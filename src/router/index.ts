import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { getMenu, profile } from '../base/service'
import { useUserStore } from '../store/user'
import { h, Component } from "vue";
import { NIcon } from "naive-ui";
import { arrayToTree } from '../utils/transform';

const Login = () => import('../pages/Auth/Login.vue')
const Index = () => import('../pages/Index.vue')
const sysMenu = () => import('../pages/sys/sysMenu.vue')
const routes: Array<RouteRecordRaw> = [
    { path: '/login', name: 'login', component: Login },
    {
        path: '/', name: 'index', component: Index,
        children: [
            { path: '/sys/sysMenu', name: 'sysMeu', component: sysMenu }
        ]
    },
]
const router = createRouter({
    history: createWebHistory(),
    routes
})

function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) });
}

router.beforeEach(async (to, from) => {
    const userStore = useUserStore();
    if (to.name !== 'login') {
        try {
            const userInfo = await profile();

            // 获取菜单
            const menus = await getMenu();

            // 获取所有icon
            const icons = await import(`@vicons/ionicons5`)

            userStore.$patch(state => {
                state.user = userInfo;
                // @ts-ignore
                state.menus = arrayToTree(menus.map((menu: any) => {
                    // @ts-ignore
                    menu.icon = renderIcon(icons[menu.icon])

                    return menu
                }));
            })

        } catch (error) {
            return { name: 'login' }
        }
    }
})

export default router