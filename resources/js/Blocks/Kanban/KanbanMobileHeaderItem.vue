<script setup lang="ts">

import {computed, h, ref} from "vue";
import DropdownItemEditCategory from "@/Dropdowns/Items/KanbanCategory/DropdownItemEditCategory.vue";
import {route} from "ziggy-js";
import DropdownItemDeleteCategory from "@/Dropdowns/Items/KanbanCategory/DropdownItemDeleteCategory.vue";
import MoreButton from "@/UI/Buttons/MoreButton.vue";
import type {ICategory} from "@/Types/models.ts";
import {useKanbanCategory} from "@/composables/ui/useKanbanCategory.ts";
import {useLongPress} from "@/composables/ui/useLongPress.ts";
import {useKanbanStore} from "@/stores/kanban.store.ts";
import {storeToRefs} from "pinia";
import {useEdgeScrollStore} from "@/stores/edgeScroll.store.ts";
import {useTouchScrollStore} from "@/stores/touchScroll.store.ts";

interface IProps {
    category: ICategory
    clickAction?: () => void
    className?: string
    isActive?: boolean
}

const props = defineProps<IProps>()
const isHoverIco = ref<boolean>(false)
const kanbanStore = useKanbanStore()
const {categories} = storeToRefs(kanbanStore)

const {getDraggableData, getDroppableData} = useKanbanCategory()
const {elementRef: droppableRef, isOvered} = getDroppableData(() => props.category.tasks)
const {elementRef: draggableRef, handleDragStart, isDragging} = getDraggableData(
    categories.value,
    computed(() => kanbanStore.getCategoryIndex(props.category.id)),
)

const edgeScrollStore = useEdgeScrollStore()
const touchScrollStore = useTouchScrollStore()

const {isPressing, handlePress} = useLongPress({
    delay: 500,
    onReady: (e) => {
        touchScrollStore.get('mobile-header')?.pause()
        handleDragStart(e as PointerEvent)
        edgeScrollStore.get('mobile-header')?.startDrag(e)

        window.addEventListener('pointerup', () => {
            touchScrollStore.get('mobile-header')?.resume()
        }, {once: true})
    },
})

function setItemRef(el: HTMLElement | null) {
    droppableRef.value = el
    draggableRef.value = el
}

function onPointerDown(e: PointerEvent) {
    if (isHoverIco.value) return
    handlePress(e)
}

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
            {'item--active': props.isActive || isOvered},
            {'item--is-dragging': isDragging},
            {'item--pressing': isPressing},
        ]"
        :ref="(el) => setItemRef(el as HTMLElement)"
        @click="handleItemClick"
        @pointerdown="onPointerDown"
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
                    url: route('categories.edit', [
                        props.category.id,
                        { from_project_id: props.category.project_id }
                    ])
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
    user-select: none;
    touch-action: none;
    background-color: colors.$bg-base;

    border: 1px solid colors.$border-default;
    border-radius: 5px;
    padding: 4px 2px 4px 10px;

    &--active {
        border-color: colors.$text-focus;
    }

    &--pressing {
        transition: transform 0.3s ease;
        transform: scale(0.95);
    }

    &__text {
        white-space: nowrap;
        margin: 0;
    }
}
</style>
