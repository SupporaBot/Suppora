<script lang="ts" setup>
    import { zodResolver } from '@primevue/forms/resolvers/zod'
    import { useDashboardStore } from '@/stores/dashboard';
    import { TeamSchema } from '@suppora/shared';
    import * as z from 'zod'
    import type { FormInstance, FormSubmitEvent } from '@primevue/forms/form';
    import useNotifier from '@/stores/notifier';
    import type { UUID } from 'crypto';

    // Services:
    const dashboard = useDashboardStore()
    const notifier = useNotifier()

    // Modal Visibility:
    const isVisible = defineModel<boolean>('isVisible')

    // Exposed Method - Start Edit:
    async function startEdit(values: {
        id?: UUID
        title: TeamSchema['title']
    }) {
        isVisible.value = true
        await nextTick()
        formRef.value?.setFieldValue('title', values.title)

    }

    // Team Form Schema
    const FormSchema = TeamSchema.pick({
        title: true
    })
    type FormSchema = z.infer<typeof FormSchema>

    const formRef = useTemplateRef<FormInstance>('formRef')


    function formSubmit(e: FormSubmitEvent) {
        if (e.valid) {
            console.info('Form VALID!', e)
        } else {
            console.warn('Form INVALID!', e)
            notifier.send({
                level: 'error',
                header: 'Invalid Submission',
                content: h(`span`, { class: 'text-xs p-1 flex w-full' }, 'Please fix any invalid form fields before continuing!')
            })
        }
    }

    // Define Exposed:
    defineExpose({ startEdit })

</script>


<template>
    <Dialog :visible="isVisible" modal block-scroll
        class="bg-bg-2! border-2! border-ring-2! w-[90%]! h-fit! p-0 m-8! max-w-xl">

        <template #container>
            <div class="w-full flex h-fit flex-center gap-2.5 flex-col">
                <Form v-slot="$form" @submit="formSubmit" :resolver="zodResolver(FormSchema)" ref="formRef"
                    class="w-full flex flex-col">

                    <header class="flex w-full items-center p-3.5">
                        <span class="flex-center gap-1.25">
                            <Icon icon="mdi:users" class="size-7" />
                            <p class="font-semibold text-lg"> Editing Team</p>
                        </span>
                    </header>

                    <!-- Form Area -->
                    <div class="flex-center w-full flex-col p-2.5 px-4 gap-2.5">

                        <!-- Title Input -->
                        <span class="w-full flex flex-col gap-1.5 flex-wrap">
                            <label for="title" class="flex-row gap-1 flex-center w-fit mr-auto"
                                :class="{ 'text-danger-2': $form.title?.invalid }">
                                <Icon icon="mdi:text" />
                                <p> Title </p>
                            </label>
                            <InputText name="title" />
                            <ul v-if="$form.title?.invalid" v-for="err in $form.title?.errors"
                                class="flex flex-col gap-1.25 px-1 list-none list-inside">
                                <li class="text-sm font-semibold w-full text-danger-2">
                                    - {{ err?.message ?? 'Invalid Input' }}
                                </li>
                            </ul>
                        </span>

                    </div>

                    <footer class="w-full flex-center gap-4 p-4 pt-2">
                        <Button unstyled title="Remove"
                            class="button-base bg-bg-2 gap-0.75 text-text-2 hover:text-danger-2 max-sm:aspect-square">
                            <Icon icon="mage:trash-fill" class="size-3.75" />
                            <p class="semibold sm:flex hidden"> Remove </p>
                        </Button>

                        <span class="flex-center flex-row gap-4 ml-auto">
                            <Button unstyled class="button-base " @click="isVisible = false">
                                Cancel
                            </Button>
                            <Button unstyled type="submit" class="button-base gap-1">
                                Save
                                <Icon icon="mdi:check" class="relative top-px" />
                            </Button>
                        </span>
                    </footer>

                </Form>
            </div>
        </template>

    </Dialog>
</template>


<style scoped></style>