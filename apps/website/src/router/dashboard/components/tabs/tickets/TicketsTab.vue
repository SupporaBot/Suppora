<script lang="ts" setup>
    import { useDashboardStore } from '@/stores/dashboard';
    import TicketCard from './TicketCard.vue';
    import type { Database } from '@suppora/shared';
    import { DateTime } from 'luxon';


    // Services:
    const dashboard = useDashboardStore()

    const exTicket: Database['public']['Tables']['tickets']['Row'] = {
        channel_id: '111',
        creator_id: '111',
        guild_id: '111',
        id: crypto.randomUUID(),
        created_at: DateTime.utc().toISO(),
        panel_data: null,
        panel_id: '9032849328704923',
        staff_ids: [],
        status: 'open',
        thread_id: '111'
    }

    const exTicket2: Database['public']['Tables']['tickets']['Row'] = {
        channel_id: '222',
        creator_id: '222',
        guild_id: '222',
        id: crypto.randomUUID(),
        created_at: DateTime.utc().toISO(),
        panel_data: null,
        panel_id: '9032849328704923',
        staff_ids: [],
        status: 'resolved',
        thread_id: '222'
    }

    const exTicket3: Database['public']['Tables']['tickets']['Row'] = {
        channel_id: '333',
        creator_id: '333',
        guild_id: '333',
        id: crypto.randomUUID(),
        created_at: DateTime.utc().toISO(),
        panel_data: null,
        panel_id: '9032849328704923',
        staff_ids: [],
        status: 'ongoing',
        thread_id: '333'
    }

</script>


<template>
    <main class="gap-2.5 flex pb-5 flex-col w-full grow">

        <!-- Tab Header -->
        <section hidden class="w-full gap-2 flex flex-col">

            <span class="flex-center w-fit gap-1 flex-row">
                <Icon icon="mingcute:paper-2-fill" class="size-7.5 opacity-70" />
                <h1 class="text-xl font-semibold">
                    Tickets
                </h1>
            </span>

            <p class="text-xs text-text-2 pl-1">
                View and manage your servers created tickets.
            </p>
        </section>


        <!-- Tickets Table -->
        <div
            class="w-full max-w-7xl rounded-lg overflow-clip mx-auto grid grid-cols-1 bg-bg-2 outline-2 outline-ring-3">

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

            <!-- Tickets List -->
            <span class="w-full flex-center gap-2 p-2">

                <!-- No Tickets - Card -->
                <div hidden class="block w-full">
                    <span class="flex-center my-3.5 flex-row gap-1 text-text-2 w-full">
                        <Icon icon="material-symbols:no-sim-outline" />
                        <p>
                            No tickets created yet
                        </p>
                    </span>


                    <!-- Tip - Create Panel(s) -->
                    <div>
                        <div class="w-27 h-0.75 bg-bg-3 rounded-full my-2 mx-auto mt-1.5" />


                        <span class="text-sm text-text-3">
                            <b class="text-brand-2 font-semibold">TIP:</b>
                            Create your first <span @click="dashboard.nav.currentTab = 'Panels'"
                                class="bg-bg-3 rounded font-semibold px-0.75 py-px hover:underline hover:text-brand-2 cursor-pointer">Ticket
                                Panel</span> for server members to easily create new tickets.
                        </span>

                    </div>

                    <p class="text-sm text-text-3">
                        <b class="text-brand-2 font-semibold">TIP:</b> You can create a <b class="text-code">Ticket</b>
                        or wait for one of your server
                        members to open
                        one themselves.
                    </p>

                </div>

                <!-- Subheading - Ticket Count -->
                <span class="text-text-3 text-sm w-full">
                    Total Tickets: <b class="font-semibold">1</b>
                </span>

                <!-- Ticket Card -->
                <TicketCard :ticket="exTicket" />
                <TicketCard :ticket="exTicket2" />
                <TicketCard :ticket="exTicket3" />

            </span>

        </div>

    </main>
</template>


<style scoped>
    /* @reference "@/styles/main.css"; */
</style>