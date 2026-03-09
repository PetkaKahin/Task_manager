import {DnDOperations, useDraggable, useDroppable} from "@vue-dnd-kit/core";
import {computed, type ComputedRef} from "vue";
import {useKanban, cardDragState} from "@/composables/ui/useKanban.ts";
import type {ICategory, ITask} from "@/Types/models.ts";
import {apiRequest} from "@/shared/api/apiRequest";
import {route} from "ziggy-js";
import {useKanbanStore} from "@/stores/kanban.store.ts";

export function useKanbanCategory() {
    const kanbanStore = useKanbanStore()
    const kanban = useKanban()

    function getDraggableData(source: any, index: ComputedRef<number>) {
        const {elementRef, handleDragStart, isDragging, isOvered} = useDraggable({
            groups: ['kanban-columns'],
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

    function getDroppableData(getTasks: () => ITask[], onAfterDrop?: () => void) {
        const {elementRef, isOvered} = useDroppable({
            groups: ['kanban-cards'],
            data: computed(() => ({
                source: getTasks(),
            })),
            events: {
                onDrop: (store, payload) => {
                    if (!cardDragState.hasMoved) return

                    if (!store.hovered.element.value) {
                        const draggedSource = payload.items[0]?.data?.source
                        if (draggedSource === getTasks()) return
                    }

                    kanban.taskMoved(payload)
                    DnDOperations.applyTransfer(store)
                    onAfterDrop?.()
                },
            },
        })

        return {
            elementRef,
            isOvered,
        }
    }

    function categoryDelete(category: ICategory) {
        const index = kanbanStore.getCategoryIndex(category.id)
        kanbanStore.deleteCategory(category)
        apiRequest.delete(route('categories.destroy', category.id))
            .catch((error) => {
                console.error(error)
                kanbanStore.addCategory(index, category)
            })
    }
    return {
        getDraggableData,
        getDroppableData,
        categoryDelete,
    }
}
