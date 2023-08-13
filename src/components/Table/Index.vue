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
  DatePickerEditorType,
  EditorType,
  NumberEditorType,
} from "@/components/Table/TableEdit.vue";
import { DataTableColumn } from "naive-ui";
import { format } from "date-fns";

export interface DataRow {
  key: string;
  [key: string]: any;
}

export type ColumnType = DataTableColumn & {
  title?: string;
  key?: string;
  width?: number;
  editor?: EditorType;
  editorProps?: NumberEditorType | DatePickerEditorType;
  format?: string;
  render?: (row: DataRow) => any;
};

export interface PageLoadProps {
  keyword: string;
  pageIndex: number,
  pageSize: number,
  isTree?: boolean
}

export default defineComponent({
  props: {
    columns: Object as PropType<ColumnType[]>,
    data: Object as PropType<DataRow[]>,
  },
  setup(props) {
    const { columns } = props;
    const data = ref<DataRow[]>(props.data!);
    const page = ref<number>(1);

    // 处理columns
    columns?.forEach((col) => {
      if (col.editor) {
        col.render = (row: any) => {
          const showVal = ref<any>(row[col.key!]);
          if (col.editorProps) {
            switch (col.editor) {
              case "datepicker":
                const editorProps = col.editorProps as DatePickerEditorType;
                showVal.value = format(row[col.key!], editorProps.format!);
                break;
              default:
                break;
            }
          }
          const index = getDataIndex(row.key);
          // @ts-ignore
          return h(TableEdit, {
            editor: col.editor,
            editorProps: col.editorProps,
            value: showVal.value,
            actValue: row[col.key!],
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