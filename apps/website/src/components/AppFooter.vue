<script lang="ts" setup>
    import { URLS, useLayoutStore } from '@/stores/layout';
    import { Icon } from '@iconify/vue'
    const fallbackUrl = 'https://github.com/SupporaBot'

    const layout = useLayoutStore()
    const colorMode = layout.colorMode()

</script>


<template>
    <footer
        class="w-full z-4 flex flex-wrap items-center max-sm:flex-col md:flex-row gap-3 p-4 bg-bg-2 ring-ring-soft ring-2"
        :class="{
            'rounded-tl-2xl': layout.appFooter.rounded,
        }">

        <span class="flex-center gap-3 grow md:gap-5 max-sm:flex-col">
            <!-- Logo & Title -->

            <span class="flex-center flex-row flex-nowrap! gap-1.25">
                <img src="/logo-light.png" class="dark:block hidden max-sm:size-6 size-7 rounded" />
                <img src="/logo.png" class="block dark:hidden max-sm:size-6 size-7 rounded" />
                <p class="text-xl font-bold"> Suppora </p>
            </span>


            <!-- Site Links -->
            <span class="flex-center gap-3 p-2 text-sm text-text-3 *:transition-all">
                <RouterLink to="/" active-class="text-brand-2!" class="hover:text-text-1/85">
                    Homepage
                </RouterLink>
                <RouterLink to="/dashboard" active-class="text-brand-2!" class="hover:text-text-1/85">
                    Dashboard
                </RouterLink>
                <RouterLink to="/pricing" active-class="text-brand-2!" class="hover:text-text-1/85">
                    Pricing
                </RouterLink>
                <RouterLink to="/account" active-class="text-brand-2!" class="hover:text-text-1/85">
                    Account
                </RouterLink>
            </span>
        </span>

        <span class="flex-center gap-3 md:gap-5 grow">
            <!-- External Links -->
            <span class="flex-center gap-3 p-2 text-sm text-text-3 *:transition-all">
                <a :href="URLS.invite" class="hover:text-text-1/85">
                    Invite Bot
                </a>
                <a :href="URLS.documentation" class="hover:text-text-1/85">
                    Documentation
                </a>
                <a :href="URLS.status" class="hover:text-text-1/85">
                    Status
                </a>
            </span>


            <!-- Socials -->
            <span class="flex-center gap-3 p-2 text-sm text-text-3 *:transition-all">
                <a href="https://github.com/SupporaBot" class="hover:text-text-1/85">
                    <Icon icon="mdi:github" class="size-5" />
                </a>
                <a :href="URLS.discord.general" class="hover:text-text-1/85">
                    <Icon icon="ic:baseline-discord" class="size-5" />
                </a>
            </span>
        </span>

        <button @click="() => { colorMode == 'light' ? colorMode = 'auto' : colorMode = 'light' }"
            class="self-center flex-center mx-auto gap-0.5">
            <Icon icon="ph:sun-duotone" v-if="colorMode == 'light'" class="size-4" />
            <Icon icon="si:moon-duotone" v-else class="size-3.75" />
            Toggle Theme
        </button>

    </footer>
</template>


<style scoped>

    @reference "@/styles/main.css";

    button {
        @apply bg-bg-4 border-2 border-ring-2 px-2 py-0.75 text-xs rounded-md cursor-pointer;
    }

</style>