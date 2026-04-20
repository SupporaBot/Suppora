<script lang="ts" setup>
    import { useDashboardStore } from '@/stores/dashboard';

    // Props
    const p = defineProps<{
        title: string,
        icon: string,
        tab: typeof dashboard.nav.currentTab
    }>()


    // Services:
    const dashboard = useDashboardStore()

    const selectTab = (tab: typeof dashboard.nav.currentTab) => dashboard.nav.currentTab = tab
    const currentTab = computed(() => dashboard.nav.currentTab)

    // Nav Expanded:
    const navExpanded = computed(() => dashboard.nav.expanded)


</script>


<template>
    <button :title="p.title" @click="selectTab(p.tab)"
        class="p-1! button-outline! flex-nowrap! bg-bg-3! w-full! h-fit! relative overflow-clip"
        :class="{ 'rounded-none! border-x-0!': !navExpanded }">
        <Icon :icon="p.icon" class="size-5! opacity-55 aspect-square!" />
        <p class="mr-auto ml-1" v-if="navExpanded"> {{ p.title }} </p>

        <span :class="{ 'w-0.75': currentTab == p.tab }"
            class="absolute right-0 h-[98%] my-auto w-0 bg-brand-2 transition-all rounded-full" />
    </button>
</template>


<style scoped></style>