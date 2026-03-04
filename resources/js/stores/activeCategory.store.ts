import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useActiveCategoryStore = defineStore('activeCategory', () => {
    const activeCategoryIds = ref<Record<number, number>>({})

    function set(projectId: number, categoryId: number) {
        activeCategoryIds.value[projectId] = categoryId
    }

    function get(projectId: number): number | undefined {
        return activeCategoryIds.value[projectId]
    }

    return {activeCategoryIds, set, get}
})
