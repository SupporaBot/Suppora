<script lang="ts" setup>
    import { useAuthStore } from '@/stores/auth';
    import { useDashboardStore } from '@/stores/dashboard/dashboard';
    import { URLS } from '@/stores/layout';
    import type { API_SelfUserIdentity_Guild } from '@suppora/shared';

    // Services:
    const auth = useAuthStore()
    const dashboard = useDashboardStore()

    const userGuilds = computed(() => auth.identity?.guilds?.sort((a, b) => {
        const aa = a.bot_installed ? 1 : 0;
        const bb = b.bot_installed ? 1 : 0;
        return (bb - aa)
    })?.sort((a, b) => {
        const aa = a.can_manage ? 1 : 0;
        const bb = b.can_manage ? 1 : 0;
        return (bb - aa)
    }))

    // Search Guilds Input:
    const searchGuildsInput = ref('')
    const inputFilteredGuilds = computed(() => userGuilds.value?.filter(g => g.name?.toLowerCase()?.includes(searchGuildsInput.value?.toLowerCase())))

    // Fn - Select Server:
    function selectServer(g: API_SelfUserIdentity_Guild) {
        if (!g.can_manage) return alert('No access!')
        if (!g.bot_installed) {
            const r = confirm('Are you sure you want to invite the bot to this server?')
            if (r) window.open(URLS.invite, '_blank')
        } else dashboard.guildId = g.id
    }

</script>


<template>
    <main class="flex-center m-auto">
        <div class="flex-center flex-col m-8 bg-bg-2 p-4 pb-1.5 gap-2 max-w-155 mx-8 rounded-md border-2 border-ring-2">

            <span class="w-full flex max-sm:justify-center items-center flex-row gap-1">
                <Icon icon="fa7-solid:clipboard-list" class="size-7" />
                <p class="text-2xl font-bold"> Select Server </p>
            </span>

            <div class="flex-center w-full h-fit">
                <p class="text-sm text-text-2 w-full ">
                    Select a Discord Server you have access to manage:
                </p>

                <!-- Search Bar -->
                <div
                    class="w-full h-7.75 bg-bg-3 rounded-lg border-2 border-ring-3 hover:border-ring-1 focus-within:border-ring-1 mt-1.5 px-2 pl-1 flex-center flex-row transition-all">
                    <Icon icon="mdi:search" class="flex-center aspect-square! size-5.5 p-px opacity-75" />
                    <input v-model="searchGuildsInput" class="flex grow h-[60%] outline-none! pr-1.75 p-1.5 px-0.5"
                        placeholder="Search for a Server.." />
                    <button @click="searchGuildsInput = ''" title="Clear Input"
                        class="aspect-square cursor-pointer flex-center opacity-0 transition-all scale-0"
                        :class="{ 'scale-100 opacity-65 hover:opacity-85': searchGuildsInput?.length }">
                        <Icon icon="mdi:close" />
                    </button>
                </div>

                <!-- Guild's List -->
                <ul class="gap-3.5 flex-center items-stretch px-4 p-2 my-2 w-full h-fit">
                    <button v-for="g in inputFilteredGuilds" :disabled="!g.can_manage" :title="g?.name"
                        @click="selectServer(g)"
                        class="bg-bg-3 relative overflow-clip grow p-3 px-4 gap-2! flex-col! button-base rounded-md">
                        <img :src="g?.icon ?? '/discord.png'" class="size-17 rounded-md border border-ring-3" />
                        <p class="font-bold text-wrap">
                            {{ g.name }}
                        </p>

                        <span v-if="!g.bot_installed && g.can_manage"
                            class="bg-bg-4 ring-2 ring-ring-3 rounded-lg flex-center flex-row px-2 py-0">
                            <Icon icon="ic:baseline-discord" class="size-4.5 p-0.5 mr-0.5 opacity-50 " />
                            <p class="text-[11px]! font-light"> Invite Needed </p>
                        </span>

                        <!-- No Access - Overlay -->
                        <span v-if="!g.can_manage"
                            class="absolute bg-black/40 text-white w-full h-full flex-col flex-center grow">
                            <Icon icon="mdi:lock" class="size-5.5" />
                            <p class="font-black text-lg"> No Access</p>
                        </span>

                    </button>
                </ul>
            </div>


            <div class="flex-center w-full p-2 gap-2 ">
                <p class="text-text-2 text-xs w-full">
                    Not seeing the right data? You can refresh your Discord data on your <RouterLink to="/account"
                        class="text-info-2 hover:underline">account</RouterLink> page.
                </p>

                <RouterLink to="/account" class="hidden button-outline hover:!ring-brand-2 bg-bg-3! active:scale-95">
                    <Icon icon="mdi:user" class="size-4.75 p-px pr-0.5 mr-0.5 opacity-80 " />
                    <p class="text-xs!"> My Account </p>
                </RouterLink>
            </div>
        </div>
    </main>
</template>


<style scoped>
    /*@reference "@/styles/main.css"; */
</style>