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

    function addTask(categoryId: number, task: ITask) {
        const category = categories.value.find(category => category.id === categoryId)
        category?.tasks.push(task)
    }

    function deleteTask(task: ITask) {
        const categoryIndex = getCategoryIndex(task.category_id)
        const taskIndex = getTaskIndex(task.id, categoryIndex)

        categories.value[categoryIndex]?.tasks.splice(taskIndex, 1)
    }

    function addCategory(index: number, kanbanCategory: ICategory) {
        categories.value.splice(index, 0, kanbanCategory);
    }

    function deleteCategory(category: ICategory) {
        const index = getCategoryIndex(category.id)
        if (index === -1) return

        categories.value.splice(index, 1)
    }

    function setCategory(newCategories: ICategory[]) {
        animationsEnabled.value = false
        categories.value = newCategories
        nextTick(() => { animationsEnabled.value = true })
    }

    function getCategoryIndexByTaskId(taskId: number): number {
        return categories.value.findIndex(items =>
            items.tasks.some(task => task.id === taskId)
        )
    }

    function getTaskIndex(taskId: number, columnIndex: number): number {
        return categories.value[columnIndex]?.tasks?.findIndex(task => task.id === taskId) ?? -1
    }

    function getCategoryIndex(categoryId: number): number {
        return categories.value.findIndex(category => category.id === categoryId)
    }


    return {
        categories,
        animationsEnabled,
        addTask,
        addCategory,
        deleteTask,
        setCategory,
        deleteCategory,
        getCategoryIndexByTaskId,
        getTaskIndex,
        getCategoryIndex
    };
});
