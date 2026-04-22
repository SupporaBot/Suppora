import * as z from 'zod'
import { DiscordSnowflake } from './discordSnowflake'

export const TeamSchema = z.object({
    id: z.uuid(),
    title: z.string('Please enter a valid Team name.')
        .trim().normalize()
        .max(25, 'Team name cannot exceed 25 characters.')
        .min(1, 'Please enter a valid Team name.'),
    guild_id: DiscordSnowflake,
    role_id_on_call: z.nullish(DiscordSnowflake),
    role_id_off_call: z.nullish(DiscordSnowflake),
    created_at: z.nullish(z.iso.datetime('Invalid timestamp was provided.'))
})
export type TeamSchema = z.infer<typeof TeamSchema>