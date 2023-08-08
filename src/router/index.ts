import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { getMenu, profile } from '../base/service'

const modules = import.meta.glob('../pages/*/*.vue');

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

// 生成动态路由
const menus = await getMenu();
menus.forEach((menu: any) => {

    let menuComp;
    if (menu.component) {
        menuComp = modules[`../pages${menu.key}.vue`]
    }
    const parenteKey = menus.filter((v: any) => v.id == menu.parentId).length > 0 ? menus.filter((v: any) => v.id == menu.parentId)[0].label : 'index'

    const childRoute = {
        path: menu.key,
        name: menu.label,
        component: menuComp,
        children: []
    }

    router.addRoute(parenteKey, childRoute)
})

router.beforeEach(async (to, _from) => {
    if (to.name !== 'login') {
        try {
            await profile()
        } catch (error) {
            return { name: 'login' }
        }
    }
})

export default router