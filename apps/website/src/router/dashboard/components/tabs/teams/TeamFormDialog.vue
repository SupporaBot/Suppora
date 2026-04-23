<script lang="ts" setup>
    import { zodResolver } from '@primevue/forms/resolvers/zod'
    import { useDashboardStore } from '@/stores/dashboard/dashboard';
    import { TeamSchema } from '@suppora/shared';
    import * as z from 'zod'
    import type { FormInstance, FormSubmitEvent } from '@primevue/forms/form';
    import useNotifier from '@/stores/notifier';
    import { ApiRequest } from '@/utils/api';
    import { useConfirm } from 'primevue';

    // Services:
    const dashboard = useDashboardStore()
    const notifier = useNotifier()
    const confirm = useConfirm()

    // Modal Visibility:
    const isVisible = defineModel<boolean>('isVisible')

    // Edit Payload:
    const editPayload = defineModel<TeamDialogFormSchema & { id: string }>('editPayload')

    // Modal/Form Action Mode:
    const formMode = ref<'new' | 'edit'>('new')

    // Editing Team Id:
    const editingTeamId = ref<string | undefined>(undefined)

    // Start/Watch Editing Payload:
    watch(editPayload, async (p) => {
        if (p) {
            formMode.value = 'edit'
            editingTeamId.value = p.id
            isVisible.value = true
            await nextTick()
            formRef.value?.setFieldValue('title', p.title)
        }
    })

    // Team Form Schema
    const FormSchema = TeamSchema.pick({
        title: true
    })
    export type TeamDialogFormSchema = z.infer<typeof FormSchema>

    // Form El Ref:
    const formRef = useTemplateRef<FormInstance>('formRef')


    // Reset Form/Dialog Fn:
    function reset() {
        formRef.value?.reset()
        editingTeamId.value = undefined
        formMode.value = 'new'
        submitState.value = 'idle'
    }

    function promptDelete() {
        confirm.require({
            header: 'Header',
            message: `<span class="w-full flex-col gap-1"><span>You're about to <b>permanently delete</b> this <b class="text-code">Team</b>!</span> <br> <span class="text-danger-2 text-sm w-full block mt-4"><b class="text-code font-bold!">NOTE:</b> This action <u>cannot be undone!</u></span></span>`,
            async accept() {
                console.info('starting delete...', editingTeamId.value)
                submitState.value = 'deleting'
                try {
                    const { success, data, error } = await ApiRequest({ url: `/guilds/${dashboard.guildId}/teams/${editingTeamId.value}`, method: 'DELETE' })
                    if (!success) {
                        console.error('FAILED TEAM DELETION', data, error)
                        notifier.send({
                            level: 'error',
                            header: 'Failed to Delete!',
                            content: 'Unfortunately, we ran into an error while trying to delete your <b class="text-code">Team</b>!'
                        })
                    } else {
                        reset()
                        isVisible.value = false
                        dashboard.guildData.teams.get({ overrideCooldown: true, silenceLoading: true })
                    }
                } finally {
                    setTimeout(() => {
                        submitState.value = 'idle'
                    }, 3000);
                }
            },
        })
    }

    // Form Submission:
    const submitState = ref<(SubmitStatus | 'deleting')>('idle')
    async function formSubmit(e: FormSubmitEvent<TeamDialogFormSchema> | FormSubmitEvent) {
        try {
            submitState.value = 'loading'
            if (e.valid) {
                if (formMode.value == 'new') {
                    // Creating NEW Team:
                    const { success } = await ApiRequest({
                        url: `/guilds/${dashboard.guildId}/teams/`,
                        method: 'POST',
                        data: e.values
                    })
                    if (!success) {
                        // API Failure:
                        notifier.send({
                            level: 'error',
                            header: 'Team Creation Failed!',
                            content: h(`span`, { class: 'text-xs p-1 flex w-full' }, 'We failed to create your new Staff Team! If this issue persist, feel free to contact support.')
                        })
                    } else {
                        // Succeeded:
                        isVisible.value = false
                        reset()
                    }
                } else {
                    // Editing EXISTING Team:
                    const { success } = await ApiRequest({
                        url: `/guilds/${dashboard.guildId}/teams/${editingTeamId.value}`,
                        method: 'PATCH',
                        data: e.values
                    })
                    if (!success) {
                        // API Failure:
                        notifier.send({
                            level: 'error',
                            header: 'Team Creation Failed!',
                            content: h(`span`, { class: 'text-xs p-1 flex w-full' }, 'We failed to update your Staff Team! If this issue persist, feel free to contact support.')
                        })
                    } else {
                        // Succeeded:
                        isVisible.value = false
                        reset()
                    }
                }
            } else {
                submitState.value = 'failed'
                console.warn('[Invalid] Team Form Submission', { values: e })
                notifier.send({
                    level: 'error',
                    header: 'Invalid Submission',
                    content: h(`span`, { class: 'text-xs p-1 flex w-full' }, 'Please fix any invalid form fields before continuing!')
                })
            }
        } finally {
            await dashboard.guildData.teams.get({ overrideCooldown: true, silenceLoading: true })
            setTimeout(() => {
                submitState.value = 'idle'
            }, 2_000);
        }
    }

    // On Unmounted:
    watch(isVisible, (visible) => {
        if (!visible) reset()
    }, { immediate: true })


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
                            <p class="font-semibold text-lg"> {{ formMode == 'edit' ? 'Editing' : 'Creating' }} Team</p>
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
                        <Button @click="promptDelete" :disabled="submitState != 'idle'" v-if="formMode == 'edit'"
                            unstyled title="Remove"
                            class="button-base bg-bg-2 gap-0.75 text-text-2 hover:text-danger-2 max-sm:aspect-square">
                            <Icon v-if="submitState == 'deleting'" icon="svg-spinners:90-ring-with-bg"
                                class="relative top-px" />
                            <Icon v-else icon="mage:trash-fill" class="size-3.75" />
                            <p class="semibold sm:flex hidden"> Remove </p>
                        </Button>

                        <span class="flex-center flex-row gap-4 ml-auto">
                            <Button unstyled class="button-base " @click="isVisible = false">
                                Cancel
                            </Button>
                            <Button :disabled="submitState != 'idle'" unstyled type="submit" class="button-base gap-1">
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