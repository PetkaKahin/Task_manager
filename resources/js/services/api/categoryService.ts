import {apiRequest} from "@/shared/api/apiRequest.ts";

export const categoryService = {
    updatePosition(categoryId: number, moveAfter: number | null) {
        apiRequest.patch(route('api.categories.reorder', categoryId), {
            move_after_id: moveAfter
        }).catch((error) => {
            console.error(error)
        })
    }
}
