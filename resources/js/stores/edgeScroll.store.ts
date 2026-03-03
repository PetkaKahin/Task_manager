import {defineStore} from 'pinia'
import {shallowReactive, type Ref} from 'vue'

export interface EdgeScrollInstance {
    startDrag: (e?: PointerEvent | TouchEvent) => void
    stopDrag: () => void
    isDragging: Ref<boolean>
}

export const useEdgeScrollStore = defineStore('edgeScroll', () => {
    const instances = shallowReactive(new Map<string, EdgeScrollInstance>())

    function register(id: string, instance: EdgeScrollInstance) {
        instances.set(id, instance)
    }

    function unregister(id: string) {
        instances.delete(id)
    }

    function get(id: string): EdgeScrollInstance | undefined {
        return instances.get(id)
    }

    return {
        instances,
        register,
        unregister,
        get,
    }
})