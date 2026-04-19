import axios from "axios";
import { APIUser, PermissionFlagsBits, RESTGetAPICurrentUserGuildsResult } from "discord.js";
import { DateTime } from "luxon";
import { supabase } from "../../../utils/database/supabase";


export type DiscordOAuth2TokenResponse = {
    token_type: "Bearer",
    access_token: string,
    expires_in: number,
    refresh_token: string,
    scope: string
}


/** UTIL - Upsert (Create OR Update) Auth User w/ Token Exchange Data
 * @note Can and **likely will throw errors**
 * - ensure call is wrapped by a `catch` statement */
export async function upsertAuthUser(tokenData: DiscordOAuth2TokenResponse) {
    // Confirm Token Response Data:
    const access_token = tokenData?.access_token;
    const refresh_token = tokenData?.refresh_token;
    if (!access_token || !refresh_token) throw new Error(`[oAuth2 User Upsert]: Missing "access_token" or "refresh_token"!`, { cause: `Missing required tokens from Discord oAuth2 token exchange, therefore cannot "upsert" user!` })
    const tokens_expire_at = DateTime.utc().plus({ seconds: tokenData.expires_in })?.toISO();


    // Fetch DISCORD USER Data
    const [userRes, guildsRes] = await Promise.all([
        axios.get<APIUser>("https://discord.com/api/users/@me", { headers: { Authorization: `Bearer ${access_token}` } }),
        axios.get<RESTGetAPICurrentUserGuildsResult>("https://discord.com/api/users/@me/guilds", { headers: { Authorization: `Bearer ${access_token}` } })
    ])
    const userData = userRes?.data
    if (userRes.status >= 300 || !userRes.data) throw new Error(`[oAuth2 User Upsert]: FAILED TO FETCH USER FROM DISCORD`, { cause: 'Discord self user data api returned a status >= 300!' })
    const guildsData = guildsRes?.data
    if (guildsRes.status >= 300 || !guildsRes.data) throw new Error(`[oAuth2 User Upsert]: FAILED TO FETCH GUILDS FOR USER FROM DISCORD`, { cause: `Discord self user data api (guilds) returned a status >= 300!` })


    // Map Manageable Guilds by Id:
    const manageableGuildIds = guildsData.filter(g => {
        const perms = BigInt(g?.permissions ?? 0)
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
        }).select().single()

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