<script lang="ts" setup>

    const viewTime = ref(0)
    const timerRef = ref<NodeJS.Timeout>()


    onMounted(() => {
        const interval = setInterval(() => viewTime.value += 1, 1_000)
        timerRef.value = interval
    })

    onUnmounted(() => {
        if (timerRef.value) {
            clearInterval(timerRef.value)
        }
        viewTime.value = 0
    })

</script>


<template>
    <main class="flex-center w-full h-full grow m-auto">
        <div class="flex-center flex-col bg-bg-2 p-4 gap-2 max-w-[80dvw] rounded-md border-2 border-ring-2">
            <ProgressSpinner stroke-width="3.5" />
            <p class="text-lg font-semibold mt-1.5"> Loading Dashboard </p>
            <p v-if="viewTime < 10" class="text-xs text-text-2 px-4"> Please wait while we fetch your data...</p>

            <!-- Still Not Loaded - Info -->
            <Transition name="blur-fade">
                <div v-if="viewTime >= 10"
                    class="m-5 bg-bg-3 border-2 border-ring-1 rounded-lg p-3 flex-center flex-col gap-1 text-sm text-center">
                    <p class="text-[16px] font-bold text-warning-2"> Still Not Loading?</p>
                    <p class="text-text-2 text-xs"> It's possible your account data is no longer accessible... </p>
                    <span>
                        Try signing
                        out and
                        back into <RouterLink to="/account" class="text-info-1 hover:underline">your account
                        </RouterLink>
                    </span>
                </div>
            </Transition>
        </div>
    </main>
</template>


<style scoped></style>