import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, ContainerBuilder, SectionBuilder, SeparatorBuilder } from "discord.js"
import { DefaultBotFooter, TextBuilder } from "../../../types/customBuilders"
import { COLORS, CORE, IMAGE_URLS, URLS } from "../../core"

// ! PROD: Improve Me!
export const botWelcomeMessage = () => {
    return new ContainerBuilder({
        accent_color: COLORS.Orange,
        components: <any>[
            new TextBuilder(`## 👋🏽  Welcome to <@${CORE.bot.user.id}>!`),
            new SeparatorBuilder(),
            new SectionBuilder({
                components: <any>[
                    new TextBuilder(`It's easy to start using your *new Suppora application*, **visit your [Bot Dashboard](${URLS.dashboard}) to get started!**`),
                    new TextBuilder(`>>> Take advantage of exciting features: \n- Setup your integrated ticket system — This can be used for support requests, applications, or anything you need! \n- Improve your ticketing flow with a "Ticket Panel", an interactive ticket creation message along with an optional designated creation form/questions. \n- Designate specific staff teams (roles) for certain users to be pinged oon ticket creations.`)
                ],
                accessory: {
                    type: ComponentType.Thumbnail,
                    media: {
                        url: IMAGE_URLS.logo.dark,
                        placeholder: 'Suppora - Logo'
                    }
                }
            }),
            new DefaultBotFooter(),
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
            }),
        ]
    })
}