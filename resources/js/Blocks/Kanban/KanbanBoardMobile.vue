<script setup lang="ts">
import {useKanbanStore} from "@/stores/kanban.store.ts";
import {storeToRefs} from "pinia";
import {nextTick, onMounted, ref} from "vue";
import type {ICategory} from "@/Types/models.ts";
import KanbanColumnMobile from "@/Blocks/Kanban/KanbanColumnMobile.vue";

const store = useKanbanStore()
const {categories} = storeToRefs(store)
const activeCategory = ref<ICategory>()

onMounted(async () => {
    await nextTick()
    activeCategory.value = categories.value[0]
})

// TODO сделать общего родителя для KanbanBoard и KanbanCardBoard
</script>

<template>
    <div ref="elementRef" class="kanban-board-wrapper">
        <header class="header">
            <h3
                class="header__text"
                :class="{'header__text--active': activeCategory?.id === item.id}"
                v-for="(item, i) in categories"
                :key="i"
                @click="activeCategory=item"
            >
                {{item.title}}
            </h3>
        </header>

        <KanbanColumnMobile
            v-if="activeCategory"
            :category="activeCategory"
            :categories="categories"
            :category-index="store.getColumnPosition(activeCategory.id)"
        />
    </div>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

.kanban-board-wrapper {
    overflow-x: auto;
    flex: 1;
    display: grid;
    grid-template-columns: auto;
    grid-auto-rows: auto 1fr;
}

.header {
    display: flex;
    gap: 20px;

    overflow-x: auto;
    padding: 5px;

    &__text {
        white-space: nowrap;
        margin: 0;

        &--active {
            border-bottom: 2px solid colors.$text-focus;
        }
    }
}
</style>
