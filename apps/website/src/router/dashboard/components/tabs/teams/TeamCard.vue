<script lang="ts" setup>
    import { useDashboardStore } from '@/stores/dashboard/dashboard';
    import DashboardTooltip from '../../DashboardTooltip.vue';
    import { type TeamDialogFormSchema } from './TeamFormDialog.vue';
    import type { DatabaseRow } from '@suppora/shared';

    // Props:
    const props = defineProps<{
        team: DatabaseRow<'teams'>
    }>()

    // Services:
    const dashboard = useDashboardStore()

    // Vars:
    const t = computed(() => props.team)

    // Guild Data:
    const guildRoles = computed(() => dashboard.guildData.roles.state ?? [])
    const onCallRole = computed(() => guildRoles.value.find(r => r?.id == t.value.role_id_on_call))
    const offCallRole = computed(() => guildRoles.value.find(r => r?.id == t.value.role_id_off_call))

    // Role Color(s)
    const roleColorNormalized = computed(() => onCallRole.value?.color?.toString(16) || '717ff0')
    const roleIconDynamicColor = computed(() => {
        if (!roleColorNormalized.value) return 'white'
        const hex = roleColorNormalized.value.replace('#', '')
        const r = parseInt(hex.substring(0, 2), 16)
        const g = parseInt(hex.substring(2, 4), 16)
        const b = parseInt(hex.substring(4, 6), 16)
        // Perceived luminance formula
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b)
        return luminance > 160 ? 'black' : 'white'
    })

    // Role Issue(s) / Unsynced:
    const roleIssues = computed(() => {
        // Util: Check Role Data:
        function checkRoleState(type: 'On' | 'Off', roleId: string | undefined) {
            const roleData = roleId ? guildRoles.value?.find(r => r.id == roleId) : undefined
            const teamName = t.value.title
            // Role Unknown / Inaccessible / Deleted:
            if (!roleData) return 'Deleted/Unknown'
            // Inaccessible / Un-Editable:
            if (!roleData.editable) return 'Inaccessible/No Permission'
            // Role Name - Out of Sync:
            if (roleData?.name !== `${teamName} - ${type} Call`) return 'Title - Out of Sync'
            // No Issues:
            return false
        }
        return {
            onCall: checkRoleState('On', onCallRole.value?.id),
            offCall: checkRoleState('Off', offCallRole.value?.id)
        }
    })

    // Start Edit - Util:
    const startTeamEdit = () => {
        emits('startEdit', props.team.id, {
            title: t.value?.title,
            color: roleColorNormalized.value
        })
    }

    // Start Edit - Emit:
    const emits = defineEmits<{
        startEdit: [string, TeamDialogFormSchema]
    }>()

</script>


<template>
    <div class="w-full flex flex-col flex-wrap bg-bg-3/80 gap-2 p-2 rounded-md border-2 border-ring-3 overflow-auto">

        <div class="w-full flex gap-1.75 py-1.25">

            <div class="flex flex-row flex-wrap items-center! gap-1.5">
                <img hidden :src="'./discord.png'" class="size-7 rounded-md" />
                <span class="size-7 rounded-md flex-center" :style="{ background: `#${roleColorNormalized}` }">
                    <Icon icon="ic:baseline-people" class="size-4.75" :style="{ color: `${roleIconDynamicColor}` }" />
                </span>
                <p class="text-text-2 font-semibold text-lg">
                    {{ t?.title ?? '?' }}
                </p>
                <span class="w-fit h-fit my-auto bg-bg-5/50 px-1.5 rounded">
                    <p :title="t?.id" class="text-text-2/70 text-[10px] w-full truncate"> #{{ t?.id?.split('-')?.[0] }}
                    </p>
                </span>
            </div>




            <Button title="Edit Team" @click="startTeamEdit" unstyled
                class="button-base max-sm:aspect-square max-sm:size-7.5 bg-bg-4 ml-auto gap-1">
                <Icon icon="mdi:pencil-outline" />
                <p class="text-xs hidden sm:block"> Edit </p>
                <p class="text-xs hidden md:block"> Team </p>
            </Button>
        </div>

        <!-- Detail Badges -->
        <div class="w-full flex items-center flex-wrap flex-row gap-2 pb-0.5">

            <!-- Assigned Staff -->
            <span hidden class="w-fit bg-bg-4 rounded-xl p-1 px-1.5 gap-1 flex items-center flex-wrap">
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

            <!-- Assigned Panel(s) -->
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

            <!-- Roles In Sync -->
            <span v-if="!roleIssues.onCall && !roleIssues.offCall"
                class="w-fit bg-bg-4 rounded-xl px-1.5 p-1 gap-1 flex items-center flex-wrap">
                <Icon icon="mdi:check" class="opacity-75 text-success-2" />
                <p class="text-text-2 font-medium text-sm"> In Sync </p>
                <DashboardTooltip placement="bottom" default_class="size-3.5!">
                    <template #tip>
                        <div class="max-w-35 w-fit text-wrap flex flex-col gap-1">
                            <span>
                                <Icon icon="mdi:info" class="inline opacity-80 size-3.5" />
                                No issues with team's Discord server roles:
                            </span>
                            <div class="truncate">
                                - <span class="text-code w-fit text-[11px]"
                                    :style="{ color: ('#' + onCallRole?.color?.toString(16)) }">
                                    @{{ onCallRole?.name }}
                                </span>

                            </div>
                            <div class="truncate">
                                - <span class="text-code w-fit text-[11px]"
                                    :style="{ color: ('#' + offCallRole?.color?.toString(16)) }">
                                    @{{ offCallRole?.name }}
                                </span>
                            </div>
                        </div>
                    </template>
                </DashboardTooltip>
            </span>
            <!-- Role Issues -->
            <span v-else class="w-fit bg-bg-4 rounded-xl p-1 gap-1 px-1.5 flex items-center flex-wrap">
                <Icon icon="mingcute:alert-fill" class="opacity-75 pl-0.5 text-danger-2 dark:text-danger-1" />
                <p class="text-text-2 font-medium text-sm uppercase"> Role Issues </p>
                <DashboardTooltip placement="bottom" default_class="size-3.5!">
                    <template #tip>
                        <div class="max-w-40 flex flex-col gap-1">
                            <!-- Heading - Alert -->
                            <div class="w-full text-wrap">
                                <Icon icon="mdi:info" class="inline opacity-80 size-3.5" />
                                There are issues with this team's Discord server roles, please review!
                            </div>
                            <!-- On Call Issues -->
                            <div class="block">
                                <Icon v-if="!!roleIssues.onCall" icon="mingcute:alert-fill"
                                    class="opacity-75 pl-0.5 text-danger-2 dark:text-danger-1 inline mr-1" />
                                <Icon v-else icon="mdi:check-bold"
                                    class="opacity-75 pl-0.5 text-success-2 dark:text-success-1 inline mr-1" />
                                <span class="text-code w-fit text-[11px] text-danger-2 dark:text-danger-1"
                                    :style="{ color: roleIssues.onCall == false ? ('#' + onCallRole?.color?.toString(16)) : '' }">
                                    @{{ onCallRole?.name || roleIssues.onCall }}
                                </span>
                            </div>
                            <!-- Off Call Issues -->
                            <div class="block">
                                <Icon v-if="!!roleIssues.offCall" icon="mingcute:alert-fill"
                                    class="opacity-75 pl-0.5 text-danger-2 dark:text-danger-1 inline mr-1" />
                                <Icon v-else icon="mdi:check-bold"
                                    class="opacity-75 pl-0.5 text-success-2 dark:text-success-1 inline mr-1" />
                                <span class="text-code w-fit text-[11px] text-danger-2 dark:text-danger-1"
                                    :style="{ color: roleIssues.offCall == false ? ('#' + offCallRole?.color?.toString(16)) : '' }">
                                    @{{ offCallRole?.name || roleIssues.offCall }}
                                </span>
                            </div>
                        </div>

                    </template>
                </DashboardTooltip>
            </span>

        </div>

    </div>

</template>


<style scoped></style>