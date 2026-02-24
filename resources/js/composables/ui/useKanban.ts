import {useKanbanStore} from "@/stores/kanban.store.ts";
import type {ICategory, ITask} from "@/Types/models.ts";
import type {IDnDPayload} from "@vue-dnd-kit/core";
import {nextTick} from "vue";
import {categoryService} from "@/services/api/categoryService.ts";
import {useProjectStore} from "@/stores/project.store.ts";
import {taskService} from "@/services/api/taskService.ts";

interface IExtractedTaskData {
    task: ITask
    oldTaskIndex: number
}

export const cardDragState = { hasMoved: false }

export function useKanban() {
    const kanbanStore = useKanbanStore()
    const projectStore = useProjectStore()

    /**
     * Находит старую и новую позицию Category.
     * Если они различаются - отправляет изменения на backend
     *
     * @param oldCategoryIndex
     */
    async function categoryMoved(oldCategoryIndex: number) {
        if (oldCategoryIndex < 0) return

        // Сохраняем старую позицию ДО обновления, порядок важен!
        const oldPosition: number = oldCategoryIndex
        const source: ICategory[] = kanbanStore.categories
        const category: ICategory = source[oldPosition] as ICategory

        await nextTick()

        const newPosition: number = kanbanStore.getCategoryIndex(category.id)

        if (newPosition == oldPosition) return

        if (projectStore.currentProject === undefined) return

        let moveAfter: number | null = null

        if (newPosition > 0) {
            const prevCategory = kanbanStore.categories[newPosition - 1]
            moveAfter = prevCategory?.id ?? null
        }

        categoryService.updatePosition(category.id, moveAfter)
    }

    /**
     * Находит старую и новую позицию Task.
     * Если они различаются - отправляет изменения на backend
     *
     * @param payload
     */
    async function taskMoved(payload: IDnDPayload) {
        const extracted = extractTaskDataFromPayload(payload)
        if (extracted == null) return

        // Сохраняем старые позиции ДО обновления, порядок важен!
        const { task, oldTaskIndex } = extracted
        const oldCategoryIndex: number = kanbanStore.getCategoryIndexByTaskId(task.id)

        await nextTick()

        const newCategoryIndex = kanbanStore.getCategoryIndexByTaskId(task.id)
        const newTaskPosition: number = kanbanStore.getTaskIndex(task.id, newCategoryIndex)

        // Позиция и категория не изменились — ничего не делаем
        if (oldTaskIndex === newTaskPosition && oldCategoryIndex === newCategoryIndex) return

        const prevTask = kanbanStore.categories[newCategoryIndex]!.tasks[newTaskPosition - 1]
        const moveAfter: number | null = prevTask?.id ?? null

        let newCategoryId: number | undefined
        if (oldCategoryIndex !== newCategoryIndex) {
            newCategoryId = kanbanStore.categories[newCategoryIndex]!.id
        }

        taskService.updatePosition(
            task.id,
            moveAfter,
            newCategoryId
        )
    }

    function extractTaskDataFromPayload(payload: IDnDPayload): IExtractedTaskData | null {
        const data = payload.items[0]?.data
        if (!data?.source || data.index === undefined) return null

        const task = data.source[data.index]
        if (!task) return null

        return { task, oldTaskIndex: data.index }
    }

    return {
        categoryMoved,
        taskMoved,
    }
}
