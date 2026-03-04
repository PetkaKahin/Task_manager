<script setup lang="ts">
import {useKanbanStore} from "@/stores/kanban.store.ts";
import {storeToRefs} from "pinia";
import {nextTick, onMounted, type Ref, ref} from "vue";
import type {ICategory} from "@/Types/models.ts";
import KanbanCategoryMobile from "@/Blocks/Kanban/KanbanCategoryMobile.vue";
import {Link} from "@inertiajs/vue3";
import BaseButton from "@/UI/Buttons/BaseButton.vue";
import {useProjectStore} from "@/stores/project.store.ts";
import {route} from "ziggy-js";
import KanbanMobileHeaderItem from "@/Blocks/Kanban/KanbanMobileHeaderItem.vue";
import {useEdgeScroll} from "@/composables/ui/useEdgeScroll.ts";
import {useTouchScroll} from "@/composables/ui/useTouchScroll.ts";
import {DnDOperations, useDroppable} from "@vue-dnd-kit/core";
import {useKanban} from "@/composables/ui/useKanban.ts";

const kanban = useKanban()
const store = useKanbanStore()
const {currentProject} = useProjectStore()
const {categories, animationsEnabled} = storeToRefs(store)
const activeCategory = ref<ICategory>()
const headerRef: Ref<HTMLElement | null> = ref(null)

const {elementRef: dropRef} = useDroppable({
    groups: ['kanban-columns'],
    events: {
        onDrop: (dndStore, payload) => {
            kanban.categoryMoved(payload.items[0]?.data?.index ?? -1)
            DnDOperations.applyTransfer(dndStore)
        },
    },
})

useEdgeScroll(headerRef, {
    id: 'mobile-header',
    horizontal: true,
    vertical: false,
})

const {init: initTouchScroll} = useTouchScroll(headerRef, {id: 'mobile-header'})

onMounted(async () => {
    await nextTick()
    activeCategory.value = categories.value[0]
    initTouchScroll()
})
</script>

<template>
    <div ref="elementRef" class="kanban-board-wrapper">
        <header class="header" :ref="(el) => { headerRef = el as HTMLElement; dropRef = el as HTMLElement }">
            <TransitionGroup :name="animationsEnabled ? 'mobile-categories' : ''" tag="div" class="header__items">
                <KanbanMobileHeaderItem
                    v-for="item in categories" :key="item.id"
                    :isActive="activeCategory?.id === item.id"
                    :category="item"
                    :clickAction="() => activeCategory=item"
                />
            </TransitionGroup>
            <Link
                :href="route('categories.create')"
                :data="{from_project_id: currentProject?.id}"
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

    &__items {
        display: flex;
        gap: 20px;
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
    height: 100%;

    &:hover {
        border-color: colors.$border-default;
    }

    &:focus {
        border-color: colors.$border-focus;
    }

    &__ico {
        font-size: 22px;
    }

    &__text {
        white-space: nowrap;
    }
}
</style>

<style lang="scss">
.mobile-categories-move {
    transition: transform 0.2s ease;
}

.mobile-categories-enter-active,
.mobile-categories-leave-active {
    transition: all 0.2s ease;
}

.mobile-categories-enter-from,
.mobile-categories-leave-to {
    opacity: 0;
}
</style>
