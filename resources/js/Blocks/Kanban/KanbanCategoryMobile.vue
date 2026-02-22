<script setup lang="ts">
import type {ICategory} from "@/Types/models.ts";
import BaseKanbanCategory from "@/Blocks/Kanban/BaseKanbanCategory.vue";

interface IProps {
    category: ICategory;
    categories: ICategory[]
    categoryIndex: number
}

const props = defineProps<IProps>()
</script>

<template>
    <BaseKanbanCategory
        className="kanban-column-mobile"
        :category="props.category"
        :categories="props.categories"
        :category-index="props.categoryIndex"
    />
</template>

<style scoped lang="scss">
.kanban-column-mobile {
    border-radius: 0;
    border: none;
    overflow-y: auto;

    :deep(.kanban-category__body) {
        flex: none;
        min-height: auto;
        overflow-y: clip;
    }
}
</style>
