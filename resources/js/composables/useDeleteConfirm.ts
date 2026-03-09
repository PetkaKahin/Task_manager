import {type Ref, ref, watch} from "vue"

export function useDeleteConfirm<T>() {
    const isOpen = ref(false)
    const target = ref<T | null>(null) as Ref<T | null>

    const confirm = (item: T) => {
        target.value = item
        isOpen.value = true
    }

    watch(isOpen, (value) => {
        if (!value) target.value = null
    }, { flush: 'sync' })

    return { isOpen, target, confirm }
}