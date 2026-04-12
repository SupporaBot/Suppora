import { DiscordAPIError } from "discord.js"

/** Discord API Error Detection Helper */
export const isDiscordApiError = (err: any) => (err instanceof DiscordAPIError)

/** Generic internal error result
 * @scope `backend / bot` */
export class ErrorResult<t> {
    public reason: string
    public error?: t

    constructor(reason: string, err?: t) {
        this.reason = reason
        this.error = err
    }
}

