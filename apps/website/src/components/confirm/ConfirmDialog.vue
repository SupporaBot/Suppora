<script lang="ts" setup>
    import { ConfirmDialog } from 'primevue';




</script>


<template>
    <ConfirmDialog class="w-full bg-bg-3! flex! m-8! max-w-xl border-2! border-ring-2!">
        <template #container="{ message, acceptCallback, rejectCallback }">
            <div class="flex-center p-7 flex-col gap-2 w-full max-w-4xl">

                <span class="flex-col absolute flex-center gap-1.5 w-full -top-8 mr-auto text-warning-2">
                    <Icon icon="mdi:alert" class="size-19.5 bg-bg-4 relative top-0.5 text-code rounded-full p-2.5" />
                    <h1 class="text-3xl font-bold"> Please Confirm! </h1>
                </span>

                <div class="w-full my-2 px-2 mt-18.5">
                    <span v-if="message?.message" v-html="message?.message" />
                    <span v-else>
                        Please confirm this action...
                    </span>
                </div>


                <span class="flex-center flex-row gap-4.5 p-2.5 w-fit ml-auto">
                    <Button @click="rejectCallback" unstyled class="button-base gap-1">
                        <Icon icon="mdi:cancel" class="size-3.75" />
                        <p class="font-semibold text-sm/snug p-px">
                            Cancel
                        </p>
                    </Button>
                    <Button @click="acceptCallback" unstyled class="button-base gap-1 hover:ring-warning-2!">
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