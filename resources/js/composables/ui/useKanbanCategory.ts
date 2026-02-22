import {DnDOperations, useDraggable, useDroppable} from "@vue-dnd-kit/core";
import {computed, type ComputedRef} from "vue";
import {useKanban, cardDragState} from "@/composables/ui/useKanban.ts";
import type {ICategory, ITask} from "@/Types/models.ts";
import axios from "axios";
import {route} from "ziggy-js";
import {useModal} from "@/composables/ui/useModal.ts";
import {useKanbanStore} from "@/stores/kanban.store.ts";

export function useKanbanCategory() {
    const kanbanStore = useKanbanStore()
    const kanban = useKanban()
    const modal = useModal()

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

    function getDroppableData(tasks: ITask[], onAfterDrop?: () => void) {
        const {elementRef, isOvered} = useDroppable({
            groups: ['kanban-cards'],
            data: computed(() => ({
                source: tasks,
            })),
            events: {
                onDrop: (store, payload) => {
                    if (!cardDragState.hasMoved) return

                    if (!store.hovered.element.value) {
                        const draggedSource = payload.items[0]?.data?.source
                        if (draggedSource === tasks) return
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
        modal.addActionClosing(
            'delete.category',
            () => {
                kanbanStore.deleteCategory(category)
                axios.delete(route('category.destroy', category.id))
            }
        )
        modal.open()
    }
    return {
        getDraggableData,
        getDroppableData,
        categoryDelete,
    }
}
