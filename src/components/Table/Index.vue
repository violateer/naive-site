<template>
  <div class="table-content" ref="loadingBarTargetRef">
    <div class="btn-bar">
      <n-button type="info" size="small" @click="add">新增</n-button>
      <n-button type="error" size="small" @click="dele">删除</n-button>
      <n-button type="primary" size="small" @click="save">保存</n-button>
      <n-button size="small" @click="loadData">刷新</n-button>
    </div>
    <n-data-table
      size="small"
      :remote="true"
      :key="(row: DataRow) => row.id"
      :columns="columns"
      :data="data"
      :cascade="cascade"
      :multiple="multiple"
      :default-expand-all="isTree"
      :row-props="rowProps"
      :row-key="rowKey"
      :row-class-name="rowClassName"
      :checked-row-keys="checkedRowKeysRef"
      max-height="calc(100vh - 133px)"
      striped
    />
    <div class="pagination-content">
      <n-pagination
        v-if="!isTree"
        :page-size="pageSize"
        :item-count="itemCount"
        :on-update:page="handlePageChange"
      />
    </div>
  </div>
</template>
  
<script lang="ts">
import { h, defineComponent, ref, PropType } from "vue";
import TableEdit, {
  ComboboxEditorType,
  DatePickerEditorType,
  EditorType,
  NumberEditorType,
} from "@/components/Table/TableEdit.vue";
import { DataTableColumn, DataTableRowKey } from "naive-ui";
import { format } from "date-fns";
import { DeleteList, InsertList, PageLoad, UpdateList } from "@/base/service";
import * as _ from "lodash";
import { treeToArray } from "@/utils/transform";
import { RowData } from "naive-ui/es/data-table/src/interface";
import { v4 as uuidv4 } from "uuid";

export interface DataRow {
  key: string;
  [key: string]: any;
}

export type ColumnType = DataTableColumn & {
  title?: string;
  key?: string;
  width?: number;
  editor?: EditorType;
  editorProps?: NumberEditorType | DatePickerEditorType | ComboboxEditorType;
  required?: boolean;
  format?: string;
  render?: (row: DataRow) => any;
};

type TableProps = {
  keyword: string;
  isTree?: boolean;
  cascade?: boolean;
  multiple?: boolean;
  pageIndex?: number;
  pageSize?: number;
};

export default defineComponent({
  props: {
    columns: Object as PropType<ColumnType[]>,
    tableProps: Object as PropType<TableProps>,
  },
  async setup(props) {
    const { columns, tableProps } = props;
    const {
      isTree = false,
      multiple = false,
      pageIndex: propPageIndex = 1,
      pageSize: propPageSize = 25,
      cascade = true,
    } = tableProps!;
    const data = ref<DataRow[]>([]);
    const pageIndex = ref<number>(propPageIndex);
    const pageSize = ref<number>(propPageSize);
    const itemCount = ref<number>(0);
    const rowKey = (row: DataRow) => row.key;
    const checkedRowKeysRef = ref<DataTableRowKey[]>([]);
    const isEdit = ref<boolean>(false);
    const setIsEdit = (val: boolean) => (isEdit.value = val);

    if (
      multiple &&
      columns?.filter((v) => v.type === "selection").length === 0
    ) {
      columns?.unshift({ type: "selection" });
    }

    // 处理columns
    columns?.forEach((col) => {
      if (col.editor) {
        col.render = (row: any) => {
          const showVal = ref<any>(row[col.key!]);
          if (col.editorProps) {
            let editorProps;
            switch (col.editor) {
              case "datepicker":
                editorProps = col.editorProps as DatePickerEditorType;
                showVal.value = format(row[col.key!], editorProps.format!);
                break;
              case "combobox":
                editorProps = col.editorProps as ComboboxEditorType;
                showVal.value = editorProps.options.filter(
                  (v) => v.value === String(row[col.key!])
                )[0]?.label;
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
            setIsEdit,
            onUpdateValue(v: any) {
              setNewData(row.key!, col.key!, v);
            },
          });
        };
      }
    });

    // 新增树
    const treeAddHelper = (
      parentId: string,
      newRow: DataRow,
      tree = data.value
    ) => {
      const parentNode = _.find(tree, { key: parentId });

      if (parentNode) {
        if (parentNode.children) {
          parentNode.children.push(newRow);
        } else {
          parentNode.children = [{ ...newRow }];
        }
      } else {
        // 如果找不到父节点，可以选择在根节点下添加
        tree.push(newRow);
      }
    };

    // 新增
    const add = () => {
      const select = checkedRowKeysRef.value.length
        ? treeToArray(data.value).filter(
            (v: DataRow) => v.key === checkedRowKeysRef.value[0]
          )[0]
        : null;
      const newID = uuidv4();
      let newRow: DataRow = {
        id: newID,
        key: newID,
        _state: "added",
      };

      if (isTree) {
        newRow.parentId = select
          ? select.id
          : "00000000-0000-0000-0000-000000000000";
        if (select) {
          treeAddHelper(select.id, newRow);
        } else {
          data.value.push(newRow);
        }
      } else {
        data.value.push(newRow);
      }

      console.log(data.value);
    };

    // 编辑树
    const treeEditHelper = (
      key: string,
      colKey: string,
      newVal: any,
      tree = data.value
    ) => {
      return _.flatMap(tree, (node): any => {
        if (node.key === key) {
          node[colKey] = newVal;
          node["_state"] = node["_state"] ? node["_state"] : "modified";
          return node;
        } else {
          if (node.children) {
            treeEditHelper(key, colKey, newVal, node.children);
          }
        }
      });
    };

    const setNewData = (key: string, colKey: string, newVal: any) => {
      if (isTree) {
        treeEditHelper(key, colKey, newVal);
      } else {
        const index = data.value.findIndex((item) => item.key === key);
        data.value[index][colKey] = newVal;
        data.value[index]["_state"] = data.value[index]["_state"]
          ? data.value[index]["_state"]
          : "modified";
      }
    };

    const rowClassName = (row: RowData) => {
      return checkedRowKeysRef.value.includes(row.key) ? "active" : "";
    };

    // 点击行事件
    const rowProps = (row: RowData) => {
      return {
        onClick: () => {
          if (!isEdit.value) {
            if (!multiple) {
              // 单选
              checkedRowKeysRef.value = [row.key];
            } else {
              // 多选
              if (checkedRowKeysRef.value.includes(row.key)) {
                checkedRowKeysRef.value = checkedRowKeysRef.value.filter(
                  (v) => v !== row.key
                );
              } else {
                checkedRowKeysRef.value.push(row.key);
              }
            }
          }
        },
      };
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
      checkedRowKeysRef.value = [];
    };

    // 保存
    const save = async () => {
      const _data = isTree ? treeToArray(data.value) : data.value;
      const modifieds = _data.filter((v: any) => v._state === "modified");
      const addeds = _data.filter((v: any) => v._state === "added");

      let isValid = true;
      for (let i = 0; i < columns!.length; i++) {
        const col = columns![i];
        if (col.required && _data.filter((v: DataRow) => !v[col.key!]).length) {
          window.$message.warning(`${col.title}必填!`);
          isValid = false;
          break;
        }
      }

      if (!isValid) return;

      if (modifieds.length > 0) {
        UpdateList({
          keyword: tableProps?.keyword!,
          list: modifieds,
        });
      }

      if (addeds.length > 0) {
        await InsertList({
          keyword: tableProps?.keyword!,
          list: addeds,
        });
        loadData();
      }
    };

    // 删除
    const dele = async () => {
      await DeleteList({
        keyword: tableProps?.keyword!,
        list: checkedRowKeysRef.value,
      });
      loadData();
    };

    // 分页
    const handlePageChange = (curPage: number) => {
      pageIndex.value = curPage;
      loadData();
    };

    loadData();

    return {
      data,
      isTree,
      cascade,
      multiple,
      pageIndex,
      pageSize,
      itemCount,
      handlePageChange,
      columns,
      save,
      add,
      dele,
      loadData,
      rowProps,
      rowKey,
      rowClassName,
      checkedRowKeysRef,
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

  .pagination-content {
    width: calc(100% - 5px);
    display: flex;
    justify-content: end;
    padding: 5px;
  }

  tr.active {
    td {
      background: rgba(24, 160, 88, 0.1) !important;
    }
  }
}
</style>