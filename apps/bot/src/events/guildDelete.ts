import { EventData, Guild } from "discord.js";
import { log } from "../utils/logs/logs";
import { DiscordLogs } from "../utils/logs/discord";
import { supabase } from "../utils/database/supabase";

export default <EventData>{
    name: 'guildDelete',
    execute: async (g: Guild) => {

        try {
            // Remove from DB - Guild Row:
            const { error: guildRowErr } = await supabase.from('guilds').delete()
                .eq('id', g?.id)
            if (guildRowErr) throw guildRowErr

            // Log Removing Guild - Bot Uninstalled:
            log.for('Bot').info(`[BOT REMOVED ❌] ${g?.name} has removed the application!`, {
                guildId: g?.id, userId: g?.ownerId,
                guild: {
                    name: g?.name,
                    owner: g?.ownerId,
                    members: g?.memberCount,
                    createdAt: g?.createdAt,
                    joinedAt: g?.joinedAt
                }
            })
            await DiscordLogs.guild_removed(g)


        } catch (err) {
            // FAILURE - Guild Removed Event:
            log.for('Bot').error(`[Guild Removed] FAILED to process event! - See Details!`, { err, guildId: g?.id, critical: true })
        }

    }
}