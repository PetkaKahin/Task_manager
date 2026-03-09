import { describe, it, expect } from 'vitest'
import { useDeleteConfirm } from '@/composables/useDeleteConfirm'

describe('useDeleteConfirm', () => {

    // ── confirm ───────────────────────────────────────────────────────────────

    it('confirm устанавливает target', () => {
        const { confirm, target } = useDeleteConfirm<string>()

        confirm('item-1')

        expect(target.value).toBe('item-1')
    })

    it('confirm открывает модал (isOpen = true)', () => {
        const { confirm, isOpen } = useDeleteConfirm<string>()

        confirm('item-1')

        expect(isOpen.value).toBe(true)
    })

    it('confirm работает с объектами', () => {
        const { confirm, target } = useDeleteConfirm<{ id: number }>()
        const obj = { id: 42 }

        confirm(obj)

        expect(target.value).toStrictEqual({ id: 42 })
    })

    it('повторный confirm перезаписывает target', () => {
        const { confirm, target } = useDeleteConfirm<string>()

        confirm('first')
        confirm('second')

        expect(target.value).toBe('second')
    })

    // ── начальное состояние ───────────────────────────────────────────────────

    it('isOpen изначально false', () => {
        const { isOpen } = useDeleteConfirm()

        expect(isOpen.value).toBe(false)
    })

    it('target изначально null', () => {
        const { target } = useDeleteConfirm()

        expect(target.value).toBeNull()
    })

    // ── реактивность watch ────────────────────────────────────────────────────

    it('реактивно: target сбрасывается в null когда isOpen становится false', () => {
        const { confirm, isOpen, target } = useDeleteConfirm<string>()

        confirm('item-to-delete')
        expect(target.value).toBe('item-to-delete')

        isOpen.value = false

        expect(target.value).toBeNull()
    })

    it('реактивно: target НЕ сбрасывается когда isOpen становится true', () => {
        const { target, isOpen } = useDeleteConfirm<string>()
        target.value = 'pre-set'

        isOpen.value = true

        // watch срабатывает только на false, не трогает target при открытии
        expect(target.value).toBe('pre-set')
    })

    it('реактивно: несколько циклов открытия/закрытия работают корректно', () => {
        const { confirm, isOpen, target } = useDeleteConfirm<number>()

        confirm(1)
        expect(target.value).toBe(1)
        isOpen.value = false
        expect(target.value).toBeNull()

        confirm(2)
        expect(target.value).toBe(2)
        isOpen.value = false
        expect(target.value).toBeNull()
    })

    // ── изоляция экземпляров ──────────────────────────────────────────────────

    it('два экземпляра не влияют друг на друга', () => {
        const a = useDeleteConfirm<string>()
        const b = useDeleteConfirm<string>()

        a.confirm('A')
        b.confirm('B')

        expect(a.target.value).toBe('A')
        expect(b.target.value).toBe('B')
        expect(a.isOpen.value).toBe(true)
        expect(b.isOpen.value).toBe(true)
    })
})