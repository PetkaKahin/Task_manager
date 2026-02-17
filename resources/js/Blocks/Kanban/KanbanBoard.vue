<script setup lang="ts">
import {DnDOperations, useDroppable} from '@vue-dnd-kit/core';
import KanbanColumn from './KanbanColumn.vue';
import {useKanbanStore} from "@/stores/kanban.store.ts";
import {storeToRefs} from "pinia";
import {useKanban} from "@/composables/useKanban.ts";
import {nextTick, onMounted, ref} from "vue";

const kanban = useKanban()
const store = useKanbanStore()
const {categories} = storeToRefs(store)
const {elementRef} = useDroppable({
    groups: ['kanban-columns'],
    events: {
        onDrop: (store, payload) => {
            kanban.categoryMoved(payload.items[0]?.data?.index ?? -1)
            DnDOperations.applyTransfer(store)
        },
    },
})
const isReady = ref(false)

onMounted(() => {
    nextTick(() => {
        isReady.value = true
    })
})
</script>

<template>
    <div ref="elementRef" class="kanban-board-wrapper">
        <TransitionGroup :name="isReady ? 'columns' : ''" tag="div" class="kanban-board">
            <KanbanColumn
                v-for="(category, index) in categories"
                :key="category.id"
                :column="category"
                :categories="categories"
                :column-index="index"
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
.columns-move {
    transition: transform 0.2s ease;
}

.columns-enter-active,
.columns-leave-active {
    transition: all 0.2s ease;
}

.columns-enter-from,
.columns-leave-to {
    opacity: 0;
}
</style>
