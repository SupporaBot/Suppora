<script lang="ts" setup>
    import { useDashboardStore } from '@/stores/dashboard/dashboard';
    import PanelCard from './PanelCard.vue';


    // Services:
    const dashboard = useDashboardStore()
    const changeTab = dashboard.nav.changeTab

</script>


<template>
    <main class="gap-2.5 flex pb-5 flex-col w-full grow">
        <!-- Panels Table -->
        <div
            class="w-full max-w-7xl rounded-lg overflow-clip mx-auto grid grid-cols-1 bg-bg-2 outline-2 outline-ring-3">

            <!-- Table Header -->
            <div class="w-full bg-bg-2 flex-center justify-between p-2 border-b-2 border-ring-3">
                <span class="flex-center w-fit gap-1 flex-row opacity-70">
                    <Icon icon="mdi:newspaper-variant" class="size-5.5 " />
                    <h1 class="text-lg font-semibold">
                        Panels
                    </h1>
                </span>

                <Button unstyled class="button-base button-success p-0.5 active:scale-95">
                    <Icon icon="mdi:plus" class="size-5" />
                    <p class="pr-1 uppercase">
                        Create
                    </p>
                </Button>
            </div>

            <!-- Panels List -->
            <span class="w-full flex-center gap-2 p-2">

                <!-- No Panels - Card -->
                <div hidden class="block w-full">
                    <span class="flex-center my-3.5 flex-row gap-1 text-text-2 w-full">
                        <Icon icon="material-symbols:no-sim-outline" />
                        <p>
                            No panels created yet
                        </p>
                    </span>


                    <!-- Tip(s) - Creating Panels(s) -->
                    <div>
                        <div class="w-27 h-0.75 bg-bg-3 rounded-full my-2 mx-auto mt-1.5" />

                        <span class="text-sm text-text-3">
                            <b class="text-brand-2 font-semibold">TIP:</b>
                            Create your first staff <span @click="changeTab('Teams')" class="text-code link">Team</span>
                            to assign specific <b class="text-code link" @click="changeTab('Tickets')">Tickets</b>/<b
                                class="text-code">Panels</b> to
                            them.
                        </span>

                    </div>

                </div>

                <!-- Subheading - Ticket Count -->
                <span class="text-text-3 text-sm w-full">
                    Total Panels: <b class="font-semibold"> ? </b>
                </span>

                <!-- Panel Card -->
                <PanelCard />
            </span>

        </div>
    </main>
</template>


<style scoped>
    /*@reference "@/styles/main.css"; */
</style>