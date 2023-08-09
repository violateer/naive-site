<template>
  <slot> </slot>
</template>

<script lang="ts">
import { useMessage } from "naive-ui";
import { defineComponent } from "vue";

export default defineComponent({
  async setup() {
    const message = useMessage();
    window.$message = message;
  },
});
</script>