<script setup lang="ts">

import {h, ref} from "vue";
import DropdownItemEditCategory from "@/Dropdowns/Items/KanbanCategory/DropdownItemEditCategory.vue";
import {route} from "ziggy-js";
import DropdownItemDeleteCategory from "@/Dropdowns/Items/KanbanCategory/DropdownItemDeleteCategory.vue";
import MoreButton from "@/UI/Buttons/MoreButton.vue";
import type {ICategory} from "@/Types/models.ts";
import {useKanbanCategory} from "@/composables/ui/useKanbanCategory.ts";

interface IProps {
    category: ICategory
    clickAction?: () => void
    className?: string
    isActive?: boolean
}

const props = defineProps<IProps>()
const isHoverIco = ref<boolean>(false)

const {elementRef: droppableRef} = useKanbanCategory().getDroppableData(props.category.tasks)

const handleItemClick = () => {
    if (!isHoverIco.value) {
        props.clickAction?.()
    }
}
</script>

<template>
    <div
        class="item"
        :class="[
            props.className,
            {'item--active': props.isActive}
        ]"
        ref="droppableRef"
        @click="handleItemClick"
    >
        <h3
            class="item__text"
        >
            {{props.category.title}}
        </h3>
        <MoreButton
            @mouseenter="isHoverIco = true"
            @mouseleave="isHoverIco = false"
            :menuItems="[
                h(DropdownItemEditCategory, {
                    url: route('category.edit', {
                        id: props.category.id,
                        from_project_id: props.category.project_id
                    })
                }),
                h(DropdownItemDeleteCategory, {
                    category: props.category
                })
            ]"
        />
    </div>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

.item {
    display: flex;
    gap: 5px;
    align-items: center;
    cursor: pointer;

    border: 1px solid colors.$border-default;
    border-radius: 5px;
    padding: 4px 2px 4px 10px;

    &--active, &:hover {
        border-color: colors.$text-focus;
    }

    &__text {
        white-space: nowrap;
        margin: 0;
    }
}
</style>