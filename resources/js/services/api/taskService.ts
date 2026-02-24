import {apiRequest} from "@/shared/api/apiRequest.ts";

export const taskService = {

    /**
     * Отправляет данные по смене позиции
     *
     * @moveAfter
     * null - первая позиция <br>
     * undefined - поле будет проигнорировано
     *
     * @newCategoryId
     * null - первая позиция <br>
     * undefined - поле будет проигнорировано
     */
    updatePosition(
        taskId: number,
        moveAfter: number | null | undefined = undefined,
        newCategoryId: number | null | undefined = undefined,
    )
    {
        const payload: any = {}

        if (moveAfter !== undefined) payload.move_after_id = moveAfter
        if (newCategoryId !== undefined) payload.category_id = newCategoryId

        apiRequest.patch(
            route('api.tasks.reorder', taskId),
            payload
        ).catch((error) => {
            console.error(error)
        })
    }
}
