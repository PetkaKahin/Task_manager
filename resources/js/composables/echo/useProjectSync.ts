import { computed } from 'vue'
import { useProjectStore } from '@/stores/project.store'
import { useKanbanStore } from '@/stores/kanban.store'
import { usePresenceChannel } from '@/composables/echo/usePresenceChannel'
import type { ICategory, ITask } from '@/Types/models'

export function useProjectSync() {
    const projectStore = useProjectStore()
    const kanbanStore = useKanbanStore()

    const channelName = computed(() => {
        const id = projectStore.currentProject?.id
        return id ? `Project.${id}` : null
    })

    usePresenceChannel(channelName, [
        {
            event: '.Task.CreatedTask',
            handler: (data: { task: ITask }) => {
                kanbanStore.addTask(data.task.category_id, data.task)
            },
        },
        {
            event: '.Task.UpdatedTask',
            handler: (data: { task: ITask }) => {
                kanbanStore.updateTask(data.task)
            },
        },
        {
            event: '.Task.DeletedTask',
            handler: (data: { taskId: number; categoryId: number }) => {
                kanbanStore.deleteTask({ id: data.taskId, category_id: data.categoryId } as ITask)
            },
        },
        {
            event: '.Task.ReorderedTask',
            handler: (data: { categoryId: number; taskIds: number[] }) => {
                kanbanStore.reorderTasks(data.categoryId, data.taskIds)
            },
        },
        {
            event: '.Category.CreatedCategory',
            handler: (data: { category: ICategory }) => {
                kanbanStore.addCategory(kanbanStore.categories.length, data.category)
            },
        },
        {
            event: '.Category.UpdatedCategory',
            handler: (data: { category: Omit<ICategory, 'tasks'> }) => {
                kanbanStore.updateCategory(data.category as ICategory)
            },
        },
        {
            event: '.Category.DeletedCategory',
            handler: (data: { categoryId: number }) => {
                const category = kanbanStore.categories.find(c => c.id === data.categoryId)
                if (!category) return
                kanbanStore.deleteCategory(category)
            },
        },
        {
            event: '.Category.ReorderedCategory',
            handler: (data: { categoryIds: number[] }) => {
                kanbanStore.reorderCategories(data.categoryIds)
            },
        },
    ])

}