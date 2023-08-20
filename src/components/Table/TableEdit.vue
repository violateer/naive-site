<script lang="ts">
import { NInput, NInputNumber, NSelect } from "naive-ui";
import { NDatePicker } from "naive-ui/lib";
import { defineComponent, ref, nextTick, h, PropType, markRaw } from "vue";

export type EditorType =
  | "string"
  | "number"
  | "datepicker"
  | "mothpicker"
  | "timepicker"
  | "combobox";

type onUpdateValueType = (row: any) => void;
type setIsEditType = (val: boolean) => void;

export interface NumberEditorType {
  precision?: string;
  validator?: (value: number) => boolean;
  min?: string;
  max?: string;
}

export interface DatePickerEditorType {
  type?: string;
  format?: string;
}

interface ComboboxEditorOptionType {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface ComboboxEditorType {
  options: ComboboxEditorOptionType[];
}

export default defineComponent({
  props: {
    editor: String as PropType<EditorType>,
    editorProps: Object as PropType<NumberEditorType> | Object as
      | PropType<DatePickerEditorType>
      | Object as PropType<ComboboxEditorType>,
    value: [String, Number],
    actValue: [String, Number],
    onUpdateValue: Function as PropType<onUpdateValueType>,
    setIsEdit: Function as PropType<setIsEditType>,
  },
  setup(props) {
    const isEdit = ref(false);

    const inputRef = ref();
    const inputValue = ref(props.actValue);
    function handleOnClick() {
      isEdit.value = true;
      props.setIsEdit?.(isEdit.value);
      nextTick(() => {
        inputRef.value.focus();
      });
    }
    function handleChange() {
      props?.onUpdateValue?.(inputValue.value);
    }

    const hE = () => {
      const editEl = ref();
      switch (props.editor) {
        case "string":
          editEl.value = markRaw(NInput);
          break;
        case "number":
          editEl.value = markRaw(NInputNumber);
          break;
        case "datepicker":
          editEl.value = markRaw(NDatePicker);
          break;
        case "combobox":
          editEl.value = markRaw(NSelect);
          inputValue.value = props.value;
          break;
        default:
          editEl.value = markRaw(NInput);
          break;
      }

      return h(
        "div",
        {
          style: "min-height: 22px;display: inline-block;min-width:7rem;",
          onClick: handleOnClick,
        },
        isEdit.value
          ? h(editEl.value, {
              ...props.editorProps,
              ref: inputRef,
              value: inputValue.value,
              "onUpdate:value": (v: any) => {
                inputValue.value = v;

                handleChange();
              },
              onBlur: () => {
                isEdit.value = false;
                props.setIsEdit?.(isEdit.value);
              },
            })
          : props.value
      );
    };

    return hE;
  },
});
</script>