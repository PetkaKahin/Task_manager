import {type Component, computed, markRaw, reactive, readonly, ref} from "vue"

const backdrop = ref<Component | null>(null)
const stack = reactive<number[]>([])

let nextId = 0

/**
 * Composable для управления единственным backdrop-компонентом
 * между несколькими потребителями.
 *
 * Backdrop один на проект и отображается только у последнего
 * вызвавшего `open()`. При закрытии backdrop возвращается
 * к предыдущему в стеке.
 *
 * @example
 * // Инициализация (один раз в корне приложения)
 * const { init } = useBackdrop()
 * init(BaseBackdrop)
 *
 * @example
 * // Использование в компоненте
 * const { component, open, close } = useBackdrop()
 * open(() => console.log('closed'))
 *
 * <component :is="component" @click="close" />
 */
export function useBackdrop() {
    const id = nextId++
    let onClose: (() => void) | null = null

    const component = computed(() => {
        return stack[stack.length - 1] === id ? backdrop.value : null
    })

    const init = (backdropComponent: Component) => {
        backdrop.value = markRaw(backdropComponent)
    }

    const open = (closeCallback: (() => void) | null = null) => {
        onClose = closeCallback
        stack.push(id)
    }

    const close = () => {
        const pos = stack.indexOf(id)
        if (pos !== -1) stack.splice(pos, 1)
        onClose?.()
        onClose = null
    }

    return {
        component: readonly(component),
        init,
        open,
        close,
    }
}