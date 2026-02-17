<script setup lang="ts">
import {DnDOperations, useDraggable, useDroppable} from '@vue-dnd-kit/core'
import {computed} from 'vue'
import KanbanCard from "@/Blocks/Kanban/KanbanCard.vue";
import DragHangle from "@/UI/Icons/DragHangle.vue";
import type {ICategory} from "@/Types/models.ts";
import {useKanban} from "@/composables/useKanban.ts";
import {Link} from "@inertiajs/vue3";

interface IProps {
    column: ICategory;
    columns: ICategory[]
    columnIndex: number
}

const props = defineProps<IProps>()
const kanban = useKanban()

const {elementRef: columnRef, handleDragStart: handleColumnDrag, isDragging, isOvered: columnIsOvered} = useDraggable({
    groups: ['kanban-columns'],
    data: computed(() => ({
        source: props.columns,
        index: props.columnIndex,
    })),
})

const {elementRef: bodyRef, isOvered: bodyIsOvered} = useDroppable({
    groups: ['kanban-cards'],
    data: computed(() => ({
        source: props.column.tasks,
    })),
    events: {
        onDrop: (store, payload) => {
            kanban.taskMoved(payload)
            DnDOperations.applyTransfer(store)
        },
    },
})
</script>

<template>
    <section
        ref="columnRef"
        class="kanban-column"
        :class="{
            'kanban-column--is-dragging': isDragging,
            'kanban-column--is-overed': columnIsOvered,
          }"
    >
        <header class="kanban-column__header header">
            <div class="header__left-block">
                <DragHangle
                    class-name="kanban-column__drug"
                    @pointerdown="handleColumnDrag"
                />
                <h3 class="header__title">{{ column.title }}</h3>
            </div>
            <div class="header__right-block">
                <span class="header__task-count">{{ column.tasks.length }}</span>
            </div>
        </header>

        <div
            ref="bodyRef"
            class="kanban-column__body"
            :class="{ 'kanban-column__body--is-over': bodyIsOvered }"
        >
            <TransitionGroup name="cards" tag="div" class="kanban-column__cards">
                <KanbanCard
                    v-for="(task, index) in column.tasks"
                    :key="task.id"
                    :task="task"
                    :source="column.tasks"
                    :index="index"
                />
            </TransitionGroup>
        </div>

        <Link :href="route('task.create', {
            category_id: column.id,
        })"
              class="link--no-decor"
        >
            <div class="kanban-column__footer add-card">
                <h4 class="add-card__text">+ Добавить</h4>
            </div>
        </Link>
    </section>
</template>

<style scoped lang="scss">
@use '@scss/variables/colors';

.kanban-column {
    border: 1px solid colors.$border-default;
    border-radius: 5px;
    padding: 15px;
    background-color: colors.$bg-elevated;
    min-width: 200px;
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
        height: 100%;
        overflow-y: auto;
        margin-bottom: 15px;

        &--is-over {

        }
    }
}

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

.kanban-column-wrapper {
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
