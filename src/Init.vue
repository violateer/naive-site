<template>
  <slot> </slot>
</template>

<script lang="ts">
import { NIcon, useMessage } from "naive-ui";
import { Component, defineComponent, h } from "vue";
import { profile, getMenu } from "./base/service";
import { useUserStore } from "./store/user";
import { arrayToTree } from "./utils/transform";

export default defineComponent({
  async setup() {
    const message = useMessage();
    window.$message = message;

    function renderIcon(icon: Component) {
      return () => h(NIcon, null, { default: () => h(icon) });
    }

    const icons = await import(`@vicons/ionicons5`);
    const userStore = useUserStore();
    const userInfo = await profile();
    const menus = await getMenu();
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
  },
});
</script>