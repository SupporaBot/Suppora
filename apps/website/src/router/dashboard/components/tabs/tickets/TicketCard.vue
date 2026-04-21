<script lang="ts" setup>
    import type { Database } from '@suppora/shared';

    // Incoming Props:
    const p = defineProps<{
        ticket: Database['public']['Tables']['tickets']['Row']
    }>()

</script>


<template>
    <div class="w-full flex flex-col flex-wrap bg-bg-3/80 gap-2 p-2 rounded-md border-2 border-ring-3 overflow-auto">

        <!-- Ticket Creator / Id -->
        <div class="w-full flex gap-1.75 py-1.25">

            <div class="flex-center items-center! gap-1.5">
                <img :src="'./discord.png'" class="size-7 rounded-md" />
                <p class="text-text-2 font-semibold text-lg">
                    @{{ p.ticket.creator_id }}
                </p>

            </div>

            <span class="w-fit h-fit my-auto bg-bg-5/70 px-1.5 rounded">
                <p class="text-text-2 text-xs w-full truncate"> #{{ p.ticket.id?.split('-').at(-1) }}</p>
            </span>


            <Button title="View Ticket" unstyled class="button-base bg-bg-4 ml-auto gap-1">
                <Icon icon="mdi:eye" />
                <p class="text-xs hidden sm:block"> View </p>
                <p class="text-xs hidden md:block"> Ticket </p>
            </Button>
        </div>

        <!-- Detail Badges -->
        <div class="w-full flex items-center flex-row flex-wrap gap-2 pb-0.5">

            <!-- Joined Staff -->
            <span class="w-fit bg-bg-4 rounded-xl p-1 px-1.5 flex items-center flex-wrap">
                <Icon icon="mdi:users" class="opacity-75" />
                <p class="pl-1 text-text-2 font-medium text-sm"> 0 Joined Staff </p>
            </span>


            <!-- Panel -->
            <span class="w-fit bg-bg-4 rounded-xl p-1 px-1.5 flex items-center flex-wrap">
                <Icon icon="mdi:newspaper-variant" class="opacity-75" />
                <p class="pl-1 text-text-2 font-medium text-sm"> No Panel </p>
            </span>


            <!-- Status -->
            <!-- Open -->
            <span v-if="p.ticket.status == 'open'"
                class="w-fit bg-bg-4 rounded-xl p-1 px-1.5 flex items-center flex-wrap">
                <Icon icon="mingcute:safe-alert-fill" class="opacity-75 text-warning-2" />
                <p class="pl-1 text-text-2 font-medium text-sm"> OPEN </p>
            </span>
            <!-- Ongoing -->
            <span v-else-if="p.ticket.status == 'ongoing'"
                class="w-fit bg-bg-4 rounded-xl p-1 px-1.5 flex items-center flex-wrap">
                <Icon icon="streamline-sharp:share-time-solid" class="opacity-75 pl-0.5 text-info-2" />
                <p class="pl-0.5 text-text-2 font-medium text-sm"> ONGOING </p>
            </span>
            <!-- Resolved -->
            <span v-else-if="p.ticket.status == 'resolved'"
                class="w-fit bg-bg-4 rounded-xl p-1 px-1.5 flex items-center flex-wrap">
                <Icon icon="mdi:check" class="opacity-75 text-success-2" />
                <p class="pl-0.5 text-text-2 font-medium text-sm pr-0.5"> RESOLVED </p>
            </span>

        </div>

    </div>
</template>


<style scoped></style>