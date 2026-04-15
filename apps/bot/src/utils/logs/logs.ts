import { Logtail } from '@logtail/node'
import LogCategories from './categories'
import PkgFile from '../../../package.json'

const ENVIRONMENT = process.env.ENVIRONMENT ?? 'development'
const SOURCE_TOKEN = process.env.BETTERSTACK_SOURCE_TOKEN
const INGESTING_HOST = process.env.BETTERSTACK_INGESTING_HOST

const logtail = new Logtail(SOURCE_TOKEN, {
    endpoint: INGESTING_HOST,
})

type CategoryName = keyof typeof LogCategories

/** Option data record(s) to attach to the saved log. */
type LogMeta = {
    /** The **`Discord`** guild id to attach to the log. */
    guildId?: string,
    /** The **`Discord`** user id to attach to the log. */
    userId?: string,
    /** `Boolean` representing weather this log is critical or not. */
    critical?: boolean,
} & {
    [x: string]: any
}

/** Extracts the true "called from" or "source" the log was initiated from. */
function getStack() {
    const err = new Error();
    const stack = err.stack?.split('\n') ?? [];
    return stack
}

// Logtail Middleware - Fixes Context:
logtail.use(async (log) => {
    const stack = getStack()?.splice(7)?.map(s => s?.trim())
    const caller = stack[2] || stack[3]

    const enriched = {
        ...log,
        context: {
            ...log.context,
            stack,
            caller,
            environment: ENVIRONMENT,
            // commit_sha: ENVIRONMENT_GIT_COMMIT_SHA?.slice(0, 7),
            version: `@suppora/bot-v${PkgFile.version}`,
            service: "discord-bot",
            runtime: undefined,
            system: undefined
        }
    }

    if (ENVIRONMENT != 'production') {
        console.log(enriched)
    }

    return enriched
});

const useLog = () => {
    return {
        for: (category: CategoryName) => {
            // Log Content(s):
            const c = LogCategories[category]
            const logMessage = (msg: string) => `[${c.emoji} ${c.name}] ${msg}`

            // Return Log Methods:
            return {
                info: (message: string, ctx?: LogMeta) => logtail.info(logMessage(message), ctx),
                debug: (message: string, ctx?: LogMeta) => logtail.debug(logMessage(message), ctx),
                warn: (message: string, ctx?: LogMeta) => logtail.warn(logMessage(message), ctx),
                error: (message: string, ctx?: LogMeta) => logtail.error(logMessage(message), ctx),
            }
        },
        sync: () => logtail.flush()
    }
}

export const log = useLog()