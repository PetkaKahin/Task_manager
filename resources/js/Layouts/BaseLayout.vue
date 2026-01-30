<script setup lang="ts">

import Header from "@/Blocks/Header.vue";
</script>

<template>
    <div class="base-layout">
        <Header/>
        <slot/>
    </div>
</template>

<style lang="scss">
@use "@scss/base";
</style>
