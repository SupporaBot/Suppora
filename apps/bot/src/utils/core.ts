import { Client } from "discord.js";

export const CORE = {
    /** Currently available Discord Bot {@linkcode Client} (if any). */
    bot: <Client<true> | undefined>undefined
}


export const COLORS = {
    red: '#c43a3a',
    error: '#c43a3a',
    orange: '#c4663a',
    warning: '#c4663a',
    yellow: '#c4b63a',
    green: '#3ac44c',
    success: '#3ac44c',
    blue: '#3674e6',
    info: '#3674e6',
    purple: '#8236e6'
} as const



export class URLS {
    static website = `https://suppora.app`
    static docs = `https://docs.suppora.app`

    static support = {
        chat: `https://discord.gg/jQjWxkbgbT`,
        site: `https://suppora.app/support`
    }

    static community = `https://discord.gg/pEVXUpBzZs`
    static pricing = `https://suppora.app/pricing`
}
export class IMAGE_URLS {

    static logo = {
        dark: (URLS.website + '/logo.png'),
        light: (URLS.website + '/logo-light.png')
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

URLS.docs = 'test-replaced.com'