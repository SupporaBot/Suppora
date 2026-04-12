<script lang="ts" setup>
    import { useAuthStore } from '@/stores/auth';
    import { URLS } from '@/stores/layout';
    import { DateTime } from 'luxon';


    // Services:
    const auth = useAuthStore()
    const user = computed(() => auth.user)


</script>


<template>
    <div class="flex-center w-full max-w-120 flex-col bg-bg-2 border-2 border-ring-2 rounded-md">

        <!-- Header -->
        <div
            class="flex w-full border-b-2 bg-text-1/3 border-ring-2 flex-row text-lg lg:text-xl items-center gap-2 p-4">
            <Icon class="text-brand-1" icon="mdi:user" />
            <p> <b class="text-brand-1">ACCOUNT</b> </p>
        </div>

        <!-- Content -->
        <div class="flex-center flex-col w-full p-4 mt-2 px-10">
            <span class="">
                <p class="w-full">
                    Hello,
                </p>
                <p class="text-2xl mb-2 lg:text-4xl font-extrabold uppercase">
                    {{ user?.user_metadata?.display_name }}
                </p>
            </span>
            <img src="/discord.png" class="size-21 my-2 rounded-full ring-2 ring-ring-2">

            <!-- Account Details -->
            <span class="flex w-full flex-col gap-2">
                <span class="w-full flex flex-col items-center gap-1">
                    <span class="flex w-full gap-1 flex-row items-center text-text-2">
                        <Icon icon="teenyicons:id-solid" class="size-4.5" />
                        <p class="font-semibold"> UID </p>
                    </span>
                    <p class="text-xs w-full pl-1.5 opacity-65">
                        - {{ user?.id || 'Unknown UID' }}
                    </p>
                </span>

                <span class="w-full flex flex-col items-center gap-1">
                    <span class="flex w-full gap-1 flex-row items-center text-text-2">
                        <Icon icon="tabler:clock-filled" class="size-4.5" />
                        <p class="font-semibold"> Created At </p>
                    </span>
                    <p class="text-xs w-full pl-1.5 opacity-65">
                        - {{ user?.created_at
                            ? DateTime.fromISO(user?.created_at)?.toFormat(`D '-' t`)
                            : `Unknown Time`
                        }}
                    </p>
                </span>


            </span>
        </div>


        <!-- Actions -->
        <div class="flex-center flex-col w-full p-3 gap-3 mb-2.25">
            <button @click="auth.signOut()" title="Sign Out"
                class="ring-danger-2 gap-0.75 hover:!ring-danger-3 button-outline bg-bg-3! active:scale-95">
                <Icon icon="line-md:logout" class="size-5.5 py-px" />
                Sign Out
            </button>

            <RouterLink to="/privacy" class="text-text-3 hover:text-info-2 mt-1 hover:underline text-xs">
                Your Data Rights
            </RouterLink>
        </div>

    </div>
</template>


<style scoped></style>