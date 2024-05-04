import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import vuetify from './plugins/vuetify/index.js'
import router from './router/index.js'
import { createPinia } from 'pinia'
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css";

const pinia = createPinia()
createApp(App).use(vuetify).use(router).use(pinia).use(Toast, {maxToasts:5}).mount('#app')
