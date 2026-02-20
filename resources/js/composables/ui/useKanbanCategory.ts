import {DnDOperations, useDraggable, useDroppable} from "@vue-dnd-kit/core";
import {computed, type ComputedRef} from "vue";
import {useKanban, cardDragState} from "@/composables/ui/useKanban.ts";
import type {ITask} from "@/Types/models.ts";

export function useKanbanCategory() {
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

    function getDroppableData(tasks: ITask[]) {
        const {elementRef, isOvered} = useDroppable({
            groups: ['kanban-cards'],
            data: computed(() => ({
                source: tasks,
            })),
            events: {
                onDrop: (store, payload) => {
                    if (!cardDragState.hasMoved) return
                    kanban.taskMoved(payload)
                    DnDOperations.applyTransfer(store)
                },
            },
        })

        return {
            elementRef,
            isOvered,
        }
    }

    return {
        getDraggableData,
        getDroppableData,
    }
}
