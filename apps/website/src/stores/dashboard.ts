import { ApiRequest } from "@/utils/api"
import { asyncState } from "@/utils/asyncState"
import type { API_GuildChannel, API_GuildRole, APIResponseValue } from "@suppora/shared"

// Reuseable - Guild Data State Config
const guildDataStateOptions = {
    cooldown: 60,
    throwCooldown: true,
    throwError: true,
    transformData: (data: any) => data?.data
} as const

// Exported Type - Dashboard Tabs
export type DashboardTab = 'Tickets' | 'Panels' | 'Teams' | 'Settings'

export const useDashboardStore = defineStore('dashboard', () => {

    // Selected Guild:
    const guildId = ref<string | undefined>(undefined)


    // Guild API/DB Data
    const guildData = {
        roles: asyncState(() => ApiRequest<API_GuildRole[]>({ url: `/guilds/${guildId.value}/roles` }), guildDataStateOptions),
        channels: asyncState(() => ApiRequest<API_GuildChannel[]>({ url: `/guilds/${guildId.value}/channels` }), guildDataStateOptions)
    }

    // Reset Store - Util:
    async function reset() {
        guildId.value = undefined
        nav.currentTab.value = 'Tickets'
        const resetPromises = Object.values(guildData)?.map(d => d.reset)
        await Promise.all(resetPromises)
    }

    // Guild Id - Watcher:
    watch(guildId, async (id) => {
        if (id) {
            // Fetch Guild Data:
            const fetchPromises = Object.values(guildData)?.map(d => d.get())
            await Promise.all(fetchPromises)
            console.log(`Selected Dashboard Guild`, guildId.value, 'Fetched Data:')
            console.log({ roles: guildData.roles.state.value, channels: guildData.channels.state.value })
        } else {
            reset()
        }
    })


    // Dashboard Nav:
    const nav = (() => ({
        expanded: ref(false),
        toggleExpanded: () => nav.expanded.value = !nav.expanded.value,
        currentTab: ref<DashboardTab>('Tickets'),
        changeTab: (t: DashboardTab) => nav.currentTab.value = t
    }))()

    // Return States & Methods:
    return {
        guildId,
        guildData,
        nav,
    }
})
