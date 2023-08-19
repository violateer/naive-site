<template>
  <div class="table-content">
    <Table :columns="columns" :data="data" :tableProps="tableProps"></Table>
  </div>
</template>
  
<script lang="ts">
import Table, { ColumnType, DataRow } from "@/components/Table/Index.vue";
import { defineComponent, ref } from "vue";
export default defineComponent({
  components: {
    Table,
  },
  async setup() {
    const createData = () =>
      Array.from({ length: 100 }).map((_, index) => ({
        key: index + "",
        name: `John Brown ${index}`,
        age: (Math.random() * 40) | 0,
        regdate: new Date().getTime(),
        address: `New York No. ${index} Lake Park`,
      }));
    const data = ref<DataRow[]>(createData());

    const tableProps = {
      keyword: "/nps/menu",
      multiple: true,
      isTree: true,
    };

    const columns: ColumnType[] = [
      { title: "菜单名称", key: "menuName", width: 150, editor: "string" },
      { title: "组件路径", key: "component", width: 100, editor: "string" },
      { title: "路由路径", key: "path", width: 100, editor: "string" },
      { title: "图标", key: "menuIcon", width: 100, editor: "string" },
      {
        title: "权限",
        key: "menuRole",
        width: 100,
        editor: "combobox",
        editorProps: {
          options: [
            {
              label: "管理员",
              value: "0",
            },
            {
              label: "开发者",
              value: "1",
            },
            {
              label: "游客",
              value: "2",
            },
          ],
        },
      },
    ];

    return { columns, data, tableProps };
  },
});
</script>

<style lang="scss">
.table-content {
  height: 100%;
}
</style>