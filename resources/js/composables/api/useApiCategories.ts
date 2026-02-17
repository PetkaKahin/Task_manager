import {type ICategory} from "@/Types/models"
import {useApi} from "@/composables/api/useApi.ts";
import {apiRequest} from "@/shared/api/apiRequest.ts";

export function useApiCategories() {

    function updateCategory(projectId: number, category: ICategory) {
        return useApi<ICategory>(
            () => apiRequest.patch(`projects/${projectId}/categories/${category.id}`, category),
            [] as unknown as ICategory
        )
    }

    return {
        updateCategory,
    }
}
