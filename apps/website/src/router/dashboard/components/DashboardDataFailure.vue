<script lang="ts" setup>
    import { useAuthStore } from '@/stores/auth';
    import { URLS } from '@/stores/layout';

    // Services:
    const auth = useAuthStore()



</script>


<template>
    <main class="flex-center w-full h-full m-auto grow">

        <div class="flex-center flex-col bg-bg-2 p-4 gap-2 max-w-120 mx-8 rounded-md border-2 border-ring-2">
            <span class="w-full mt-1 flex items-center flex-row gap-1">
                <Icon icon="mdi:warning" class="size-7" />
                <p class="text-xl font-bold"> Loading Failure </p>
            </span>

            <p class="w-full text-center opacity-75 my-2"> We couldn't load your Dashboard! </p>

            <div class="flex-center w-full">
                <p class="font-medium text-sm w-full"> There's a few reasons why this may have happened:</p>

                <ul class="flex gap-1 flex-col list-inside list-disc px-4 my-2 w-full *:text-sm">
                    <li>
                        You lost access to this guild due to permissions.
                    </li>
                    <li>
                        You lost access to your own account data.
                    </li>
                    <li>
                        Our internal systems are experiencing an outage.
                    </li>
                </ul>
            </div>

            <p class="text-text-2 text-xs w-full">
                If you'd like, you can contact our Support Team via Discord.
            </p>
            <div class="flex-center w-full p-3 gap-3 ">
                <button @click="auth.signIn()"
                    class="ring-brand-3 gap-0.75 hover:!ring-brand-2 button-outline bg-bg-3! active:scale-95">
                    <Icon icon="heroicons-outline:status-online" class="size-5.5" />
                    Status Page
                </button>
                <a :href="URLS.discord.support" target="_blank"
                    class="button-outline ring-warning-3 hover:!ring-warning-2 bg-bg-3! active:scale-95">
                    <Icon icon="mingcute:chat-1-line" class="size-5.5 p-px pr-0.5 " />
                    Support Chat
                </a>
            </div>
        </div>

    </main>
</template>


<style scoped></style>