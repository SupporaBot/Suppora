<script lang="ts" setup>
    import { useDashboardStore } from '@/stores/dashboard/dashboard';
    import TeamCard from './TeamCard.vue';
    import TeamFormDialog, { type TeamDialogFormSchema } from './TeamFormDialog.vue';
    import { URLS } from '@/stores/layout';

    const randomId = computed(() => crypto.randomUUID())

    // Services:
    const dashboard = useDashboardStore()

    const teams = computed(() => dashboard.guildData.teams.state ?? [])


    // Teams Dialog
    const teamDialogEditPayload = ref<TeamDialogFormSchema & { id: any } | undefined>(undefined)
    const teamDialogVisible = ref(false)

</script>


<template>
    <main class="gap-2.5 flex pb-5 flex-col w-full grow">

        <!-- Teams Table -->
        <div
            class="w-full max-w-7xl rounded-lg overflow-clip mx-auto grid grid-cols-1 bg-bg-2 outline-2 outline-ring-3">

            <!-- Table Header -->
            <div class="w-full bg-bg-2 flex-center justify-between p-2 border-b-2 border-ring-3">
                <span class="flex-center w-fit gap-1 flex-row opacity-70">
                    <Icon icon="ic:baseline-people" class="size-5.5 " />
                    <h1 class="text-lg font-semibold">
                        Teams
                    </h1>
                </span>

                <Button @click="teamDialogVisible = true" unstyled
                    class="button-base button-success p-0.5 active:scale-95">
                    <Icon icon="mdi:plus" class="size-5" />
                    <p class="pr-1 uppercase">
                        Create
                    </p>
                </Button>
            </div>

            <!-- Teams List -->
            <span class="w-full flex-center gap-2 p-2">

                <!-- No Teams - Card -->
                <div v-if="!teams?.length" class="block w-full">
                    <span class="flex-center my-3.5 flex-row gap-1 text-text-2 w-full">
                        <Icon icon="material-symbols:no-sim-outline" />
                        <p>
                            No teams created yet
                        </p>
                    </span>


                    <!-- Tip(s) - Creating Teams(s) -->
                    <div class="">
                        <div class="w-27 h-0.75 bg-bg-3 rounded-full mx-auto my-2 mt-1.5" />

                        <div class="flex w-full bg-bg-3/35 rounded-md p-1.5">
                            <span class="text-sm text-text-3">
                                <b class="text-brand-2 font-semibold">TIP:</b>
                                Create your first staff <span @click="" class="text-code">Team</span>
                                to assign specific Ticket <span @click="dashboard.nav.changeTab('Panels')"
                                    class="text-code link">Panels</span> to
                                them.
                            </span>
                        </div>

                    </div>

                </div>

                <!-- Subheading - Ticket Count -->
                <span v-if="teams?.length" class="text-text-3 text-sm w-full">
                    Total Teams: <b class="font-semibold">{{ teams?.length ?? 0 }}</b>
                </span>

                <!-- Team Card -->
                <TeamCard v-for="t in teams" :team="t"
                    @startEdit="(id, p) => { teamDialogEditPayload = { ...p, id } }" />
            </span>

        </div>

        <a :href="URLS.documentation + '/teams'" target="_blank"
            class="mt-3 group relative text-text-2 w-fit mx-auto cursor-pointer flex-center gap-0.5 flex-row">

            <Icon icon="mdi:info" class="opacity-75 size-3.5" />
            <p class=" text-xs text-center"> Learn more about <b class="">Teams</b></p>

            <div class="absolute w-0 group-hover:w-full! transition-all  -bottom-0.75 h-0.5 bg-ring-2" />
        </a>

        <!-- Team Form Dialog -->
        <TeamFormDialog v-model:is-visible="teamDialogVisible" v-model:edit-payload="teamDialogEditPayload" />

    </main>
</template>


<style scoped>
    /*@reference "@/styles/main.css"; */
</style>