<script lang="ts" setup>
    import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
    import type { useFormFieldInstance } from '@primevue/forms/useform'
    import { hexCodeRegEx } from '@suppora/shared'

    // Modal/Field Value:
    const value = defineModel<string>('value')

    // Popup:
    const popupVisible = ref(false)
    const inputRef = useTemplateRef('inputRef')
    const popupRef = useTemplateRef('popupRef')
    const { floatingStyles } = useFloating(inputRef, popupRef, {
        placement: 'bottom',
        middleware: [
            offset(8),
            shift(),
            flip()
        ],
        whileElementsMounted: autoUpdate
    })
    onClickOutside(popupRef, (e) => {
        popupVisible.value = false
    }, {
        ignore: [inputRef]
    })


    // Hex Color String Input / Form:
    const hexInputValue = ref('')
    const hexInputErrors = ref<string[]>([])
    // Watch for Hex Text Input:
    watch(hexInputValue, async (iv) => {
        if (iv) {
            if (hexCodeRegEx.test(iv)) {
                const adj = iv?.replace(/(_)?#?/g, '')
                value.value = adj
                hexInputErrors.value = []
            } else {
                hexInputErrors.value = ['Invalid Hex Input']
            }
        }
    })


    // UI Util: Dynamic Field Text Color:
    const textColor = computed(() => {
        if (!value.value) return 'white'
        const hex = value.value.replace('#', '')
        const r = parseInt(hex.substring(0, 2), 16)
        const g = parseInt(hex.substring(2, 4), 16)
        const b = parseInt(hex.substring(4, 6), 16)
        // Perceived luminance formula
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b)
        return luminance > 160 ? 'black' : 'white'
    })

</script>


<template>
    <FormField name="color">
        <span ref="inputRef" @click="popupVisible = !popupVisible"
            class="w-full cursor-pointer flex h-10.5 p-1.75 rounded-md border border-ring-2 hover:border-ring-1 transition-all bg-bg-3">

            <!-- Value Display -->
            <div class="flex w-full h-full bg-sky-500 rounded" :style="{ backgroundColor: `#${value}` }">
                <p class="pl-1.5 text-sm my-auto font-semibold" :style="{ color: textColor }">
                    {{ '#' + value || '#??????' }}
                </p>
            </div>
        </span>

        <!-- Picker Popup -->
        <Transition name="fade" type="transition">
            <div ref="popupRef" v-if="popupVisible" :style="floatingStyles"
                class="flex-center z-777! bg-bg-3 border border-ring-2 rounded-md p-1.5">
                <div class="flex flex-col w-fit h-fit">
                    <!-- Color Picker Input -->
                    <ColorPicker name="color" v-model:model-value="value" inline :default-color="value"
                        :pt="{ overlay: 'bg-bg-2! border-0!', hue: 'rounded! ring! ring-ring-1!', colorSelector: 'overflow-clip! rounded! ring! ring-ring-2!', colorBackground: 'rounded! overflow-clip!' }" />
                    <!-- Color String Input -->
                    <div class="w-full flex flex-col gap-1 flex-wrap p-2 z-2">
                        <InputMask v-model:model-value="hexInputValue" mask="#******" size="small" class="text-xs!"
                            fluid :placeholder="'#' + value || '#HexColor'" />
                        <p class="w-full text-xs text-danger-2" v-for="err in hexInputErrors">
                            {{ err }}
                        </p>
                    </div>
                </div>
            </div>
        </Transition>
    </FormField>
</template>


<style scoped></style>