<script lang="ts" setup>
    import { useLayoutStore } from '@/stores/layout';
    import Dashboard from './Dashboard.vue';
    import { useDashboardStore } from '@/stores/dashboard';
    import { useAuthStore } from '@/stores/auth';
    import DashboardNav from './components/nav/dashboardNav.vue';

    // Services:
    const layout = useLayoutStore()
    const dashboard = useDashboardStore()
    const auth = useAuthStore()


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
    <main class="flex-center md:flex-row w-full grow relative">


        <!-- Dashboard Nav -->
        <DashboardNav />



        <!-- Main Dashboard Content -->
        <div class="flex h-full grow p-7 ml-13.5 md:ml-0">
            Content Here
        </div>

    </main>
</template>


<style scoped>
    /*@reference "@/styles/main.css"; */
</style>