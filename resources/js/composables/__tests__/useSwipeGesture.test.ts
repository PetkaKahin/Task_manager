import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { useSwipeGesture } from '@/composables/ui/useSwipeGesture'

// happy-dom может не поддерживать конструктор Touch, поэтому создаём
// события вручную и проставляем touches/changedTouches напрямую.
function dispatchTouchStart(el: HTMLElement, x: number, y: number) {
    const event = new Event('touchstart') as any
    event.touches = [{ clientX: x, clientY: y }]
    el.dispatchEvent(event)
}

function dispatchTouchEnd(el: HTMLElement, x: number, y: number) {
    const event = new Event('touchend') as any
    event.changedTouches = [{ clientX: x, clientY: y }]
    el.dispatchEvent(event)
}

function swipe(el: HTMLElement, startX: number, endX: number, startY = 0, endY = 0) {
    dispatchTouchStart(el, startX, startY)
    dispatchTouchEnd(el, endX, endY)
}

describe('useSwipeGesture', () => {
    let container: HTMLElement
    let containerRef: ReturnType<typeof ref<HTMLElement | null>>

    beforeEach(() => {
        setActivePinia(createPinia())
        container = document.createElement('div')
        containerRef = ref(container)
    })

    // ── основные свайпы ───────────────────────────────────────────────────────

    it('onSwipeLeft вызывается при свайпе влево (>= threshold)', () => {
        const onSwipeLeft = vi.fn()
        const { init } = useSwipeGesture(containerRef, { onSwipeLeft, threshold: 50 })
        init()
        swipe(container, 200, 140) // deltaX = -60
        expect(onSwipeLeft).toHaveBeenCalledTimes(1)
    })

    it('onSwipeRight вызывается при свайпе вправо (>= threshold)', () => {
        const onSwipeRight = vi.fn()
        const { init } = useSwipeGesture(containerRef, { onSwipeRight, threshold: 50 })
        init()
        swipe(container, 100, 160) // deltaX = +60
        expect(onSwipeRight).toHaveBeenCalledTimes(1)
    })

    // ── порог ─────────────────────────────────────────────────────────────────

    it('не срабатывает если |deltaX| < threshold', () => {
        const onSwipeLeft = vi.fn()
        const { init } = useSwipeGesture(containerRef, { onSwipeLeft, threshold: 50 })
        init()
        swipe(container, 200, 170) // deltaX = -30 < 50
        expect(onSwipeLeft).not.toHaveBeenCalled()
    })

    it('срабатывает точно на границе threshold', () => {
        const onSwipeLeft = vi.fn()
        const { init } = useSwipeGesture(containerRef, { onSwipeLeft, threshold: 50 })
        init()
        swipe(container, 200, 150) // deltaX = -50 === 50
        expect(onSwipeLeft).toHaveBeenCalledTimes(1)
    })

    // ── вертикальный скролл ───────────────────────────────────────────────────

    it('игнорирует жест если |deltaY| > |deltaX| (вертикальный скролл)', () => {
        const onSwipeLeft = vi.fn()
        const { init } = useSwipeGesture(containerRef, { onSwipeLeft, threshold: 50 })
        init()
        swipe(container, 200, 100, 0, 200) // deltaX=-100, deltaY=200
        expect(onSwipeLeft).not.toHaveBeenCalled()
    })

    // ── pause / resume ────────────────────────────────────────────────────────

    it('pause: touchstart игнорируется, свайп не определяется', () => {
        const onSwipeLeft = vi.fn()
        const { init, pause } = useSwipeGesture(containerRef, { onSwipeLeft, threshold: 50 })
        init()
        pause()
        swipe(container, 200, 100)
        expect(onSwipeLeft).not.toHaveBeenCalled()
    })

    it('resume: после pause свайп снова работает', () => {
        const onSwipeLeft = vi.fn()
        const { init, pause, resume } = useSwipeGesture(containerRef, { onSwipeLeft, threshold: 50 })
        init()
        pause()
        resume()
        swipe(container, 200, 100)
        expect(onSwipeLeft).toHaveBeenCalledTimes(1)
    })

    // ── destroy ───────────────────────────────────────────────────────────────

    it('destroy: события не обрабатываются после удаления слушателей', () => {
        const onSwipeLeft = vi.fn()
        const { init, destroy } = useSwipeGesture(containerRef, { onSwipeLeft, threshold: 50 })
        init()
        destroy()
        swipe(container, 200, 100)
        expect(onSwipeLeft).not.toHaveBeenCalled()
    })

    // ── без init ──────────────────────────────────────────────────────────────

    it('без вызова init события не обрабатываются', () => {
        const onSwipeLeft = vi.fn()
        useSwipeGesture(containerRef, { onSwipeLeft, threshold: 50 })
        swipe(container, 200, 100)
        expect(onSwipeLeft).not.toHaveBeenCalled()
    })

    // ── containerRef = null ───────────────────────────────────────────────────

    it('init с null containerRef не бросает ошибку', () => {
        const { init } = useSwipeGesture(ref(null), { threshold: 50 })
        expect(() => init()).not.toThrow()
    })

    it('destroy с null containerRef не бросает ошибку', () => {
        const { destroy } = useSwipeGesture(ref(null), { threshold: 50 })
        expect(() => destroy()).not.toThrow()
    })

    // ── с id: интеграция со store ─────────────────────────────────────────────

    it('с id: pause через store останавливает обработку свайпа', () => {
        const onSwipeLeft = vi.fn()
        const { init, pause } = useSwipeGesture(containerRef, { id: 'my-swipe', onSwipeLeft, threshold: 50 })
        init()
        pause()
        swipe(container, 200, 100)
        expect(onSwipeLeft).not.toHaveBeenCalled()
    })
})