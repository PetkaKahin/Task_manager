import {type ICategory} from "@/Types/models"
import {useApi} from "@/composables/api/useApi.ts";
import {apiRequest} from "@/shared/api/apiRequest.ts";
import {route} from "ziggy-js";

export function useApiCategories() {

    function updateCategory(category: ICategory) {
        return useApi<ICategory>(
            () => apiRequest.patch(route('api.categories.update', category.id), category),
            [] as unknown as ICategory
        )
    }

    return {
        updateCategory,
    }
}
