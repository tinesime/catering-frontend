import './assets/tailwind.css'
import router from './router'
import { createApp } from 'vue'
import App from './App.vue'
import store from './store/store'
import api from './interceptor'

const app = createApp(App)

app.config.globalProperties.$api = api

app.use(router).use(store).mount('#app')
