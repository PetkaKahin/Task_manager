import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { useProjectStore } from '@/stores/project.store'
import { usePrivateChannel } from '@/composables/echo/usePrivateChannel'
import type { IProject } from '@/Types/models'

export function useUserSync() {
    const projectStore = useProjectStore()
    const page = usePage()

    const channelName = computed(() => {
        const userId = (page.props.auth as any)?.user?.id
        return userId ? `User.${userId}` : null
    })

    usePrivateChannel(channelName, [
        {
            event: '.Project.CreatedProject',
            handler: (data: { project: IProject }) => {
                projectStore.addProject(projectStore.projects.length, data.project)
            },
        },
        {
            event: '.Project.UpdatedProject',
            handler: (data: { project: IProject }) => {
                projectStore.updateProject(data.project)
            },
        },
        {
            event: '.Project.DeletedProject',
            handler: (data: { projectId: number }) => {
                const index = projectStore.findIndexProject(data.projectId)
                if (index === -1) return
                projectStore.projects.splice(index, 1)
            },
        },
        {
            event: '.Project.ReorderedProject',
            handler: (data: { projectIds: number[] }) => {
                projectStore.reorderProjects(data.projectIds)
            },
        },
    ])
}