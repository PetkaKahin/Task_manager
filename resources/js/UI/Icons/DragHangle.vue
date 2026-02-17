<script setup lang="ts">
const props = defineProps<{
    className?: string,
}>()
</script>

<template>
    <article
        class="drag-hangle"
        :class="props.className"
    >
        <div class="drag-hangle__point"></div>
        <div class="drag-hangle__point"></div>
        <div class="drag-hangle__point"></div>
        <div class="drag-hangle__point"></div>
        <div class="drag-hangle__point"></div>
        <div class="drag-hangle__point"></div>
    </article>
</template>

<style scoped lang="scss">
@use '@scss/variables/colors';

.drag-hangle {
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-template-rows: repeat(3, auto);
    gap: 3px;
    width: fit-content;
    height: fit-content;
    cursor: grab;

    &__point {
        height: 4px;
        width: 4px;
        background-color: colors.$border-default;
        border-radius: 4px;
    }
}
</style>
