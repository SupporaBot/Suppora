<script lang="ts" setup>
    import { useLayoutStore } from '@/stores/layout';


    // Services:
    const layout = useLayoutStore()
    const nav = layout.nav

</script>


<template>

    <!-- App Navigation -->
    <Transition name="nav-slide">
        <nav v-if="nav.visible"
            class="flex min-w-50 flex-col z-7 fixed top-0 bottom-0 right-0 h-full bg-bg-2 dark:bg-bg-1 border-ring-3/50 border-l-2 rounded-l-xl">

            <!-- Nav Header -->
            <div class="flex h-fit items-center justify-between flex-row gap-4 p-2">
                <span to="/" title="Suppora" class="flex-center flex-nowrap! gap-1.25 p-2">
                    <img src="/logo-light.png" class="dark:block hidden size-5.5 rounded" />
                    <img src="/logo.png" class="block dark:hidden size-5.5 rounded" />
                    <p class="text-lg font-bold"> Suppora </p>
                </span>
                <button @click="nav.close()" class="button-dynamic hover:bg-bg-3! p-1! aspect-square! active:scale-95">
                    <div class="  ">
                        <Icon icon="line-md:close" class="size-4.5" />
                    </div>
                </button>
            </div>

            <!-- Nav List -->
            <div class="flex flex-col justify-evenly grow bg-emerald-300/0 border-ring-3/50 border-y-2">

                <span class="w-full flex-center flex-row gap-2 h-fit px-4 py-2">
                    <div class="bg-bg-3 rounded-full from-ring-2 mx-auto flex grow h-1! my-2" />
                    <p class=" font-semibold text-xs opacity-60">
                        Most Visited
                    </p>
                    <div class="bg-bg-3 rounded-full from-ring-2 mx-auto flex grow h-1! my-2" />
                </span>


                <span class="w-full flex-center flex-row gap-2 h-fit px-4 py-2">
                    <div class="bg-bg-3 rounded-full from-ring-2 mx-auto flex grow h-1! my-2" />
                    <p class=" font-semibold text-xs opacity-60">
                        My Account
                    </p>
                    <div class="bg-bg-3 rounded-full from-ring-2 mx-auto flex grow h-1! my-2" />
                </span>

                <span class="w-full flex-center flex-row gap-2 h-fit px-4 py-2">
                    <div class="bg-bg-3 rounded-full from-ring-2 mx-auto flex grow h-1! my-2" />
                    <p class=" font-semibold text-xs opacity-60">
                        Extra Resources
                    </p>
                    <div class="bg-bg-3 rounded-full from-ring-2 mx-auto flex grow h-1! my-2" />
                </span>

            </div>

            <!-- Nav Footer -->
            <div class="w-full flex p-2 opacity-50 text-xs flex-center">
                Nav Footer
            </div>

        </nav>
    </Transition>


    <!-- Background/Dismiss Overlay -->
    <Transition name="fade">
        <div v-if="nav.visible" @click="nav.close()"
            class="absolute z-5 flex grow bg-black/45 w-full h-full backdrop-blur-xs" />
    </Transition>
</template>


<style scoped>


    .nav-slide-enter-from,
    .nav-slide-leave-to {
        opacity: 0;
        transform: translateX(45px);
    }

    .nav-slide-enter-to,
    .nav-slide-leave-from {
        opacity: 1;
        transform: translateX(0px);
    }

    .nav-slide-enter-active,
    .nav-slide-leave-active {
        transition: all ease 0.3s;
    }


</style>