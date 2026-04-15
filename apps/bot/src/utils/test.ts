import { DateTime } from 'luxon'
import { log } from "./logs/logs";
import { CORE } from "./core";
import { supabase } from "./database/supabase";
import sendWithFallback from './messages/sendWithFallback';
import guildCreate from '../events/guildCreate';

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

        // const testGuild = await CORE.bot.guilds.fetch(applicationTestingGuildId)

        // console.log(r)

        // Completed - Debug:
        console.info(`(i) Development Tests -- Completed at ${DateTime.local()?.toFormat('F')}`)
    } catch (err) {
        // Developments Test(s) -- Errored:
        console.log(`(!) Development Tests -- ERRORED`, err)
    }
}