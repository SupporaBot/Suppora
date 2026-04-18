<script lang="ts" setup>
    import { useLayoutStore } from '@/stores/layout';

    // Services:
    const layout = useLayoutStore()
    const nav = layout.nav

    // Dynamic Header Size:
    const headerEl = useTemplateRef('headerRef')
    const size = useElementSize(headerEl, undefined, { box: 'border-box' })
    watch(() => size.height.value, (h) => {
        if (h) layout.appHeader.currentHeight = h // .updateHeight(h)
    }, { immediate: true })



</script>


<template>
    <header ref="headerRef"
        class="flex fixed z-4 top-0 w-full h-fit justify-between items-center p-4 bg-bg-2 ring-ring-soft ring-2" :class="{
            'rounded-b-2xl': layout.appHeader.rounded,
        }">
        <!-- Logo & Title -->
        <RouterLink to="/" title="Suppora" class="flex-center flex-nowrap! gap-1.25">
            <img src="/logo-light.png" class="dark:block hidden size-7 rounded" />
            <img src="/logo.png" class="block dark:hidden size-7 rounded" />
            <p class="text-xl font-bold"> Suppora </p>
        </RouterLink>

        <!-- Menu Button -->
        <div @click="nav.open()"
            class=" flex-center cursor-pointer hover:ring-2 hover:bg-bg-3 ring-ring-2 aspect-square size-7 rounded-sm transition-all active:scale-95">
            <Icon icon="line-md:menu" class="size-5.5 aspect-square" />
        </div>
    </header>
</template>


<style scoped></style>
