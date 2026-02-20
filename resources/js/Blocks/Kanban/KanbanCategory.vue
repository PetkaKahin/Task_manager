<script setup lang="ts">
import type {ICategory} from "@/Types/models.ts";
import BaseKanbanCategory from "@/Blocks/Kanban/BaseKanbanCategory.vue";
import DragHandleIco from "@/UI/Icons/DragHandleIco.vue";

interface IProps {
    category: ICategory;
    categories: ICategory[]
    categoryIndex: number
}

const props = defineProps<IProps>()
</script>

<template>
    <BaseKanbanCategory :category="props.category" :categories="props.categories" :category-index="props.categoryIndex">
        <template #header="{ handleDrag }">
            <div class="header">
                <div class="header__left-block">
                    <DragHandleIco
                        class-name="header__drug"
                        @pointerdown="handleDrag"
                        :size="15"
                    />
                    <h3 class="header__title">{{ category.title }}</h3>
                </div>
                <div class="header__right-block">
                    <span class="header__task-count">{{ category.tasks.length }}</span>
                </div>
            </div>
        </template>
    </BaseKanbanCategory>
</template>

<style scoped lang="scss">
@use '@scss/variables/colors';
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid colors.$border-default;
    margin-bottom: 15px;
    padding-bottom: 15px;

    &__left-block {
        display: flex;
        gap: 10px;
        align-items: center;
    }

    &__task-count {
        color: colors.$text-muted;
        font-weight: 600;
    }

    &__title {
        margin: 0;
    }

    &__drug {
        color: colors.$ico-inactive;
    }
}
</style>
