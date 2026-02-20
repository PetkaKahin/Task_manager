<script setup lang="ts">
import type {ITask} from "@/Types/models.ts";
import KanbanCard from "@/Blocks/Kanban/KanbanCard.vue";

interface IProps {
    task: ITask
    source: any[]
    index: number
}

const props = defineProps<IProps>()
</script>

<template>
    <KanbanCard :task="props.task" :source="props.source" :index="props.index" :iconsSize="20"/>
</template>

<style scoped lang="scss">
@use '@scss/variables/colors';
@use '@scss/variables/sizes';

:deep(.kanban-card) {
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
}

:deep(.kanban-card__right-block) {
    gap: 20px;
}
</style>
