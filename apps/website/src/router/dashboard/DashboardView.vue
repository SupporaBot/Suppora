<script lang="ts" setup>
    import { useLayoutStore } from '@/stores/layout';
    import Dashboard from './Dashboard.vue';
    import { useDashboardStore } from '@/stores/dashboard';
    import { useAuthStore } from '@/stores/auth';

    // Services:
    const layout = useLayoutStore()
    const dashboard = useDashboardStore()
    const auth = useAuthStore()

    const guildDataFromUser = computed(() => auth.identity?.guilds.find(g => g.id == dashboard.guildId))

    // Alter Header / Footer Roundness when visible:
    onMounted(() => {
        console.log('Mounted!')
        layout.appHeader.rounded = false
        layout.appFooter.rounded = false
    })

    onUnmounted(() => {
        console.log('Unmounted!')
        layout.appHeader.rounded = true
        layout.appFooter.rounded = true
    })

</script>


<template>
    <main class="flex-center md:flex-row w-full grow relative">


        <!-- Dashboard Nav -->
        <nav class="w-45 flex-col absolute md:relative left-0 top-0 h-full flex bg-bg-2 border-r-2 border-ring-3/30">

            <span class="w-full flex-center p-2 flex-row flex-nowrap">
                <img :src="guildDataFromUser?.icon ?? '/discord.png'" class="size-6 rounded-md block" />
                <p class="truncate">
                    {{ guildDataFromUser?.name ?? 'Server?' }}
                </p>
            </span>

            <span @click="dashboard.guildId = undefined"> Clear Guild </span>

            <span>
                <p>

                </p>
            </span>


            <span>

            </span>
        </nav>

        <!-- Main Dashboard Content -->
        <div class="flex h-full grow">
            Content Here
        </div>
    </main>
</template>


<style scoped>
    /*@reference "@/styles/main.css"; */
</style>