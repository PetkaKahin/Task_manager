import type {IProject} from "@/Types/models.ts";
import axios from "axios";
import {route} from "ziggy-js";
import {useProjectStore} from "@/stores/project.store.ts";
import {router} from "@inertiajs/vue3";
import {useDraggable, useDroppable, DnDOperations} from "@vue-dnd-kit/core";
import {computed, type ComputedRef, nextTick} from "vue";
import {projectService} from "@/services/api/projectService.ts";

export function useKanbanProject() {
    const projectStore = useProjectStore()

    async function projectDelete(project: IProject) {
        projectStore.deleteProject(project)
        try {
            await axios.delete(route('projects.destroy', project.id))
        } catch (error) {
            console.error(error)
        }
        router.visit(route('home'))
    }

    /**
     * Находит старую и новую позицию Project.
     * Если они различаются - отправляет изменения на backend
     */
    async function projectMoved(oldIndex: number) {
        if (oldIndex < 0) return

        const source: IProject[] = projectStore.projects
        const project: IProject = source[oldIndex] as IProject

        await nextTick()

        const newIndex: number = projectStore.findIndexProject(project.id)

        if (newIndex === oldIndex) return

        let moveAfter: number | null = null

        if (newIndex > 0) {
            const prevProject = projectStore.projects[newIndex - 1]
            moveAfter = prevProject?.id ?? null
        }

        projectService().updatePosition(project.id, moveAfter)
    }

    function getDraggableData(source: IProject[], index: ComputedRef<number>) {
        const {elementRef, handleDragStart, isDragging, isOvered} = useDraggable({
            groups: ['sidebar-projects'],
            data: computed(() => ({
                source: source,
                index: index.value,
            })),
        })

        return {
            handleDragStart,
            isDragging,
            elementRef,
            isOvered,
        }
    }

    function getDroppableData() {
        const {elementRef} = useDroppable({
            groups: ['sidebar-projects'],
            events: {
                onDrop: (store, payload) => {
                    const oldIndex = payload.items[0]?.data?.index ?? -1
                    projectMoved(oldIndex)
                    DnDOperations.applyTransfer(store)
                },
            },
        })

        return {
            elementRef,
        }
    }

    return {
        projectDelete,
        projectMoved,
        getDraggableData,
        getDroppableData,
    }
}
