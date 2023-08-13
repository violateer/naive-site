<template>
  <div class="table-content" ref="loadingBarTargetRef">
    <div class="btn-bar">
      <n-button type="info" size="small" @click="add">新增</n-button>
      <n-button size="small" @click="loadData">刷新</n-button>
      <n-button type="primary" size="small" @click="save">保存</n-button>
    </div>
    <n-data-table
      size="small"
      :key="(row: DataRow) => row.id"
      :columns="columns"
      :data="data"
      :pagination="paginationReactive"
      :on-update:page="handlePageChange"
      :default-expand-all="isTree"
      striped
    />
  </div>
</template>
  
<script lang="ts">
import { h, defineComponent, ref, PropType, reactive } from "vue";
import TableEdit, {
  DatePickerEditorType,
  EditorType,
  NumberEditorType,
} from "@/components/Table/TableEdit.vue";
import { DataTableColumn } from "naive-ui";
import { format } from "date-fns";
import { PageLoad, UpdateList } from "@/base/service";
import * as _ from "lodash";
import { treeToArray } from "@/utils/transform";

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

type TableProps = {
  keyword: string;
  isTree?: boolean;
};

export default defineComponent({
  props: {
    columns: Object as PropType<ColumnType[]>,
    data: Object as PropType<DataRow[]>,
    tableProps: Object as PropType<TableProps>,
  },
  async setup(props) {
    const { columns, tableProps } = props;
    const { isTree = false } = tableProps!;
    const data = ref<DataRow[]>([]);
    const pageIndex = ref<number>(1);
    const pageSize = ref<number>(1);
    const itemCount = ref<number>(0);

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

          // @ts-ignore
          return h(TableEdit, {
            editor: col.editor,
            editorProps: col.editorProps,
            value: showVal.value,
            actValue: row[col.key!],
            onUpdateValue(v: any) {
              setNewData(row.key!, col.key!, v);
            },
          });
        };
      }
    });

    // 编辑树
    const treeEitHelper = (
      key: string,
      colKey: string,
      newVal: any,
      tree = data.value
    ) => {
      return _.flatMap(tree, (node): any => {
        if (node.key === key) {
          node[colKey] = newVal;
          node["_state"] = "modified";
          return node;
        } else {
          treeEitHelper(key, colKey, newVal, node.children);
        }
      });
    };

    const setNewData = (key: string, colKey: string, newVal: any) => {
      if (isTree) {
        treeEitHelper(key, colKey, newVal);
      } else {
        const index = data.value.findIndex((item) => item.key === key);
        data.value[index][colKey] = newVal;
        data.value[index]["_state"] = "modified";
      }
    };

    // 查询
    const loadData = async () => {
      // 处理data
      const { data: ResData, totalCount } = await PageLoad({
        keyword: `${tableProps?.keyword!}${isTree ? "/tree" : ""}`,
        pageIndex: pageIndex.value,
        pageSize: pageSize.value,
      });

      data.value = ResData;
      itemCount.value = totalCount;
      // paginationReactive.itemCount = totalCount;
    };

    // 保存
    const save = () => {
      const _data = isTree ? treeToArray(data.value) : data.value;
      const modifieds = _data.filter((v: any) => v._state === "modified");
      const addeds = _data.filter((v: any) => v._state === "added");
      console.log(modifieds, addeds);

      if (modifieds.length > 0) {
        UpdateList({
          keyword: tableProps?.keyword!,
          list: modifieds,
        });
      }
    };

    // 新增
    const add = () => {};

    // 分页
    const handlePageChange = (curPage: number) => {
      pageIndex.value = curPage;
      loadData();
    };

    const paginationReactive = reactive({
      page: pageIndex.value,
      pageSize: pageSize.value,
      itemCount: itemCount.value,
      onChange: (page: number) => {
        paginationReactive.page = page;
        loadData();
      },
      onUpdatePageSize: (pageSize: number) => {
        paginationReactive.pageSize = pageSize;
        paginationReactive.page = 1;
        loadData();
      },
    });

    loadData();

    return {
      data,
      isTree,
      paginationReactive,
      handlePageChange,
      columns,
      save,
      add,
      loadData,
    };
  },
});
</script>

<style lang="scss">
.table-content {
  .btn-bar {
    padding: 5px 0;

    .n-button {
      margin-right: 5px;
    }
  }
}
</style>