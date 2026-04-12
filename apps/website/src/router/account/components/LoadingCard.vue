<script lang="ts" setup>
    import { useAuthStore } from '@/stores/auth';


    // Services:
    const auth = useAuthStore()

    const gettingType = computed(() => {
        if (!auth.authReady) return 'Account System'
        if (!auth.signedIn) return 'New Sign In...'
    })

    // If Signing In:
    onMounted(async () => {
        const authOk = await auth.waitForAuthReady()
        if (!auth.signedIn || !auth.user) {
            // New Sign In:
            auth.signIn()
        }
    })

</script>


<template>
    <div class="flex-center gap-3 flex-col bg-bg-2 border-2 border-ring-3/50 p-5 rounded-md m-8">
        <ProgressSpinner />
        <p class="font-semibold">
            Loading Account
        </p>
        <p class="text-xs text-text-3">
            Fetching {{ gettingType }}
        </p>
    </div>
</template>


<style scoped></style>