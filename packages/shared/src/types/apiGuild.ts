import type { ChannelType, RoleColors } from "discord.js"

export type API_GuildRole = {
    name: string
    color: number | RoleColors
    permissions: bigint
    editable: boolean
    managed: boolean
}


export type API_GuildChannel = {
    name: string
    type: ChannelType
    manageable: boolean
    viewable: boolean
    sendable: boolean
}