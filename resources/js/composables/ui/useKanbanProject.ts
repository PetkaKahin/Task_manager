import type {IProject} from "@/Types/models.ts";
import axios from "axios";
import {route} from "ziggy-js";
import {useModal} from "@/composables/ui/useModal.ts";
import {useProjectStore} from "@/stores/project.store.ts";
import {router} from "@inertiajs/vue3";

export function useKanbanProject() {
    const projectStore = useProjectStore()
    const modal = useModal()

    function projectDelete(project: IProject) {
        modal.addActionClosing(
            'delete.project',
            async () => {
                projectStore.deleteProject(project)
                try {
                    await axios.delete(route('projects.destroy', project.id))
                } catch (error) {
                    console.error(error)
                }
                router.visit(route('home'))
            }
        )
        modal.open()
    }

    return {
        projectDelete,
    }
}