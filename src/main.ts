import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'
import { createPinia } from 'pinia'

// 通用字体
import 'vfonts/Lato.css'

// 路由
import router from './router/index'

const app = createApp(App)
const pinia = createPinia();
app.use(pinia)
app.use(naive)
app.use(router)
app.mount('#app')
