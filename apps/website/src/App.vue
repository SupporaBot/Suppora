<script setup lang="ts">
  import type { MaybeElementRef } from '@vueuse/core';
  import AppFooter from './components/AppFooter.vue';
  import AppHeader from './components/AppHeader.vue';
  import { useLayoutStore } from './stores/layout';

  // Services:
  const nav = useLayoutStore()
  const headerHeight = computed(() => `${nav.appHeader.currentHeight}px`)

</script>

<template>

  <AppHeader />
  <AppNavigation />
  <div class="block w-full" :style="{ height: headerHeight }" />

  <RouterView v-slot="{ Component }">
    <Transition name="blur-fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>


  <AppFooter />

</template>

<style scoped>

  @reference "@/styles/main.css";

  .router-leave-to,
  .router-enter-from {
    @apply blur-xs;
    opacity: 0;
  }

  .router-enter-to,
  .router-leave-from {
    @apply blur-none;
    opacity: 1;
  }

  .router-enter-active,
  .router-leave-active {
    transition: all ease 0.23s;
  }


</style>
