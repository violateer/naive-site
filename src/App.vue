<script setup lang="ts">
import Init from "./Init.vue";
console.log(123);
</script>

<template>
  <n-message-provider>
    <n-dialog-provider>
      <n-loading-bar-provider>
        <Suspense>
          <Init>
            <router-view></router-view>
          </Init> </Suspense
      ></n-loading-bar-provider>
    </n-dialog-provider>
  </n-message-provider>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
