<script setup lang="ts">
import {useKanbanStore} from "@/stores/kanban.store.ts";
import {storeToRefs} from "pinia";
import {h, nextTick, onMounted, ref} from "vue";
import type {ICategory} from "@/Types/models.ts";
import KanbanCategoryMobile from "@/Blocks/Kanban/KanbanCategoryMobile.vue";
import {Link} from "@inertiajs/vue3";
import BaseButton from "@/UI/Buttons/BaseButton.vue";
import {useProjectStore} from "@/stores/project.store.ts";
import MoreButton from "@/UI/Buttons/MoreButton.vue";
import DropdownItemEditCategory from "@/Dropdowns/Items/KanbanCategory/DropdownItemEditCategory.vue";
import {route} from "ziggy-js";
import DropdownItemDeleteCategory from "@/Dropdowns/Items/KanbanCategory/DropdownItemDeleteCategory.vue";

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
            <div class="header__item" v-for="(item, i) in categories" :key="i">
                <h3
                    class="header__text"
                    :class="{'header__text--active': activeCategory?.id === item.id}"
                    @click="activeCategory=item"
                >
                    {{item.title}}
                </h3>
                <MoreButton :menuItems="[
                    h(DropdownItemEditCategory, {
                        url: route('category.edit', {
                            id: item.id,
                            from_project_id: currentProject?.id
                        })
                    }),
                    h(DropdownItemDeleteCategory, {
                        category: item
                    })
                ]"/>
            </div>
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
    height: max-content;

    &__text {
        white-space: nowrap;
        margin: 0;

        &--active {
            border-bottom: 2px solid colors.$text-focus;
        }
    }

    &__item {
        display: flex;
        gap: 5px;
        align-items: center;
    }

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

    &__ico {
        font-size: 22px;
    }

    &__text {
        white-space: nowrap;
    }
}
</style>
