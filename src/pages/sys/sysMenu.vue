<template>
  <div class="table-content">
    <Table :columns="columns"></Table>
  </div>
</template>
  
<script lang="ts">
import Table, { ColumnType } from "@/components/Table/Index.vue";
import { defineComponent } from "vue";
export default defineComponent({
  components: {
    Table,
  },
  setup() {
    const columns: ColumnType[] = [
      {
        type: "selection",
      },
      {
        title: "姓名",
        key: "name",
        width: 150,
        editor: "string",
      },
      {
        title: "年龄",
        key: "age",
        width: 100,
        editor: "number",
        editorProps: {},
      },
      {
        title: "地址",
        key: "address",
        editor: "string",
      },
    ];

    return { columns };
  },
});
</script>

<style lang="scss">
.table-content {
  height: 100%;
}
</style>