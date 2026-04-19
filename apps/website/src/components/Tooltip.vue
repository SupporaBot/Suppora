<script lang="ts" setup>

    import { useLayoutStore } from '@/stores/layout';
    import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue';

    // Services:
    const layout = useLayoutStore()

    // Tooltip / Floating Vars:
    const showTooltip = ref(false)
    const show = () => showTooltip.value = true
    const hide = () => showTooltip.value = true

    const refEl = useTemplateRef('refEl')
    const floatingEl = useTemplateRef('floatingEl')
    const { floatingStyles } = useFloating(refEl, floatingEl, {
        placement: 'top',
        middleware: [
            offset(8),
            flip({
                padding: {
                    top: layout.appHeader.currentHeight + 5,
                    bottom: 5, left: 5, right: 5
                }
            }),
            shift({ padding: 8 })
        ],
        whileElementsMounted: autoUpdate
    })

</script>


<template>

    <span class="w-fit h-fit group/btn" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false">
        <!-- Tooltip - Content -->
        <Transition name="tooltip" type="transition">
            <div v-if="showTooltip" ref="floatingEl" :style="floatingStyles"
                class="flex-center bg-bg-2 border-ring-soft text-text-2 border-2 p-1.25 px-2 rounded-md text-xs font-medium">
                <slot name="tip" :isVisible="showTooltip" :hide :show>
                    Tooltip Content!
                </slot>
            </div>
        </Transition>

        <!-- Reference - Element -->
        <div ref="refEl" class="w-fit h-fit relative" @click="showTooltip = !showTooltip">
            <slot :isVisible="showTooltip" :hide :show class="z-2">
                <Icon icon="material-symbols:help-outline"
                    class="size-4.5 z-2! cursor-pointer! opacity-55 group-hover/btn:opacity-80 transition-all" />
            </slot>

            <!-- Hover Trigger - Extended -->
            <div class="absolute z-0 cursor-pointer! -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)]" />

        </div>
    </span>

</template>


<style scoped>

    .tooltip-enter-active,
    .tooltip-leave-active {
        transition: opacity ease 0.3s;
    }

    .tooltip-enter-from,
    .tooltip-leave-to {
        opacity: 0;
        transform: translateY(17px);
    }

    .tooltip-leave-from,
    .tooltip-enter-to {
        opacity: 1;
        transform: translateY(0px);
    }

</style>