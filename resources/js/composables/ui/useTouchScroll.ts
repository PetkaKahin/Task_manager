import {onUnmounted, unref, type Ref} from 'vue'
import {useTouchScrollStore} from '@/stores/touchScroll.store.ts'

interface TouchScrollOptions {
    id?: string
}

/**
 * Программный горизонтальный скролл для контейнера,
 * когда дочерние элементы имеют touch-action: none.
 *
 * Перехватывает touch-события на контейнере и двигает scrollLeft вручную.
 * Поддерживает инерцию после отпускания.
 */
export function useTouchScroll(containerRef: Ref<HTMLElement | null>, options: TouchScrollOptions = {}) {
    const {id} = options
    let startX = 0
    let startScrollLeft = 0
    let currentScrollLeft = 0
    let isScrolling = false
    let paused = false

    let lastX = 0
    let lastTime = 0
    let velocity = 0
    let animFrameId: number | null = null

    const friction = 0.95
    const minVelocity = 0.5

    function stopInertia() {
        if (animFrameId !== null) {
            cancelAnimationFrame(animFrameId)
            animFrameId = null
        }
    }

    function inertiaStep() {
        const container = unref(containerRef)
        if (!container) return

        velocity *= friction
        if (Math.abs(velocity) < minVelocity) {
            animFrameId = null
            return
        }

        currentScrollLeft -= velocity
        container.scrollLeft = currentScrollLeft
        animFrameId = requestAnimationFrame(inertiaStep)
    }

    function pause() {
        paused = true
        stopInertia()
        isScrolling = false
    }

    function resume() {
        paused = false
    }

    function onTouchStart(e: TouchEvent) {
        if (paused) return
        const container = unref(containerRef)
        if (!container || !e.touches[0]) return

        stopInertia()

        startX = e.touches[0].clientX
        startScrollLeft = container.scrollLeft
        currentScrollLeft = startScrollLeft
        lastX = startX
        lastTime = performance.now()
        velocity = 0
        isScrolling = true
    }

    function onTouchMove(e: TouchEvent) {
        if (!isScrolling || !e.touches[0]) return
        const container = unref(containerRef)
        if (!container) return

        const now = performance.now()
        const currentX = e.touches[0].clientX
        const dt = now - lastTime

        if (dt > 0) {
            velocity = (currentX - lastX) / dt * 16
        }

        lastX = currentX
        lastTime = now

        currentScrollLeft = startScrollLeft - (currentX - startX)
        container.scrollLeft = currentScrollLeft
    }

    function onTouchEnd() {
        if (!isScrolling) return
        isScrolling = false

        if (Math.abs(velocity) > minVelocity) {
            animFrameId = requestAnimationFrame(inertiaStep)
        }
    }

    function init() {
        const container = unref(containerRef)
        if (!container) return

        container.addEventListener('touchstart', onTouchStart, {passive: true})
        container.addEventListener('touchmove', onTouchMove, {passive: true})
        container.addEventListener('touchend', onTouchEnd)
        container.addEventListener('touchcancel', onTouchEnd)
    }

    function destroy() {
        stopInertia()
        const container = unref(containerRef)
        if (!container) return

        container.removeEventListener('touchstart', onTouchStart)
        container.removeEventListener('touchmove', onTouchMove)
        container.removeEventListener('touchend', onTouchEnd)
        container.removeEventListener('touchcancel', onTouchEnd)
    }

    if (id) {
        const touchScrollStore = useTouchScrollStore()
        touchScrollStore.register(id, {pause, resume})

        onUnmounted(() => {
            destroy()
            touchScrollStore.unregister(id)
        })
    } else {
        onUnmounted(destroy)
    }

    return {init, destroy, pause, resume}
}