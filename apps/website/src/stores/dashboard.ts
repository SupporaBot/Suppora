
export const useDashboardStore = defineStore('dashboard', () => {

    // Selected Guild:
    const guildId = ref<string | null>()

    const guildData = {

    }


    // Dashboard Nav:
    const nav = (() => ({
        expanded: ref(false),
        toggle: () => nav.expanded.value = !nav.expanded.value,
        currentTab: ref<'Tickets' | 'Panels' | 'Teams' | 'Settings'>('Tickets')
    }))()

    // Return States & Methods:
    return {
        guildId,
        guildData,

        nav
    }
})
