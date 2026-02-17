import {defineStore} from 'pinia';
import {readonly, type Ref, ref} from 'vue';
import type {IProject} from "@/Types/models.ts";

export const useProjectStore = defineStore('project', () => {
    const project: Ref<IProject | undefined> = ref<IProject>()

    function setProject(newProject: IProject) {
        project.value = newProject
    }

    return {
        project,
        setProject
    };
});
