import cors, { CorsOptions } from "cors"

const ENVIRONMENT = process.env.ENVIRONMENT

// Allowed Origins:
const allowedOrigins = [
    'https://suppora.app',
    'https://suppora.pages.dev',
    ...ENVIRONMENT != 'production'
        ? [
            'http://localhost:3000',
            'http://localhost:5173'
        ]
        : []
]

// Util - Check for ALLOWED Origin/Host:
function isAllowedOrigin(org: string): Boolean {
    try {
        const originUrl = new URL(org)
        const host = originUrl.hostname

        // Exact Allowed Matches:
        if (allowedOrigins?.includes(org)) return true

        // Allow CloudFlare Preview Pages:
        if (host?.endsWith('.suppora.pages.dev')) return true

        return false
    } catch (e) {
        return false
    }
}

const options: CorsOptions = {
    origin(requestOrigin, callback) {
        if (!requestOrigin) {
            // Allow requests like Postman or curl (no origin)
            return callback(null, true);
        }
        if (isAllowedOrigin(requestOrigin)) {
            // Allow specified origins
            return callback(null, true);
        }
        // Block everything else
        return callback(new Error(`[CORS] Not allowed: ${requestOrigin}`))
    },
    credentials: true
}

export default cors(options)