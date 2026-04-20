<script lang="ts" setup>
    import { useLayoutStore } from '@/stores/layout';

    const layout = useLayoutStore()
    const theme = computed(() => layout.colorTheme)

    // Props:
    const p = defineProps<{
        rootClass?: string,
        iconClass?: string,
        textClass?: string
    }>()

</script>


<template>
    <Button unstyled @click="theme.toggle()" class="self-center button-base bg-bg-3 flex-center mx-auto gap-0.5"
        :class="p.rootClass">
        <div class="relative aspect-square size-4" :class="p.iconClass">
            <Transition name="blur-fade" type="transition">
                <Icon icon="ph:sun-duotone" v-if="theme.mode == 'light'" class="size-full absolute mr-px" />
                <Icon icon="si:moon-duotone" v-else class="size-full p-px absolute" />
            </Transition>
        </div>
        <p :class="p.textClass" class="text-[11px]">
            Toggle Theme
        </p>
    </Button>
</template>


<style scoped></style>