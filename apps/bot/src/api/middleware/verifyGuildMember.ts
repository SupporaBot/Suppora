import { NextFunction, Request, Response } from "express"
import { log } from "../../utils/logs/logs"
import { ApiResponse, DiscordSnowflake } from "@suppora/shared"
import { CORE } from "../../utils/core"
import { DiscordAPIError, Guild, GuildMember, PermissionFlagsBits, User } from "discord.js"
import { HttpStatusCode } from "axios"
import verifyToken from "./verifyToken"

const ADMINISTRATOR = PermissionFlagsBits.Administrator
const MANAGE_GUILD = PermissionFlagsBits.ManageGuild




/** API Middleware 🔑 - Used to verify that the requesting user is a valid (admin?) member of the related guild. 
 * @requires {@linkcode verifyToken()} has **ran prior** to invoking this middleware.
 * @requires `guildId` is provided as a request parameter. 
 * @attaches {@linkcode Guild} & {@linkcode GuildMember} to request:
 * ```
 * req.auth?.guildMember = type GuildMember;
 * req.guild = type Guild;
 * ``` */
export const verifyGuildMembership = (
    /** Set to `true` to ensure the user sending the request has either {@linkcode ADMINISTRATOR} or {@linkcode MANAGE_GUILD} permissions within guild. 
     * @default- false */
    checkAdmin?: boolean
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Parse Req:
        const userId = req?.auth?.profile?.discord_id
        const guildId = req?.params?.guildId as string
        if (!userId) return new ApiResponse(res).failure(`[BAD REQUEST]: No "userId" provided for guild membership check!`, HttpStatusCode.BadRequest)
        if (!guildId) return new ApiResponse(res).failure(`[BAD REQUEST]: No "guildId" provided for guild membership check!`, HttpStatusCode.BadRequest)

        try {
            // Fetch Guild:
            let guild: Guild
            try {
                guild = CORE.bot.guilds.cache.get(guildId) ?? await CORE.bot.guilds.fetch(guildId)
            } catch (g_err) {
                if (g_err instanceof DiscordAPIError) {
                    if (g_err.code == 10004 || g_err.code == 50055) {
                        // Unknown Guild - Log & Return:
                        log.for('API').warn(`[UNKNOWN GUILD]: An API request has been triggered on an unknown guild?`, { guildId, err: g_err })
                        return new ApiResponse(res).success(`[FORBIDDEN]: Unknown Guild!`, HttpStatusCode.Forbidden)
                    } else if (g_err.code == 50001) {
                        // Missing Access - Log & Return:
                        log.for('API').warn(`[GUILD - MISSING ACCESS]: An API request has been triggered on a guild without access! `, { guildId, err: g_err })
                        return new ApiResponse(res).success(`[FORBIDDEN]: Unknown Guild - Permissions!`, HttpStatusCode.Forbidden)
                    }
                } else throw g_err
            }


            // Confirm User is Member:
            let user: GuildMember
            try {
                user = guild.members.cache.get(userId) ?? await guild.members.fetch(userId)
            } catch (u_err) {
                if (u_err instanceof DiscordAPIError && (u_err.code == 10007 || u_err.code == 10013)) {
                    // Unknown Member:
                    return new ApiResponse(res).failure(`[FORBIDDEN]: You are not a member of this guild!`, HttpStatusCode.Forbidden)
                } else if (u_err instanceof DiscordAPIError && u_err.code == 50001) {
                    // Unaccessible Member:
                    return new ApiResponse(res).failure(`[FORBIDDEN]: Cannot verify membership due to missing permissions.`, HttpStatusCode.Forbidden)
                } else throw u_err
            }

            if (checkAdmin) {
                const hasPerms = user.permissions.any([ADMINISTRATOR, MANAGE_GUILD], true)
                if (!hasPerms) return new ApiResponse(res).failure(`[FORBIDDEN]: You are not an admin member of this guild!`, HttpStatusCode.Forbidden)
            }

            // Attach Guild & Member to Request:
            req.auth.guildMember = user
            req.guild = guild

            // Checks Passed:
            return next()

        } catch (err) {
            // FAILED MEMBERSHIP CHECK - Return/Log Error:
            log.for('API').error(`[GUILD MEMBERSHIP CHECK]: Failed to verify a user's guild membership!`, { userId: userId, guildId, err })
            return new ApiResponse(res).failure(`[INTERNAL ERROR]: Failed to verify you're a member of this guild!`)
        }
    }
}