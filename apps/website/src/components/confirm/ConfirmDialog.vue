<script lang="ts" setup>
    import { ConfirmDialog } from 'primevue';




</script>


<template>
    <ConfirmDialog class="w-full bg-bg-3! dark:bg-bg-2! flex! m-8! max-w-lg border-2! border-ring-2!">
        <template #container="{ message, acceptCallback, rejectCallback }">
            <div class="flex items-center p-5 flex-col flex-nowrap gap-2 w-full max-w-4xl overflow-y-auto">

                <span class="flex-col relative flex-center gap-1.75 w-full text-warning-2">
                    <Icon icon="mdi:alert"
                        class="size-19.5 bg-bg-4 dark:bg-bg-3! relative top-0.5 text-code rounded-full p-2.5" />
                    <h1 class="text-3xl font-bold"> {{ message?.header || 'Are you sure?' }} </h1>
                </span>

                <div class="w-full py-3 px-2 *:font-medium">
                    <span v-if="message?.message" v-html="message?.message" />
                    <span v-else>
                        Please confirm this action...
                    </span>
                </div>


                <span class="flex-center flex-row gap-4.5 p-2.5 w-full ml-auto">
                    <Button @click="rejectCallback" unstyled class="button-base gap-1 bg-bg-3!">
                        <Icon icon="mdi:cancel" class="size-3.75" />
                        <p class="font-semibold text-sm/snug p-px">
                            Cancel
                        </p>
                    </Button>
                    <Button @click="acceptCallback" unstyled class="button-base bg-bg-3! gap-1 hover:ring-warning-2!">
                        <Icon icon="mdi:check" class="size-4" />
                        <p class="font-semibold text-sm/snug p-px">
                            Confirm
                        </p>

                    </Button>
                </span>
            </div>
        </template>
    </ConfirmDialog>
</template>


<style scoped></style>