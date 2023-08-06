<template>123</template>
    
  <script lang="ts">
import { defineComponent } from "vue";
import { useMessage } from "naive-ui";

export default defineComponent({
  setup() {
    const message = useMessage();

    window.$message = message;

    return {};
  },
});
</script>