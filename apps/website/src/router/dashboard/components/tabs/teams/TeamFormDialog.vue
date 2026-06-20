<script lang="ts" setup>
    import { zodResolver } from '@primevue/forms/resolvers/zod'
    import { useDashboardStore } from '@/stores/dashboard/dashboard';
    import { TeamSchema } from '@suppora/shared';
    import * as z from 'zod'
    import type { FormInstance, FormSubmitEvent } from '@primevue/forms/form';
    import useNotifier from '@/stores/notifier';
    import { ApiRequest } from '@/utils/api';
    import { useConfirm } from 'primevue';
    import ColorInput from './ColorInput.vue';


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


    // Team Form Schema
    const FormSchema = TeamSchema.pick({
        title: true
    }).and(z.object({
        color: z.string().regex(/^(#)?[a-fA-F0-9]{6}$/g, 'Please enter a valid Team color.')
    }))
    export type TeamDialogFormSchema = z.infer<typeof FormSchema>

    // Editing Team Id:
    const editingTeamId = ref<string | undefined>(undefined)

    // Start/Watch Editing Payload:
    watch(editPayload, async (p) => {
        if (p) {
            formMode.value = 'edit'
            editingTeamId.value = p.id
            isVisible.value = true
            colorInputValue.value = p.color
            await nextTick()
            formRef.value?.setFieldValue('title', p.title)
            formRef.value?.setFieldValue('color', p.color)
            await formRef.value?.validate()
        }
    })



    // Form El Ref:
    const formRef = useTemplateRef<FormInstance>('formRef')

    // Color Picker Value Ref:
    const defaultTeamRoleColor = '717ff0'
    const colorInputValue = ref<string | null>(defaultTeamRoleColor)
    watch(colorInputValue, (v) => {
        if (v) {
            formRef.value?.setFieldValue('color', v)
        } else {
            colorInputValue.value = defaultTeamRoleColor
            formRef.value?.setFieldValue('color', defaultTeamRoleColor)
        }
    })


    // Reset Form/Dialog Fn:
    function reset() {
        formRef.value?.reset()
        editingTeamId.value = undefined
        editPayload.value = undefined
        formMode.value = 'new'
        submitState.value = 'idle'
        colorInputValue.value = null
    }


    // Team (Edit) Deletion Prompt:
    const deletePromptContent = useTemplateRef('deletePromptContent')
    function promptDelete() {
        confirm.require({
            // header: 'Header',
            message: deletePromptContent.value?.getHTML(),
            async accept() {
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
                    setTimeout(() => submitState.value = 'idle', 3000)
                }
            }
        })
    }


    // Form Submission:
    const submitState = ref<(SubmitStatus | 'deleting')>('idle')
    async function formSubmit(e: FormSubmitEvent<TeamDialogFormSchema> | FormSubmitEvent) {
        try {
            submitState.value = 'loading'
            const untouched = Object.values(e.states).every(s => !s.touched && !s.dirty)

            if (formMode.value == 'edit' && untouched) {
                // Form Untouched:
                isVisible.value = false
                reset()
                return
            }
            const testReturn = false
            if (testReturn) {
                console.info({ valid: e.valid, values: e.states, untouched, e })
                return console.warn('Prevented submission! - Testing')
            }
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
                        submitState.value = 'success'
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
                        submitState.value = 'success'
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
            // Refresh Updated Guild Data:
            if (submitState.value != 'failed') {
                await Promise.allSettled([
                    dashboard.guildData.teams.get({
                        overrideCooldown: true,
                        silenceLoading: true
                    }),
                    dashboard.guildData.roles.get({
                        overrideCooldown: true,
                        silenceLoading: true
                    })
                ])
            }
            // Reset Submit Status:
            setTimeout(() => {
                submitState.value = 'idle'
            }, 2_000);
        }
    }

    // On Un/mounted:
    watch(isVisible, async (visible) => {
        if (!visible) reset()
        else {
            await nextTick()
            formRef.value?.setFieldValue('color', colorInputValue.value)
        }
    }, { immediate: true })

</script>


<template>
    <Dialog :visible="isVisible" modal block-scroll
        class="bg-bg-2! border-2! border-ring-2! w-[90%]! h-fit! p-0 m-8! max-w-xl overflow-y-visible!">

        <template #container>
            <div class="w-full flex h-fit flex-center gap-2.5 flex-col overflow-y-auto!">
                <Form v-slot="$form" @submit="formSubmit" :resolver="zodResolver(FormSchema)" ref="formRef"
                    class="w-full flex flex-col">

                    <!-- Form Header -->
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

                            <InputText name="title" placeholder="Ex: Support" />

                            <ul v-if="$form.title?.invalid" v-for="err in $form.title?.errors"
                                class="flex flex-col gap-1.25 px-1 list-none list-inside">
                                <li class="text-sm font-semibold w-full text-danger-2">
                                    - {{ err?.message ?? 'Invalid Input' }}
                                </li>
                            </ul>
                        </span>

                        <!-- Color Input -->
                        <span class="w-full flex flex-col gap-1.5 flex-wrap">
                            <label for="color" class="flex-row gap-1 flex-center w-fit mr-auto"
                                :class="{ 'text-danger-2': $form.color?.invalid }">
                                <Icon icon="mdi:color" />
                                <p> Color </p>
                            </label>

                            <ColorInput v-model:value="(colorInputValue as string)" />

                            <ul v-if="$form.color?.invalid" v-for="err in $form.color?.errors"
                                class="flex flex-col gap-1.25 px-1 list-none list-inside">
                                <li class="text-sm font-semibold w-full text-danger-2">
                                    - {{ err?.message ?? 'Invalid Input' }}
                                </li>
                            </ul>
                        </span>

                    </div>

                    <!-- Form Footer -->
                    <footer class="w-full flex-center gap-4 p-4 pt-2">
                        <!-- Delete Team -->
                        <Button @click="promptDelete" :disabled="submitState != 'idle'" v-if="formMode == 'edit'"
                            unstyled title="Remove"
                            class="button-base bg-bg-2 gap-0.75 text-text-2 hover:text-danger-2 max-sm:aspect-square">
                            <Icon v-if="submitState == 'deleting'" icon="svg-spinners:90-ring-with-bg"
                                class="relative top-px" />
                            <Icon v-else icon="mage:trash-fill" class="size-3.75" />
                            <p class="semibold sm:flex hidden"> Remove </p>
                        </Button>

                        <!-- Save Team / Cancel Edits -->
                        <span class="flex-center flex-row gap-4 ml-auto">
                            <Button unstyled title="Cancel" class="button-base" @click="isVisible = false">
                                Cancel
                            </Button>
                            <Button title="Save" :disabled="submitState != 'idle'" unstyled type="submit"
                                class="button-base gap-1" :class="{
                                    'disabled:ring-danger-2!': submitState == 'failed',
                                    'disabled:ring-success-2!': submitState == 'success'
                                }">
                                <Icon v-if="submitState == 'loading'" icon="eos-icons:loading"
                                    class="relative top-px" />
                                <Icon v-else icon="mdi:check" class="relative top-px" />
                                {{ formMode == 'new' ? 'Submit' : 'Save' }}
                            </Button>
                        </span>
                    </footer>

                </Form>
            </div>
        </template>

    </Dialog>

    <!-- Delete Prompt - Content -->
    <div hidden ref="deletePromptContent">
        <div class=" flex-col flex gap-1 w-full">
            <span> You're about to <u>permanently delete</u> this <b class="text-code font-semibold">Team</b>!</span>

            <div class="text-sm mt-4 w-full flex flex-col gap-2">
                <span class="w-full pb-2 flex flex-row items-center gap-1.5">
                    <div class="flex grow h-0.5 bg-ring-2" />
                    <p class="text-xs opacity-50 font-bold uppercase font-default"> Details</p>
                    <div class="flex grow h-0.5 bg-ring-2" />
                </span>
                <span> <b class="text-code font-light">Team Name</b>: {{ editPayload?.title }} </span>
                <span> <b class="text-code font-light">Note</b>: <b class="text-danger-2">This action cannot be
                        undone!</b>
                </span>
            </div>
        </div>
    </div>
</template>


<style scoped></style>