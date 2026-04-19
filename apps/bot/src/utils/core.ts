import { Client } from "discord.js";
import { Colors as DJSColors } from "discord.js";
import { BotEmojiData, BotEmojiName } from "./bot/emojis";

export const CORE = {
    /** Currently available Discord Bot {@linkcode Client} (if any). */
    bot: <Client<true> | undefined>undefined,

    /** Application Emojis Fetched from Client
     * @required `clientReady` event for data propagation  */
    emojis: <Record<BotEmojiName, BotEmojiData>>undefined
}


export const COLORS = {
    ...DJSColors,
    Error: 0xC43A3A,
    Success: 0x3ac44c,
    Warning: 0xe67e22
    // red: '#c43a3a',
    // error: '#c43a3a',
    // orange: '#c4663a',
    // warning: '#c4663a',
    // yellow: '#c4b63a',
    // green: '#3ac44c',
    // success: '#3ac44c',
    // blue: '#3674e6',
    // info: '#3674e6',
    // purple: '#8236e6'
} as const



export class URLS {
    static website = `https://suppora.app` as const
    static dashboard = this.website + `/dashboard` as `${typeof this.website} + /dashboard`
    static docs = `https://docs.suppora.app` as const

    static invite = `https://invite.suppora.app` as const

    static support = {
        chat: `https://discord.gg/jQjWxkbgbT`,
        site: `https://suppora.app/support`
    } as const

    static community = `https://discord.gg/pEVXUpBzZs` as const
    static pricing = `https://suppora.app/pricing` as const
}
export class IMAGE_URLS {

    // ! PROD: Change Me!
    static w = 'https://suppora.pages.dev' as undefined

    static logo = {
        dark: (this?.w + '/logo.png'),
        light: (this.w + '/logo-light.png')
    }

    static discord_logo: [
        'https://cdn.discordapp.com/embed/avatars/0.png',
        'https://cdn.discordapp.com/embed/avatars/1.png',
        'https://cdn.discordapp.com/embed/avatars/2.png',
        'https://cdn.discordapp.com/embed/avatars/3.png',
        'https://cdn.discordapp.com/embed/avatars/4.png',
        'https://cdn.discordapp.com/embed/avatars/5.png'
    ]
}
IMAGE_URLS.w = undefined