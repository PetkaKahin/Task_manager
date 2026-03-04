import {ref, type Ref} from "vue";

interface UseLongPressOptions {
    delay?: number
    moveThreshold?: number
    onReady?: (e: PointerEvent | TouchEvent) => void
}

interface UseLongPressReturn {
    isPressing: Ref<boolean>
    isReady: Ref<boolean>
    handlePress: (e: PointerEvent | TouchEvent) => void
    cancel: () => void
}

export function useLongPress(options: UseLongPressOptions = {}): UseLongPressReturn {
    const {delay = 500, moveThreshold = 10, onReady} = options
    const isPressing = ref(false)
    const isReady = ref(false)

    let timerId: ReturnType<typeof setTimeout> | null = null
    let startX = 0
    let startY = 0

    function cleanup() {
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerup', cancel)
        window.removeEventListener('pointercancel', cancel)
    }

    function cancel() {
        if (timerId !== null) {
            clearTimeout(timerId)
            timerId = null
        }
        isPressing.value = false
        isReady.value = false
        cleanup()
    }

    function onPointerMove(e: PointerEvent) {
        if (Math.abs(e.clientX - startX) > moveThreshold || Math.abs(e.clientY - startY) > moveThreshold) {
            cancel()
        }
    }

    function handlePress(e: PointerEvent | TouchEvent) {
        cancel()

        if ('clientX' in e) {
            startX = e.clientX
            startY = e.clientY
        } else if (e.touches[0]) {
            startX = e.touches[0].clientX
            startY = e.touches[0].clientY
        }

        isPressing.value = true
        const storedEvent = e

        timerId = setTimeout(() => {
            timerId = null
            isPressing.value = false
            isReady.value = true
            cleanup()
            onReady?.(storedEvent)
        }, delay)

        window.addEventListener('pointermove', onPointerMove)
        window.addEventListener('pointerup', cancel, {once: true})
        window.addEventListener('pointercancel', cancel, {once: true})
    }

    return {
        isPressing,
        isReady,
        handlePress,
        cancel,
    }
}