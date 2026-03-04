import {onUnmounted, unref, type Ref} from 'vue'

interface SwipeGestureOptions {
    onSwipeLeft?: () => void
    onSwipeRight?: () => void
    threshold?: number
}

/**
 * Распознаёт горизонтальный свайп на элементе.
 * Игнорирует жест, если вертикальное смещение больше горизонтального (вертикальный скролл).
 */
export function useSwipeGesture(containerRef: Ref<HTMLElement | null>, options: SwipeGestureOptions) {
    const {onSwipeLeft, onSwipeRight, threshold = 50} = options

    let startX = 0
    let startY = 0
    let tracking = false

    function onTouchStart(e: TouchEvent) {
        const touch = e.touches[0]
        if (!touch) return

        startX = touch.clientX
        startY = touch.clientY
        tracking = true
    }

    function onTouchEnd(e: TouchEvent) {
        if (!tracking) return
        tracking = false

        const touch = e.changedTouches[0]
        if (!touch) return

        const deltaX = touch.clientX - startX
        const deltaY = touch.clientY - startY

        if (Math.abs(deltaY) > Math.abs(deltaX)) return
        if (Math.abs(deltaX) < threshold) return

        if (deltaX < 0) {
            onSwipeLeft?.()
        } else {
            onSwipeRight?.()
        }
    }

    function init() {
        const container = unref(containerRef)
        if (!container) return

        container.addEventListener('touchstart', onTouchStart, {passive: true})
        container.addEventListener('touchend', onTouchEnd, {passive: true})
    }

    function destroy() {
        const container = unref(containerRef)
        if (!container) return

        container.removeEventListener('touchstart', onTouchStart)
        container.removeEventListener('touchend', onTouchEnd)
    }

    onUnmounted(destroy)

    return {init, destroy}
}
