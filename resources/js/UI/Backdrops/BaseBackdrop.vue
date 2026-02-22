<script setup lang="ts">
import {useBackdrop} from "@/composables/ui/useBackdrop.ts";

const {isVisible, closeLast, currentZIndex} = useBackdrop()

function close() {
    closeLast()
}
</script>

<template>
    <div
        class="base-backdrop"
        :class="{'base-backdrop--visible' : isVisible}"
        :style="{ zIndex: currentZIndex }"
        @click="close"
    ></div>
</template>

<style scoped lang="scss">
.base-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;

    display: none;
    width: 100vw;
    height: 100vh;

    background-color: rgba(0, 0, 0, 0.5);

    &--visible {
        display: block;
    }
}
</style>
