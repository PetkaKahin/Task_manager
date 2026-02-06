<script setup lang="ts">

</script>

<template>
  <div class="auth-layout">
    <slot/>
  </div>
</template>

<style scoped lang="scss">
.auth-layout {
  height: 100vh;
  width: 100vw;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>