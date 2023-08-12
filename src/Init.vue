<template>
  <slot> </slot>
</template>

<script lang="ts">
import { useMessage, useLoadingBar } from "naive-ui";
import { defineComponent } from "vue";

export default defineComponent({
  async setup() {
    const message = useMessage();
    window.$message = message;

    const loadingBar = useLoadingBar();
    window.$loadingBar = loadingBar;
  },
});
</script>