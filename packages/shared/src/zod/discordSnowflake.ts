import * as z from 'zod'

export const DiscordSnowflake = z.string().regex(new RegExp('/^\d{17,21}$/g'), 'An invalid Discord id was provided.')