<script lang="ts" setup>

    import { useLayoutStore } from '@/stores/layout';
    import { autoUpdate, flip, offset, shift, useFloating, type Placement } from '@floating-ui/vue';

    // Services:
    const layout = useLayoutStore()

    // Props:
    const props = defineProps<{
        placement?: Placement
        tooltip_class?: string
        default_class?: string
    }>()

    // Tooltip / Floating Vars:
    const showTooltip = ref(false)
    const show = () => showTooltip.value = true
    const hide = () => showTooltip.value = true

    const refEl = useTemplateRef('refEl')
    const floatingEl = useTemplateRef('floatingEl')
    const { floatingStyles } = useFloating(refEl, floatingEl, {
        placement: props?.placement || 'top',
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

    <div class="w-fit h-fit block group/btn" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false">
        <!-- Tooltip - Content -->
        <Transition name="tooltip" type="transition">
            <div v-if="showTooltip" ref="floatingEl" :style="floatingStyles" :class="props.tooltip_class"
                class="flex-center z-4 bg-bg-2 border-ring-soft text-text-2 border-2 p-1.25 px-2 rounded-md text-xs font-medium">
                <slot name="tip" :isVisible="showTooltip" :hide :show>
                    Tooltip Content! {{ props.placement ?? '?' }}
                </slot>
            </div>
        </Transition>

        <!-- Reference - Element -->
        <div ref="refEl" class="w-fit h-fit relative" @click="showTooltip = !showTooltip">
            <slot :isVisible="showTooltip" :hide :show class="z-2">
                <Icon icon="material-symbols:help-outline" :class="props.default_class"
                    class="size-4.25 z-2! cursor-pointer! opacity-55 group-hover/btn:opacity-80 transition-all" />
            </slot>

            <!-- Hover Trigger - Extended -->
            <div v-if="showTooltip"
                class="absolute z-0 cursor-pointer! -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)]" />

        </div>
    </div>

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