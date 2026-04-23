import { ApiRequest } from "@/utils/api"
import { asyncState, type AsyncStateOptions } from "@/utils/asyncState"
import type { API_GuildChannel, API_GuildRole, APIResponseValue, DatabaseRow } from "@suppora/shared"
import { fetchGuildTeams } from "./dashboard.api"

// Reuseable - Guild Data State Config
const guildDataStateOptions: AsyncStateOptions<any> = {
    cooldown: 60,
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
        roles: asyncState<API_GuildRole[]>(() => ApiRequest({ url: `/guilds/${guildId.value}/roles` }), guildDataStateOptions),
        channels: asyncState<API_GuildChannel[]>(() => ApiRequest({ url: `/guilds/${guildId.value}/channels` }), guildDataStateOptions),
        teams: asyncState<DatabaseRow<'teams'>[]>(() => fetchGuildTeams(guildId.value), guildDataStateOptions),
    }
    const guildDataLoading = computed(() => Object.values(guildData)?.map(d => d.loading.value)?.some(d => d == true))
    const guildDataReady = computed(() => Object.values(guildData)?.map(d => d.ready.value)?.every(d => d == true))

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
            console.log(Object.entries(guildData)?.map(([n, state]) => ({ [n]: state.state.value }))?.flat())
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
        guildDataLoading,
        guildDataReady,
        nav,
    }
})
