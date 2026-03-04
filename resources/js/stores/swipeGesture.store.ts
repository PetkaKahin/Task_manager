import {defineStore} from 'pinia'
import {shallowReactive} from 'vue'

export interface SwipeGestureInstance {
    pause: () => void
    resume: () => void
}

export const useSwipeGestureStore = defineStore('swipeGesture', () => {
    const instances = shallowReactive(new Map<string, SwipeGestureInstance>())

    function register(id: string, instance: SwipeGestureInstance) {
        instances.set(id, instance)
    }

    function unregister(id: string) {
        instances.delete(id)
    }

    function get(id: string): SwipeGestureInstance | undefined {
        return instances.get(id)
    }

    return {
        instances,
        register,
        unregister,
        get,
    }
})
