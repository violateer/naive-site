<template>
  <n-space vertical>
    <n-layout has-sider>
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <n-menu
          v-model:value="activeKey"
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
          @update:value="ClickMenu"
          accordion
        />
      </n-layout-sider>
      <n-layout>
        <div class="content">
          <router-view></router-view>
        </div>
      </n-layout>
    </n-layout>
  </n-space>
</template>
    
<script lang="ts">
import { defineComponent, ref } from "vue";
import type { MenuOption } from "naive-ui";
import { useUserStore } from "../store/user";
import router from "../router/index";

export default defineComponent({
  setup() {
    const userStore = useUserStore();
    const activeKey = ref<string | null>(null);
    const collapsed = ref(false);

    const menuOptions: MenuOption[] = userStore.getMenu;

    const ClickMenu = (key: string, item: MenuOption) => {
      if (item.component) {
        router.push(key);
      }

      return [item];
    };

    return {
      activeKey,
      collapsed,
      menuOptions,
      userStore,
      ClickMenu,
    };
  },
});
</script>

<style lang="scss">
.content {
  padding: 1rem;
  height: calc(100vh - 2rem);
}
</style>