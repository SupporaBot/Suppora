import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, SeparatorBuilder, TextDisplayBuilder } from "discord.js";
import { COLORS, URLS } from "../utils/core";

// -------- DEFAULT (LIKE) BUILDERS --------

export class TextBuilder {
    constructor(content: string) {
        return new TextDisplayBuilder({ content })
    }
}

export type HexColorNumber = number
export const HexColorNumber = (color: string) => Number(String(color).replace('#', '0x'))


// -------- CUSTOM BUILDERS --------
export class DefaultBotFooter {

    constructor(showWatermark: boolean, showHelpResources: boolean) {
        let rString = ``
        if (showWatermark) rString += `-# Powered by [**Suppora**](${URLS.website})`
        if (showHelpResources) rString += ((showWatermark ? '\n' : '') + `-# Need Help? - Contact [Bot Support](${URLS.support.chat})`)
        return new TextBuilder(rString)
    }
}


export class BotErrorMessageContainer {

    constructor(
        level: 'WARN' | 'ERROR',
        /** Styles Applied: `###` Heading 3*/
        title: string = '⚠️  Error Occurred!',
        /** Styles Applied: `>>>` Multi Lined Block Quote */
        details: string = `It appears we ran into an error somewhere along the way processing that last interaction... If this issue persists please get in contact with [Bot Support](${URLS.support.chat}).`) {

        const accent_color = level == 'WARN'
            ? HexColorNumber(COLORS.warning)
            : HexColorNumber(COLORS.error)

        return new ContainerBuilder({
            accent_color,
            components: <any>[
                new TextBuilder(`### ${title}`),
                new SeparatorBuilder(),
                new TextBuilder(`>>> ${details}`),
                new SeparatorBuilder(),
                new ActionRowBuilder({
                    components: [
                        new ButtonBuilder({
                            style: ButtonStyle.Link,
                            label: '💬 Support Chat',
                            url: URLS.support.chat
                        }),
                        new ButtonBuilder({
                            style: ButtonStyle.Link,
                            label: '📚 More Resources',
                            url: URLS.support.site
                        })
                    ]
                })

            ]
        })

    }

}