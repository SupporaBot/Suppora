import { ApiResponse } from "@suppora/shared";
import axios, { HttpStatusCode } from "axios";
import { NextFunction, Request, Response } from "express";
import { DateTime } from "luxon";
import { DiscordOAuth2TokenResponse, upsertAuthUser } from "../routes/auth/authUtils";
import { log } from "../../utils/logs/logs";

const client_id = process.env.DISCORD_CLIENT_ID
const client_secret = process.env.DISCORD_CLIENT_SECRET


/** Reads currently authenticated api {@linkcode Request}.`auth`.`profile` Discord access token is not yet expired, if so it refreshes and updates them. */
async function ensureValidDiscordToken(req: Request, res: Response, next: NextFunction) {
    try {
        // Parse / Validate Request:
        if (!req.auth) return new ApiResponse(res).failure(`[Forbidden]: No user is authenticated for this request/token validation`, HttpStatusCode.Forbidden)
        if (!req?.auth?.profile?.discord_refresh_token) return new ApiResponse(res).failure(`[Unauthorized/Bad Request] Authorized user has no valid refresh token?`, HttpStatusCode.Forbidden)
        if (!req?.auth?.profile?.discord_tokens_expires_at) return new ApiResponse(res).failure(`[Unauthorized/Bad Request] Authorized user has no valid token expiration date?`, HttpStatusCode.Forbidden)
        // Check Discord Access Token Expiration:
        const expiresAt = DateTime.fromISO(req.auth.profile.discord_tokens_expires_at, { zone: 'utc' })
        if (expiresAt <= DateTime.utc()?.plus({ minute: 1 })) {
            // Token(s) Expired - Refresh New:
            const { data } = await axios.post<DiscordOAuth2TokenResponse>('https://discord.com/api/oauth2/token',
                new URLSearchParams({
                    client_id,
                    client_secret,
                    grant_type: 'refresh_token',
                    refresh_token: req?.auth?.profile?.discord_refresh_token
                } as any),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            )
            if (!data?.access_token || !data?.refresh_token) {
                throw new Error('Invalid Discord token response', { cause: data });
            }
            // Update Auth User:
            const { user: updatedUser, profile: updatedProfile } = await upsertAuthUser(data)

            // Debug Refreshed User:
            log.for('API').info(`[Auth - Token Refresh] ${updatedProfile.username} has refreshed their Discord tokens!`, { userId: updatedProfile?.discord_id })
            // Update Attached Request User:
            req.auth = {
                user: updatedUser,
                profile: updatedProfile as any
            }
            // Debug:
            log.for('API').info(`[Auth - Token Refresh] A user's Discord access token was automatically refreshed!`, { userId: req?.auth?.profile?.discord_id })
        }
        // Proceed w/ Request:
        return next()
    } catch (err) {
        // Log & Return Token Refresh Error:
        log.for('API').error(`[Auth - Token Refresh] Failed to refresh a users auth token from API request!`, { userId: req?.auth?.profile?.discord_id, err })
        return new ApiResponse(res).failure(`[Internal Error/Forbidden] Failed to validate or refresh your Discord access token, please re-authenticate!`, HttpStatusCode.Forbidden)
    }

}

export default ensureValidDiscordToken