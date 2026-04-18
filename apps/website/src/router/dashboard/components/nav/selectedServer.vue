<script lang="ts" setup>
    import { useAuthStore } from '@/stores/auth';
    import { useDashboardStore } from '@/stores/dashboard';


    // Services:
    const dashboard = useDashboardStore()
    const auth = useAuthStore()

    // Dashboard Nav Expanded:
    const navExpanded = computed(() => dashboard.nav.expanded)

    // Guild Data from User Identity:
    const guildDataFromUser = computed(() => auth.identity?.guilds.find(g => g.id == dashboard.guildId))

</script>


<template>
    <div class="w-full flex-center p-1.5">

        <span :class="{ 'w-fit!': !navExpanded }"
            class="w-full flex-center p-1 button-outline bg-bg-3! gap-0.75 flex-row flex-nowrap">
            <img :src="guildDataFromUser?.icon ?? '/discord.png'" class="size-6 aspect-square! rounded-md block" />
            <p class="truncate" v-if="navExpanded">
                {{ guildDataFromUser?.name ?? 'Server?' }}
            </p>
        </span>

    </div>
</template>


<style scoped></style>