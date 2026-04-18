import { ChannelType } from "discord.js"

type ModalQuestionLabelData = {
    name: string,
    description?: string
}

type ModalQuestionDefaults = {
    index: number
    label: ModalQuestionLabelData,
    required: boolean
}

type ModalQuestionsValueLimits = {
    max_values?: number,
    min_values?: number
}

export type PanelQuestion = ({
    type: 'TextInput' | 'ParagraphInput',
} | ({
    type: 'StringSelect' | 'CheckboxSelect',
    options: {
        value: string,
        description?: string
    }[]
} & ModalQuestionsValueLimits) | {
    type: 'RadioSelect',
    options: {
        value: string,
        description?: string
    }[],
} | {
    type: 'UserSelect' | 'RoleSelect' | 'MentionableSelect',
} & ModalQuestionsValueLimits | {
    type: 'ChannelSelect',
    channel_types?: ChannelType[]
} & ModalQuestionsValueLimits | {
    type: 'FileUpload',
} & ModalQuestionsValueLimits) & ModalQuestionDefaults


export type PanelFormData = {
    name: string
    questions: PanelQuestion[]
}


export const exPanel: PanelFormData = {
    name: 'Example Title',
    questions: [
        {
            index: 1,
            type: 'ParagraphInput',
            label: {
                name: 'Reason for Support',
                description: `Explain why you're for requesting support today.`
            },
            required: true
        },
        {
            index: 2,
            type: 'CheckboxSelect',
            label: {
                name: 'Issue Type',
                description: 'Select any of the services your facing issues with.'
            },
            required: false,
            options: [
                { value: 'Discord Bot', description: 'The main Discord application you interact with.' },
                { value: 'Website / Dashboard', description: 'The https://suppora.app website and Bot Dashboard where you configure things.' },
                { value: 'Subscriptions / Billing', description: 'Any premium product offering or billing related request.' },
                { value: 'Other', description: 'Any other reason not provided.' },
            ]
        },
        {
            index: 3,
            type: 'FileUpload',
            label: {
                name: 'Upload File(s)',
                description: 'Provide any related attachments. — Optional'
            },
            max_values: 3,
            required: false
        },
        {
            type: 'CheckboxSelect',
            index: 4,
            label: {
                name: 'Confirm'
            },
            options: [
                {
                    value: `This ticket is not feedback related`,
                    description: `If I have feedback I'll share it inside the feedback channel!`
                }
            ],
            required: true
        }
    ]
}