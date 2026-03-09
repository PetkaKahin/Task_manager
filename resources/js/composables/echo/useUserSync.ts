import { computed } from 'vue'
import { router, usePage } from '@inertiajs/vue3'
import { route } from 'ziggy-js'
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
                projectStore.addProject(0, data.project)
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
                const project = projectStore.projects.find(p => p.id === data.projectId)
                if (!project) return
                projectStore.deleteProject(project)
                const firstProject = projectStore.projects[0]
                if (firstProject) {
                    router.visit(route('projects.show', firstProject.id))
                } else {
                    router.visit(route('home'))
                }
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