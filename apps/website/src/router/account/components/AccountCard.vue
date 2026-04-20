<script lang="ts" setup>
    import Tooltip from '@/components/Tooltip.vue';
    import { useAuthStore } from '@/stores/auth';
    import { DateTime } from 'luxon';


    // Services:
    const auth = useAuthStore()
    const user = computed(() => auth.user)
    const identity = computed(() => auth.identity.state)


    const now = ref(DateTime.utc())

    const nextIdentityFetchAllowedAt = computed(() => identity.value?._next_fetch_allowed_at)
    const isNextRefreshCooldown = computed(() => ((nextIdentityFetchAllowedAt.value ?? now.value) > now.value))

    // Avatar Icon Load State:
    const avatarLoaded = ref(false)

    onMounted(() => {
        const interval = setInterval(() => {
            now.value = DateTime.utc()
        }, 1000) // update every second

        onUnmounted(() => clearInterval(interval))
    })

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
                <img v-show="avatarLoaded && identity?.avatar_url" @loadstart="avatarLoaded = false"
                    @load="avatarLoaded = true" :src="identity?.avatar_url"
                    class="size-21 lg:size-25 my-2 aspect-square rounded-full ring-2 ring-ring-2">
                <Skeleton v-show="!avatarLoaded || !identity?.avatar_url" shape="circle"
                    class="size-21! lg:size-25! my-2! aspect-square! rounded-full! ring-2! ring-ring-2!" />

            </div>

            <!-- Account Details -->
            <div class="flex w-full md:w-fit max-w-full flex-col gap-2">
                <!-- UID -->
                <span class="w-full flex flex-col items-center gap-1">
                    <span class="flex w-full gap-1 flex-row items-center text-text-2">
                        <Icon icon="teenyicons:id-solid" class="size-4.5" />
                        <p class="font-semibold"> UID </p>
                    </span>
                    <span class="flex items-center px-2 text-xs w-full pl-1.5 opacity-65">
                        <p v-if="user?.id" class="">
                            - {{ user?.id }}
                        </p>
                        <Skeleton v-else class="w-25! h-4! rounded!" />
                    </span>
                </span>
                <!-- Discord Id -->
                <span class="w-full flex flex-col items-center gap-1">
                    <span class="flex w-full gap-1 flex-row items-center text-text-2">
                        <Icon icon="ic:baseline-discord" class="size-4.5" />
                        <p class="font-semibold"> Discord ID </p>
                    </span>
                    <span class="flex items-center px-2 text-xs w-full pl-1.5 opacity-65">
                        <p v-if="identity?.id" class="">
                            - {{ identity?.id }}
                        </p>
                        <Skeleton v-else class="w-25! h-4! rounded!" />
                    </span>
                </span>
                <!-- Created At -->
                <span class="w-full flex flex-col items-center gap-1">
                    <span class="flex w-full gap-1 flex-row items-center text-text-2">
                        <Icon icon="tabler:clock-filled" class="size-4.5" />
                        <p class="font-semibold"> Created At </p>
                    </span>
                    <span class="flex items-center px-2 text-xs w-full pl-1.5 opacity-65">
                        <p v-if="user?.created_at" class="">
                            - {{ DateTime.fromISO(user?.created_at, { zone: 'local' })?.toFormat(`D '-' t`) }}
                        </p>
                        <Skeleton v-else class="w-25! h-4! rounded!" />
                    </span>
                </span>
                <!-- Last Sync -->
                <span class="w-full flex flex-col items-center gap-1">
                    <span class="flex w-full gap-1 flex-row items-center text-text-2">
                        <Icon icon="fluent:cloud-sync-16-filled" class="size-4.5" />
                        <p class="font-semibold"> Last Sync </p>
                        <Tooltip placement="right" default_class="size-3.5!" tooltip_class="bg-bg-1 p-3">
                            <template #tip>
                                <div class="flex flex-col max-w-30 sm:max-w-45">
                                    <p class="mb-1">
                                        Last time you synced your individual Discord account data.
                                    </p>
                                    <p class="opacity-70"> Includes things like: </p>
                                    <ul class="w-full list-disc list-outside ml-4">
                                        <li>Username</li>
                                        <li>Icon</li>
                                        <li>Guilds you have access to</li>
                                        <li>Etc.</li>
                                    </ul>
                                </div>
                            </template>
                        </Tooltip>
                    </span>
                    <span class="flex items-center px-2 text-xs w-full pl-1.5 opacity-65">
                        <p v-if="identity?._fetched_at" class="">
                            - {{ DateTime.fromISO(identity?._fetched_at, { zone: 'local' })?.toFormat(`D '-' t`) }}
                        </p>
                        <Skeleton v-else class="w-25! h-4! rounded!" />
                    </span>
                </span>
            </div>

        </div>


        <!-- Actions -->
        <div class="flex-center max-sm:flex-col w-full p-3 gap-4.5 mb-2.25">
            <Button unstyled @click="auth.signOut()" title="Sign Out"
                class="ring-danger-3 gap-0.75 hover:!ring-danger-2 button-outline bg-bg-3! active:scale-95">
                <Icon icon="line-md:logout" class="size-5.5 py-px" />
                Sign Out
            </Button>

            <Button unstyled @click="auth.identity.execute(0, true)" :disabled="isNextRefreshCooldown"
                title="Resync Discord Data"
                class=" gap-0.75 hover:!ring-brand-2 disabled:cursor-not-allowed disabled:!ring-ring-2 disabled:scale-100! button-outline bg-bg-3! active:scale-95">
                <Icon icon="ic:baseline-discord" class="size-4.5 py-px opacity-60" />
                <p class="text-xs opacity-70"> Resync Data </p>
            </Button>

            <span class="w-full flex-center">
                <RouterLink to="/privacy" class="text-text-3 hover:text-info-2 mt-1 hover:underline text-xs">
                    Your Data Rights
                </RouterLink>
            </span>
        </div>

    </div>
</template>


<style scoped></style>