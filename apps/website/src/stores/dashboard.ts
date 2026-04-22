
// Exported Type - Dashboard Tabs
export type DashboardTab = 'Tickets' | 'Panels' | 'Teams' | 'Settings'

export const useDashboardStore = defineStore('dashboard', () => {

    // Selected Guild:
    const guildId = ref<string | null>()

    const guildData = {

    }


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
