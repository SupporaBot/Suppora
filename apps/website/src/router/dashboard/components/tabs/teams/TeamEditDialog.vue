<script lang="ts" setup>

    import { useDashboardStore } from '@/stores/dashboard';
    import { DiscordSnowflake } from '@suppora/shared';
    import * as z from 'zod'

    // Services:
    const dashboard = useDashboardStore()

    // Modal Visibility:
    const isVisible = defineModel<boolean>('isVisible')

    // Team Form
    const teamSchema = z.object({
        id: z.uuid(),
        title: z.string('Please enter a valid Team name.').max(32, 'Team name cannot exceed 32 characters.'),
        guild_id: DiscordSnowflake,
        role_id_on_call: z.nullish(DiscordSnowflake),
        role_id_off_call: z.nullish(DiscordSnowflake),
        created_at: z.nullish(z.iso.datetime('Invalid timestamp was provided.'))
    })
    type TeamSchema = z.infer<typeof teamSchema>


    const formRef = useTemplateRef('formRef')
    const form = (() => {

        const values = reactive<Partial<TeamSchema>>({
            id: undefined,
            title: undefined,
            guild_id: undefined,
            role_id_on_call: undefined,
            role_id_off_call: undefined,
            created_at: undefined
        })

        const reset = () => {
            for (const k of Object.keys(values)) {
                const key: keyof typeof values = k as any
                values[key] = undefined
            }
        }

        return {
            values,
            reset
        }

    })()

</script>


<template>
    <Dialog :visible="isVisible" modal block-scroll class="bg-bg-2! border-2! border-ring-2! w-[90%]! h-fit! p-0 m-8!">

        <template #container>
            <div class="w-full flex h-fit flex-center gap-2.5 flex-col">
                <header class="flex w-full items-center p-2.5">
                    <span class="flex-center">
                        <Icon icon="mdi:users" class="size-7" />
                        <p class="font-semibold text-lg"> Editing Team</p>
                    </span>
                </header>

                <div class="flex-center w-full flex-col p-2.5 px-4 gap-2.5">

                    <!-- Team Values Form -->
                    <Form v-slot="$form" ref="formRef" class="w-full flex flex-col">

                        <span class="w-full flex flex-col flex-wrap">
                            <label for="Title" class="flex-row flex-center w-fit mr-auto">
                                <Icon icon="mdi:text" />
                                <p> Title </p>
                            </label>
                            <InputText name="Title" />
                        </span>

                    </Form>

                    <ThemeToggleButton />

                </div>

                <footer class="w-full flex-center gap-4 p-2.5 pb-4">
                    <Button unstyled class="button-base ml-auto" @click="isVisible = false">
                        Cancel
                    </Button>
                    <Button unstyled class="button-base mr-2 gap-1" @click="isVisible = false">
                        Save
                        <Icon icon="mdi:check" class="relative top-px" />
                    </Button>
                </footer>


            </div>
        </template>

    </Dialog>
</template>


<style scoped></style>