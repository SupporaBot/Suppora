import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import { type PrimeVueConfiguration } from 'primevue'
import { PrimeVueTheme } from './styles/PrimeVueTheme';
import ConfirmationService from 'primevue/confirmationservice';

import { initializeAuthStateWatcher } from './stores/auth'


const app = createApp(App)

// Plugins
app.use(PrimeVue, <PrimeVueConfiguration>{
    theme: PrimeVueTheme,
    ripple: true
})
app.use(createPinia())
app.use(ConfirmationService),
    app.use(router)


// Mount App
app.mount('#app')

// Initialize Auth Event Watcher
initializeAuthStateWatcher()
