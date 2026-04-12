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
  <span class="block w-full" :style="{ height: headerHeight }" />

  <RouterView />

  <AppFooter />

</template>

<style scoped></style>
