import { DateTime } from 'luxon'
import { checkGuildPermissions } from "./permissions";
import { log } from "./logs/logs";
import { CORE } from "./core";
import { BotErrorMessageContainer, DefaultBotFooter } from "../types/customBuilders";
import { MessageFlags, TextChannel } from "discord.js";
import { supabase } from "./database/supabase";
import { UserIdentity } from "@supabase/supabase-js";

const ENVIRONMENT = process.env.ENVIRONMENT
const preventProductionTests = true;


const applicationTestingGuildId = '1379160686629880028'
const supporaOfficialGuildId = '1492365525093712012'

export async function beginTests() {
    try {
        // Environment Check:
        if (ENVIRONMENT == 'production' && preventProductionTests) {
            console.warn('(!) Development test(s) was prevented from executing -- Revise configurations if this was unintended!')
            return
        }
        // Perform Test(s):
        console.info(`(i) Development Tests -- Executing at ${DateTime.local()?.toFormat('F')}`)

        // Test here:

        // const testGuild = await CORE.bot.guilds.fetch(supporaOfficialGuildId)

        // const channel = await testGuild.channels?.fetch('1379160687154298912') as TextChannel

        // console.log(r)

        // Completed - Debug:
        console.info(`(i) Development Tests -- Completed at ${DateTime.local()?.toFormat('F')}`)
    } catch (err) {
        // Developments Test(s) -- Errored:
        console.log(`(!) Development Tests -- ERRORED`, err)
    }
}