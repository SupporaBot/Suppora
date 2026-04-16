import { ContainerBuilder, EventData, Interaction, MessageFlags, SeparatorBuilder, TextDisplayBuilder } from "discord.js";
import { COLORS, CORE } from "../utils/core";
import { BotErrorMessageContainer } from "../types/customBuilders";
import { log } from "../utils/logs/logs";
import { isDiscordPermissionError } from "../utils/permissions";

const ENVIRONMENT = process.env.ENVIRONMENT || 'development'

// Cooldown Utils:
const useCooldowns = () => {
    const commandCooldowns = new Map<string, Map<string, number>>()
    const buttonCooldowns = new Map<string, Map<string, number>>()

    const getCooldownActions = (base: Map<string, Map<string, number>>) => {
        return {
            /** Returns the amount of seconds(floored) left in the users cooldown. */
            remaining: (userId: string, intId: string) => {
                // Get Cooldowns for Unique Interaction:
                let thisIntCooldowns = base.get(intId);
                if (!thisIntCooldowns) {
                    thisIntCooldowns = new Map<string, number>();
                    base.set(intId, thisIntCooldowns);
                }
                // Check for users current cooldown:
                const nowUtcSecs = Math.floor(Date.now() / 1000)
                const userCurCooldownEnd = thisIntCooldowns.get(userId) ?? nowUtcSecs
                return Math.max((userCurCooldownEnd - nowUtcSecs), 0)
            },
            /** Starts a new cooldown for provided options. */
            start: (userId: string, intId: string, cooldownSecs: number = 3) => {
                // Start a new cooldown for provided user and interaction:
                const nowUtcSecs = Math.floor(Date.now() / 1000)
                const newCooldownEndSecs = nowUtcSecs + cooldownSecs
                // Set cooldown for user inside interaction map:
                let thisIntCooldowns = base.get(intId) ?? base.set(intId, new Map<string, number>())?.get(intId);
                thisIntCooldowns.set(userId, newCooldownEndSecs)
                return newCooldownEndSecs
            },

            cooldownAlertContent: (remainingSecs: number) => new ContainerBuilder({
                accent_color: COLORS.Orange,
                components: <any>[
                    new TextDisplayBuilder({ content: `## ⏳ Cooldown` }),
                    new SeparatorBuilder(),
                    new TextDisplayBuilder({ content: `It seems you've used this interaction **too recently**, please wait a short while and try this interaction again!` }),
                    new SeparatorBuilder(),
                    new TextDisplayBuilder({ content: `Remaining: \`${remainingSecs}\` \nCooldown Ends: <t:${(Math.floor(Date.now() / 1000) + remainingSecs)}:T>` })
                ]
            })
        }
    }

    return {
        commands: getCooldownActions(commandCooldowns),
        buttons: getCooldownActions(buttonCooldowns)
    }

}
const cooldowns = useCooldowns()

// Interaction Handler:
export default <EventData>{
    name: 'interactionCreate',
    execute: async (i: Interaction) => {
        try {
            // ABORT INTERACTIONS IN API_ONLY MODE:
            if (ENVIRONMENT == 'api_only') {
                return console.info('[API ONLY MODE]: Disregarding Interaction', i?.guildId, i?.user?.id)
            }
            // Interaction Data:
            const userId = i?.user?.id

            // Stringed Interaction Type:
            const iTypeString = (() => {
                if (i.isCommand()) return 'Command'
                else if (i.isButton()) return 'Button'
                else if (i.isAutocomplete()) return 'Auto Complete'
                else return '\`Unknown?\`'
            })()

            // + Button Interactions:
            if (i.isButton()) {
                const buttonId = i?.customId?.split(':')[0]
                const button = CORE.bot.buttons.get(buttonId)

                // Confirm not already replied or inside bypass list:
                const bypassIds = [
                    "ticket-modal-cancel",
                    "ticket-modal-continue"
                ]
                if (bypassIds?.includes(buttonId)) return
                if (i?.replied || i?.deferred) return

                // Confirm Button
                if (!button) {
                    throw new Error('Missing button file within interactions.ts!')
                } else {
                    // Check Cooldowns:
                    const buttonCooldown = button.cooldown ?? 3;
                    const remainingCooldown = cooldowns.buttons.remaining(userId, buttonId)
                    if (remainingCooldown > 0) {
                        // Send Cooldown Alert:
                        await i.reply({
                            components: [cooldowns.buttons.cooldownAlertContent(remainingCooldown)],
                            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2
                        })
                    } else {
                        // Start Cooldown:
                        cooldowns.buttons.start(userId, buttonId, buttonCooldown)
                        // Execute Command:
                        await button?.execute(i)
                    }
                }


            }

            // + Auto Complete Interactions:
            if (i.isAutocomplete()) {

                // Get Command (Auto Complete) Data:
                const command = CORE.bot.commands.get(i?.commandName)

                // Confirm Command & Auto Complete Logic:
                if (!command || !command.autocomplete) {
                    throw (`Command file is missing or missing it's auto complete logic within interactions.ts! `)
                } else {
                    try {
                        await command.autocomplete(i)
                    } catch (err) {
                        // Confirm Empty Response:
                        if (!i.responded) {
                            await i.respond([]).catch(() => { })
                        }
                        throw err
                    }
                }

            }

            // + Command Interactions:
            if (i.isChatInputCommand()) {

                // Get Command Data:
                const command = CORE.bot.commands.get(i.commandName);
                const cooldownSeconds = command?.cooldown ?? 3;

                // Check Cooldown:
                const remainingCooldown = cooldowns.commands.remaining(i.user.id, i.commandId)
                if (remainingCooldown > 0) {
                    // Send Cooldown Alert:
                    await i.reply({
                        components: [cooldowns.commands.cooldownAlertContent(remainingCooldown)],
                        flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2
                    })
                } else {
                    // Start Cooldown:
                    cooldowns.commands.start(userId, i?.commandId, cooldownSeconds)
                    // Execute Command:
                    await command?.execute(i)
                }

            }


        } catch (err) {
            // Interaction Error - Default Handling:
            const interactionUniqueString = (() => {
                if (i.isCommand()) return `Command - /${i?.commandName}`
                else if (i.isButton()) return `Button - ${i?.customId?.split(':')[0]}`
                else if (i.isAutocomplete()) return `Auto Complete - /${i?.commandName}`
                else return `Unknown?`
            })()
            const interactionUniqueID = (() => {
                if (i.isCommand()) return `Command - /${i?.commandName}`
                else if (i.isButton()) return `Button - ${i?.customId}`
                else if (i.isAutocomplete()) return `Auto Complete - /${i?.commandName}`
                else return `Unknown?`
            })()
            const userId = i?.user?.id
            const guildId = i?.guildId

            // Check Permission Error & Log Error:
            if (isDiscordPermissionError(err)) {
                log.for('Bot').warn(`The ${interactionUniqueString} interaction has failed due to permissions!`, { guildId: guildId, interaction: interactionUniqueID, err })
            } else {
                log.for('Bot').error(`The ${interactionUniqueString} interaction has failed!`, { guildId: guildId, userId: userId, interaction: interactionUniqueID, err })
            }

            // Build Error Alert Message:
            const copyCodeContext = `\`\`\`\nGuild Id: ${guildId}\nUser Id: ${userId}\nInteraction: ${interactionUniqueString}\`\`\``
            const errDetailString = `Copy the following details below to provide to our Support Team if you reach out! \n${copyCodeContext}`
            const alertMsg = new BotErrorMessageContainer('ERROR', undefined, errDetailString)

            // Send Error Alert Message:
            if (i?.isRepliable()) {
                if (i.replied || i.deferred) {
                    // Already Replied - Follow Up:
                    await i.followUp({
                        components: [alertMsg as any],
                        flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2
                    })
                } else {
                    // New Reply:
                    await i.reply({
                        components: [alertMsg as any],
                        flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2
                    })
                }
            } else {
                // Non Repliable Interaction - Send New Alert:
                await i.channel.send({
                    target: i.user,
                    components: [alertMsg as any],
                    flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2
                })
            }
        }

    },
}