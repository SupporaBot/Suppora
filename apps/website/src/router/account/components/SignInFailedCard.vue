<script lang="ts" setup>
    import { useAuthStore } from '@/stores/auth';
    import { URLS } from '@/stores/layout';


    // Services:
    const auth = useAuthStore()


</script>


<template>
    <div class="flex-center flex-col bg-bg-2 border-2 border-ring-2 rounded-md">

        <!-- Header -->
        <div
            class="flex w-full border-b-2 bg-text-1/3 border-ring-2 flex-row text-lg lg:text-xl items-center gap-2 p-4">
            <Icon class="text-danger-1" icon="mdi:user" />
            <p> Sign In <b class="text-danger-1">FAILED</b>! </p>
        </div>

        <!-- Content -->
        <div class="flex flex-col items-start justify-start w-full gap-4 p-4">
            <p>
                There's a few reasons why this may have happened:
            </p>
            <ul class="list-disc flex flex-col list-inside text-sm md:text-normal">
                <li>
                    You rejected the account access prompt
                </li>
                <li>
                    You are not allowed to use our services
                </li>
                <li>
                    We ran into an internal API error
                </li>
            </ul>

            <p class="text-text-2 text-xs">
                If you'd like you can either try to sign in again or contact our Support Team via Discord.
            </p>
            <div class="flex-center w-full p-3 gap-3 ">
                <a :href="URLS.discord.support" target="_blank" class="button-outline bg-bg-3! active:scale-95">
                    <Icon icon="mingcute:chat-1-line" class="size-5.5 p-px pr-0.5 " />
                    Support Chat
                </a>
                <button @click="auth.signIn()"
                    class="ring-brand-3 gap-0.75 hover:!ring-brand-2 button-outline bg-bg-3! active:scale-95">
                    <Icon icon="mdi:refresh" class="size-5.5" />
                    Try Again
                </button>
            </div>
        </div>

    </div>
</template>


<style scoped></style>