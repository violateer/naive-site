<template>
  <div class="table-content">
    <Table :columns="columns" :tableProps="tableProps"></Table>
  </div>
</template>
  
<script lang="ts">
import Table, { ColumnType } from "@/components/Table/Index.vue";
import { defineComponent } from "vue";
export default defineComponent({
  components: {
    Table,
  },
  async setup() {
    const tableProps = {
      keyword: "/nps/menu",
      multiple: true,
      isTree: true,
      cascade: false,
    };

    const columns: ColumnType[] = [
      {
        title: "菜单名称",
        key: "menuName",
        width: 150,
        editor: "string",
        required: true,
      },
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
      {
        title: "序号",
        key: "sequ",
        width: 50,
        editor: "string",
        required: true,
      },
    ];

    return { columns, tableProps };
  },
});
</script>

<style lang="scss">
.table-content {
  height: 100%;
}
</style>