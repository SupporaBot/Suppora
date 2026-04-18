<script lang="ts" setup>
    import { useAuthStore } from '@/stores/auth';
    import { useDashboardStore } from '@/stores/dashboard';
    import SelectedServer from './selectedServer.vue';


    // Services:
    const dashboard = useDashboardStore()
    const auth = useAuthStore()

    // Nav Expanded:
    const navExpanded = computed(() => dashboard.nav.expanded)

</script>


<template>
    <nav class="w-13.5 z-2 flex-col absolute md:relative left-0 top-0 h-full flex bg-bg-2 border-r-2 border-ring-soft transition-all"
        :class="{ 'w-47': navExpanded }">

        <!-- Nav Header -->
        <span class="flex flex-row flex-nowrap items-center gap-2 w-full p-2">
            <p v-if="navExpanded" class="text-xs text-text-2 uppercase font-extrabold grow text-nowrap">
                Bot Dashboard
            </p>
            <button @click="dashboard.nav.toggle()" :title="navExpanded ? 'Collapse Nav' : 'Expand Nav'"
                class="cursor-pointer flex-center rounded-md hover:bg-text-1/10 group/btn m-1 aspect-square p-1!">
                <Icon icon="icon-park-outline:expand-left" :class="{ 'rotate-y-180! mx-auto!': navExpanded }"
                    class="size-5.5 opacity-50 aspect-square transition-all group-hover/btn:opacity-70!" />
            </button>
        </span>

        <span class="w-[87%] mx-auto h-0.75 rounded bg-bg-3 my-2 mt-0" />

        <!-- Nav Content -->
        <div class="flex-center flex-col grow overflow-clip" :class="{ 'px-2': navExpanded }">
            <!-- Selected Server -->
            <span class="w-full">
                <SelectedServer />
                <span @click="dashboard.guildId = undefined"
                    class="w-full text-center truncate text-xs opacity-45 hover:underline">
                    Clear Guild
                </span>
            </span>

            <!-- Dashboard Tabs -->
            <span class="flex flex-col gap-2.25 pb-4 grow w-full p-1.5" :class="{ 'px-0': !navExpanded }">

                <button title="Tickets"
                    class="p-1! button-outline! flex-nowrap! bg-bg-3! w-full! h-fit! relative overflow-clip"
                    :class="{ 'rounded-none! border-x-0!': !navExpanded }">
                    <Icon icon="mingcute:paper-2-fill" class="size-5! opacity-55 aspect-square!" />
                    <p class="mr-auto ml-1" v-if="navExpanded"> Tickets </p>

                    <span hidden class="absolute top-0 right-0 h-full w-0.75 bg-brand-2" />
                </button>

                <button title="Panels"
                    class="p-1! button-outline! flex-nowrap! bg-bg-3! w-full! h-fit! relative overflow-clip"
                    :class="{ 'rounded-none! border-x-0!': !navExpanded }">
                    <Icon icon="mdi:newspaper-variant" class="size-5! opacity-55 aspect-square!" />
                    <p class="mr-auto ml-1" v-if="navExpanded"> Panels </p>

                    <span class="absolute top-0 right-0 h-full w-0.75 bg-brand-2" />
                </button>

                <button title="Teams"
                    class="p-1! button-outline! flex-nowrap! bg-bg-3! w-full! h-fit! relative overflow-clip"
                    :class="{ 'rounded-none! border-x-0!': !navExpanded }">
                    <Icon icon="ic:baseline-people" class="size-5! opacity-55 aspect-square!" />
                    <p class="mr-auto ml-1" v-if="navExpanded"> Teams </p>

                    <span hidden class="absolute top-0 right-0 h-full w-0.75 bg-brand-2" />
                </button>



                <button title="Settings"
                    class="p-1! button-outline! mt-auto flex-nowrap! bg-bg-3! w-full! h-fit! relative overflow-clip"
                    :class="{ 'rounded-none! border-x-0!': !navExpanded }">
                    <Icon icon="ic:settings" class="size-5! opacity-55 aspect-square!" />
                    <p class="mr-auto ml-1" v-if="navExpanded"> Settings </p>

                    <span hidden class="absolute top-0 right-0 h-full w-0.75 bg-brand-2" />
                </button>

            </span>

        </div>



        <!-- Nav Footer -->
        <span hidden class="w-[87%] mx-auto h-0.75 rounded bg-bg-3 my-2" />
        <span hidden class="flex-center p-2">
            <p>
                Footer
            </p>
        </span>


        <span>

        </span>
    </nav>

    <!-- Nav Overlay - Max MD Screen -->
    <Transition name="fade">
        <span @click="dashboard.nav.expanded = false" v-if="dashboard.nav.expanded"
            class="z-1 absolute md:hidden flex grow w-full h-full bg-black/25 dark:bg-black/40 blur-xs" />
    </Transition>

</template>


<style scoped></style>