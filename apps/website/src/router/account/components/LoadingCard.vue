<script lang="ts" setup>
    import { useAuthStore } from '@/stores/auth';

    // Props:
    const props = defineProps<{
        authOk: boolean | undefined
    }>()

    // Services:
    const auth = useAuthStore()

    const gettingType = computed(() => {
        if (!props.authOk) return 'Account System'
        if (!auth.signedIn) return 'New Sign In...'
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