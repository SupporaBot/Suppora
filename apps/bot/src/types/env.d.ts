declare namespace NodeJS {
    interface ProcessEnv {

        ENVIRONMENT: 'development' | 'api_only' | 'production'

        DISCORD_BOT_TOKEN: string
        DISCORD_CLIENT_ID: string
        DISCORD_CLIENT_SECRET: string

        BETTERSTACK_INGESTING_HOST: string
        BETTERSTACK_SOURCE_TOKEN: string

        SUPABASE_URL: string
        SUPABASE_KEY: string

    }
}