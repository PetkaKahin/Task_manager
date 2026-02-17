import {apiRequest} from "@/shared/api/apiRequest.ts";

export const categoryService = {
    updatePosition(projectId: number, categoryId: number, moveAfter: number | null) {
        apiRequest.patch(`/projects/${projectId}/categories/${categoryId}/reorder`, {
            move_after: moveAfter
        }).catch((error) => {
            console.error(error)
        })
    }
}
