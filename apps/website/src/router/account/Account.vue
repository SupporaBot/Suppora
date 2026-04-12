<script lang="ts" setup>
    import { useAuthStore } from '@/stores/auth';
    import AccountCard from './components/AccountCard.vue';
    import SignInFailedCard from './components/SignInFailedCard.vue';
    import LoadingCard from './components/LoadingCard.vue';


    // Services:
    const auth = useAuthStore()
    const route = useRoute()

    const authErrorQuery = computed(() => {
        const failed = route?.query?.failed;
        const reason = route?.query?.reason;
        if (reason || failed) return { reason, failed }
    })

</script>


<template>
    <main class="flex-center flex-col w-full grow min-h-[82dvh] p-8">

        <Transition name="zoom">
            <LoadingCard v-if="!auth.authReady || !auth.signedIn" />

            <AccountCard v-else-if="auth.signedIn" />

            <SignInFailedCard v-else-if="authErrorQuery != undefined" />


        </Transition>

    </main>
</template>


<style scoped>
    /*@reference "@/styles/main.css"; */
</style>