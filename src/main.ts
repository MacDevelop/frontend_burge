import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

import '@fortawesome/fontawesome-free/css/all.min.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Inicializar admin store después de montar la app
import { useAdminStore } from './stores/admin'
const adminStore = useAdminStore()
// No inicializar automáticamente - se hará después del login

app.mount('#app')
