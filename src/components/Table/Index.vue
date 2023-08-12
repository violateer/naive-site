<template>
  <div>
    <div class="btn-bar">
      <n-button type="primary" size="small" @click="save">保存</n-button>
    </div>
    <n-data-table
      size="small"
      :key="(row: DataRow) => row.id"
      :columns="columns"
      :data="data"
      :pagination="paginationRef"
      :on-update:page="handlePageChange"
      striped
    />
  </div>
</template>
  
<script lang="ts">
import { h, defineComponent, ref, computed, PropType } from "vue";
import TableEdit, {
  EditorType,
  NumberEditorType,
} from "@/components/Table/TableEdit.vue";
import { DataTableColumn } from "naive-ui";

interface DataRow {
  key: string;
  [key: string]: any;
}

export type ColumnType = DataTableColumn & {
  title?: string;
  key?: string;
  width?: number;
  editor?: EditorType;
  editorProps?: NumberEditorType;
  format?: string;
  render?: (row: DataRow) => any;
};

const createData = () =>
  Array.from({ length: 100 }).map((_, index) => ({
    key: index + "",
    name: `John Brown ${index}`,
    age: (Math.random() * 40) | 0,
    address: `New York No. ${index} Lake Park`,
  }));

export default defineComponent({
  props: {
    columns: Object as PropType<ColumnType[]>,
  },
  setup(props) {
    const { columns } = props;
    const data = ref<DataRow[]>(createData());
    const page = ref<number>(1);

    // 处理columns
    columns?.forEach((col) => {
      if (col.editor) {
        col.render = (row: any) => {
          const index = getDataIndex(row.key);
          return h(TableEdit, {
            editor: col.editor,
            value: row[col.key!],
            onUpdateValue(v: any) {
              data.value[index][col.key!] = v;
              data.value[index]["_state"] = "modified";
            },
          });
        };
      }
    });

    const getDataIndex = (key: string) => {
      return data.value.findIndex((item) => item.key === key);
    };
    const handlePageChange = (curPage: number) => {
      page.value = curPage;
    };

    const paginationRef = computed(() => ({
      pageSize: 20,
      page: page.value,
    }));

    // 保存
    const save = () => {
      const modifieds = data.value.filter((v) => v._state === "modified");
      const addeds = data.value.filter((v) => v._state === "added");
      console.log(modifieds[0], addeds);
    };

    return {
      data,
      paginationRef,
      handlePageChange,
      columns,
      save,
    };
  },
});
</script>

<style lang="scss">
.btn-bar {
  padding: 5px 0;
}

.n-data-table {
  height: 100%;
}
</style>