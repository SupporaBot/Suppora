import { exPanel, PanelFormData, PanelQuestion } from "@suppora/shared"
import { ComponentType, LabelBuilder, TextInputStyle, ModalSubmitInteraction, Attachment } from "discord.js"

/** Resolves {@linkcode LabelBuilder} Components from {@linkcode PanelFormData} */
export function resolveModalFormComponents(modalData: PanelFormData) {
    let r: LabelBuilder[] = []
    const sortedQuestions = modalData.questions?.sort((a, b) => a.index - b.index)
    for (const q of sortedQuestions) {
        if (q.type == 'TextInput' || q.type == 'ParagraphInput') {
            r.push(new LabelBuilder({
                label: q.label.name,
                description: q.label.description ?? undefined,
                component: {
                    type: ComponentType.TextInput,
                    style: q?.type == 'TextInput' ? TextInputStyle.Short : TextInputStyle.Paragraph,
                    custom_id: `question-${q.index}`,
                    required: q.required
                }
            }))
        } else if (q.type == 'ChannelSelect') {
            r.push(new LabelBuilder({
                label: q.label.name,
                description: q.label.description ?? undefined,
                component: {
                    type: ComponentType.ChannelSelect,
                    custom_id: `question-${q.index}`,
                    required: q.required,
                    channel_types: q?.channel_types,
                    max_values: q?.max_values,
                    min_values: q?.min_values
                }
            }))
        } else if (q.type == 'CheckboxSelect') {
            r.push(new LabelBuilder({
                label: q.label.name,
                description: q.label.description ?? undefined,
                component: {
                    type: ComponentType.CheckboxGroup,
                    custom_id: `question-${q.index}`,
                    required: q.required,
                    options: (q.options ?? [])?.map(o => ({
                        label: o.value,
                        value: o.value,
                        description: o?.description ?? undefined
                    })),
                    max_values: q?.max_values,
                    min_values: q?.min_values
                }
            }))
        } else if (q.type == 'FileUpload') {
            r.push(new LabelBuilder({
                label: q.label.name,
                description: q.label.description ?? undefined,
                component: {
                    type: ComponentType.FileUpload,
                    custom_id: `question-${q.index}`,
                    required: q.required,
                    max_values: q?.max_values,
                    min_values: q?.min_values
                }
            }))
        } else if (q.type == 'MentionableSelect') {
            r.push(new LabelBuilder({
                label: q.label.name,
                description: q.label.description ?? undefined,
                component: {
                    type: ComponentType.MentionableSelect,
                    custom_id: `question-${q.index}`,
                    required: q.required,
                    max_values: q?.max_values,
                    min_values: q?.min_values
                }
            }))
        } else if (q.type == 'RadioSelect') {
            r.push(new LabelBuilder({
                label: q.label.name,
                description: q.label.description ?? undefined,
                component: {
                    type: ComponentType.RadioGroup,
                    custom_id: `question-${q.index}`,
                    required: q.required,
                    options: (q.options ?? [])?.map(o => ({
                        label: o.value,
                        value: o.value,
                        description: o?.description ?? undefined
                    }))
                }
            }))
        } else if (q.type == 'RoleSelect') {
            r.push(new LabelBuilder({
                label: q.label.name,
                description: q.label.description ?? undefined,
                component: {
                    type: ComponentType.RoleSelect,
                    custom_id: `question-${q.index}`,
                    required: q.required,
                    max_values: q?.max_values,
                    min_values: q?.min_values
                }
            }))
        } else if (q.type == 'StringSelect') {
            r.push(new LabelBuilder({
                label: q.label.name,
                description: q.label.description ?? undefined,
                component: {
                    type: ComponentType.StringSelect,
                    custom_id: `question-${q.index}`,
                    required: q.required,
                    options: (q.options ?? [])?.map(o => ({
                        label: o.value,
                        value: o.value,
                        description: o?.description ?? undefined
                    })),
                    max_values: q?.max_values,
                    min_values: q?.min_values
                }
            }))
        } else if (q.type == 'UserSelect') {
            r.push(new LabelBuilder({
                label: q.label.name,
                description: q.label.description ?? undefined,
                component: {
                    type: ComponentType.UserSelect,
                    custom_id: `question-${q.index}`,
                    required: q.required,
                    max_values: q?.max_values,
                    min_values: q?.min_values
                }
            }))
        }
    }
    return r
}

/** Resolves Panel Response ({@linkcode ModalSubmitInteraction}) Data to readable `string` for ticket creation messages */
export function resolveModelFormResponse(submission: ModalSubmitInteraction, panelData: PanelFormData) {
    // Get Submission Field Keys:
    const fieldKeys = [...submission.fields.fields.keys()]
    let attachments: Map<string, Attachment[]> = new Map()

    // UTIL - Resolve Question by Custom Id & Type:
    const resolveQuestion = (custom_id: string) => {
        // Field Data:
        const field = submission.fields.getField(custom_id)
        const index = Number(custom_id?.split('question-')[1] ?? 0)
        const questionData = panelData.questions.find(q => q.index == index) ?? {} as PanelQuestion
        const { type } = field
        let answer = undefined
        // File Uploads:
        if (type == ComponentType.FileUpload) {
            const attached = [...field.attachments?.values() ?? []]
            if (attached?.length) {
                attachments.set(`Question ${index}`, attached)
                answer = attached?.map(a => a.url)?.join(', ')
            } else {
                answer = "-# *No Files Attached*"
            }
            // Mentionable(s), Roles, Users, & Channels:
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
            mentions.length
                ? answer = mentions.join(`, `)
                : answer = '-# *None Selected*';
            // Checkboxes, Radios, & String Selects
        } else if ('values' in field && type != ComponentType.TextInput) {
            answer = field.values?.join(', ')?.trim() || '-# *None Selected*'
            // Text Inputs (or single selection from multiple select ^):
        } else if ('value' in field) {
            answer = field?.value || '-# *No Response*'
        } else answer = '-# *No Response*';

        // Return Full Data:
        return {
            ...questionData,
            answer
        }
    }

    // Resolve Each Form Question:
    let qs = []
    for (const customId of fieldKeys) {
        const q = resolveQuestion(customId)
        qs.push(`**${q.index}**. ${q.label.name}${q.label.description ? `\n-# ${q.label.description}` : ''}\n> ${q.answer} `)
    }
    const msgString = qs.join('\n')

    // Return Results:
    return {
        string: msgString,
        attachments
    }
}