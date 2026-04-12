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


const fallbackSite = 'https://github.com/SupporaBot'
export const URLS = {
    website: `https://suppora.app`,
    docs: fallbackSite,
    support: {
        chat: fallbackSite,
        site: `https://suppora.app/support`
    },
    pricing: fallbackSite
} as const