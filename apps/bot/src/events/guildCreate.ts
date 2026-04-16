import { EventData, Guild } from "discord.js";
import { log } from "../utils/logs/logs";
import { DiscordLogs } from "../utils/logs/discord";
import { supabase } from "../utils/database/supabase";
import { DateTime } from "luxon";
import sendWithFallback from "../utils/bot/messages/sendWithFallback";
import { botWelcomeMessage } from "../utils/bot/messages/common";

export default <EventData>{
    name: 'guildCreate',
    execute: async (g: Guild) => {

        try {
            // Add to Database - Guild/Stats Row(s):
            const { error: guildRowErr } = await supabase.from('guilds').upsert({
                id: g?.id,
                name: g?.name,
                owner_id: g?.ownerId,
                joined_at: DateTime.fromMillis(g?.joinedTimestamp)?.toUTC()?.toISO()
            })
            if (guildRowErr) throw guildRowErr
            const { error: statsRowErr } = await supabase.from('guild_stats').upsert({
                guild_id: g?.id
            })
            if (statsRowErr) throw statsRowErr

            // Log New Guild - Bot Installed:
            log.for('Bot').info(`[BOT ADDED ✅] ${g?.name} has added the application!`, {
                guildId: g?.id, userId: g?.ownerId,
                guild: {
                    name: g?.name,
                    owner: g?.ownerId,
                    members: g?.memberCount,
                    createdAt: g?.createdAt
                }
            })
            await DiscordLogs.guild_added(g)

            // Send Welcome Message:
            const send = await sendWithFallback(g, botWelcomeMessage())
            if (send?.success != true) {
                throw new Error('Failed to send bot welcoming message!', { cause: send?.error })
            }

        } catch (err) {
            // FAILURE - Guild Added Event:
            log.for('Bot').error(`[Guild Added] FAILED to process event! - See Details!`, { err, guildId: g?.id, critical: true })
        }

    }
}