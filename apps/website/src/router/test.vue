<script lang="ts" setup>
    import Tooltip from '@/components/Tooltip.vue';
    import { useLayoutStore } from '@/stores/layout';
    import { ApiRequest } from '@/utils/api';
    import { asyncState } from '@/utils/asyncState';


    const nav = useLayoutStore()

    const fetchTest = asyncState(() => ApiRequest({ url: '/system/status', method: 'GET' }), {
        cooldown: 5
    })
    const fetchData = computed(() => fetchTest.state.value)

</script>


<template>
    <main class="flex-center w-full grow overflow-auto">

        <!-- Brand Colors -->
        <span class="w-full flex-center p-4 gap-4">
            <div class="w-45 h-25 bg-brand-1">
                Brand 1
            </div>
            <div class="w-45 h-25 bg-brand-2">
                Brand 2
            </div>
            <div class="w-45 h-25 bg-brand-3">
                Brand 3
            </div>
            <div class="w-45 h-25 bg-brand-4">
                Brand 4
            </div>
            <div class="w-45 h-25 bg-brand-5">
                Brand 5
            </div>
        </span>


        <!-- Async State - Test -->
        <div hidden>
            Fetch Test:
            <button @click="async () => await fetchTest.get()" class="button-base">
                Fetch
            </button>
            <button @click="console.log(fetchTest.meta.cooldown_secs_remaining())" class="button-base">
                Remaining Cooldown
            </button>
            <span>
                Data: {{ !!fetchData }}
                Loading: {{ fetchTest.loading.value }}
                Ready: {{ fetchTest.ready.value }}

                Count: {{ fetchTest.meta.count }}
                Last Fetched: {{ fetchTest.meta.last_fetched_at?.toISO() }}
            </span>


        </div>

        <!-- Button Testing -->
        <section hidden class="w-full flex-center flex-col gap-2 p-4">
            <p class="w-full font-bold text-sm uppercase">
                Button Bases
            </p>

            <span class="w-full flex-center gap-2">
                <button class="button-base">
                    Regular
                </button>

                <button class="button-outline">
                    Outline
                </button>

                <button class="button-dynamic">
                    Dynamic
                </button>
            </span>


            <span class="w-full flex-center gap-2">
                <button class="button-success button-base">
                    Success
                </button>

                <button class="button-success button-outline">
                    Success
                </button>

                <button class="button-success button-dynamic">
                    Success
                </button>
            </span>


            <span class="w-full flex-center gap-2">
                <button class="button-info button-base">
                    Info
                </button>

                <button class="button-info button-outline">
                    Info
                </button>

                <button class="button-info button-dynamic">
                    Info
                </button>
            </span>

            <span class="w-full flex-center gap-2">
                <button class="button-warning button-base">
                    Warning
                </button>

                <button class="button-warning button-outline">
                    Warning
                </button>

                <button class="button-warning button-dynamic">
                    Warning
                </button>
            </span>

            <span class="w-full flex-center gap-2">
                <button class="button-danger button-base">
                    Danger
                </button>

                <button class="button-danger button-outline">
                    Danger
                </button>

                <button class="button-danger button-dynamic">
                    Danger
                </button>
            </span>



            <span class="w-full flex-center gap-4 p-4">

                <div class="w-full flex-center gap-4 p-4">
                    <span class="bg-brand-1 aspect-square rounded size-15 text-wrap flex-center">
                        Brand 1
                    </span>
                    <span class="bg-brand-2 aspect-square rounded size-15 text-wrap flex-center">
                        Brand 2
                    </span>
                    <span class="bg-brand-3 aspect-square rounded size-15 text-wrap flex-center">
                        Brand 3
                    </span>
                </div>

                <div class="w-full flex-center gap-4 p-4">
                    <span class="bg-success-1 aspect-square rounded size-15 text-wrap flex-center">
                        Success 1
                    </span>
                    <span class="bg-success-2 aspect-square rounded size-15 text-wrap flex-center">
                        Success 2
                    </span>
                    <span class="bg-success-3 aspect-square rounded size-15 text-wrap flex-center">
                        Success 3
                    </span>
                </div>

                <div class="w-full flex-center gap-4 p-4">
                    <span class="bg-info-1 aspect-square rounded size-15 text-wrap flex-center">
                        Info 1
                    </span>
                    <span class="bg-info-2 aspect-square rounded size-15 text-wrap flex-center">
                        Info 2
                    </span>
                    <span class="bg-info-3 aspect-square rounded size-15 text-wrap flex-center">
                        Info 3
                    </span>
                </div>

                <div class="w-full flex-center gap-4 p-4">
                    <span class="bg-warning-1 aspect-square rounded size-15 text-wrap flex-center">
                        Warning 1
                    </span>
                    <span class="bg-warning-2 aspect-square rounded size-15 text-wrap flex-center">
                        Warning 2
                    </span>
                    <span class="bg-warning-3 aspect-square rounded size-15 text-wrap flex-center">
                        Warning 3
                    </span>
                </div>

                <div class="w-full flex-center gap-4 p-4">
                    <span class="bg-danger-1 aspect-square rounded size-15 text-wrap flex-center">
                        Danger 1
                    </span>
                    <span class="bg-danger-2 aspect-square rounded size-15 text-wrap flex-center">
                        Danger 2
                    </span>
                    <span class="bg-danger-3 aspect-square rounded size-15 text-wrap flex-center">
                        Danger 3
                    </span>
                </div>

            </span>


            <span class="flex-center p-4 gap-4">

                <button class="button-base">
                    Cancel
                </button>

                <button class="button-success button-outline">
                    Submit
                </button>

            </span>

        </section>

    </main>
</template>


<style scoped>
    @reference "@/styles/main.css";
</style>