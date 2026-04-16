import { AttachmentBuilder, ComponentType, ContainerBuilder, Guild, MediaGalleryBuilder, MessageFlags, SeparatorBuilder, TextChannel, ThumbnailBuilder } from "discord.js";
import { HexColorNumber, TextBuilder } from "../../types/customBuilders";
import { COLORS, CORE, IMAGE_URLS } from "../core";
import { log } from "./logs";

const internalGuildId = '1492365525093712012'
const installationsChannelId = '1493836582992613507'

type Result = {
    success: boolean
    details?: any
}

export const DiscordLogs = {
    guild_added: async (g: Guild): Promise<Result> => {
        try {
            // Build Message
            const guildIconUrl = (g?.iconURL({ size: 256 }) || IMAGE_URLS.discord_logo[1])
            const content = new ContainerBuilder({
                accent_color: COLORS.Success,
                components: <any>[
                    new TextBuilder(`## ✅ Bot Installed`),
                    new SeparatorBuilder(),
                    new TextBuilder(`**Guild Name:**\n> ${g?.name}\n**Server Created:**\n> <t:${Math.floor(g?.createdTimestamp / 1000)}:f>\n**Bot Installed:**\n> <t:${Math.floor(g?.joinedTimestamp / 1000)}:f>\n**Member Count:**\n> ${g?.memberCount}`),
                    new MediaGalleryBuilder({
                        items: [{ media: { url: guildIconUrl, placeholder: 'Guild Icon' }, description: 'Guild Icon' }]
                    }),
                ]
            })
            // Fetch Guild - Send Message
            const guild = await CORE.bot.guilds.fetch(internalGuildId)
            const channel = await guild.channels.fetch(installationsChannelId) as TextChannel
            await channel.send({
                components: [content],
                flags: MessageFlags.IsComponentsV2
            })
            return {
                success: true,
                details: 'Message sent!'
            }
        } catch (err) {
            // Failed - Log & Return
            log.for('Bot').error('[Logs - Guild Added] Failed to send an internal discord log!', err)
            return {
                success: false,
                details: err
            }
        }
    },
    guild_removed: async (g: Guild): Promise<Result> => {
        try {
            // Build Message
            const guildIconUrl = (g?.iconURL({ size: 256 }) || IMAGE_URLS.discord_logo[1])
            const content = new ContainerBuilder({
                accent_color: COLORS.Error,
                components: <any>[
                    new TextBuilder(`## ❌  Bot Uninstalled`),
                    new SeparatorBuilder(),
                    new TextBuilder(`**Guild Name:**\n> ${g?.name}\n**Server Created:**\n> <t:${Math.floor(g?.createdTimestamp / 1000)}:f>\n**Bot Installed:**\n> <t:${Math.floor(g?.joinedTimestamp / 1000)}:f>\n**Bot Uninstalled:**\n> <t:${Math.floor(Date.now() / 1000)}:f>\n**Member Count:**\n> ${g?.memberCount}`),
                    new MediaGalleryBuilder({
                        items: [{ media: { url: guildIconUrl, placeholder: 'Guild Icon' }, description: 'Guild Icon - D' }]
                    }),
                ]
            })
            // Fetch Guild - Send Message
            const guild = await CORE.bot.guilds.fetch(internalGuildId)
            const channel = await guild.channels.fetch(installationsChannelId) as TextChannel
            await channel.send({
                components: [content],
                flags: MessageFlags.IsComponentsV2
            })
            return {
                success: true,
                details: 'Message sent!'
            }
        } catch (err) {
            // Failed - Log & Return
            log.for('Bot').error('[Logs - Guild Removed] Failed to send an internal discord log!', { err })
            return {
                success: false,
                details: err
            }
        }
    }
}