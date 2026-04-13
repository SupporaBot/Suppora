import Express from 'express'
import verifyToken from '../middleware/verifyToken'
import axios from 'axios'
import { LRUCache } from 'lru-cache'
import { ApiResponse, requiredBotPermissions, API_GuildIdentity, API_SelfUserIdentity, API_UserIdentity } from '@suppora/shared'
import { PermissionFlagsBits, PermissionsBitField, RESTGetAPICurrentUserGuildsResult, RESTGetAPICurrentUserResult } from 'discord.js'
import { supabase } from '../../utils/database/supabase'
import { log } from '../../utils/logs/logs'
import { DateTime } from 'luxon'
import { CORE } from '../../utils/core'

const identityRoutes = Express.Router({ mergeParams: true })

const CACHE_SelfIdentities = new LRUCache<string, API_SelfUserIdentity>({
    max: 25, // 25 users
    ttl: (60_000 * 7) // 7 mins
})

// SELF - Identity - Authed User
// URL: https://api.suppora.app/v1/identity/users/@me
identityRoutes.get(`/users/@me`, verifyToken, async (req, res) => {
    try {
        // Parse Request:
        const forceApi = req.query?.force
        const access_token = req?.auth?.profile?.discord_access_token
        const discord_id = req?.auth?.profile?.discord_id
        if (!discord_id) return new ApiResponse(res).failure(`[SELF IDENTITY] Couldn't get discord id from token!`, 400)
        if (!access_token) return new ApiResponse(res).failure(`[UNAUTHORIZED] No Authorization token provided for identity!`, 401)

        // Check For & Return Cached Identities:
        const cached = CACHE_SelfIdentities.get(discord_id)
        if (cached && !forceApi) {
            return new ApiResponse(res).success(<API_SelfUserIdentity>{
                ...cached,
                _cache: true
            })
        }

        // Discord API Handler:
        const discordAPI = axios.create({
            validateStatus: () => true,
            baseURL: 'https://discord.com/api',
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })

        // Get Self Discord User Data:
        const { status: userStatus, data: userRes }: { status: number, data: RESTGetAPICurrentUserResult } = await discordAPI.get('/users/@me')
        if (!userRes || userStatus >= 300) {
            // User Data Fetch - Failed:
            log.for('API').error(`[SELF IDENTITY] Failed to fetch self Discord user data!`, { err: userRes, status: userStatus })
            return new ApiResponse(res).failure(`[SELF IDENTITY] Failed to fetch self Discord user data!`)
        }
        const userDataMap = {
            id: userRes.id,
            username: userRes?.username,
            display_name: userRes?.global_name,
            accent_color: userRes?.accent_color,
            avatar_url: (() => {
                if (!userRes.avatar) return `https://cdn.discordapp.com/embed/avatars/1.png`
                const fileExt = userRes?.avatar?.startsWith('a_') ? '.gif' : '.png';
                return `https://cdn.discordapp.com/avatars/${userRes?.id}/${userRes?.avatar}${fileExt}`
            })()
        }

        // Get Discord User's Guilds:
        const { status: guildsStatus, data: guildsRes }: { status: number, data: RESTGetAPICurrentUserGuildsResult } = await discordAPI.get(`/users/@me/guilds`)
        if (!guildsRes || guildsStatus >= 300) {
            // Guilds Data Fetch - Failed:
            log.for('API').error(`[SELF IDENTITY] Failed to fetch self Discord guild data!`, { err: guildsRes, status: guildsStatus })
            return new ApiResponse(res).failure(`[SELF IDENTITY] Failed to fetch self Discord guild data!`)
        }

        // Map Guild Data:
        const userGuildsMap = await (async () => {
            // Get any user guilds from DB:
            const { data: guildsInDbRes, error: guildsInDbError } = await supabase.from('guilds').select('id')
                .in('id', guildsRes?.map(g => g.id))
            if (guildsInDbError) throw new Error(`Failed to fetch guilds in db for self identity`, { cause: guildsInDbError })
            const guildsInDb = guildsInDbRes?.flatMap(g => g.id) ?? []
            // Map all user guilds:
            return guildsRes.map(g => ({
                id: g?.id,
                name: g?.name,
                icon: (() => {
                    if (!g.icon) return `https://cdn.discordapp.com/embed/avatars/1.png`
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
                bot_installed: guildsInDb?.includes(g?.id)
            }))
        })()

        // Return & Cache Identity Data:
        const selfIdentity: API_SelfUserIdentity = {
            ...userDataMap,
            guilds: userGuildsMap,
            _fetched_at: DateTime.utc().toISO()
        }
        CACHE_SelfIdentities.set(discord_id, selfIdentity)
        return new ApiResponse(res).success(selfIdentity)

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
            icon_url: g.iconURL({ size: 512 }) ?? `https://cdn.discordapp.com/embed/avatars/1.png`,
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
            avatar_url: u.avatarURL() ?? `https://cdn.discordapp.com/embed/avatars/1.png`
        }
        return new ApiResponse(res).success(identity)

    } catch (err) {
        // Failed Guild Identity:
        log.for('API').error(`[USER IDENTITY] Failed fetch a user's identity!`, { err })
        return new ApiResponse(res).failure(`[USER IDENTITY]: Failed due to an internal error!`)
    }
})

export default identityRoutes