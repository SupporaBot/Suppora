<script lang="ts" setup>
    import { useAuthStore } from '@/stores/auth';
    import { URLS } from '@/stores/layout';
    import { DateTime } from 'luxon';


    // Services:
    const auth = useAuthStore()
    const user = computed(() => auth.user)
    const identity = computed(() => auth.identity)

    const identityLastFetchedAt = computed(() => DateTime.fromISO(String(identity?.value?._fetched_at), { zone: 'local' }))
    const identityResyncWaitMins = 5
    const cooldownSecsUntilIdentityRefresh = computed(() => Math.max(identityLastFetchedAt.value.plus({ minute: identityResyncWaitMins })?.diffNow('seconds')?.seconds, 0))

</script>


<template>
    <div class="flex-center w-full max-w-150 flex-col bg-bg-2 border-2 border-ring-2 rounded-md">

        <!-- Header -->
        <div
            class="flex w-full border-b-2 bg-text-1/3 border-ring-2 flex-row text-lg lg:text-xl items-center gap-2 p-4">
            <Icon class="text-brand-1" icon="mdi:user" />
            <p> <b class="text-brand-1">ACCOUNT</b> </p>
        </div>

        <!-- Content -->
        <div class="flex-center flex-wrap flex-col md:flex-row md:gap-7 w-full p-4 mt-2 px-10">

            <!-- Welcome & Avatar -->
            <div class="flex-col w-full md:w-fit md:mx-auto max-w-full flex-center">
                <span class="w-fit self-center text-wrap max-w-full">
                    <p class="w-full">
                        Hello,
                    </p>
                    <p class="text-3xl mb-2 lg:text-5xl font-extrabold uppercase text-center">
                        {{ (identity?.display_name ?? user?.user_metadata?.display_name) }}
                    </p>
                </span>
                <img :src="identity?.avatar_url ?? '/discord.png'"
                    class="size-21 lg:size-25 my-2 rounded-full ring-2 ring-ring-2">

            </div>

            <!-- Account Details -->
            <div class="flex w-full md:w-fit max-w-full flex-col gap-2">
                <!-- UID -->
                <span class="w-full flex flex-col items-center gap-1">
                    <span class="flex w-full gap-1 flex-row items-center text-text-2">
                        <Icon icon="teenyicons:id-solid" class="size-4.5" />
                        <p class="font-semibold"> UID </p>
                    </span>
                    <p class="text-xs w-full pl-1.5 opacity-65">
                        - {{ user?.id || 'Unknown' }}
                    </p>
                </span>
                <!-- Discord Id -->
                <span class="w-full flex flex-col items-center gap-1">
                    <span class="flex w-full gap-1 flex-row items-center text-text-2">
                        <Icon icon="ic:baseline-discord" class="size-4.5" />
                        <p class="font-semibold"> Discord ID </p>
                    </span>
                    <p class="text-xs w-full pl-1.5 opacity-65">
                        - {{ identity?.id ?? 'Unknown' }}
                    </p>
                </span>
                <!-- Created At -->
                <span class="w-full flex flex-col items-center gap-1">
                    <span class="flex w-full gap-1 flex-row items-center text-text-2">
                        <Icon icon="tabler:clock-filled" class="size-4.5" />
                        <p class="font-semibold"> Created At </p>
                    </span>
                    <p class="text-xs w-full pl-1.5 opacity-65">
                        - {{ user?.created_at
                            ? DateTime.fromISO(user?.created_at, { zone: 'local' })?.toFormat(`D '-' t`)
                            : `Unknown`
                        }}
                    </p>
                </span>
                <!-- Last Sync -->
                <span class="w-full flex flex-col items-center gap-1">
                    <span class="flex w-full gap-1 flex-row items-center text-text-2">
                        <Icon icon="fluent:cloud-sync-16-filled" class="size-4.5" />
                        <p class="font-semibold"> Last Sync </p>
                    </span>
                    <p class="text-xs w-full pl-1.5 opacity-65">
                        - {{ user?.created_at
                            ? identityLastFetchedAt?.toFormat(`D '-' t`)
                            : `Unknown`
                        }}
                    </p>
                </span>
            </div>

        </div>


        <!-- Actions -->
        <div class="flex-center flex-col w-full p-3 gap-4.5 mb-2.25">
            <button @click="auth.signOut()" title="Sign Out"
                class="ring-danger-3 gap-0.75 hover:!ring-danger-2 button-outline bg-bg-3! active:scale-95">
                <Icon icon="line-md:logout" class="size-5.5 py-px" />
                Sign Out
            </button>

            <button @click="auth.fetchSelfIdentity(true)" :disabled="cooldownSecsUntilIdentityRefresh >= 1"
                title="Resync Discord Data"
                class=" gap-0.75 hover:!ring-brand-2 disabled:cursor-not-allowed disabled:!ring-ring-2 disabled:scale-100! button-outline bg-bg-3! active:scale-95">
                <Icon icon="ic:baseline-discord" class="size-5.5 py-px" />
                Resync Discord Data
            </button>

            <RouterLink to="/privacy" class="text-text-3 hover:text-info-2 mt-1 hover:underline text-xs">
                Your Data Rights
            </RouterLink>
        </div>

    </div>
</template>


<style scoped></style>