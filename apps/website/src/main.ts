import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import { type PrimeVueConfiguration } from 'primevue'

import { initializeAuthStateWatcher } from './stores/auth'
import { PrimeVueTheme } from './styles/PrimeVueTheme';

const app = createApp(App)

// Plugins
app.use(PrimeVue, <PrimeVueConfiguration>{
    theme: PrimeVueTheme,
    ripple: true
})
app.use(createPinia())
app.use(router)


// Mount App
app.mount('#app')

// Initialize Auth Event Watcher
initializeAuthStateWatcher()
