import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useSidebar } from '@/composables/ui/useSidebar'
import { useProjectStore } from '@/stores/project.store'

describe('useSidebar', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        // isOpen — module-level ref (singleton), сбрасываем перед каждым тестом
        useSidebar().close()
    })

    // ── начальное состояние ───────────────────────────────────────────────────

    it('isOpen изначально false', () => {
        expect(useSidebar().isOpen.value).toBe(false)
    })

    // ── open / close ──────────────────────────────────────────────────────────

    it('open устанавливает isOpen = true', () => {
        const { open, isOpen } = useSidebar()
        open()
        expect(isOpen.value).toBe(true)
    })

    it('close устанавливает isOpen = false', () => {
        const { open, close, isOpen } = useSidebar()
        open()
        close()
        expect(isOpen.value).toBe(false)
    })

    it('повторный close не бросает ошибку', () => {
        const { close } = useSidebar()
        expect(() => { close(); close() }).not.toThrow()
    })

    // ── toggle ────────────────────────────────────────────────────────────────

    it('toggle открывает закрытый sidebar', () => {
        const { toggle, isOpen } = useSidebar()
        toggle()
        expect(isOpen.value).toBe(true)
    })

    it('toggle закрывает открытый sidebar', () => {
        const { open, toggle, isOpen } = useSidebar()
        open()
        toggle()
        expect(isOpen.value).toBe(false)
    })

    it('два вызова toggle возвращают исходное состояние', () => {
        const { toggle, isOpen } = useSidebar()
        toggle()
        toggle()
        expect(isOpen.value).toBe(false)
    })

    // ── singleton ─────────────────────────────────────────────────────────────

    it('isOpen — singleton: изменение через один экземпляр видно в другом', () => {
        const a = useSidebar()
        const b = useSidebar()
        a.open()
        expect(b.isOpen.value).toBe(true)
    })

    // ── projectsList ──────────────────────────────────────────────────────────

    it('projectsList реактивно отражает projects из store', () => {
        const { projectsList } = useSidebar()
        const store = useProjectStore()
        expect(projectsList.value).toHaveLength(0)

        store.addProject(0, { id: 1, title: 'P', position: 'a' })
        expect(projectsList.value).toHaveLength(1)
    })

    // ── isDesktop ─────────────────────────────────────────────────────────────

    it('isDesktop отражает текущую ширину окна', () => {
        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 })
        window.dispatchEvent(new Event('resize'))
        expect(useSidebar().isDesktop.value).toBe(true)

        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 800 })
        window.dispatchEvent(new Event('resize'))
        expect(useSidebar().isDesktop.value).toBe(false)
    })
})