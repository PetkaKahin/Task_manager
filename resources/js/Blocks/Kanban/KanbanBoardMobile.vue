<script setup lang="ts">
import {useKanbanStore} from "@/stores/kanban.store.ts";
import {storeToRefs} from "pinia";
import {computed, nextTick, onMounted, type Ref, ref, watch} from "vue";
import type {ICategory} from "@/Types/models.ts";
import KanbanCategoryMobile from "@/Blocks/Kanban/KanbanCategoryMobile.vue";
import {Link} from "@inertiajs/vue3";
import BaseButton from "@/UI/Buttons/BaseButton.vue";
import {useProjectStore} from "@/stores/project.store.ts";
import {route} from "ziggy-js";
import KanbanMobileHeaderItem from "@/Blocks/Kanban/KanbanMobileHeaderItem.vue";
import {useEdgeScroll} from "@/composables/ui/useEdgeScroll.ts";
import {useTouchScroll} from "@/composables/ui/useTouchScroll.ts";
import {useSwipeGesture} from "@/composables/ui/useSwipeGesture.ts";
import {DnDOperations, useDroppable} from "@vue-dnd-kit/core";
import {useKanban} from "@/composables/ui/useKanban.ts";
import {useActiveCategoryStore} from "@/stores/activeCategory.store.ts";

const kanban = useKanban()
const store = useKanbanStore()
const {currentProject} = useProjectStore()
const activeCategoryStore = useActiveCategoryStore()
const {categories, animationsEnabled} = storeToRefs(store)
const activeCategory = ref<ICategory>()
const headerRef: Ref<HTMLElement | null> = ref(null)
const contentRef: Ref<HTMLElement | null> = ref(null)
const slideDirection = ref<'left' | 'right'>('left')

const transitionName = computed(() =>
    animationsEnabled.value ? `slide-${slideDirection.value}` : ''
)

function switchCategory(direction: number) {
    const idx = categories.value.findIndex(c => c.id === activeCategory.value?.id)
    const next = idx + direction
    if (next >= 0 && next < categories.value.length) {
        slideDirection.value = direction > 0 ? 'left' : 'right'
        activeCategory.value = categories.value[next]
    }
}

function onTabClick(item: ICategory) {
    const currentIdx = categories.value.findIndex(c => c.id === activeCategory.value?.id)
    const nextIdx = categories.value.findIndex(c => c.id === item.id)
    slideDirection.value = nextIdx > currentIdx ? 'left' : 'right'
    activeCategory.value = item
}

const {init: initSwipe} = useSwipeGesture(contentRef, {
    id: 'mobile-content',
    onSwipeLeft: () => switchCategory(1),
    onSwipeRight: () => switchCategory(-1),
})

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

function scrollHeaderToActive() {
    if (!headerRef.value || !activeCategory.value) return
    const activeEl = headerRef.value.querySelector('.item--active') as HTMLElement | null
    activeEl?.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'center'})
}

watch(activeCategory, (cat) => {
    if (cat && currentProject?.id) {
        activeCategoryStore.set(currentProject.id, cat.id)
    }
    nextTick(scrollHeaderToActive)
})

onMounted(async () => {
    await nextTick()

    const savedId = currentProject?.id ? activeCategoryStore.get(currentProject.id) : undefined
    const saved = savedId !== undefined
        ? categories.value.find(c => c.id === savedId)
        : undefined
    activeCategory.value = saved ?? categories.value[0]

    initTouchScroll()
    initSwipe()
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
                    :clickAction="() => onTabClick(item)"
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

        <div ref="contentRef" class="kanban-content">
            <Transition :name="transitionName" mode="out-in">
                <KanbanCategoryMobile
                    v-if="activeCategory"
                    :key="activeCategory.id"
                    :category="activeCategory"
                    :categories="categories"
                    :category-index="store.getCategoryIndex(activeCategory.id)"
                />
            </Transition>
        </div>
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

.kanban-content {
    overflow: hidden;
    min-height: 0;
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
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
    transition: transform 0.15s ease, opacity 0.15s ease;
}

.slide-left-enter-from {
    transform: translateX(30%);
    opacity: 0;
}

.slide-left-leave-to {
    transform: translateX(-30%);
    opacity: 0;
}

.slide-right-enter-from {
    transform: translateX(-30%);
    opacity: 0;
}

.slide-right-leave-to {
    transform: translateX(30%);
    opacity: 0;
}

.mobile-categories-move {
    transition: transform 0.1s ease;
}

.mobile-categories-enter-active,
.mobile-categories-leave-active {
    transition: all 0.1s ease;
}

.mobile-categories-enter-from,
.mobile-categories-leave-to {
    opacity: 0;
}
</style>
