import { PanelFormData } from "@suppora/shared"
import { ComponentType, LabelBuilder, TextInputStyle } from "discord.js"

/** Resolves {@linkcode LabelBuilder} Components from {@linkcode PanelFormData} */
export function resolveModalFormComponents(modalData: PanelFormData) {
    let r: LabelBuilder[] = []
    for (const q of modalData.questions) {
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