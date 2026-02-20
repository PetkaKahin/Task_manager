<script setup lang="ts">
import {DnDOperations, useDroppable} from '@vue-dnd-kit/core';
import {useKanbanStore} from "@/stores/kanban.store.ts";
import {storeToRefs} from "pinia";
import {useKanban} from "@/composables/ui/useKanban.ts";
import KanbanCategory from "@/Blocks/Kanban/KanbanCategory.vue";

const kanban = useKanban()
const store = useKanbanStore()
const {categories, animationsEnabled} = storeToRefs(store)
const {elementRef} = useDroppable({
    groups: ['kanban-columns'],
    events: {
        onDrop: (store, payload) => {
            kanban.categoryMoved(payload.items[0]?.data?.index ?? -1)
            DnDOperations.applyTransfer(store)
        },
    },
})
</script>

<template>
    <div ref="elementRef" class="kanban-board-wrapper">
        <TransitionGroup :name="animationsEnabled ? 'categories' : ''" tag="div" class="kanban-board">
            <KanbanCategory
                v-for="(category, index) in categories"
                :key="category.id"
                :category="category"
                :categories="categories"
                :category-index="index"
            />
        </TransitionGroup>
    </div>
</template>

<style scoped lang="scss">
.kanban-board-wrapper {
    overflow-x: auto;
    flex: 1;
}

.kanban-board {
    display: flex;
    gap: 20px;
    align-items: flex-start;
    height: 100%;
}
</style>

<style lang="scss">
.categories-move {
    transition: transform 0.2s ease;
}

.categories-enter-active,
.categories-leave-active {
    transition: all 0.2s ease;
}

.categories-enter-from,
.categories-leave-to {
    opacity: 0;
}
</style>
