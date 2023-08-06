import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'

// 通用字体
import 'vfonts/Lato.css'

const app = createApp(App)
app.use(naive)
app.mount('#app')
