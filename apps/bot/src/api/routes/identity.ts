import Express from 'express'
import verifyToken from '../middleware/verifyToken'
import axios, { HttpStatusCode } from 'axios'
import { LRUCache } from 'lru-cache'
import { ApiResponse, requiredBotPermissions, API_GuildIdentity, API_SelfUserIdentity, API_UserIdentity } from '@suppora/shared'
import { PermissionFlagsBits, PermissionsBitField, REST, RESTGetAPICurrentUserGuildsResult, RESTGetAPICurrentUserResult } from 'discord.js'
import { supabase } from '../../utils/database/supabase'
import { log } from '../../utils/logs/logs'
import { DateTime } from 'luxon'
import { CORE, IMAGE_URLS, URLS } from '../../utils/core'

const identityRoutes = Express.Router({ mergeParams: true })

const CACHE_SelfIdentities = new LRUCache<string, API_SelfUserIdentity>({
    max: 25, // 25 users
    ttl: (60_000 * 7) // 7 mins
})
const PENDING_SelfIdentities = new Map<string, Promise<Express.Response>>()

export const discordOAuthAPI = axios.create({
    baseURL: 'https://discord.com/api',
    timeout: 15_000,
})

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

discordOAuthAPI.interceptors.response.use(
    res => res,
    async (error) => {
        const res = error.response

        if (res?.status === 429) {
            const retryAfter = res.data?.retry_after ?? 1

            error.config.__retryCount = error.config.__retryCount || 0

            if (error.config.__retryCount >= 2) {
                return Promise.reject(error)
            }

            error.config.__retryCount++

            console.warn(`[DISCORD] 429 hit, retrying in ${retryAfter}s`)

            await sleep(retryAfter * 1000)

            return discordOAuthAPI.request(error.config)
        }

        return Promise.reject(error)
    }
)


// SELF - Identity - Authed User
// URL: https://api.suppora.app/v1/identity/users/@me
identityRoutes.get(`/users/@me`, verifyToken, async (req, res) => {
    try {
        // Parse Request:
        const forceApi = (req.query?.force == 'true')
        const access_token = req?.auth?.profile?.discord_access_token
        const token_exp_at = DateTime.fromISO(req.auth.profile.discord_tokens_expires_at, { zone: 'utc' })
        const discord_id = req?.auth?.profile?.discord_id
        if (!token_exp_at?.isValid || token_exp_at <= DateTime.utc()) return new ApiResponse(res).failure(`[SELF IDENTITY] Forbidden - Discord Token is EXPIRED - Please try signing out and back in!`, HttpStatusCode.Forbidden)
        if (!access_token) return new ApiResponse(res).failure(`[SELF IDENTITY] Unauthorized - No token provided for identity!`, 401)
        if (!discord_id) return new ApiResponse(res).failure(`[SELF IDENTITY] Bad Request - Couldn't get discord id from token!`, 400)

        // Check For & Return Cached Identities:
        const cached = CACHE_SelfIdentities.get(discord_id)
        if (cached && !forceApi) {
            return new ApiResponse(res).success(<API_SelfUserIdentity>{
                ...cached,
                _cache: true
            })
        }
        async function getIdentity(discordId: string) {

            // Discord API - Get Self User Data:
            const { data: userData } = await discordOAuthAPI.get<RESTGetAPICurrentUserResult>('/users/@me',
                {
                    headers: { Authorization: `Bearer ${access_token}` }
                })
            if (!userData) throw new Error(`Self Identity Error - Discord API`, { cause: 'Missing user response data from Discord API!' })
            // Map User Data:
            const userDataMap = {
                id: userData.id,
                username: userData?.username,
                display_name: userData?.global_name,
                accent_color: userData?.accent_color,
                avatar_url: (() => {
                    if (!userData.avatar) return IMAGE_URLS.discord_logo[1]
                    const fileExt = userData?.avatar?.startsWith('a_') ? '.gif' : '.png';
                    return `https://cdn.discordapp.com/avatars/${userData?.id}/${userData?.avatar}${fileExt}`
                })()
            }

            // Discord API - Get Self Guilds Data:
            const { data: guildsData } = await discordOAuthAPI.get<RESTGetAPICurrentUserGuildsResult>(`/users/@me/guilds`,
                {
                    headers: { Authorization: `Bearer ${access_token}` }
                })
            if (!guildsData) throw new Error(`Self Identify Error - Discord API`, { cause: `Missing guild(s) data response from Discord API!` })
            // Map Guild Data:
            const userGuildsMap = await (async () => {
                // Get any user guilds from DB:
                const userGuildIds = (guildsData ?? [])?.map(g => g?.id);
                if (!userGuildIds?.length) return []
                const { data: guildsInDbRes, error: guildsInDbError } = await supabase.from('guilds').select('id')
                    .in('id', userGuildIds)
                if (guildsInDbError) throw new Error(`Failed to fetch guilds in db for self identity`, { cause: guildsInDbError })
                const guildIdsInDb = guildsInDbRes?.flatMap(g => g.id) ?? []
                // Map all user guilds:
                const userGuilds = (guildsData ?? [])?.map(g => ({
                    id: g?.id,
                    name: g?.name,
                    icon: (() => {
                        if (!g.icon) return IMAGE_URLS.discord_logo[1]
                        const fileExt = g?.icon?.startsWith('a_') ? '.gif' : '.png';
                        return `https://cdn.discordapp.com/icons/${g?.id}/${g?.icon}${fileExt}`
                    })(),
                    owner: g?.owner,
                    permissions: g?.permissions,
                    can_manage: (() => {
                        const userPerms = new PermissionsBitField(BigInt(g?.permissions ?? 0))
                        return userPerms.any([
                            PermissionFlagsBits.Administrator,
                            PermissionFlagsBits.ManageGuild
                        ], true)
                    })(),
                    bot_installed: guildIdsInDb?.includes(g?.id)
                }))
                // Confirm User's Manageable Guild Ids are in SYNC w/ DB:
                const manageableIds = userGuilds?.filter(g => g.can_manage).map(g => g?.id)
                async function syncManagedGuildIdToDb() {
                    const profileIds = req?.auth?.profile?.manageable_guild_ids
                    const missingIds = manageableIds?.filter(id => !profileIds?.includes(id))
                    const extraIds = profileIds?.filter(id => !manageableIds?.includes(id))
                    if (missingIds?.length || extraIds?.length) {
                        // Update DB:
                        const { error } = await supabase.from('profiles').update({
                            manageable_guild_ids: manageableIds
                        }).eq('id', req?.auth?.profile?.id)
                        if (error) log.for('Database').error(`FAILED - Updating user's manageable guild ids - Identity fetch`)
                    }
                }
                await syncManagedGuildIdToDb()
                // Return Guilds:
                return userGuilds
            })()

            // Return & Cache Identity Data:
            const selfIdentity: API_SelfUserIdentity = {
                ...userDataMap,
                guilds: userGuildsMap,
                _fetched_at: DateTime.utc().toISO()
            }

            CACHE_SelfIdentities.set(discord_id, selfIdentity)
            return new ApiResponse(res).success(selfIdentity)
        }

        // Check for already pending request - return:
        if (PENDING_SelfIdentities.get(discord_id)) return PENDING_SelfIdentities.get(discord_id)
        else {
            // Fetch Fresh Identity:
            const promise = getIdentity(discord_id)
            PENDING_SelfIdentities.set(discord_id, promise)
            try {
                return await promise
            } finally {
                PENDING_SelfIdentities.delete(discord_id)
            }
        }

    } catch (err) {
        // Failed Self DDiscord Identity:
        log.for('API').error(`[SELF IDENTITY] Failed getting a users self identity!`, { err })
        return new ApiResponse(res).failure(`[SELF IDENTITY] Failed getting a users self identity!`)
    }
})


// Guild - Identity - Public:
// URL: https://api.suppora.app/v1/identity/guilds/:guildId
identityRoutes.get(`/guilds/:guildId`, async (req, res) => {
    try {
        // Parse Request:
        const guildId = req.params?.guildId
        if (!guildId) return new ApiResponse(res).failure(`[GUILD IDENTITY] Bad Request, missing guild id!`, 400)

        // Get Guild Identity FROM BOT:
        const g = CORE.bot.guilds.cache.get(guildId) ?? await CORE.bot.guilds.fetch(guildId)

        // Check Bot Permissions:
        const botMember = g.members.me ?? await g.members.fetchMe();
        const missingPermissions = (() => {
            const globalPerms = botMember.permissions
            const missing_globalPerms = globalPerms.missing(requiredBotPermissions)
            const result: Record<string, string[] | null> = {}
            result['global'] = missing_globalPerms?.length
                ? missing_globalPerms
                : undefined
            return result
        })()


        const identity: API_GuildIdentity = {
            name: g?.name,
            id: g?.id,
            owner_id: g?.ownerId,
            icon_url: g.iconURL({ size: 512 }) ?? IMAGE_URLS.discord_logo[1],
            missing_permissions: missingPermissions
        }
        return new ApiResponse(res).success(identity)

    } catch (err) {
        // Failed Guild Identity:
        log.for('API').error(`[GUILD IDENTITY] Failed fetch a guild's identity!`, { err })
        return new ApiResponse(res).failure(`[GUILD IDENTITY]: Failed due to an internal error!`)
    }
})



// User - Identity - Public:
// URL: https://api.suppora.app/v1/identity/users/:userId
identityRoutes.get(`/users/:userId`, async (req, res) => {
    try {
        // Parse Request:
        const userId = req.params?.userId
        if (!userId) return new ApiResponse(res).failure(`[USER IDENTITY] Bad Request, missing user id!`, 400)

        // Get User Identity FROM BOT:
        const u = CORE.bot.users.cache.get(userId) ?? await CORE.bot.users.fetch(userId)

        const identity: API_UserIdentity = {
            username: u.username,
            display_name: u.displayName,
            avatar_url: u.avatarURL() ?? IMAGE_URLS.discord_logo[1]
        }
        return new ApiResponse(res).success(identity)

    } catch (err) {
        // Failed Guild Identity:
        log.for('API').error(`[USER IDENTITY] Failed fetch a user's identity!`, { err })
        return new ApiResponse(res).failure(`[USER IDENTITY]: Failed due to an internal error!`)
    }
})

export default identityRoutes