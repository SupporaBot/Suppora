import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, ComponentType, ContainerBuilder, lazy, SectionBuilder, SeparatorBuilder } from "discord.js"
import { HexColorNumber, TextBuilder } from "../../types/customBuilders"
import { CORE, IMAGE_URLS, URLS } from "../core"

export const botWelcomeMessage = () => {
    return new ContainerBuilder({
        accent_color: Colors.Red, // HexColorNumber(COLORS.orange),
        components: <any>[
            new TextBuilder(`##👋🏽  Welcome to <@${CORE.bot.user.id}>!`),
            new SeparatorBuilder(),
            new SectionBuilder({
                components: <any>[
                    new TextBuilder(`**It's easy to start using your new Suppora application, visit your [Bot Dashboard](${URLS.dashboard}) to get started!**`)
                ],
                accessory: {
                    type: ComponentType.Thumbnail,
                    media: {
                        url: IMAGE_URLS.logo.dark,
                        placeholder: 'Suppora - Logo'
                    }
                }
            }),
            new SeparatorBuilder(),
            new ActionRowBuilder({
                components: [
                    new ButtonBuilder({
                        style: ButtonStyle.Link,
                        url: URLS.dashboard,
                        label: '🤖 Bot Dashboard'
                    }),
                    new ButtonBuilder({
                        style: ButtonStyle.Link,
                        url: URLS.support.chat,
                        label: '💬 Support Chat'
                    })
                ]
            })
        ]
    })
}