import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { profile } from '../base/service'
import { RenderHelper } from './renderHelper'

const Login = () => import('../pages/Auth/Login.vue')
const Index = () => import('../pages/Index.vue')
const routes: Array<RouteRecordRaw> = [
    { path: '/login', name: 'login', component: Login },
    { path: '/', name: 'index', component: Index, },
]
const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from) => {
    window.$loadingBar?.start()
    if (to.name !== 'login') {
        try {
            await profile()
            await RenderHelper(to.fullPath)
        } catch (error) {
            return { name: 'login' }
        }
    }
})

router.afterEach((to: any) => {
    window.$loadingBar?.finish();
})

export default router