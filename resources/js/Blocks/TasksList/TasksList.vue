<script setup lang="ts">

import BaseDivider from "@/UI/Dividers/BaseDivider.vue";
import TaskBaseItem from "@/Blocks/TasksList/TaskBaseItem.vue";

interface Props {
    header: string,
}

const props = defineProps<Props>()
</script>

<template>
    <article class="tasks-list">
        <header class="tasks-list__header">
            <h3 class="tasks-list__haeder-text">{{ props.header }}</h3>
            <span class="tasks-list__all-items">3</span>
        </header>

        <BaseDivider class="tasks-list__divider"/>

        <div class="tasks-list__list">
            <TaskBaseItem header="Задача 1" description="Полное описание задачи 1"/>
            <TaskBaseItem header="Задача 2" description="Полное описание задачи 2"/>
            <TaskBaseItem header="Задача 2" description="Полное описание задачи 2"/>
            <TaskBaseItem header="Задача 2" description="Полное описание задачи 2"/>
            <TaskBaseItem header="Задача 2" description="Полное описание задачи 2"/>
            <TaskBaseItem header="Задача 2" description="Полное описание задачи 2"/>
            <TaskBaseItem header="Задача 2" description="Полное описание задачи 2"/>
            <TaskBaseItem header="Задача 2" description="Полное описание задачи 2"/>
            <TaskBaseItem header="Задача 2" description="Полное описание задачи 2"/>
            <TaskBaseItem header="Задача 2" description="Полное описание задачи 2"/>
            <TaskBaseItem header="Задача 2" description="Полное описание задачи 2"/>
        </div>

        <div class="tasks-list__add-task add-task">
            <h4 class="add-task__text">+ Добавить</h4>
        </div>
    </article>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

.tasks-list {
    border: 1px solid colors.$border-muted;
    background-color: colors.$bg-elevated;
    padding: 15px;
    min-width: 200px;
    max-width: 500px;
    border-radius: 5px;
    box-sizing: border-box;


    display: flex;
    flex-direction: column;
    height: 100%;

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__haeder-text {
        margin: 0;
    }

    &__all-items {
        color: colors.$text-muted;
    }

    &__divider {
        margin: 20px 0;
    }

    &__list {
        display: flex;
        flex-direction: column;
        gap: 15px;
        overflow-y: auto;
        overflow-x: hidden;
        flex: 1;
        min-height: 0;
    }
}

.add-task {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    margin-top: 15px;

    border: 1px dashed colors.$border-hover;
    cursor: pointer;

    &:hover {
        border-color: colors.$border-focus;
    }

    &__text {
        color: colors.$text-secondary;
        font-weight: 500;
    }
}
</style>
