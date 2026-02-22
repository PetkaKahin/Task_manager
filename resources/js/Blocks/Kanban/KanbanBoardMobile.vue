<script setup lang="ts">
import {useKanbanStore} from "@/stores/kanban.store.ts";
import {storeToRefs} from "pinia";
import {nextTick, onMounted, ref} from "vue";
import type {ICategory} from "@/Types/models.ts";
import KanbanCategoryMobile from "@/Blocks/Kanban/KanbanCategoryMobile.vue";
import {Link} from "@inertiajs/vue3";
import BaseButton from "@/UI/Buttons/BaseButton.vue";
import {useProjectStore} from "@/stores/project.store.ts";
import {route} from "ziggy-js";
import KanbanMobileHeaderItem from "@/Blocks/Kanban/KanbanMobileHeaderItem.vue";

const store = useKanbanStore()
const {currentProject} = useProjectStore()
const {categories} = storeToRefs(store)
const activeCategory = ref<ICategory>()


onMounted(async () => {
    await nextTick()
    activeCategory.value = categories.value[0]
})
</script>

<template>
    <div ref="elementRef" class="kanban-board-wrapper">
        <header class="header">
            <KanbanMobileHeaderItem
                v-for="(item, i) in categories" :key="i"
                :isActive="activeCategory?.id === item.id"
                :category="item"
                :clickAction="() => activeCategory=item"
            />
            <Link
                :href="route('category.create', {
                    from_project_id: currentProject?.id
                })"
                class="header__link"
            >
                <BaseButton className="header__button button">
                    <span class="button__ico">+</span>
                    <span class="button__text">Добавить категорию</span>
                </BaseButton>
            </Link>
        </header>

        <KanbanCategoryMobile
            v-if="activeCategory"
            :key="activeCategory.id"
            :category="activeCategory"
            :categories="categories"
            :category-index="store.getCategoryIndex(activeCategory.id)"
        />
    </div>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

.kanban-board-wrapper {
    overflow: hidden;
    flex: 1;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto minmax(0, 1fr);
}

.header {
    display: flex;
    gap: 20px;

    overflow-x: auto;
    padding: 5px;
    height: max-content;

    &__button {
        :deep(.text) {
            margin: 0 5px;
            font-size: 20px;
        }
    }

    &__link {
        text-decoration: none;
    }
}

.button {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 2px 10px;
    height: 100%;

    &__ico {
        font-size: 22px;
    }

    &__text {
        white-space: nowrap;
    }
}
</style>
