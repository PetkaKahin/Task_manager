import axios from "axios";
import {route} from "ziggy-js";
import type {ITask} from "@/Types/models.ts";
import {useKanbanStore} from "@/stores/kanban.store.ts";
import {useModal} from "@/composables/ui/useModal.ts";
import {useDraggable} from "@vue-dnd-kit/core";
import {computed, type ComputedRef} from "vue";
import {cardDragState} from "@/composables/ui/useKanban.ts";

export function useKanbanCard() {
    const kanbanStore = useKanbanStore()
    const modal = useModal();

    function getDraggableData(source: any, index: ComputedRef<number>) {
        const {elementRef, handleDragStart: startDrag, isDragging, isOvered} = useDraggable({
            data: computed(() => ({
                source: source,
                index: index.value,
            })),
            groups: ['kanban-cards'],
        })

        function handleDragStart(event: PointerEvent) {
            cardDragState.hasMoved = false

            const rect = (elementRef.value as HTMLElement | null)?.getBoundingClientRect()

            function onMove(e: PointerEvent) {
                if (!rect ||
                    e.clientX < rect.left || e.clientX > rect.right ||
                    e.clientY < rect.top  || e.clientY > rect.bottom) {
                    cardDragState.hasMoved = true
                    window.removeEventListener('pointermove', onMove)
                }
            }

            window.addEventListener('pointermove', onMove)
            window.addEventListener('pointerup', () => window.removeEventListener('pointermove', onMove), {once: true})

            startDrag(event)
        }

        return {
            elementRef,
            isOvered,
            isDragging,
            handleDragStart,
        };
    }

    function taskDelete(task: ITask) {
        modal.addActionClosing(
            'delete.task',
            () => {
                kanbanStore.deleteTask(task)
                axios.delete(route('task.destroy', task.id))
            }
        )
        modal.open()
    }

    return {
        taskDelete,
        getDraggableData,
    }
}
