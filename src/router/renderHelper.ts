import { NIcon } from "naive-ui";
import { Component, h } from "vue";
import router from ".";
import { getMenu, profile } from "../base/service";
import { useUserStore } from "../store/user";
import { arrayToTree } from "../utils/transform";

export const RenderHelper = async (toPath = "/") => {
    const modules = import.meta.glob("/src/pages/*/*.vue");
    const { data: menus } = await getMenu();

    // 生成动态路由
    if (router.getRoutes().length == 2) {
        menus.forEach((menu: any) => {
            let menuComp;
            if (menu.component) {
                menuComp = modules[`/src/pages${menu.key}.vue`];
            }
            const parenteKey =
                menus.filter((v: any) => v.id == menu.parentId).length > 0
                    ? menus.filter((v: any) => v.id == menu.parentId)[0].label
                    : "index";

            const childRoute = {
                path: menu.key,
                name: menu.label,
                component: menuComp,
                children: [],
            };

            router.addRoute(parenteKey, childRoute);
        });

        console.log(router.getRoutes());


        router.replace(toPath)
    }


    // 生成菜单
    function renderIcon(icon: Component) {
        return () => h(NIcon, null, { default: () => h(icon) });
    }

    const icons = await import(`@vicons/ionicons5`);
    const userStore = useUserStore();
    const userInfo = await profile();
    userStore.$patch((state) => {
        state.user = userInfo;

        // @ts-ignore
        state.menus = arrayToTree(
            menus.map((menu: any) => {
                // @ts-ignore
                menu.icon = renderIcon(icons[menu.icon]);

                return menu;
            })
        );
    });
}