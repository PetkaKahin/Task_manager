import { describe, it, expect, beforeEach } from 'vitest'
import { defineComponent, createApp } from 'vue'
import { useDropdown } from '@/composables/ui/useDropdown'

// ── Вспомогательные функции ───────────────────────────────────────────────────

function makeRect(props: Partial<DOMRect> = {}): DOMRect {
    return { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => '', ...props } as DOMRect
}

function mockElement(rectProps: Partial<DOMRect>): HTMLElement {
    const el = document.createElement('div')
    el.getBoundingClientRect = () => makeRect(rectProps)
    return el
}

// Открывает dropdown, устанавливая rect-мок для button и (опционально) dropdown
async function openDropdown(
    dd: ReturnType<typeof useDropdown>,
    buttonProps: Partial<DOMRect>,
    dropdownProps?: Partial<DOMRect>,
) {
    dd.buttonRef.value = mockElement(buttonProps)
    if (dropdownProps !== undefined) {
        dd.dropdownRef.value = mockElement(dropdownProps)
    }
    await dd.toggle()
}

// withSetup — нужен только для тестов с click-outside (onMounted)
function withSetup<T>(composable: () => T) {
    let result!: T
    const app = createApp(defineComponent({
        setup() { result = composable(); return () => {} },
    }))
    app.mount(document.createElement('div'))
    return { result, unmount: () => app.unmount() }
}

// ── Тесты ─────────────────────────────────────────────────────────────────────

describe('useDropdown', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'innerWidth',  { writable: true, configurable: true, value: 1000 })
        Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 800 })
    })

    // ── начальное состояние ───────────────────────────────────────────────────

    it('isOpen изначально false', () => {
        expect(useDropdown().isOpen.value).toBe(false)
    })

    it('dropdownStyle возвращает {} когда buttonRect не установлен', () => {
        expect(useDropdown().dropdownStyle.value).toEqual({})
    })

    // ── toggle ────────────────────────────────────────────────────────────────

    it('toggle открывает dropdown (isOpen = true)', async () => {
        const dd = useDropdown()
        dd.buttonRef.value = mockElement({})
        await dd.toggle()
        expect(dd.isOpen.value).toBe(true)
    })

    it('toggle закрывает открытый dropdown', async () => {
        const dd = useDropdown()
        dd.buttonRef.value = mockElement({})
        await dd.toggle()
        await dd.toggle()
        expect(dd.isOpen.value).toBe(false)
    })

    // ── close ─────────────────────────────────────────────────────────────────

    it('close устанавливает isOpen = false', async () => {
        const dd = useDropdown()
        dd.buttonRef.value = mockElement({})
        await dd.toggle()
        dd.close()
        expect(dd.isOpen.value).toBe(false)
    })

    // ── dropdownStyle: базовое позиционирование ───────────────────────────────

    it('позиционирует dropdown ниже кнопки с gap', async () => {
        // gap=10 по умолчанию: top = button.bottom + 10
        const dd = useDropdown()
        await openDropdown(dd, { bottom: 100, right: 300 })

        expect(dd.dropdownStyle.value).toEqual({
            top: '110px',       // 100 + 10
            right: '700px',     // 1000 - 300
        })
    })

    it('кастомные padding и gap применяются корректно', async () => {
        const dd = useDropdown(4, 6)
        await openDropdown(dd, { bottom: 200, right: 400 })

        expect(dd.dropdownStyle.value).toEqual({
            top: '206px',   // 200 + 6
            right: '600px', // 1000 - 400
        })
    })

    // ── dropdownStyle: нижнее переполнение → перенос наверх ──────────────────

    it('переносит dropdown выше кнопки если не помещается снизу', async () => {
        // bottom=700, dropdown.height=150 → top=710, 710+150=860 > 800 → overflow
        // → top = button.top(680) - gap(10) - height(150) = 520
        const dd = useDropdown()
        await openDropdown(dd,
            { bottom: 700, top: 680, right: 300 },
            { height: 150, width: 100 },
        )

        expect(dd.dropdownStyle.value).toMatchObject({ top: '520px' })
    })

    it('прижимает к верхнему padding если после переноса top < padding', async () => {
        // button.top=5, gap=10, dropdown.height=100 → adjusted top = 5-10-100 = -105 < 8 → 8
        const dd = useDropdown()
        await openDropdown(dd,
            { bottom: 780, top: 5, right: 300 },
            { height: 100, width: 80 },
        )

        expect(dd.dropdownStyle.value).toMatchObject({ top: '8px' })
    })

    // ── dropdownStyle: левое переполнение → сдвиг вправо ─────────────────────

    it('корректирует right если dropdown выходит за левый край', async () => {
        // button.right=100, innerWidth=400, dropdown.width=200
        // right=300, leftEdge = 400-300-200 = -100 < 8 → right = 400-200-8 = 192
        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 400 })
        const dd = useDropdown()
        await openDropdown(dd,
            { bottom: 100, right: 100 },
            { height: 40, width: 200 },
        )

        expect(dd.dropdownStyle.value).toMatchObject({ right: '192px' })
    })

    // ── dropdownStyle: right < padding ────────────────────────────────────────

    it('прижимает right к padding если кнопка у правого края', async () => {
        // button.right=997, innerWidth=1000 → right=3 < 8 → right=8
        const dd = useDropdown()
        await openDropdown(dd, { bottom: 100, right: 997 })

        expect(dd.dropdownStyle.value).toMatchObject({ right: '8px' })
    })

    // ── click outside ─────────────────────────────────────────────────────────

    it('клик за пределами button и dropdown закрывает dropdown', async () => {
        const { result: dd, unmount } = withSetup(() => useDropdown())

        dd.buttonRef.value = mockElement({})
        await dd.toggle()
        expect(dd.isOpen.value).toBe(true)

        document.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        expect(dd.isOpen.value).toBe(false)

        unmount()
    })

    it('клик внутри button НЕ закрывает dropdown', async () => {
        const { result: dd, unmount } = withSetup(() => useDropdown())

        const btn = document.createElement('div')
        document.body.appendChild(btn)
        btn.getBoundingClientRect = () => makeRect({})
        dd.buttonRef.value = btn

        await dd.toggle()
        btn.dispatchEvent(new MouseEvent('click', { bubbles: true }))

        expect(dd.isOpen.value).toBe(true)

        document.body.removeChild(btn)
        unmount()
    })
})