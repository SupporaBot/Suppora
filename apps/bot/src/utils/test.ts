import { DateTime } from 'luxon'
import { COLORS, CORE, URLS } from "./core";
import { supabase } from "./database/supabase";
import sendWithFallback from './bot/messages/sendWithFallback';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, SeparatorBuilder } from 'discord.js';
import { DefaultBotFooter, TextBuilder } from '../types/customBuilders';

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

        const testPanelMessage = new ContainerBuilder({
            accent_color: COLORS.LuminousVividPink,
            components: <any>[
                new TextBuilder(`## 🙏🏽 Request Support`),
                new SeparatorBuilder(),
                new TextBuilder(`> Have any general product question or concerns? Feel free to create a new support ticket by clicking the button below! :)`),
                new DefaultBotFooter(),
                new SeparatorBuilder(),
                new ActionRowBuilder({
                    components: [
                        new ButtonBuilder({
                            style: ButtonStyle.Primary,
                            label: '🎟 Create Ticket',
                            custom_id: `new_ticket:EX_PANEL_ID`
                        }),
                        new ButtonBuilder({
                            style: ButtonStyle.Link,
                            label: 'Link 1',
                            url: URLS.website
                        }),
                        new ButtonBuilder({
                            style: ButtonStyle.Link,
                            label: 'Link 2',
                            url: URLS.dashboard
                        })
                    ]
                })
            ]
        })

        // const testGuild = await CORE.bot.guilds.fetch(applicationTestingGuildId)
        // console.log(await sendWithFallback(testGuild, testPanelMessage))

        // console.log(r)

        // Completed - Debug:
        console.info(`(i) Development Tests -- Completed at ${DateTime.local()?.toFormat('F')}`)
    } catch (err) {
        // Developments Test(s) -- Errored:
        console.log(`(!) Development Tests -- ERRORED`, err)
    }
}