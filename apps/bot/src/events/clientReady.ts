import { EventData, type Client } from "discord.js";
import { CORE } from "../utils/core";
import axios from "axios";
import { beginTests } from "../utils/test";
import { log } from "../utils/logs/logs";
import INIT_API from '../api/index'
import { fetchBotEmojisToCore } from "../utils/bot/emojis";

export default <EventData>{
    name: 'clientReady',
    once: true,
    async execute(c: Client) {
        // Debug:
        log.for("Bot").info(`✅ Client Ready - ${c.user.tag}`)

        // Set Client to CORE:
        CORE.bot = c as Client<true>;

        // Fetch Client Data --> CORE:
        await fetchBotEmojisToCore()


        // If Development ENV -- Perform Test(s):
        if (process.env?.ENVIRONMENT == 'development') await beginTests()
        if (process.env?.ENVIRONMENT == 'api_only') console.warn(`(!) Started in API_ONLY Env Mode - Ensure this was intended!`)

        // Start Web/API Server:
        INIT_API()
    }
}