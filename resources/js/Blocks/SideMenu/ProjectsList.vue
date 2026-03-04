<script setup lang="ts">

import {useSidebar} from "@/composables/ui/useSidebar.ts";
import {ref} from "vue";
import {useDeleteConfirm} from "@/composables/useDeleteConfirm.ts";
import type {IProject} from "@/Types/models.ts";
import DeleteModal from "@/UI/Modals/DeleteModal.vue";
import {useKanbanProject} from "@/composables/ui/useKanbanProject.ts";
import ProjectItem from "@/Blocks/SideMenu/ProjectItem.vue";
import {useEdgeScroll} from "@/composables/ui/useEdgeScroll.ts";

const {projectsList} = useSidebar()
const isItemActive = ref<boolean | number>(false)
const {target: targetDelete, confirm: deleteConfirm, isOpen: isDeleteModal} = useDeleteConfirm<IProject>()
const {getDroppableData, projectDelete} = useKanbanProject()
const {elementRef: listRef} = getDroppableData()
useEdgeScroll(listRef, {
    id: 'project-list',
    zoneSize: 100,
    containerOnly: true,
    maxSpeed: 15,
})

function deleteProject() {
    if (!targetDelete.value) return

    projectDelete(targetDelete.value)
}
</script>

<template>
    <article class="projects-list">
        <DeleteModal v-model="isDeleteModal" :onDelete="deleteProject"/>

        <h5 class="projects-list__header-text">Проекты:</h5>
        <ul ref="listRef" class="projects-list__list projects-list">
            <TransitionGroup name="projects">
                <ProjectItem
                    v-for="(project, index) in projectsList"
                    :key="project.id"
                    :project="project"
                    :projects="projectsList"
                    :index="index"
                    :isActive="isItemActive == project.id"
                    @mouseenter="isItemActive = project.id"
                    @mouseleave="isItemActive = false"
                    @delete="deleteConfirm(project)"
                />
            </TransitionGroup>
        </ul>
    </article>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

.projects-list {
    margin: 5px 0;
    padding: 0;
    color: colors.$text-primary;

    display: flex;
    flex-direction: column;
    gap: 5px;

    &__item {
        list-style-type: none;
    }

    &__header-text {
        margin: 0 0 0 10px;
    }

    &__list {
        overflow-y: auto;
        max-height: 100%;
    }
}
</style>

<style lang="scss">
.projects-move {
    transition: transform 0.2s ease;
}

.projects-enter-active,
.projects-leave-active {
    transition: all 0.2s ease;
}

.projects-enter-from,
.projects-leave-to {
    opacity: 0;
    transform: translateY(-100%);
}
</style>
