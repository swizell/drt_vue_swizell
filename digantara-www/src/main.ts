import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { vuetify } from './plugins/vuetify'
import { store } from './store'
import { router } from './router' 

createApp(App).use(router).use(vuetify).use(store).mount('#app')
