<script lang="ts" setup>
    import { useAuthStore } from '@/stores/auth';
    import { URLS, useLayoutStore } from '@/stores/layout';
    import { RouterLink } from 'vue-router';


    // Services:
    const layout = useLayoutStore()
    const nav = layout.nav
    const auth = useAuthStore()

</script>


<template>

    <!-- App Navigation -->
    <Transition name="nav-slide">
        <nav v-if="nav.visible"
            class="flex min-w-50 flex-col z-7 fixed top-0 bottom-0 right-0 h-full bg-bg-2 dark:bg-bg-1 border-ring-3/50 border-l-2 rounded-l-xl overflow-y-auto">

            <!-- Nav Header -->
            <div class="flex h-fit items-center justify-between flex-row gap-4 p-2">
                <span to="/" title="Suppora" class="flex-center flex-nowrap! gap-1.25 p-2">
                    <img src="/logo-light.png" class="dark:block hidden size-5.5 rounded" />
                    <img src="/logo.png" class="block dark:hidden size-5.5 rounded" />
                    <h1 class="text-lg font-bold"> Suppora </h1>
                </span>
                <button @click="nav.close()" class="button-dynamic hover:bg-bg-3! p-1! aspect-square! active:scale-95">
                    <div class="  ">
                        <Icon icon="line-md:close" class="size-4.5" />
                    </div>
                </button>
            </div>

            <!-- Nav List -->
            <div class="flex flex-col justify-between pb-3 gap-5 grow bg-emerald-300/0 border-ring-3/50 border-y-2">

                <!-- Most Visited -->
                <section class="px-4 py-2 flex flex-col gap-3.25 flex-wrap">
                    <span class="w-full flex-center flex-row gap-2 h-fit ">
                        <div class="bg-bg-3 rounded-full from-ring-2 mx-auto flex grow h-1! my-2" />
                        <h5 class=" font-semibold text-xs opacity-60">
                            Most Visited
                        </h5>
                        <div class="bg-bg-3 rounded-full from-ring-2 mx-auto flex grow h-1! my-2" />
                    </span>

                    <NavLinkButton to="/" title="Homepage" icon="mdi:home" />
                    <NavLinkButton to="/dashboard" title="Dashboard" icon="mdi:layers" />
                    <NavLinkButton href="https://invite.suppora.app" title="Invite Bot" icon="mdi:plus" />
                </section>

                <!-- Information -->
                <section class="px-4 pt-0 py-2 flex flex-col gap-3.25 flex-wrap">
                    <span class="w-full flex-center flex-row gap-2 h-fit ">
                        <div class="bg-bg-3 rounded-full from-ring-2 mx-auto flex grow h-1! my-2" />
                        <h5 class=" font-semibold text-xs opacity-60">
                            Information
                        </h5>
                        <div class="bg-bg-3 rounded-full from-ring-2 mx-auto flex grow h-1! my-2" />
                    </span>

                    <NavLinkButton to="/pricing" title="Premium" icon="tabler:diamond-filled" />
                    <NavLinkButton :href="URLS.documentation" title="Documentation" icon="gridicons:book" />
                    <NavLinkButton :href="URLS.status" title="Status" icon="heroicons-outline:status-online" />

                </section>

                <!-- Account -->
                <section class="px-4 pt-0 py-2 flex flex-col gap-3.25 flex-wrap">
                    <span class="w-full flex-center flex-row gap-2 h-fit ">
                        <div class="bg-bg-3 rounded-full from-ring-2 mx-auto flex grow h-1! my-2" />
                        <h5 class=" font-semibold text-xs opacity-60">
                            Account
                        </h5>
                        <div class="bg-bg-3 rounded-full from-ring-2 mx-auto flex grow h-1! my-2" />
                    </span>

                    <NavLinkButton to="/account" :title="auth.signedIn ? 'My Account' : 'Sign In'" icon="mdi:user" />
                    <NavLinkButton v-if="auth.signedIn" :action="() => auth.signOut()" title="Sign Out"
                        icon="mdi:sign-out" />
                </section>

            </div>

            <!-- Nav Footer -->
            <div class="w-full flex flex-col gap-0.5 p-2 text-xs flex-center">
                <div class="w-fit" @click="nav.close()">
                    <RouterLink to="/privacy" active-class="text-brand-2!"
                        class="text-xs transition-all text-text-3 hover:underline hover:text-text-2"
                        :class="{ 'text-text-2': true }">
                        Privacy Policy
                    </RouterLink>
                </div>
                <div class="w-fit" @click="nav.close()">
                    <RouterLink to="/terms" active-class="text-brand-2!"
                        class="text-xs transition-all text-text-3 hover:underline hover:text-text-2"
                        :class="{ 'text-text-2': true }">
                        Terms & Conditions
                    </RouterLink>
                </div>
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