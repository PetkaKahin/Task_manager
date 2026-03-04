<script setup lang="ts">

import EditIco from "@/UI/Icons/EditIco.vue";
import {Link} from "@inertiajs/vue3";
import DeleteIco from "@/UI/Icons/DeleteIco.vue";
import DragHandleIco from "@/UI/Icons/DragHandleIco.vue";
import {useKanbanProject} from "@/composables/ui/useKanbanProject.ts";
import {useProjectStore} from "@/stores/project.store.ts";
import type {IProject} from "@/Types/models.ts";
import {computed} from "vue";
import {useEdgeScrollStore} from "@/stores/edgeScroll.store.ts";

interface IProps {
    project: IProject
    projects: IProject[]
    index: number
    isActive: boolean
}

const props = defineProps<IProps>()
const emit = defineEmits<{
    delete: []
}>()

const {currentProject} = useProjectStore()
const {getDraggableData} = useKanbanProject()
const edgeScrollStore = useEdgeScrollStore()
const {
    elementRef: itemRef,
    isDragging,
    handleDragStart,
} = getDraggableData(props.projects, computed(() => props.index))

function pointerDrug(e: PointerEvent) {
    handleDragStart(e)
    edgeScrollStore.get('project-list')?.startDrag(e)
}
</script>

<template>
    <li
        ref="itemRef"
        class="projects-list__item item"
        :class="{
            'item--active': isActive,
            'item--is-dragging': isDragging,
        }"
    >
        <div class="item__wrapper">
            <div class="left-block">
                <DragHandleIco :size="10" class="item__drug-ico" @pointerdown="pointerDrug"/>
                <Link
                    :href="route('projects.show', project.id)"
                    class="item__link"
                >
                    <span class="item__title">{{ project.title }}</span>
                </Link>
            </div>
            <div class="right-block">
                <Link
                    :href="route('projects.edit', project.id)"
                    :data="{from_project_id: currentProject?.id}"
                >
                    <EditIco class="item__ico" :size="16"/>
                </Link>
                <DeleteIco class="item__ico" :size="16" @click="emit('delete')"/>
            </div>
        </div>
    </li>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

.item {
    border: 1px solid colors.$border-default;
    border-radius: 5px;
    background-color: colors.$bg-elevated;
    padding: 0;

    &--active {
        border-color: colors.$border-focus;
    }

    &--is-dragging {
        opacity: 0.6;
    }

    &__link {
        padding: 5px 8px 5px 2px;
        text-decoration: none;
        display: block;
        flex: 1;
        min-width: 0;

        &:hover {
            color: colors.$text-primary;
        }
    }

    &__title {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
    }

    &__wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
    }

    &__ico {
        z-index: 1;
        color: colors.$text-muted;
        cursor: pointer;

        &:hover {
            color: colors.$border-focus;
        }
    }

    &__drug-ico {
        color: colors.$text-disabled;
        cursor: grab;
    }
}

.left-block, .right-block {
    display: flex;
    align-items: center;
    gap: 5px;
}

.left-block {
    margin-left: 4px;
    flex: 1;
    min-width: 0;
}

.right-block {
    margin-right: 6px;
}
</style>
