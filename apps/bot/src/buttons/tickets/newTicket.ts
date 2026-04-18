import { ActionRowBuilder, APIMediaGalleryItem, Attachment, AttachmentBuilder, ButtonBuilder, ButtonData, ButtonInteraction, ButtonStyle, ChannelType, ComponentType, ContainerBuilder, DiscordjsError, FileBuilder, LabelBuilder, LabelModalData, MediaGalleryBuilder, MessageFlags, ModalBuilder, ModalSubmitInteraction, SeparatorBuilder, TextChannel, TextDisplayBuilder, ThreadAutoArchiveDuration } from "discord.js";
import { log } from "../../utils/logs/logs";
import { BotErrorMessageContainer, DefaultBotFooter, TextBuilder } from "../../types/customBuilders";
import { supabase } from "../../utils/database/supabase";
import { COLORS } from "../../utils/core";
import { exPanel, PanelFormData, PanelQuestion } from "@suppora/shared";
import { resolveModalFormComponents } from "../../utils/tickets/panelForms";
import { DateTime } from "luxon";


export default <ButtonData>{
    data: {
        customId: 'new_ticket'
    },
    execute: async (i) => {
        try {
            // Parse Interaction:
            const creator = i?.user
            const channel = i?.channel as TextChannel
            const [_, panelId] = i.customId?.split(':')
            if (!panelId) throw new Error(`Failed to create new ticket - Missing/invalid panel_id in button's custom_id!`, { cause: { customId: i?.customId, guildId: i?.guildId } })


            // Step 1: Load Panel - Fetch From DB - Safety Time Limit:
            async function preparePanelData() {
                try {
                    // Timeout Fetch DB:
                    const { data, error } = await Promise.race([
                        new Promise<never>((_, r) => setTimeout(() => r(`DB couldn't fetch modal data in 2.5s for new ticket interaction`), 2_500)),
                        supabase.from('guilds').select('*').eq('id', '1379160686629880028').single()
                    ])
                    if (error || !data) throw new Error(`[DB Timeout/Error] Couldn't find panel data for new ticket interaction! (attempt 1)`, { cause: { data, error } })
                    // DB Ready - SHOW & AWAIT MODAL:
                    await awaitModalSubmission(exPanel, i) // ! FIX Panel Data

                } catch (err) {
                    // Timeout / Db Failure - New Interaction "Flow":
                    // Defer -> Fetch DB -> "Continue" Msg -> Await Response -> Modal:
                    await i?.deferReply({ flags: MessageFlags.Ephemeral })?.catch(() => { })
                    // Fetch DB (again)
                    const { data, error } = await supabase.from('guilds').select('*').eq('id', '1379160686629880028').single()
                    if (error || !data) throw new Error(`[DB Failed] Couldn't find panel data for new ticket interaction!`, { cause: { data, error } })

                    // Build/Send "Continue" Message:
                    const continueMsg = await i?.editReply({
                        components: [new ContainerBuilder({
                            accent_color: COLORS.LuminousVividPink,
                            components: <any>[
                                new TextBuilder(`### 🎟  Creating Ticket — Begin Form`),
                                new TextBuilder(`> We've prepared the **form you must complete** in order to create this new ticket! \nClick on the "Continue" button below to get started.`),
                                new DefaultBotFooter({ trailing: `<@${i?.user?.id}>` }),
                                new SeparatorBuilder(),
                                new ActionRowBuilder({
                                    components: [
                                        new ButtonBuilder({
                                            style: ButtonStyle.Secondary,
                                            label: 'Cancel ✖',
                                            custom_id: 'ticket-modal-cancel'
                                        }),
                                        new ButtonBuilder({
                                            style: ButtonStyle.Primary,
                                            label: 'Continue ✔',
                                            custom_id: 'ticket-modal-continue'
                                        })
                                    ]
                                })
                            ]
                        })],
                        flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2
                    })

                    // Await "Continue" Msg Reply:
                    const continueCollector = continueMsg.createMessageComponentCollector({
                        componentType: ComponentType.Button,
                        idle: 60_000,
                        filter: (ni) => (i.user.id == ni.user.id)
                    })

                    // Continue Response - Collected:
                    continueCollector.on('collect', async (ci) => {
                        // IF Continuing - Show / Await Modal Submission:
                        if (ci.customId == 'ticket-modal-continue') {
                            // End Collector
                            continueCollector.stop('continued')
                            await i?.deleteReply(continueMsg)?.catch((e) => console.warn('Failed to delete reply after continuing', e))
                            // DB Ready & Continuing - SHOW & AWAIT MODAL:
                            await awaitModalSubmission(exPanel, ci) // ! FIX Panel Data
                        }
                        // IF Canceled - End Collector - Edit Continue Msg:
                        if (ci.customId == 'ticket-modal-cancel') {
                            // Defer Update / Edit Reply
                            await ci.deferUpdate()
                            await i?.editReply({
                                components: [new ContainerBuilder({
                                    accent_color: COLORS.Orange,
                                    components: <any>[
                                        new TextBuilder(`### ✖  Interaction Canceled!`),
                                        new SeparatorBuilder(),
                                        new TextBuilder(`> This Ticket Creation *(form)* has **been canceled**! \n> -# **TIP**: Didn't mean to do this? Don't worry, just start the [interaction](${i?.message?.url}) over again...`),
                                        new DefaultBotFooter()
                                    ]
                                })],
                                flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
                            })
                            // End Collector
                            continueCollector.stop('canceled')
                        }
                    })

                    // Continue Response - Ended:
                    continueCollector.on('end', async (_, r) => {
                        if (r == 'canceled' || r == 'continued') return
                        else if (r == 'time' || r == 'idle') {
                            // Send/Edit Reply - Timed Out Alert:
                            await i?.editReply({
                                flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
                                components: <any>[
                                    new ContainerBuilder({
                                        accent_color: COLORS.Orange,
                                        components: <any>[
                                            new TextBuilder(`### 🎟  New Ticket — Form Expired`),
                                            new SeparatorBuilder(),
                                            new TextBuilder(`Unfortunately you **ran out of time** to start the ticket form for your new ticket request! \n-# **Tip**: To continue creating a new ticket, start this [interaction](${i?.message?.url}) over.`)
                                        ]
                                    })
                                ]
                            })
                        }
                    })

                }

            }
            await preparePanelData()


            // Step 2: Build / Send / Await - Modal Form Submission
            async function awaitModalSubmission(panelData: PanelFormData, sendToInteraction: ButtonInteraction) {
                let receivedSubmission = undefined
                try {
                    // Resolve & Build Modal from Data:
                    const modalQuestions = resolveModalFormComponents(panelData)
                    const modal = new ModalBuilder({
                        custom_id: `new-ticket-form:${panelId}`,
                        title: panelData.name,
                        components: <any>[
                            ...modalQuestions,
                            new TextDisplayBuilder({
                                content: `> -# Please respond within 5 minutes! | <t:${DateTime.utc().plus({ minutes: 5 })?.toUnixInteger()}:t>`
                            })
                        ]
                    })
                    // Send Modal to SPECIFIED Interaction:
                    await sendToInteraction.showModal(modal)
                    // Await Modal Response:
                    const submission = await sendToInteraction.awaitModalSubmit({
                        time: (60_000 * 5)
                    })
                    // Defer Submission Reply:
                    await submission.deferUpdate()
                    receivedSubmission = submission

                } catch (err) {
                    // Step 2 - Modal Show / Await Submit - FAILED:
                    if (err instanceof DiscordjsError && err.code == 'InteractionCollectorError' && err?.message?.includes('time')) {
                        // Modal Submission Timeout:
                        return await i?.followUp({
                            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
                            components: <any>[new BotErrorMessageContainer('WARN', '🎟  New Ticket — Form Failed', `Unfortunately you **ran out of time** to complete the ticket form for your new ticket request! \n-# **Tip**: To continue creating a new ticket, please start this [interaction](${i?.message?.url}) over.`)]
                        })
                    } else {
                        log.for('Bot').error(`[New Ticket - Form Submission] FAILED Modal interaction!`, { userId: i?.user?.id, guildId: i?.guildId, err })
                        const errMsg = new BotErrorMessageContainer('ERROR', '⚠  Failed creating ticket!', `Unfortunately somewhere along the way we failed to create your new ticket! \nIf this issue persist, please get in contact with bot support.`)
                        return await i?.followUp({
                            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
                            components: [errMsg as any]
                        })
                    }

                }
                // Create Ticket From Received Submission:
                if (!receivedSubmission) throw new Error('[New Ticket - Form] Failed to receive a completed modal submission for ticket data!', { cause: { receivedSubmission } })
                await createTicketThread(receivedSubmission)
            }


            // Step 3: Create New Ticket Thread - AFTER MODAL:
            async function createTicketThread(submission?: ModalSubmitInteraction) {
                try {
                    // Cerate Thread Ticket:
                    const thread = await channel?.threads.create({
                        name: `ticket-${creator.username}`,
                        reason: 'User created ticket',
                        autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
                        type: ChannelType.PrivateThread,
                        invitable: false,
                    })

                    // Respond/Redirect User to New Thread:
                    await i.followUp({
                        components: [new ContainerBuilder({
                            accent_color: COLORS.Blurple,
                            components: <any>[
                                new TextBuilder(`### 🎟 Ticket Created! `),
                                new SeparatorBuilder(),
                                new TextBuilder(`> Check out your newly **created ticket**: ${thread?.url}`),
                                new DefaultBotFooter({ trailing: `<@${i?.user?.id}>` })
                            ]
                        })],
                        flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
                    })

                    // Send Initial Ticket Details:
                    await thread.send({
                        components: [new ContainerBuilder({
                            accent_color: COLORS.Purple,
                            components: <any>[
                                new TextBuilder(`## 🎟  Ticket Details:`),
                                new SeparatorBuilder(),
                                new TextBuilder(`**Created By**:\n> <@${creator?.id}>\n**Created at**:\n> <t:${DateTime?.utc()?.toUnixInteger()}:f>\n> <t:${DateTime?.utc()?.toUnixInteger()}:R>\n**Joined Staff**:\n> *Nobody Yet!*`),
                                new DefaultBotFooter(),
                                new SeparatorBuilder(),
                                new ActionRowBuilder({
                                    components: [
                                        new ButtonBuilder({
                                            custom_id: 'close-ticket:${ticket_it}',
                                            style: ButtonStyle.Secondary,
                                            label: '✖ Close Ticket'
                                        })
                                    ]
                                })
                            ]
                        })],
                        flags: MessageFlags.IsComponentsV2
                    })

                    // Parse Modal Questions:
                    if (submission) {

                        const fieldKeys = [...submission.fields.fields.keys()]
                        let attachments: Map<string, Attachment[]> = new Map()

                        const resolveQuestion = (custom_id: string) => {
                            const field = submission.fields.getField(custom_id)
                            const index = Number(custom_id?.split('question-')[1] ?? 0)
                            const questionData = exPanel.questions.find(q => q.index == index) ?? {} as PanelQuestion
                            const { type } = field
                            let answer = undefined
                            if (type == ComponentType.FileUpload) {
                                const attached = [...field.attachments?.values() ?? []]
                                if (attached?.length) {
                                    attachments.set(`Question ${index}`, attached)
                                    answer = attached?.map(a => a.url)?.join(', ')
                                } else {
                                    answer = "No Files Attached"
                                }
                            } else if (type == ComponentType.MentionableSelect
                                || type == ComponentType.RoleSelect
                                || type == ComponentType.UserSelect
                                || type == ComponentType.ChannelSelect) {
                                let mentions = []
                                for (const u of field?.users ?? []) {
                                    mentions.push(`<@${u[1]?.id}>`)
                                }
                                for (const r of field?.roles ?? []) {
                                    mentions.push(`<@&${r[1]?.id}>`)
                                }
                                for (const c of field?.channels ?? []) {
                                    mentions.push(`<#${c[1]?.id}>`)
                                }
                                answer = mentions.join(`, `)
                            } else if ('values' in field && type != ComponentType.TextInput) {
                                answer = field.values?.join(', ')
                            } else if ('value' in field) {
                                answer = field.value
                            } else answer = '?';

                            // Return Full Data:
                            return {
                                ...questionData,
                                answer
                            }
                        }
                        const resolveAnsweredFormString = () => {
                            let qs = []
                            for (const customId of fieldKeys) {
                                const q = resolveQuestion(customId)
                                qs.push(`**${q.index}**. ${q.label.name}${q.label.description ? `\n-# ${q.label.description}` : ''}\n> ${q.answer} `)
                            }
                            return qs.join('\n')
                        }

                        await thread.send({
                            components: [
                                new ContainerBuilder({
                                    accent_color: COLORS.Blurple,
                                    components: <any>[
                                        new TextBuilder(`## 📝  Ticket Form:`),
                                        new SeparatorBuilder(),
                                        new TextBuilder(resolveAnsweredFormString()),
                                    ]
                                })
                            ],
                            flags: MessageFlags.IsComponentsV2,
                            allowedMentions: {
                                parse: []
                            }
                        })

                        for (const [question, attached] of attachments.entries()) {
                            await thread.send({
                                content: `\`${question}\` - Attached ${attached?.length > 1 ? 'Files' : 'File'}:`,
                                files: attached?.map(a => a.url)
                            })
                        }

                    }
                } catch (err) {
                    // FAILED - Creating Thread - Log & Respond Error:
                    log.for('Bot').error(`[Tickets - Create]: Failed to create a new ticking from the "new_ticket" interaction!`, { userId: i?.user?.id, guildId: i?.guildId, err })
                    return submission.followUp({
                        components: <any>[new BotErrorMessageContainer('ERROR', '⚠ Ticket Creation Failed!')],
                        flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2
                    })
                }
            }


        } catch (err) {
            // ROOT Interaction Failed - Log & Respond w/ Alert:
            log.for('Bot').error(`[New Ticket] FAILED Button interaction!`, { userId: i?.user?.id, guildId: i?.guildId, err })
            const errMsg = new BotErrorMessageContainer('ERROR', '⚠  Failed creating ticket!', `Unfortunately somewhere along the way we failed to create your new ticket! \nIf this issue persist, please get in contact with bot support.`)
            if (i?.replied || i?.deferred) {
                await i.followUp({
                    components: [errMsg as any],
                    flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
                })
            } else {
                await i.reply({
                    components: [errMsg as any],
                    flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
                })
            }
        }

    }
}