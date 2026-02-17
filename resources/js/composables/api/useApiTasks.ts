import {type ITask} from "@/Types/models"
import {useApi} from "@/composables/api/useApi.ts";
import {apiRequest} from "@/shared/api/apiRequest.ts";

export function useCategories() {
    function updateTask(projectId: number, categoryId: number, task: ITask) {
        return useApi<ITask>(
            () => apiRequest.patch(`projects/${projectId}/categories/${categoryId}/tasks/${task.id}`, task),
            [] as ITask
        )
    }

    return {
        updateTask,
    }
}
