<script setup lang="ts">
import type {ICategory} from "@/Types/models.ts";
import BaseKanbanCategory from "@/Blocks/Kanban/BaseKanbanCategory.vue";
import {computed, ref} from "vue";
import {useEdgeScroll} from "@/composables/ui/useEdgeScroll.ts";

interface IProps {
    category: ICategory
    categories: ICategory[]
    categoryIndex: number
}

const props = defineProps<IProps>()
const baseRef = ref<InstanceType<typeof BaseKanbanCategory> | null>(null)
const sectionEl = computed<HTMLElement | null>(() => baseRef.value?.categoryRef ?? null)
useEdgeScroll(sectionEl, {
    id: `category-${props.category.id}`,
    zoneSize: 80,
    containerOnly: true,
})
</script>

<template>
    <BaseKanbanCategory
        ref="baseRef"
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
    width: 100%;
    max-width: none;

    :deep(.kanban-category__body) {
        flex: none;
        min-height: auto;
        overflow-y: clip;
    }
}
</style>
