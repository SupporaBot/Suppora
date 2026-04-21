<script lang="ts" setup>
    import { useLayoutStore } from '@/stores/layout';
    import { useDashboardStore } from '@/stores/dashboard';
    import { useAuthStore } from '@/stores/auth';
    import DashboardNav from './components/nav/dashboardNav.vue';
    import TicketsTab from './components/tabs/tickets/TicketsTab.vue';
    import PanelsTab from './components/tabs/panels/PanelsTab.vue';
    import TeamsTab from './components/tabs/teams/TeamsTab.vue';
    import SettingsTab from './components/tabs/settings/SettingsTab.vue';

    // Services:
    const layout = useLayoutStore()
    const dashboard = useDashboardStore()
    const auth = useAuthStore()

    // Viewing Tab:
    const currentTab = computed(() => dashboard.nav.currentTab)


    // Alter Header / Footer Roundness when visible:
    onMounted(() => {
        layout.appHeader.rounded = false
        layout.appFooter.rounded = false
    })
    onUnmounted(() => {
        layout.appHeader.rounded = true
        layout.appFooter.rounded = true
    })

</script>


<template>
    <main class="flex w-full h-full grow">

        <!-- Dashboard Nav -->
        <DashboardNav />

        <!-- Main Dashboard Content -->
        <div class="flex w-full flex-row grow flex-center gap-3 z-1! p-4 pb-0 ml-13.5 overflow-y-auto"
            :class="{ 'md:ml-47': dashboard.nav.expanded }">
            <div class="flex grow w-full h-full">

                <!-- Dashboard Tab View(s): -->
                <Transition name="blur-fade" mode="out-in">

                    <TicketsTab v-if="currentTab == 'Tickets'" />

                    <PanelsTab v-else-if="currentTab == 'Panels'" />

                    <TeamsTab v-else-if="currentTab == 'Teams'" />

                    <SettingsTab v-else-if="currentTab == 'Settings'" />

                </Transition>

            </div>
        </div>

    </main>
</template>


<style scoped>
    /*@reference "@/styles/main.css"; */
</style>