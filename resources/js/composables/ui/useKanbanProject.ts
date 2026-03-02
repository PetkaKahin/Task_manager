import type {IProject} from "@/Types/models.ts";
import axios from "axios";
import {route} from "ziggy-js";
import {useProjectStore} from "@/stores/project.store.ts";
import {router} from "@inertiajs/vue3";

export function useKanbanProject() {
    const projectStore = useProjectStore()

    async function projectDelete(project: IProject) {
        projectStore.deleteProject(project)
        try {
            await axios.delete(route('projects.destroy', project.id))
        } catch (error) {
            console.error(error)
        }
        router.visit(route('home'))
    }

    return {
        projectDelete,
    }
}