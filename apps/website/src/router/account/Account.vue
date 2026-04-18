<script lang="ts" setup>
    import { useAuthStore } from '@/stores/auth';
    import AccountCard from './components/AccountCard.vue';
    import SignInFailedCard from './components/SignInFailedCard.vue';
    import LoadingCard from './components/LoadingCard.vue';


    // Services:
    const auth = useAuthStore()
    const route = useRoute()

    const authOk = computedAsync(async () => (await auth.waitForAuthReady()).success)
    watch(authOk, (isOk) => {
        if (isOk) {
            if (!auth.signedIn) auth.signIn()
        }
    }, { immediate: true })

    const authErrorQuery = computed(() => {
        const failed = route?.query?.failed;
        const reason = route?.query?.reason;
        if (reason || failed) return { reason, failed }
    })

</script>


<template>
    <main class="flex-center flex-col w-full grow min-h-[82dvh] p-8">



        <Transition name="zoom" enter-active-class="absolute m-auto transition-all transition-[0.3s]"
            leave-active-class="absolute m-auto transition-all">
            <LoadingCard v-if="!authOk" :authOk />
            <SignInFailedCard v-else-if="authErrorQuery != undefined" />
            <AccountCard v-else-if="auth.signedIn" />
        </Transition>

    </main>
</template>


<style scoped>
    /*@reference "@/styles/main.css"; */
</style>