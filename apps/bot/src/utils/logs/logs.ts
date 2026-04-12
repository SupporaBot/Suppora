import LogCategories from './categories'

type CategoryName = keyof typeof LogCategories

/** Option data record(s) to attach to the saved log. */
type LogMeta = {
    /** The **`Discord`** guild id to attach to the log. */
    guildId?: string,
    /** The **`Discord`** user id to attach to the log. */
    userId?: string,
} & {
    [x: string]: any
}

/** Extracts the true "called from" or "source" the log was initiated from. */
function getStack() {
    const err = new Error();
    const stack = err.stack?.split('\n') ?? [];
    return stack
}

const useLog = () => {
    return {
        for: (category: CategoryName) => {
            const c = LogCategories[category]
            const stack = getStack()
            const caller = stack[3] || stack[4]

            // Log Content(s):
            const logPrefix = `[${c.emoji} ${c.name}]`
            const logContent = (message: string, ctx?: LogMeta) => {
                if (ctx) return [`${logPrefix} ${message}`, ctx]
                else return [`${logPrefix} ${message}`]
            }

            return {
                info: (message: string, ctx?: LogMeta) => console.info(...logContent(message, ctx)),
                debug: (message: string, ctx?: LogMeta) => console.debug(...logContent(message, ctx)),
                warn: (message: string, ctx?: LogMeta) => console.warn(...logContent(message, ctx)),
                error: (message: string, ctx?: LogMeta) => console.error(...logContent(message, ctx))
            }
        }
    }
}

export const log = useLog()