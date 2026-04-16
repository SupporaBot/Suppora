import { CORE } from "../core"

const EmojiNames = [
    "Logo",
    "Logo_Light",
    "parti"
] as const


export type BotEmojiName = typeof EmojiNames[number]
export type BotEmojiData = {
    id: string,
    syntax: string
}


export async function fetchBotEmojisToCore() {
    const bot = CORE.bot
    const emojis = await bot.application.emojis.fetch()

    const mapped: Map<BotEmojiName, BotEmojiData> = new Map();

    for (const e of emojis?.values()) {
        mapped.set(e?.name as BotEmojiName, {
            id: e.id,
            syntax: `<${e?.animated ? 'a' : ''}:${e?.name}:${e?.id}>`
        })
    }

    const entries = Object.fromEntries(mapped?.entries()) as Record<BotEmojiName, BotEmojiData>
    CORE.emojis = entries
}