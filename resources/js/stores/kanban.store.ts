import {defineStore} from 'pinia';
import {nextTick, ref} from 'vue';
import type {ICategory, ITask} from "@/Types/models.ts";

export interface IData {
    source?: any[]
    index?: number
}

export const useKanbanStore = defineStore('kanban', () => {
    const categories = ref<ICategory[]>([])
    const animationsEnabled = ref(false)

    function addTask(columnId: number, task: ITask) {
        const column = categories.value.find(column => column.id === columnId)
        column?.tasks.push(task)
    }

    function deleteTask(task: ITask) {
        const columnIndex = getColumnPosition(task.category_id)
        const taskIndex = getTaskPosition(task.id, columnIndex)

        categories.value[columnIndex]?.tasks.splice(taskIndex, 1)
    }

    function addColumn(index: number, kanbanColumn: ICategory) {
        categories.value.splice(index, 0, kanbanColumn);
    }

    function setColumns(newColumns: ICategory[]) {
        animationsEnabled.value = false
        categories.value = newColumns
        nextTick(() => { animationsEnabled.value = true })
    }

    function getColumnIndexByTaskId(taskId: number): number {
        return categories.value.findIndex(items =>
            items.tasks.some(task => task.id === taskId)
        )
    }

    function getTaskPosition(taskId: number, columnIndex: number): number {
        return categories.value[columnIndex]?.tasks?.findIndex(task => task.id === taskId) ?? -1
    }

    function getColumnPosition(columnId: number): number {
        return categories.value.findIndex(column => column.id === columnId)
    }


    return {
        categories,
        animationsEnabled,
        addTask,
        addColumn,
        deleteTask,
        setColumns,
        getColumnIndexByTaskId,
        getTaskPosition,
        getColumnPosition
    };
});
