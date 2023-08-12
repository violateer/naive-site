<script lang="ts">
import { NInput, NInputNumber } from "naive-ui";
import { defineComponent, ref, nextTick, h, PropType, markRaw } from "vue";

export type EditorType =
  | "string"
  | "number"
  | "datepicker"
  | "mothpicker"
  | "timepicker"
  | "combobox";

type onUpdateValueType = (row: any) => void;

export interface NumberEditorType {
  precision?: string;
  format?: (value: number | null) => string;
  validator?: (value: number) => boolean;
  min?: string;
  max?: string;
}

export default defineComponent({
  props: {
    editor: String as PropType<EditorType>,
    value: [String, Number],
    onUpdateValue: Function as PropType<onUpdateValueType>,
  },
  setup(props) {
    const isEdit = ref(false);

    const inputRef = ref();
    const inputValue = ref(props.value);
    function handleOnClick() {
      isEdit.value = true;
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

        default:
          editEl.value = markRaw(NInput);
          break;
      }

      return h(
        "div",
        {
          style: "min-height: 22px",
          onClick: handleOnClick,
        },
        isEdit.value
          ? h(editEl.value, {
              ref: inputRef,
              value: inputValue.value,
              "onUpdate:value": (v: any) => {
                inputValue.value = v;
                handleChange();
              },
              onBlur: () => {
                isEdit.value = false;
              },
            })
          : props.value
      );
    };

    return hE;
  },
});
</script>