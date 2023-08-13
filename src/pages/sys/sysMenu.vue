<template>
  <div class="table-content">
    <Table :columns="columns" :data="data"></Table>
  </div>
</template>
  
<script lang="ts">
import Table, { ColumnType, DataRow } from "@/components/Table/Index.vue";
import { defineComponent, ref } from "vue";
export default defineComponent({
  components: {
    Table,
  },
  setup() {
    const createData = () =>
      Array.from({ length: 100 }).map((_, index) => ({
        key: index + "",
        name: `John Brown ${index}`,
        age: (Math.random() * 40) | 0,
        regdate: new Date().getTime(),
        address: `New York No. ${index} Lake Park`,
      }));
    const data = ref<DataRow[]>(createData());

    const columns: ColumnType[] = [
      { type: "selection" },
      { title: "姓名", key: "name", width: 150, editor: "string" },
      { title: "年龄", key: "age", width: 100, editor: "number" },
      { title: "地址", key: "address", width: 300, editor: "string" },
      {
        title: "注册日期",
        key: "regdate",
        width: 100,
        editor: "datepicker",
        editorProps: {
          type: "date",
          format: "yyyy-MM-dd",
        },
      },
    ];

    return { columns, data };
  },
});
</script>

<style lang="scss">
.table-content {
  height: 100%;
}
</style>