<script setup lang="ts">
import type {ICategory} from "@/Types/models.ts";
import BaseKanbanCategory from "@/Blocks/Kanban/BaseKanbanCategory.vue";
import DragHandleIco from "@/UI/Icons/DragHandleIco.vue";
import MoreButton from "@/UI/Buttons/MoreButton.vue";
import DropdownItemEditCategory from "@/Dropdowns/Items/KanbanCategory/DropdownItemEditCategory.vue";
import {h} from "vue";
import {route} from "ziggy-js";
import {useProjectStore} from "@/stores/project.store.ts";
import DropdownItemDeleteCategory from "@/Dropdowns/Items/KanbanCategory/DropdownItemDeleteCategory.vue";

interface IProps {
    category: ICategory;
    categories: ICategory[]
    categoryIndex: number
}

const {currentProject} = useProjectStore()

const props = defineProps<IProps>()
const menuItems = [
    h(DropdownItemEditCategory, {
        url: route('categories.edit', {
            id: props.category.id,
            from_project_id: currentProject?.id
        })
    }),
    h(DropdownItemDeleteCategory, {
        category: props.category
    })
]
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
                    <MoreButton :menuItems="menuItems"/>
                </div>
            </div>
        </template>
    </BaseKanbanCategory>
</template>

<style scoped lang="scss">
@use '@scss/variables/colors';
@use '@scss/variables/sizes';

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid colors.$border-default;
    margin-bottom: 15px;
    padding-bottom: 15px;
    gap: 10px;
    max-width: sizes.$card-max-width;

    &__left-block {
        display: flex;
        gap: 10px;
        align-items: center;
        min-width: 0;
        flex: 1;
    }

    &__right-block {
        display: flex;
        gap: 10px;
        align-items: center;
        flex-shrink: 0;
    }

    &__task-count {
        padding: 3px 8px;
        border-radius: 15px;
        color: colors.$text-muted;
        font-weight: 600;
        background-color: colors.$bg-active;
    }

    &__title {
        margin: 0;
        word-break: break-word;
    }

    &__drug {
        color: colors.$ico-inactive;
        min-width: 15px;
    }
}
</style>
