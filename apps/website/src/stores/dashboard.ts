
export const useDashboardStore = defineStore('dashboard', () => {

    // Selected Guild:
    const guildId = ref<string | null>()

    const guildData = {

    }

    // Return States & Methods:
    return {
        guildId,
        guildData
    }
})
