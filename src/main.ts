import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'

// 通用字体
import 'vfonts/Lato.css'

// 路由
import router from './router/index'

const app = createApp(App)
app.use(naive)
app.use(router)
app.mount('#app')
