<script lang="ts" setup>
    import { useAuthStore } from '@/stores/auth';
    import { useDashboardStore } from '@/stores/dashboard';
    import LoadingDashboard from './components/LoadingDashboard.vue';
    import DashboardDataFailure from './components/DashboardDataFailure.vue';
    import DashboardView from './DashboardView.vue';
    import SelectServer from './components/SelectServer.vue';
    import { useLayoutStore } from '@/stores/layout';


    // Services:
    const dashboard = useDashboardStore()
    const auth = useAuthStore()
    const layout = useLayoutStore()
    const authReady = computed(() => auth.authReady)
    const dashboardDataFailure = ref(false)

    // Redirect - Not Signed In:
    onMounted(async () => {
        layout.appFooter.isVisible = false
        await auth.waitForAuthReady(10_000)
        if (!auth.signedIn) auth.signIn()
    })

    onUnmounted(() => {
        layout.appFooter.isVisible = true
    })

</script>


<template>
    <main class="flex flex-col h-full w-full min-h-[87dvh] grow">
        <Transition name="blur-fade" mode="out-in">
            <!-- Loading Card -->
            <LoadingDashboard v-if="!authReady || !auth.signedIn" />

            <!-- Select Server Card -->
            <SelectServer v-else-if="!dashboard.guildId" />

            <!-- Data Failure Card -->
            <DashboardDataFailure v-else-if="dashboardDataFailure" />

            <!-- Main Dashboard View -->
            <DashboardView v-else />


        </Transition>
    </main>
</template>


<style scoped></style>