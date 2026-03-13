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
            handler: (data: { task_id: number }) => {
                kanbanStore.deleteTask({ id: data.task_id } as ITask)
            },
        },
        {
            event: '.Task.ReorderedTask',
            handler: (data: { category_id: number; task_ids: number[] }) => {
                kanbanStore.reorderTasks(data.category_id, data.task_ids)
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
            handler: (data: { category_id: number }) => {
                const category = kanbanStore.categories.find(c => c.id === data.category_id)
                if (!category) return
                kanbanStore.deleteCategory(category)
            },
        },
        {
            event: '.Category.ReorderedCategory',
            handler: (data: { category_ids: number[] }) => {
                kanbanStore.reorderCategories(data.category_ids)
            },
        },
    ])

}