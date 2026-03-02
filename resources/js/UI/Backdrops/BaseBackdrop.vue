<script setup lang="ts">
import {useBackdrop} from "@/composables/ui/useBackdrop.ts";

const {close} = useBackdrop()
</script>

<template>
    <div
        class="base-backdrop"
        @click="close"
    ></div>
</template>

<style scoped lang="scss">
.base-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    display: block;
    width: 100vw;
    height: 100vh;

    background-color: rgba(0, 0, 0, 0.5);
}
</style>
