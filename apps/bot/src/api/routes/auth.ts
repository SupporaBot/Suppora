import express from "express";
import { log } from "../../utils/logs/logs";
import { URLS } from "../../utils/core";
import { APIUser, DiscordAPIError, OAuth2Scopes, PermissionFlagsBits, REST, RESTGetAPICurrentUserGuildsResult, Routes } from "discord.js";
import axios from "axios";
import { supabase } from "../../utils/database/supabase";
import { DateTime } from "luxon";
import { ApiResponse } from "@suppora/shared";

// ENV Variables:
const client_id = process.env?.DISCORD_CLIENT_ID
const client_secret = process.env?.DISCORD_CLIENT_SECRET
const environment = process.env?.ENVIRONMENT || 'development'

// oAuth URLS & Scopes
const oAuth2Scopes: (keyof typeof OAuth2Scopes)[] = ['Identify', 'Guilds']
const oAuth2ScopesURI = oAuth2Scopes?.map(s => s.toLowerCase())?.join('+')
const oAuthRedirectURI = environment == 'production' || true
    ? 'https://api.suppora.app/auth/discord-callback'
    : 'http://localhost:3000/api/auth/discord-callback';
const oAuthUrl = environment == 'production'
    ? `https://discord.com/oauth2/authorize?client_id=1491140828574515330&response_type=code&redirect_uri=${encodeURIComponent(oAuthRedirectURI)}&scope=${oAuth2ScopesURI}`
    : `https://discord.com/oauth2/authorize?client_id=1491140828574515330&response_type=code&redirect_uri=${encodeURIComponent(oAuthRedirectURI)}&scope=${oAuth2ScopesURI}`;
// oAuth2 Token Response Type:
type DiscordOAuth2TokenResponse = {
    token_type: "Bearer",
    access_token: string,
    expires_in: number,
    refresh_token: string,
    scope: string
}

// Router:
const authRoutes = express.Router({ mergeParams: true })


/** UTIL - Upsert (Create OR Update) Auth User w/ Token Exchange Data
 * @note Can and **likely will throw errors**
 * - ensure call is wrapped by a `catch` statement */
async function upsertAuthUser(tokenData: DiscordOAuth2TokenResponse) {
    // Confirm Token Response Data:
    const access_token = tokenData?.access_token;
    const refresh_token = tokenData?.refresh_token;
    if (!access_token || !refresh_token) throw new Error(`[oAuth2 User Upsert]: Missing "access_token" or "refresh_token"!`, { cause: `Missing required tokens from Discord oAuth2 token exchange, therefore cannot "upsert" user!` })
    const tokens_expire_at = DateTime.utc().plus({ seconds: tokenData.expires_in })?.toISO();

    // Fetch DISCORD USER Data from Discord API:
    const userResponse = await axios.get<APIUser>("https://discord.com/api/users/@me", { headers: { Authorization: `Bearer ${access_token}` } });
    if (userResponse.status >= 300 || !userResponse.data) throw new Error(`[oAuth2 User Upsert]: FAILED TO FETCH USER FROM DISCORD`, { cause: 'Discord self user data api returned a status >= 300!' })
    const userData = userResponse.data

    // Fetch DISCORD User GUILDS from Discord API:
    const guildsResponse = await axios.get<RESTGetAPICurrentUserGuildsResult>("https://discord.com/api/users/@me/guilds", { headers: { Authorization: `Bearer ${access_token}` } })
    if (guildsResponse.status >= 300 || !guildsResponse.data) throw new Error(`[oAuth2 User Upsert]: FAILED TO FETCH GUILDS FOR USER FROM DISCORD`, { cause: `Discord self user data api (guilds) returned a status >= 300!` })
    const guildsData = guildsResponse.data

    // Map Manageable Guilds by Id:
    const manageableGuildIds = guildsData.filter(g => {
        const perms = BigInt(g.permissions)
        const is_administrator = (perms & PermissionFlagsBits.Administrator) != 0n
        const has_manage_guild = (perms & PermissionFlagsBits.ManageGuild) != 0n
        return is_administrator || has_manage_guild
    }).map(g => g.id)

    // Search for EXISTING user in Profiles table:
    const { data: existingProfile, error: existingProfileErr } = await supabase.from('profiles').select('discord_id')
        .eq('discord_id', userData.id)
        .maybeSingle()
    if (existingProfileErr) throw new Error(`[oAuth2 User Upsert]: FAILED to search for EXISTING PROFILE from Discord id!`, { cause: existingProfileErr })

    // If Existing User:
    if (!existingProfile) {
        // CREATE NEW USER:
        const { data: { user: newUser }, error: newUserErr } = await supabase.auth.admin.createUser({
            email: `${userData.id}@suppora.app`,
            email_confirm: true,
            app_metadata: {
                providers: ['discord'],
                discord_id: userData.id
            },
            user_metadata: {
                display_name: userData.username
            }
        })
        // Confirm New User:
        if (newUserErr || !newUser) throw new Error(`[oAuth2 User Upsert]: FAILED to CREATE NEW USER from Token Exchange!`, { cause: newUserErr })
        // Create NEW PROFILE ROW:
        const { data: newProfile, error: newProfileErr } = await supabase.from('profiles').upsert({
            id: newUser.id,
            discord_id: userData.id,
            username: userData.username,
            manageable_guild_ids: manageableGuildIds,
            discord_access_token: access_token,
            discord_refresh_token: refresh_token,
            discord_tokens_expires_at: tokens_expire_at
        })
            .select()
        // Confirm New Profile:
        if (newProfileErr || !newProfile) throw new Error(`[oAuth2 User Upsert]: FAILED to CREATE NEW PROFILE from Token Exchange!`, { cause: { ...newProfileErr, note: 'A NEWLY created auth user has been created for this failed profile!' } })
        // Return Auth User & Profile:
        return {
            user: newUser,
            profile: newProfile
        } as const
    } else {
        // UPDATE EXISTING USER - PROFILE:
        const { data: updatedProfile, error: updateProfileErr } = await supabase.from('profiles').update({
            discord_access_token: access_token,
            discord_refresh_token: refresh_token,
            discord_tokens_expires_at: tokens_expire_at,
            manageable_guild_ids: manageableGuildIds,
            username: userData.username
        })
            .eq('discord_id', existingProfile.discord_id)
            .select('*').single()
        // Confirm Updated Profile:
        if (updateProfileErr || !updatedProfile) throw new Error(`[oAuth2 User Upsert]: FAILED to UPDATE EXISTING PROFILE after Token Exchange!`, { cause: updateProfileErr })
        // UPDATE EXISTING USER - AUTH USER:
        const { data: { user: updatedUser }, error: updateUserErr } = await supabase.auth.admin.updateUserById(updatedProfile.id, {
            email: `${userData.id}@suppora.app`,
            app_metadata: {
                providers: ['discord'],
                discord_id: userData.id
            },
            user_metadata: {
                display_name: userData.username
            }
        })
        // Confirm User Update:
        if (updateUserErr || !updatedUser) throw new Error(`[oAuth2 User Upsert]: FAILED to UPDATE EXISTING AUTH USER after Token Exchange!`, { cause: updateUserErr })
        // Return Auth User & Profile:
        return {
            user: updatedUser,
            profile: updatedProfile
        } as const
    }



}


// ALL - Sign In - Discord oAuth Prompt
// URL: https://api.suppora.app/v1/auth/sign-in
authRoutes.all(`/sign-in`, (req, res) => {
    return res.redirect(oAuthUrl)
})

// ALL - Discord Callback - oAuth 2 Authorization:
// URL: https://api.suppora.app/v1/auth/discord-callback
authRoutes.get('/discord-callback', async (req, res) => {
    try {
        const { code, error } = req.query

        // Redirect - FAILED - Missing Code/Error Received from Discord:
        if (error) return res.redirect(URLS.website + `/sign-in?failed=true&reason=${encodeURI(String(error))}`)
        if (!code) return res.redirect(URLS.website + `/sign-in?failed=true&reason=missing+code`)

        // Exchange Code for Access Token(s):
        const { data, status } = await axios.post<DiscordAPIError | DiscordOAuth2TokenResponse>('https://discord.com/api/oauth2/token',
            new URLSearchParams({
                client_id,
                client_secret,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: oAuthRedirectURI
            } as any),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        )

        // Confirm Token Response:
        if (status >= 300 || "rawError" in data) {
            const err = Error('Discord API FAILURE - Token Exchange', { cause: { data, status } })
            throw err
        } else {
            // Update/Create Auth User:
            const { user, profile } = await upsertAuthUser(data)
            // Create/Get Magic Sign In URL:
            const { data: link, error: linkError } = await supabase.auth.admin.generateLink({
                email: user?.email,
                type: 'magiclink',
                options: {
                    redirectTo: process.env.ENVIRONMENT != 'production'
                        ? 'http://localhost:5173'
                        : URLS.website
                }
            })
            // Confirm Magic Link:
            if (linkError || !link) throw new Error(`Discord Auth Callback Error - MAGIC LINK FAILED`, { cause: linkError })
            else {
                return res.redirect(link.properties.action_link)
            }
        }


    } catch (err) {
        // FAILED - Discord Auth Callback - Log & Redirect:
        log.for('Auth').error(`FAILED - Discord AUTH Callback`, { err })
        return res.redirect(URLS.website + `/sign-in?failed=true&reason=internal+error`)
    }

})


// ALL - DISCORD AUTH REFRESH
// FINISH ME
// URL: https://api.suppora.app/v1/auth./discord-refresh
authRoutes.get(`/discord-refresh`, async (req, res) => {
    try {
        // Get current token from profile:
        const { data, error } = await supabase.from('profiles').select('*')
            .eq('discord_id', 'USER_ID_FROM_VERIFICATION')


    } catch (err) {
        // FAILED - Discord Auth Callback - Log & Redirect:
        log.for('Auth').error(`FAILED - Discord AUTH Refresh`, { err })
        return new ApiResponse(res).failure('Discord Auth Refresh - FAILED', 500)
    }
})


export default authRoutes