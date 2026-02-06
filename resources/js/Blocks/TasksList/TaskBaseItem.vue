<script setup lang="ts">

interface Props {
    header: string,
    description?: string,
    teg?: string,
}

const props = defineProps<Props>()
</script>

<template>
    <div class="task-base-item">
        <h4 class="task-base-item__header-text">{{ props.header }}</h4>

        <p class="task-base-item__description">{{ props.description }}</p>
    </div>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

.task-base-item {
    border: 1px solid colors.$border-default;
    border-radius: 5px;
    background-color: colors.$bg-base;
    cursor: pointer;
    padding: 15px;

    &:hover {
        border-color: colors.$border-focus;
    }

    &__header-text {
        margin: 0;
    }

    &__description {
        color: colors.$text-secondary;
    }
}
</style>
