import { DiscordAPIError, PermissionResolvable } from 'discord.js'
import { CORE } from './core'
import { requiredBotPermissions } from '@suppora/shared';
import { ErrorResult } from '../types/errorResult';
import { log } from './logs/logs';


/** Check if `error` is a {@linkcode DiscordAPIError} AND includes one of the following Discord API Error Codes:
 * - `50001` : *Missing access*
 * - `50007` : *Cannot send messages to this user*
 * - `50013` : *You lack permissions to perform that action* */
export function isDiscordPermissionError(err: any) {
    if (err instanceof DiscordAPIError) {
        const code = err?.code
        return [50001, 50007, 50013]?.includes(Number(code))
    }
}

/** Returns back missing permission granted to the bot within a guild */
export async function checkGuildPermissions(guildId: string, channelIds?: string[]) {
    try {
        const guild = await CORE.bot.guilds.fetch(guildId);
        const me = guild.members.me ?? await guild.members.fetchMe();

        const guildResults = me.permissions.missing(requiredBotPermissions, true)

        const channelResults = new Map<string, (PermissionResolvable | "UnknownChannel")[]>()
        if (channelIds?.length) {
            for (const chId of channelIds) {
                try {
                    const channel = await guild.channels.fetch(chId)
                    const missingInChannel = channel?.permissionsFor(me)?.missing(requiredBotPermissions, true) ?? [];
                    channelResults.set(chId, missingInChannel)
                } catch (err) {
                    if (err instanceof DiscordAPIError && err.code == 10003) channelResults.set(chId, ['UnknownChannel']);
                    else if (isDiscordPermissionError(err)) channelResults.set(chId, ['ViewChannel']);
                    else throw err;
                }
            }
        }

        return {
            missing_guild_perms: guildResults,
            missing_channel_perms: Object.fromEntries(channelResults)
        } as const

    } catch (err) {
        // Failed Checking Guild Permissions:
        log.for('Bot').warn('Failed to check permission for guild!', { guildId, err })
        return new ErrorResult('Failed to check guild permissions!', err)
    }
}