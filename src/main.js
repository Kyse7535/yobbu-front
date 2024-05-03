import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import vuetify from './plugins/vuetify/index.js'
import router from './router/index.js'
import { createPinia } from 'pinia'

const pinia = createPinia()
createApp(App).use(vuetify).use(router).use(pinia).mount('#app')
