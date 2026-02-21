import {defineStore} from 'pinia';
import {type Ref, ref} from 'vue';
import type {IProject} from "@/Types/models.ts";

export const useProjectStore = defineStore('project', () => {
    const currentProject: Ref<IProject | undefined> = ref<IProject>()
    const projects: Ref<IProject[]> = ref<IProject[]>([])

    function deleteProject(project: IProject) {
        const index = findIndexProject(project.id)
        if (index == -1) return

        projects.value.splice(index, 1)
    }

    function setCurrentProject(newProject: IProject) {
        currentProject.value = newProject
    }

    function setProjects(newProjects: IProject[]) {
        projects.value = newProjects
    }

    function findIndexProject(projectId: number) {
        if (projects.value.length == 0) return -1

        return projects.value.findIndex(project => project.id === projectId)
    }

    return {
        currentProject,
        projects,
        setProjects,
        setCurrentProject,
        deleteProject,
    };
});
