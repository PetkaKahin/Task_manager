<script setup lang="ts">
import {DnDOperations, useDraggable, useDroppable} from '@vue-dnd-kit/core'
import {computed} from 'vue'
import KanbanCard from "@/Blocks/Kanban/KanbanCard.vue";
import DragHangle from "@/UI/Icons/DragHangle.vue";
import type {ICategory} from "@/Types/models.ts";
import {useKanban} from "@/composables/useKanban.ts";
import {Link} from "@inertiajs/vue3";
import KanbanCardMobile from "@/Blocks/Kanban/KanbanCardMobile.vue";

interface IProps {
    category: ICategory;
    categories: ICategory[]
    categoryIndex: number
}

const props = defineProps<IProps>()
const kanban = useKanban()

const {elementRef: columnRef, isDragging, isOvered: columnIsOvered} = useDraggable({
    groups: ['kanban-columns'],
    data: computed(() => ({
        source: props.categories,
        index: props.categoryIndex,
    })),
})

const {elementRef: bodyRef, isOvered: bodyIsOvered} = useDroppable({
    groups: ['kanban-cards'],
    data: computed(() => ({
        source: props.category.tasks,
    })),
    events: {
        onDrop: (store, payload) => {
            kanban.taskMoved(payload)
            DnDOperations.applyTransfer(store)
        },
    },
})

// TODO сделать общего родителя для KanbanColumn и KanbanColumnMobile
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
        <div
            ref="bodyRef"
            class="kanban-column__body"
            :class="{ 'kanban-column__body--is-over': bodyIsOvered }"
        >
            <TransitionGroup name="cards" tag="div" class="kanban-column__cards">
                <KanbanCardMobile
                    v-for="(task, index) in category.tasks"
                    :key="task.id"
                    :task="task"
                    :source="category.tasks"
                    :index="index"
                />
            </TransitionGroup>
        </div>

        <Link :href="route('task.create', {
            category_id: category.id,
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
