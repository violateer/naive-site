import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { profile } from '../base/service'
const Login = () => import('../pages/Auth/Login.vue')
const Index = () => import('../pages/Index.vue')
const routes: Array<RouteRecordRaw> = [
    { path: '/login', name: 'login', component: Login },
    { path: '/', name: 'index', component: Index },
]
const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from) => {
    if (to.name !== 'login') {
        try {
            await profile();
        } catch (error) {
            return { name: 'login' }
        }
    }
})

export default router