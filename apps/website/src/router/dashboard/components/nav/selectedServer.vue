<script lang="ts" setup>
    import { useAuthStore } from '@/stores/auth';
    import { useDashboardStore } from '@/stores/dashboard';
    import { autoUpdate, flip, offset, shift, useFloating, } from '@floating-ui/vue';
    import { flattenJSON } from 'three/src/animation/AnimationUtils.js';


    // Services:
    const dashboard = useDashboardStore()
    const auth = useAuthStore()

    // Dashboard Nav Expanded:
    const navExpanded = computed(() => dashboard.nav.expanded)

    // Guild Data from User Identity:
    const guildDataFromUser = computed(() => auth.identity?.state?.guilds.find(g => g.id == dashboard.guildId))


    // Server Pop Up Element:
    const showPopUp = ref(false)

    const serverPopUp = useTemplateRef('serverPopUp')
    const buttonRef = useTemplateRef('buttonRef')
    const { floatingStyles } = useFloating(buttonRef, serverPopUp, {
        placement: 'bottom',
        middleware: [
            offset(8),
            flip(),
            shift(),
        ],
        strategy: 'fixed',
        whileElementsMounted: autoUpdate
    })
    onClickOutside(serverPopUp, (e) => {
        showPopUp.value = false
    }, {
        ignore: [buttonRef]
    })

</script>


<template>
    <div class="w-full flex-center">

        <!-- Nav Button -->
        <button @click="showPopUp = !serverPopUp" ref="buttonRef" :class="{ 'w-fit!': !navExpanded }"
            class="w-full flex-center button-outline bg-bg-3! py-1.5 px-1.75 gap-1 flex-row flex-nowrap">
            <img v-if="guildDataFromUser?.icon" :src="guildDataFromUser?.icon"
                class="size-6 aspect-square! rounded-md block" />
            <Skeleton v-else class="size-6! aspect-square! min-w-fit! rounded-md!" />
            <p class="truncate" v-if="navExpanded && guildDataFromUser?.name">
                {{ guildDataFromUser?.name }}
            </p>
            <Skeleton v-else-if="navExpanded && !guildDataFromUser?.name" class="flex!" />
        </button>

        <!-- Nav Popper -->
        <Teleport to="#app">
            <Transition name="blur-fade" type="transition">
                <div v-if="showPopUp" ref="serverPopUp" :style="floatingStyles"
                    class="absolute transition-opacity! ml-1.5 z-10! min-w-42 top-10 left-10 bg-bg-2 border-2 border-ring-3 p-2 gap-2 rounded-md flex flex-col">

                    <button @click="dashboard.guildId = undefined"
                        class="button-base flex-row flex-nowrap justify-start text-text-2 hover:text-text-1 active:scale-95">
                        <Icon icon="basil:arrow-left-solid" class="size-4.5" />
                        <p class="text-xs">
                            Manage another server
                        </p>
                    </button>

                    <RouterLink to="/pricing"
                        class="button-base gap-1 flex-row flex-nowrap justify-start text-text-2 hover:text-text-1 active:scale-95">
                        <Icon icon="dashicons:money-alt" class="size-4" />
                        <p class="text-xs">
                            Manage Subscription Plan
                        </p>
                    </RouterLink>


                </div>
            </Transition>
        </Teleport>




    </div>
</template>


<style scoped></style>