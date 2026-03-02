import {type ITask} from "@/Types/models"
import {useApi} from "@/composables/api/useApi.ts";
import {apiRequest} from "@/shared/api/apiRequest.ts";
import {route} from "ziggy-js";

export function useApiTasks() {
    function storeTask(task: Pick<ITask, 'category_id' | 'content'>) {
        return useApi<ITask>(
            () => apiRequest.post(route('api.tasks.store'), task),
            [] as unknown as ITask
        )
    }

    function updateTask(task: ITask) {
        return useApi<ITask>(
            () => apiRequest.patch(route('api.tasks.update', task.id), task),
            [] as unknown as ITask
        )
    }

    return {
        storeTask,
        updateTask,
    }
}
