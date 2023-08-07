<template>
  <n-space vertical>
    <n-layout has-sider>
      <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="240" :collapsed="collapsed" show-trigger @collapse="collapsed = true" @expand="collapsed = false">
        <n-menu v-model:value="activeKey" :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions" accordion />
      </n-layout-sider>
      <n-layout>
        <span>内容</span>
      </n-layout>
    </n-layout>
  </n-space>
</template>
    
<script lang="ts">
import { defineComponent, h, ref, Component } from 'vue'
import { useMessage } from 'naive-ui'
import { NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { BookOutline as BookIcon } from '@vicons/ionicons5'

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
  {
    label: '且听风吟',
    key: 'hear-the-wind-sing',
    icon: renderIcon(BookIcon),
  },
  {
    label: '1973年的弹珠玩具',
    key: 'pinball-1973',
    icon: renderIcon(BookIcon),
    children: [
      {
        label: '鼠',
        key: 'rat',
      },
    ],
  },
  {
    label: '寻羊冒险记',
    key: 'a-wild-sheep-chase',
    icon: renderIcon(BookIcon),
  },
]

export default defineComponent({
  setup() {
    const message = useMessage()

    window.$message = message

    return {
      activeKey: ref<string | null>(null),
      collapsed: ref(true),
      menuOptions,
    }
  },
})
</script>