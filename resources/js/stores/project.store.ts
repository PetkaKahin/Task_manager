import {defineStore} from 'pinia';
import {type Ref, ref} from 'vue';
import type {IProject} from "@/Types/models.ts";

export const useProjectStore = defineStore('project', () => {
    const currentProject: Ref<IProject | undefined> = ref<IProject>()
    const projects: Ref<IProject[] | undefined> = ref<IProject[]>()

    function setProject(newProject: IProject) {
        currentProject.value = newProject
    }

    function setProjects(newProjects: IProject[]) {
        projects.value = newProjects
    }

    return {
        currentProject,
        projects,
        setProjects,
        setProject,
    };
});
