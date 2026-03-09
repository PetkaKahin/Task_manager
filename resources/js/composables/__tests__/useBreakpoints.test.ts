import { describe, it, expect, beforeEach } from 'vitest'
import { useBreakpoints } from '@/composables/useBreakpoints'

// width — module-level ref, обновляется через window.resize
function setWidth(px: number) {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: px })
    window.dispatchEvent(new Event('resize'))
}

describe('useBreakpoints', () => {
    beforeEach(() => {
        setWidth(0)
    })

    // ── breakpoint (эксклюзивные зоны) ───────────────────────────────────────

    describe('breakpoint', () => {
        it('возвращает "mobile" при width < 425', () => {
            setWidth(424)
            const { breakpoint } = useBreakpoints()
            expect(breakpoint.value).toBe('mobile')
        })

        it('возвращает "tablet" при 425 ≤ width < 768', () => {
            setWidth(425)
            expect(useBreakpoints().breakpoint.value).toBe('tablet')

            setWidth(767)
            expect(useBreakpoints().breakpoint.value).toBe('tablet')
        })

        it('возвращает "laptop" при 768 ≤ width < 1024', () => {
            setWidth(768)
            expect(useBreakpoints().breakpoint.value).toBe('laptop')

            setWidth(1023)
            expect(useBreakpoints().breakpoint.value).toBe('laptop')
        })

        it('возвращает "desktop" при width ≥ 1024', () => {
            setWidth(1024)
            expect(useBreakpoints().breakpoint.value).toBe('desktop')

            setWidth(1920)
            expect(useBreakpoints().breakpoint.value).toBe('desktop')
        })
    })

    // ── isMobile ──────────────────────────────────────────────────────────────

    describe('isMobile', () => {
        it('true при width < 425', () => {
            setWidth(424)
            expect(useBreakpoints().isMobile.value).toBe(true)
        })

        it('false при width = 425', () => {
            setWidth(425)
            expect(useBreakpoints().isMobile.value).toBe(false)
        })

        it('false при width > 425', () => {
            setWidth(1200)
            expect(useBreakpoints().isMobile.value).toBe(false)
        })
    })

    // ── isTablet ──────────────────────────────────────────────────────────────
    // Текущая реализация: width >= 425 (true для laptop и desktop тоже)
    // Это не соответствует эксклюзивной зоне из breakpoint — потенциальный баг

    describe('isTablet', () => {
        it('false при width < 425', () => {
            setWidth(424)
            expect(useBreakpoints().isTablet.value).toBe(false)
        })

        it('true при width = 425 (начало планшетной зоны)', () => {
            setWidth(425)
            expect(useBreakpoints().isTablet.value).toBe(true)
        })

        it('true при width = 1200 (desktop) — isTablet не ограничен сверху', () => {
            // Текущее поведение: isTablet === width >= 425, без верхней границы.
            // Ожидаемое (если это баг): false при width >= 768.
            setWidth(1200)
            expect(useBreakpoints().isTablet.value).toBe(true)
        })

        it('breakpoint("desktop") и isTablet(true) существуют одновременно при width=1200', () => {
            // Документирует несоответствие между isTablet и breakpoint
            setWidth(1200)
            const bp = useBreakpoints()
            expect(bp.breakpoint.value).toBe('desktop')
            expect(bp.isTablet.value).toBe(true) // исключительные значения конфликтуют
        })
    })

    // ── isLaptop ──────────────────────────────────────────────────────────────

    describe('isLaptop', () => {
        it('false при width ≤ 768', () => {
            setWidth(768)
            expect(useBreakpoints().isLaptop.value).toBe(false)
        })

        it('true при width > 768', () => {
            setWidth(769)
            expect(useBreakpoints().isLaptop.value).toBe(true)
        })
    })

    // ── isDesktop ─────────────────────────────────────────────────────────────

    describe('isDesktop', () => {
        it('false при width < 1024', () => {
            setWidth(1023)
            expect(useBreakpoints().isDesktop.value).toBe(false)
        })

        it('true при width ≥ 1024', () => {
            setWidth(1024)
            expect(useBreakpoints().isDesktop.value).toBe(true)
        })
    })

    // ── реактивность ──────────────────────────────────────────────────────────

    describe('реактивность', () => {
        it('все computed обновляются после смены window.innerWidth', () => {
            setWidth(300)
            const bp = useBreakpoints()
            expect(bp.isMobile.value).toBe(true)
            expect(bp.breakpoint.value).toBe('mobile')

            setWidth(1200)
            expect(bp.isMobile.value).toBe(false)
            expect(bp.breakpoint.value).toBe('desktop')
        })

        it('width реактивно отражает текущий innerWidth после resize', () => {
            setWidth(500)
            const { width } = useBreakpoints()
            expect(width.value).toBe(500)

            setWidth(1000)
            expect(width.value).toBe(1000)
        })
    })
})