<script lang="ts" setup>
    import Tooltip from '@/components/Tooltip.vue';
    import { useDashboardStore } from '@/stores/dashboard/dashboard';
    import DashboardTooltip from '../../DashboardTooltip.vue';
    // import TeamEditDialog from './TeamEditDialog.vue';


    // Services:
    const dashboard = useDashboardStore()

    // Vars:
    const teamTitle = ref('Example')
    const roleIssues = ref(false)

    // Edit Dialog:
    const editDialogRef = useTemplateRef('editDialogRef')
    const editTeamDialogVisible = ref(false)

    function editThisTeam() {
        editDialogRef.value?.startEdit({
            title: teamTitle.value
        })
    }

</script>


<template>
    <div class="w-full flex flex-col flex-wrap bg-bg-3/80 gap-2 p-2 rounded-md border-2 border-ring-3 overflow-auto">

        <div class="w-full flex gap-1.75 py-1.25">

            <div class="flex-center items-center! gap-1.5">
                <img hidden :src="'./discord.png'" class="size-7 rounded-md" />
                <span class="bg-zinc-500/90 size-7 rounded-md flex-center">
                    <Icon icon="iconamoon:star-duotone" class="size-4.75" />
                </span>
                <p class="text-text-2 font-semibold text-lg">
                    {{ teamTitle ?? '?' }}
                </p>

            </div>

            <span class="w-fit h-fit my-auto bg-bg-5/70 px-1.5 rounded">
                <p class="text-text-2 text-xs w-full truncate"> #1 </p>
            </span>


            <Button title="View Ticket" @click="editThisTeam" unstyled class="button-base bg-bg-4 ml-auto gap-1">
                <Icon icon="mdi:pencil-outline" />
                <p class="text-xs hidden sm:block"> Edit </p>
                <p class="text-xs hidden md:block"> Team </p>
            </Button>
        </div>

        <!-- Detail Badges -->
        <div class="w-full flex items-center flex-wrap flex-row gap-2 pb-0.5">

            <!-- Assigned Staff -->

            <span class="w-fit bg-bg-4 rounded-xl p-1 px-1.5 gap-1 flex items-center flex-wrap">
                <Icon icon="mdi:users" class="opacity-75" />
                <p class="text-text-2 font-medium text-sm"> ? Assigned </p>
                <DashboardTooltip placement="bottom" default_class="size-3.5!">
                    <template #tip>
                        <div class="max-w-30 text-wrap">
                            <Icon icon="mdi:info" class="inline opacity-80 size-3.5" />
                            The amount of members within this sever assigned to this team.
                        </div>
                    </template>
                </DashboardTooltip>
            </span>



            <!-- Panel -->

            <span class="w-fit bg-bg-4 rounded-xl p-1 px-1.5 gap-1 flex items-center flex-wrap">
                <Icon icon="mdi:newspaper-variant" class="opacity-75" />
                <p class="text-text-2 font-medium text-sm"> 0 Panel(s) </p>
                <DashboardTooltip placement="bottom" default_class="size-3.5!">
                    <template #tip>
                        <div class="max-w-30 text-wrap">
                            <Icon icon="mdi:info" class="inline opacity-80 size-3.5" />
                            The number of <span class="text-code">Ticket Panels</span> this team is assigned to.
                        </div>
                    </template>
                </DashboardTooltip>
            </span>



            <!-- Role Issues -->
            <span v-if="roleIssues" class="w-fit bg-bg-4 rounded-xl p-1 gap-1 px-1.5 flex items-center flex-wrap">
                <Icon icon="mingcute:alert-fill" class="opacity-75 pl-0.5 text-danger-2 dark:text-danger-1" />
                <p class="text-text-2 font-medium text-sm uppercase"> Role Issues </p>
                <DashboardTooltip placement="bottom" default_class="size-3.5!">
                    <template #tip>
                        <div class="max-w-30 text-wrap">
                            <Icon icon="mdi:info" class="inline opacity-80 size-3.5" />
                            There are issues with this team's Discord server roles, please review!
                        </div>
                    </template>
                </DashboardTooltip>
            </span>
            <!-- Roles In Sync -->
            <span v-else class="w-fit bg-bg-4 rounded-xl px-1.5 p-1 gap-1 flex items-center flex-wrap">
                <Icon icon="mdi:check" class="opacity-75 text-success-2" />
                <p class="text-text-2 font-medium text-sm"> In Sync </p>
                <DashboardTooltip placement="bottom" default_class="size-3.5!">
                    <template #tip>
                        <div class="max-w-30 text-wrap">
                            <Icon icon="mdi:info" class="inline opacity-80 size-3.5" />
                            No issues with this team's Discord server roles!
                        </div>
                    </template>
                </DashboardTooltip>
            </span>

        </div>

    </div>

    <!-- <TeamEditDialog ref="editDialogRef" v-model:is-visible="editTeamDialogVisible" /> -->
</template>


<style scoped></style>