<script lang="ts" setup>
    import { useLayoutStore } from '@/stores/layout';


    const nav = useLayoutStore()

</script>


<template>
    <main class="flex w-full grow overflow-auto">

        <section class="w-full flex-center flex-col gap-2 p-4">
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
                <button class="button-success">
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
                <button class="button-info">
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
                <button class="button-warning">
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
                <button class="button-danger">
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