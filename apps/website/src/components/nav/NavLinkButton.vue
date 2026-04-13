<script lang="ts" setup>
    import { useLayoutStore } from '@/stores/layout';

    const props = defineProps<{
        icon: string | undefined,
        title: string,
        href?: string,
        to?: string,
        action?: (...args: any[]) => any,
        noCloseOnClick?: true
    }>()

    // Services:
    const layout = useLayoutStore()


    // Util - Handle Button Click:
    function handleClick() {
        if (!props.noCloseOnClick) {
            layout.nav.close()
        }
        if (props.action) {
            props.action()
        }
    }
</script>


<template>

    <!-- Router Link(s) -->
    <RouterLink class="w-full flex" v-if="props.to" :to="props.to" v-slot="{ isActive }">
        <button @click="handleClick" :title="props.title"
            class="button-base flex grow justify-start items-center gap-0.5!"
            :class="{ 'bg-brand-3/20 dark:bg-brand-2/20': isActive }">
            <Icon v-if="props.icon" class="size-5.25 opacity-80" :icon="props.icon" />
            <p class="font-medium py-px">
                {{ props.title }}
            </p>
        </button>
    </RouterLink>

    <!-- Href Links -->
    <a v-if="props.href" :href="props.href" target="_blank" class="w-full flex">
        <button @click="handleClick" :title="props.title"
            class="button-base flex grow justify-start items-center gap-0.5!">
            <Icon v-if="props.icon" class="size-5.25 opacity-80" :icon="props.icon" />
            <p class="font-medium py-px">
                {{ props.title }}
            </p>
            <Icon class="size-3 opacity-80 ml-auto my-auto" icon="gridicons:external" />
        </button>
    </a>
</template>


<style scoped></style>