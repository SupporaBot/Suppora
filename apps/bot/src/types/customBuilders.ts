import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, SeparatorBuilder, TextDisplayBuilder } from "discord.js";
import { COLORS, CORE, URLS } from "../utils/core";

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

    constructor(opts?: {
        /** Show small link for help resources? @default false */
        showHelpResources?: boolean,
        /** Additional text to append after (with divider " | ") the Bot Footer text. @default undefined */
        leading?: string
        /** Additional text to append after (with divider " | ") the Bot Footer text. @default undefined */
        trailing?: string
    }) {
        let rString = `-# ${CORE.emojis?.Logo?.syntax} Powered by [**Suppora**](${URLS.website})`
        if (opts?.showHelpResources) rString += ` — [Need Help?](${URLS.support.chat})`
        if (opts?.leading?.length) rString = `${opts.leading} | ${rString?.replace('-#', '')?.trim()}`
        if (opts?.trailing?.length) rString = `${rString} | ${opts.trailing}`
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
            ? COLORS.Orange
            : COLORS.Error

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
                            label: '💬 Bot Support',
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