<script setup lang="ts">
import type {ICategory} from "@/Types/models.ts";
import {Link} from "@inertiajs/vue3";
import {useKanbanCategory} from "@/composables/ui/useKanbanCategory.ts";
import KanbanCard from "@/Blocks/Kanban/KanbanCard.vue";
import {computed} from "vue";
import {useProjectStore} from "@/stores/project.store.ts";
import {useKanbanStore} from "@/stores/kanban.store.ts";
import {storeToRefs} from "pinia";

interface IProps {
    category: ICategory
    categories: ICategory[]
    categoryIndex: number
    className?: string
}

const props = defineProps<IProps>()
const {animationsEnabled} = storeToRefs(useKanbanStore())
const {getDraggableData, getDroppableData} = useKanbanCategory()
const {elementRef: bodyRef, isOvered: bodyIsOvered} = getDroppableData(() => props.category.tasks)
const {
    elementRef: categoryRef,
    isDragging,
    handleDragStart: handleColumnDrag,
    isOvered: categoryIsOvered
} = getDraggableData(props.categories, computed(() => props.categoryIndex))
</script>

<template>
    <section
        ref="categoryRef"
        class="kanban-category"
        :class="{
            [props.className!]: props.className,
            'kanban-category--is-dragging': isDragging,
            'kanban-category--is-overed': categoryIsOvered,
          }"
    >
        <header class="kanban-category__header header">
            <slot name="header" :handle-drag="handleColumnDrag"/>
        </header>

        <div
            ref="bodyRef"
            class="kanban-category__body"
            :class="{ 'kanban-category__body--is-over': bodyIsOvered }"
        >
            <TransitionGroup :name="animationsEnabled ? 'cards' : ''" tag="div" class="kanban-category__cards">
                <KanbanCard
                    v-for="(task, index) in category.tasks"
                    :key="task.id"
                    :task="task"
                    :source="category.tasks"
                    :index="index"
                />
            </TransitionGroup>
        </div>

        <Link :href="route('tasks.create', {
            category_id: category.id,
            from_project_id: useProjectStore().currentProject?.id
        })"
              class="link--no-decor"
        >
            <div class="kanban-category__footer add-card">
                <h4 class="add-card__text">+ Добавить</h4>
            </div>
        </Link>
    </section>
</template>

<style scoped lang="scss">
@use '@scss/variables/colors';
@use '@scss/variables/sizes';

.kanban-category {
    border: 1px solid colors.$border-default;
    border-radius: 5px;
    padding: 15px;
    background-color: colors.$bg-elevated;
    min-width: 200px;
    max-width: sizes.$category-max-width;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    position: relative;

    &--is-dragging {
        opacity: 0.6;
    }

    &__cards {
        display: flex;
        flex-direction: column;
        gap: 15px;
        height: 100%;
    }

    &__body {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        margin-bottom: 15px;

        &--is-over {

        }
    }

    &__drug {
        color: colors.$ico-inactive;
    }
}


.add-card {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
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

.kanban-category-wrapper {
    display: flex;
    align-items: stretch;
    gap: 20px;
    height: 100%;
}

.vertical-line {
    width: 3px;
    border-radius: 3px;
    background-color: colors.$border-focus;
}
</style>

<style lang="scss">
.cards-move {
    transition: transform 0.2s ease;
}

.cards-enter-active,
.cards-leave-active {
    transition: all 0.2s ease;
}

.cards-enter-from,
.cards-leave-to {
    opacity: 0;
    transform: translateY(-100%);
}
</style>
