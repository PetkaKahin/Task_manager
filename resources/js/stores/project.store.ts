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
        projects.value.length = 0
        projects.value.push(...newProjects)
    }

    function findIndexProject(projectId: number) {
        if (projects.value.length == 0) return -1

        return projects.value.findIndex(project => project.id === projectId)
    }

    function addProject(index: number, project: IProject) {
        projects.value.splice(index, 0, project)
    }

    function updateProject(updatedProject: IProject) {
        const index = findIndexProject(updatedProject.id)
        if (index === -1) return
        projects.value.splice(index, 1, { ...projects.value[index]!, ...updatedProject })
        if (currentProject.value?.id === updatedProject.id) {
            currentProject.value = { ...currentProject.value, ...updatedProject }
        }
    }

    function reorderProjects(projectIds: number[]) {
        const projMap = new Map(projects.value.map(p => [p.id, p]))
        const reordered: IProject[] = []
        for (const id of projectIds) {
            const proj = projMap.get(id)
            if (proj) {
                reordered.push(proj)
                projMap.delete(id)
            }
        }
        for (const proj of projMap.values()) {
            reordered.push(proj)
        }
        projects.value.splice(0, projects.value.length, ...reordered)
    }

    return {
        currentProject,
        projects,
        setProjects,
        setCurrentProject,
        deleteProject,
        updateProject,
        reorderProjects,
        findIndexProject,
        addProject,
    };
});
