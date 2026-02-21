import {type Subscriber, useBackdrop} from "@/composables/ui/useBackdrop.ts";
import {ref} from "vue";

const MODAL_KEY = "modal"

const isOpen = ref<boolean>(false)
const backdrop = useBackdrop()

const subscriber: Subscriber = {
    key: MODAL_KEY,
    unsubscribeCallback: () => isOpen.value = false,
}

const actionsClosing = new Map<string, () => void>()

export function useModal() {
    const toggle = () => {
        if (isOpen.value) {
            close()
        } else {
            open()
        }
    }

    const open = ()=> {
        backdrop.open(subscriber)
        isOpen.value = true
    }

    const close = ()=> {
        backdrop.close(subscriber.key)
        isOpen.value = false
    }

    function addActionClosing(key: string, action: () => void) {
        actionsClosing.set(key, action)
    }

    /**
     * Выполняет action по ключу и удаляет его
     * Если ключ == null, то удаляет последний добавленный элемент в списке
     *
     * @param key
     */
    function runActionClosing(key: string | null = null) {
        if (!key) {
            const keys = [...actionsClosing.keys()]
            key = keys[keys.length - 1] ?? null
        }

        if (!key) return

        const action = actionsClosing.get(key)
        if (!action) return

        action()
        actionsClosing.delete(key)
    }

    return {
        actionsClosing,
        isOpen,
        open,
        close,
        toggle,
        addActionClosing,
        runActionClosing,
    }
}
