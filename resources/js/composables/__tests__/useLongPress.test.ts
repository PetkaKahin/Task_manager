import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useLongPress } from '@/composables/ui/useLongPress'

function pointerEvent(x = 0, y = 0): PointerEvent {
    return { clientX: x, clientY: y } as PointerEvent
}

function touchEvent(x = 0, y = 0): TouchEvent {
    return { touches: [{ clientX: x, clientY: y }] } as unknown as TouchEvent
}

describe('useLongPress', () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => vi.useRealTimers())

    // ── начальное состояние ───────────────────────────────────────────────────

    it('isPressing изначально false', () => {
        expect(useLongPress().isPressing.value).toBe(false)
    })

    it('isReady изначально false', () => {
        expect(useLongPress().isReady.value).toBe(false)
    })

    // ── handlePress ───────────────────────────────────────────────────────────

    it('handlePress устанавливает isPressing = true', () => {
        const { isPressing, handlePress } = useLongPress()
        handlePress(pointerEvent())
        expect(isPressing.value).toBe(true)
    })

    it('isReady не становится true сразу после handlePress', () => {
        const { isReady, handlePress } = useLongPress()
        handlePress(pointerEvent())
        expect(isReady.value).toBe(false)
    })

    it('работает с TouchEvent — читает координаты из touches[0]', () => {
        const { isPressing, handlePress } = useLongPress()
        handlePress(touchEvent(100, 200))
        expect(isPressing.value).toBe(true)
    })

    // ── срабатывание по таймеру ───────────────────────────────────────────────

    it('после delay: isPressing = false, isReady = true', () => {
        const { isPressing, isReady, handlePress } = useLongPress({ delay: 500 })
        handlePress(pointerEvent())
        vi.advanceTimersByTime(500)
        expect(isPressing.value).toBe(false)
        expect(isReady.value).toBe(true)
    })

    it('до истечения delay: isPressing = true, isReady = false', () => {
        const { isPressing, isReady, handlePress } = useLongPress({ delay: 500 })
        handlePress(pointerEvent())
        vi.advanceTimersByTime(499)
        expect(isPressing.value).toBe(true)
        expect(isReady.value).toBe(false)
    })

    it('onReady вызывается с оригинальным событием после delay', () => {
        const onReady = vi.fn()
        const { handlePress } = useLongPress({ delay: 300, onReady })
        const e = pointerEvent(10, 20)
        handlePress(e)
        vi.advanceTimersByTime(300)
        expect(onReady).toHaveBeenCalledWith(e)
    })

    it('onReady не вызывается до истечения delay', () => {
        const onReady = vi.fn()
        const { handlePress } = useLongPress({ delay: 500, onReady })
        handlePress(pointerEvent())
        vi.advanceTimersByTime(499)
        expect(onReady).not.toHaveBeenCalled()
    })

    // ── cancel ────────────────────────────────────────────────────────────────

    it('cancel сбрасывает isPressing и isReady', () => {
        const { isPressing, isReady, handlePress, cancel } = useLongPress()
        handlePress(pointerEvent())
        cancel()
        expect(isPressing.value).toBe(false)
        expect(isReady.value).toBe(false)
    })

    it('cancel предотвращает срабатывание onReady', () => {
        const onReady = vi.fn()
        const { handlePress, cancel } = useLongPress({ delay: 500, onReady })
        handlePress(pointerEvent())
        cancel()
        vi.advanceTimersByTime(500)
        expect(onReady).not.toHaveBeenCalled()
    })

    it('pointerup отменяет нажатие', () => {
        const { isPressing, handlePress } = useLongPress()
        handlePress(pointerEvent())
        window.dispatchEvent(new PointerEvent('pointerup'))
        expect(isPressing.value).toBe(false)
    })

    it('pointercancel отменяет нажатие', () => {
        const { isPressing, handlePress } = useLongPress()
        handlePress(pointerEvent())
        window.dispatchEvent(new PointerEvent('pointercancel'))
        expect(isPressing.value).toBe(false)
    })

    // ── порог движения ────────────────────────────────────────────────────────

    it('движение в пределах moveThreshold не отменяет нажатие', () => {
        const { isPressing, handlePress } = useLongPress({ moveThreshold: 10 })
        handlePress(pointerEvent(0, 0))
        window.dispatchEvent(new PointerEvent('pointermove', { clientX: 5, clientY: 0 }))
        expect(isPressing.value).toBe(true)
    })

    it('движение сверх moveThreshold по X отменяет нажатие', () => {
        const { isPressing, handlePress } = useLongPress({ moveThreshold: 10 })
        handlePress(pointerEvent(0, 0))
        window.dispatchEvent(new PointerEvent('pointermove', { clientX: 15, clientY: 0 }))
        expect(isPressing.value).toBe(false)
    })

    it('движение сверх moveThreshold по Y отменяет нажатие', () => {
        const { isPressing, handlePress } = useLongPress({ moveThreshold: 10 })
        handlePress(pointerEvent(0, 0))
        window.dispatchEvent(new PointerEvent('pointermove', { clientX: 0, clientY: 15 }))
        expect(isPressing.value).toBe(false)
    })

    it('порог движения учитывает стартовую позицию из TouchEvent', () => {
        const onReady = vi.fn()
        const { handlePress } = useLongPress({ moveThreshold: 10, delay: 300, onReady })
        handlePress(touchEvent(100, 200))
        // Движение на 15px от стартовой точки → отмена
        window.dispatchEvent(new PointerEvent('pointermove', { clientX: 115, clientY: 200 }))
        vi.advanceTimersByTime(300)
        expect(onReady).not.toHaveBeenCalled()
    })

    // ── повторный handlePress ─────────────────────────────────────────────────

    it('второй handlePress отменяет первый таймер', () => {
        const onReady = vi.fn()
        const { handlePress } = useLongPress({ delay: 500, onReady })
        handlePress(pointerEvent())
        handlePress(pointerEvent())
        vi.advanceTimersByTime(500)
        expect(onReady).toHaveBeenCalledTimes(1)
    })
})