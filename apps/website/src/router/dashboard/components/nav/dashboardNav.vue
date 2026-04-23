<script lang="ts" setup>
    import { useAuthStore } from '@/stores/auth';
    import { useDashboardStore } from '@/stores/dashboard/dashboard';
    import SelectedServer from './selectedServer.vue';
    import { useLayoutStore } from '@/stores/layout';
    import TabButton from './tabButton.vue';


    // Services:
    const dashboard = useDashboardStore()
    const auth = useAuthStore()
    const layout = useLayoutStore()

    const selectTab = (tab: typeof dashboard.nav.currentTab) => dashboard.nav.currentTab = tab
    const currentTab = computed(() => dashboard.nav.currentTab)

    // Nav Expanded:
    const navExpanded = computed(() => dashboard.nav.expanded)

</script>


<template>

    <span class="absolute inset-0">

        <nav class="w-13.5! z-3! fixed flex flex-col items-center left-0 h-dvh bg-bg-2 border-r-2 border-ring-soft transition-all overflow-clip overflow-y-auto"
            :class="{ 'w-47!': dashboard.nav.expanded }"
            :style="{ paddingTop: `${layout.appHeader.currentHeight ?? 0}px` }">


            <!-- Nav Header -->
            <span class="flex flex-row flex-nowrap items-center gap-2 w-full p-2">
                <p v-if="navExpanded" class="text-xs text-text-2 uppercase font-extrabold grow text-nowrap">
                    Bot Dashboard
                </p>
                <button @click="dashboard.nav.toggleExpanded()" :title="navExpanded ? 'Collapse Nav' : 'Expand Nav'"
                    class="cursor-pointer flex-center rounded-md m-1 hover:bg-text-1/10 group/btn aspect-square p-1!">
                    <Icon icon="icon-park-outline:expand-left" :class="{ 'rotate-y-180! mx-auto!': navExpanded }"
                        class="size-5.5 opacity-50 aspect-square transition-all group-hover/btn:opacity-70!" />
                </button>
            </span>


            <div class="w-7 mx-auto h-0.75 rounded bg-bg-3 my-3.5 mt-0" :class="{ 'w-32': navExpanded }" />

            <!-- Nav Content -->
            <span class="w-full flex flex-col gap-2.5 items-center" :class="{ 'px-2.75': navExpanded }">

                <!-- Selected Server -->
                <span class="w-full flex-center flex-col gap-1">
                    <SelectedServer />

                    <!-- <p hidden @click="dashboard.guildId = undefined"
                        class="w-full text-center truncate text-xs opacity-45 hover:underline">
                        Clear Guild
                    </p> -->

                    <div class="w-7 mx-auto h-0.75 rounded bg-bg-3 my-2.5 mb-0.5" :class="{ 'w-32': navExpanded }" />

                </span>

                <!-- Dashboard Tabs -->
                <span class="flex flex-col gap-2.25 grow w-full">

                    <TabButton tab="Tickets" title="Tickets" icon="mingcute:paper-2-fill" />

                    <TabButton tab="Panels" title="Panels" icon="mdi:newspaper-variant" />

                    <TabButton tab="Teams" title="Teams" icon="ic:baseline-people" />

                </span>

            </span>

            <div class="w-7 mx-auto h-0.75 rounded bg-bg-3 mt-auto my-4" :class="{ 'w-32': navExpanded }" />

            <!-- Nav Footer -->
            <span class="w-full flex flex-col items-center pb-3.5" :class="{ 'px-2.75': navExpanded }">

                <TabButton tab="Settings" title="Settings Tab" icon="ic:settings" />

            </span>

        </nav>

    </span>



    <!-- Nav Overlay - Max MD Screen -->
    <Transition name="fade">
        <span @click="dashboard.nav.expanded = false" v-if="dashboard.nav.expanded"
            class="z-2 absolute inset-0 md:hidden! flex grow w-full h-full bg-black/25 dark:bg-black/40 blur-xs" />
    </Transition>

</template>


<style scoped></style>