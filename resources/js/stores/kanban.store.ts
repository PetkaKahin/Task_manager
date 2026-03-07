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
    const pendingEditTaskId = ref<number | null>(null)
    const pendingRealIds = new Map<number, Promise<number | null>>()

    function registerPendingTask(tempId: number, promise: Promise<number | null>) {
        const resolved = promise.then(realId => {
            if (realId != null) {
                for (const category of categories.value) {
                    const task = category.tasks.find(t => t.id === tempId)
                    if (task) { task.id = realId; break }
                }
            }
            pendingRealIds.delete(tempId)
            return realId
        })
        pendingRealIds.set(tempId, resolved)
    }

    async function awaitRealId(taskId: number): Promise<number | null> {
        if (taskId >= 0) return taskId
        const promise = pendingRealIds.get(taskId)
        if (!promise) return null
        return promise
    }

    function addTask(categoryId: number, task: ITask) {
        const category = categories.value.find(category => category.id === categoryId)
        category?.tasks.push(task)
    }

    function updateTask(updatedTask: ITask) {
        const oldCategoryIndex = getCategoryIndexByTaskId(updatedTask.id)
        const newCategoryIndex = getCategoryIndex(updatedTask.category_id)

        if (oldCategoryIndex !== -1) {
            const oldTaskIndex = getTaskIndex(updatedTask.id, oldCategoryIndex)
            if (oldCategoryIndex === newCategoryIndex) {
                // Та же категория — обновляем свойства на месте
                Object.assign(categories.value[oldCategoryIndex]!.tasks[oldTaskIndex]!, updatedTask)
                return
            }
            // Удаляем из старой категории
            categories.value[oldCategoryIndex]!.tasks.splice(oldTaskIndex, 1)
        }

        // Добавляем в новую категорию
        if (newCategoryIndex !== -1) {
            categories.value[newCategoryIndex]!.tasks.push(updatedTask)
        }
    }

    function updateCategory(updatedCategory: ICategory) {
        const index = getCategoryIndex(updatedCategory.id)
        if (index === -1) return
        const tasks = categories.value[index]!.tasks
        categories.value[index]! = { ...updatedCategory, tasks }
    }

    function reorderTasks(categoryId: number, taskIds: number[]) {
        const categoryIndex = getCategoryIndex(categoryId)
        if (categoryIndex === -1) return
        const tasks = categories.value[categoryIndex]!.tasks
        const taskMap = new Map(tasks.map(t => [t.id, t]))
        const reordered: ITask[] = []
        for (const id of taskIds) {
            const task = taskMap.get(id)
            if (task) {
                reordered.push(task)
                taskMap.delete(id)
            }
        }
        for (const task of taskMap.values()) {
            reordered.push(task)
        }
        tasks.splice(0, tasks.length, ...reordered)
    }

    function deleteTask(task: ITask) {
        const categoryIndex = getCategoryIndexByTaskId(task.id)
        if (categoryIndex === -1) return
        const taskIndex = getTaskIndex(task.id, categoryIndex)
        if (taskIndex === -1) return
        categories.value[categoryIndex]!.tasks.splice(taskIndex, 1)
    }

    function addCategory(index: number, kanbanCategory: ICategory) {
        categories.value.splice(index, 0, kanbanCategory);
    }

    function reorderCategories(categoryIds: number[]) {
        const catMap = new Map(categories.value.map(c => [c.id, c]))
        const reordered: ICategory[] = []
        for (const id of categoryIds) {
            const cat = catMap.get(id)
            if (cat) {
                reordered.push(cat)
                catMap.delete(id)
            }
        }
        for (const cat of catMap.values()) {
            reordered.push(cat)
        }
        categories.value.splice(0, categories.value.length, ...reordered)
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
        pendingEditTaskId,
        addTask,
        updateTask,
        addCategory,
        updateCategory,
        reorderTasks,
        reorderCategories,
        deleteTask,
        setCategory,
        deleteCategory,
        getCategoryIndexByTaskId,
        getTaskIndex,
        getCategoryIndex,
        registerPendingTask,
        awaitRealId,
    };
});
