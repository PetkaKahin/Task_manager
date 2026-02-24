import {type ITask} from "@/Types/models"
import {useApi} from "@/composables/api/useApi.ts";
import {apiRequest} from "@/shared/api/apiRequest.ts";
import {route} from "ziggy-js";

export function useApiTasks() {
    function updateTask(task: ITask) {
        return useApi<ITask>(
            () => apiRequest.patch(route('api.tasks.update', task.id), task),
            [] as unknown as ITask
        )
    }

    return {
        updateTask,
    }
}
