<script lang="ts" setup>
    import { useDashboardStore } from '@/stores/dashboard';
    import TeamCard from './TeamCard.vue';


    // services:
    const dashboard = useDashboardStore()

</script>


<template>
    <main class="gap-2.5 flex pb-5 flex-col w-full grow">
        <div>
            TEAMS - Content Here
        </div>


        <div class="w-full rounded-lg overflow-clip mx-auto grid grid-cols-1 bg-bg-2 outline-2 outline-ring-3">

            <!-- Table Header -->
            <div class="w-full bg-bg-2 flex-center justify-between p-2 border-b-2 border-ring-3">
                <span class="flex-center w-fit gap-1 flex-row opacity-70">
                    <Icon icon="mingcute:paper-2-fill" class="size-5.5 " />
                    <h1 class="text-lg font-semibold">
                        Tickets
                    </h1>
                </span>

                <Button unstyled class="button-base button-success p-0.5 active:scale-95">
                    <Icon icon="mdi:plus" class="size-5" />
                    <p class="pr-1 uppercase">
                        Create
                    </p>
                </Button>
            </div>

            <!-- Teams List -->
            <span class="w-full flex-center gap-2 p-2">

                <!-- No Teams - Card -->
                <div hidden class="block w-full">
                    <span class="flex-center my-3.5 flex-row gap-1 text-text-2 w-full">
                        <Icon icon="material-symbols:no-sim-outline" />
                        <p>
                            No teams created yet
                        </p>
                    </span>


                    <!-- Tip(s) - Creating Teams(s) -->
                    <div hidden>
                        <div class="w-27 h-0.75 bg-bg-3 rounded-full my-2 mt-1.5" />

                        <span class="text-sm text-text-3">
                            <b class="text-brand-2 font-semibold">TIP:</b>
                            Create your first staff <span @click="" class="text-code">Team</span>
                            to assign specific tickets/<span @click="dashboard.nav.currentTab = 'Panels'"
                                class="text-code hover:text-brand-2 hover:underline cursor-pointer">Panels</span> to
                            them.
                        </span>

                        <p class="text-sm text-text-3">
                            <b class="text-brand-2 font-semibold">TIP:</b> You can create one or wait for one of your
                            server
                            members to open one themselves.
                        </p>

                    </div>

                </div>

                <!-- Subheading - Ticket Count -->
                <span class="text-text-3 text-sm w-full">
                    Teams: <b class="font-semibold">1</b>
                </span>

                <!-- Team Card -->
                <TeamCard />
            </span>

        </div>
    </main>
</template>


<style scoped>
    /*@reference "@/styles/main.css"; */
</style>