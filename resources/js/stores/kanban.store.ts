import {defineStore} from 'pinia';
import {nextTick, readonly, ref} from 'vue';
import type {ICategory, ITask} from "@/Types/models.ts";
import {emitter} from '@/eventBus.ts';

export interface IData {
    source?: any[]
    index?: number
}

export const useKanbanStore = defineStore('kanban', () => {
    const columns = ref<ICategory[]>([])

    function addTask(columnId: number, task: ITask) {
        const column = columns.value.find(column => column.id === columnId)
        column?.tasks.push(task)
    }

    function deleteTask(task: ITask) {
        const columnIndex = getColumnPosition(task.category_id)
        const taskIndex = getTaskPosition(task.id, columnIndex)

        columns.value[columnIndex]?.tasks.splice(taskIndex, 1)
    }

    function addColumn(index: number, kanbanColumn: ICategory) {
        columns.value.splice(index, 0, kanbanColumn);
    }

    function setColumns(newColumns: ICategory[]) {
        columns.value = newColumns
    }

    function getColumnIndexByTaskId(taskId: number): number {
        return columns.value.findIndex(items =>
            items.tasks.some(task => task.id === taskId)
        )
    }

    function getTaskPosition(taskId: number, columnIndex: number): number {
        return columns.value[columnIndex]?.tasks?.findIndex(task => task.id === taskId) ?? -1
    }

    function getColumnPosition(columnId: number): number {
        return columns.value.findIndex(column => column.id === columnId)
    }


    return {
        columns,
        addTask,
        addColumn,
        deleteTask,
        setColumns,
        getColumnIndexByTaskId,
        getTaskPosition,
        getColumnPosition
    };
});
