<script setup lang="ts">
import {useModal} from "@/composables/ui/useModal.ts";

const {isOpen} = useModal();
</script>

<template>
    <div class="base-modal" v-if="isOpen">
        <slot/>
    </div>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

.base-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;

    padding: 20px;
    background-color: colors.$bg-elevated;
    border: 1px solid colors.$border-default;
    border-radius: 5px;
}
</style>
