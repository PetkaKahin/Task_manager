import {defineStore} from 'pinia'
import {shallowReactive} from 'vue'

export interface TouchScrollInstance {
    pause: () => void
    resume: () => void
}

export const useTouchScrollStore = defineStore('touchScroll', () => {
    const instances = shallowReactive(new Map<string, TouchScrollInstance>())

    function register(id: string, instance: TouchScrollInstance) {
        instances.set(id, instance)
    }

    function unregister(id: string) {
        instances.delete(id)
    }

    function get(id: string): TouchScrollInstance | undefined {
        return instances.get(id)
    }

    return {
        instances,
        register,
        unregister,
        get,
    }
})