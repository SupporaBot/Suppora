<script lang="ts" setup>
    import PixelSnow from '@/components/VueBits/PixelSnow.vue';
    import { URLS } from '@/stores/layout';
    import { Icon } from '@iconify/vue';


</script>


<template>
    <main class="flex-center w-full h-full flex-1 grow px-7 min-h-[87dvh] p-10">
        <div class="font-bold z-2 w-full flex-center gap-4 lg:gap-13 flex-col">

            <div>
                <p class="text-7xl lg:text-8xl">
                    NOT FOUND
                </p>
                <p class="text-text-2 lg:text-lg">
                    We can't find the page you're looking for :/
                </p>
            </div>

            <div class="flex bg-bg-3/50 border border-ring-2 p-3 rounded-md flex-col gap-0 max-md:text-sm mt-4">
                <span class="text-text-2 lg:text-lg items-center">
                    <Icon icon="mdi:info-outline" class="inline relative bottom-px" /> This resource may have been
                    deleted or
                    moved to a
                    new location!
                </span>
                <span class="text-text-2 font-semibold mt-2 text-xs opacity-85">
                    You can go back to our <RouterLink class="hover:underline text-sky-600" to="/"> Homepage
                    </RouterLink>
                </span>
                <span class="text-text-2 font-semibold mt-2 text-xs opacity-85">
                    Not expecting this? Feel free to contact our <a class="text-sky-600 hover:underline"
                        :href="URLS.discord.support" target="_blank">Support
                        Team</a> via Discord.
                </span>
            </div>

        </div>

        <PixelSnow :color="'#eeeeee'" :brightness="2.5" class="block z-0" />
    </main>
</template>


<style scoped>
    /* @reference "@/styles/main.css"; */
</style>