import {apiRequest} from "@/shared/api/apiRequest.ts";
import {route} from "ziggy-js";
import type {IProject} from "@/Types/models.ts";
import type {AxiosResponse} from "axios";

export const projectService = () => {

    const getProjects = async (): Promise<AxiosResponse<IProject[]>> => {
        try {
            return await apiRequest.get<IProject[]>(route('api.projects.index'))
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    return {
        getProjects,
    }
}
