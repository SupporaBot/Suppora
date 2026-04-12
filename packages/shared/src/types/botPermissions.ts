import type { PermissionsString } from 'discord.js'

export const requiredBotPermissions: PermissionsString[] = [
    "AddReactions", "CreatePrivateThreads",
    "EmbedLinks", "ManageMessages", "ManageRoles",
    "ManageThreads", "ManageWebhooks", "ReadMessageHistory",
    "SendMessages", "SendMessagesInThreads", "ViewChannel"
]