import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { ref } from 'vue'
import { useActiveCategoryStore } from '@/stores/activeCategory.store'
import { useEdgeScrollStore, type EdgeScrollInstance } from '@/stores/edgeScroll.store'
import { useSwipeGestureStore, type SwipeGestureInstance } from '@/stores/swipeGesture.store'
import { useTouchScrollStore, type TouchScrollInstance } from '@/stores/touchScroll.store'

// ─── Фабрики моков ───────────────────────────────────────────────────────────

function makeEdgeScrollInstance(): EdgeScrollInstance {
    return {
        startDrag: vi.fn(),
        stopDrag: vi.fn(),
        isDragging: ref(false),
    }
}

function makePausableInstance(): SwipeGestureInstance & TouchScrollInstance {
    return {
        pause: vi.fn(),
        resume: vi.fn(),
    }
}

// ─── activeCategory ──────────────────────────────────────────────────────────

describe('useActiveCategoryStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('set сохраняет активную категорию для проекта', () => {
        const store = useActiveCategoryStore()

        store.set(1, 42)

        expect(store.get(1)).toBe(42)
    })

    it('get возвращает undefined для неизвестного проекта', () => {
        const store = useActiveCategoryStore()

        expect(store.get(999)).toBeUndefined()
    })

    it('set перезаписывает предыдущее значение для того же проекта', () => {
        const store = useActiveCategoryStore()
        store.set(1, 10)
        store.set(1, 20)

        expect(store.get(1)).toBe(20)
    })

    it('разные проекты хранят независимые активные категории', () => {
        const store = useActiveCategoryStore()
        store.set(1, 10)
        store.set(2, 99)

        expect(store.get(1)).toBe(10)
        expect(store.get(2)).toBe(99)
    })

    it('реактивно: activeCategoryIds обновляется после set', () => {
        const store = useActiveCategoryStore()

        store.set(5, 77)

        expect(store.activeCategoryIds[5]).toBe(77)
    })
})

// ─── Общие тесты для registry-сторов ─────────────────────────────────────────
// edgeScroll, swipeGesture и touchScroll реализуют одинаковый паттерн:
// Map<string, Instance> + register / unregister / get

function describeRegistry<T>(
    name: string,
    useStore: () => { instances: Map<string, T>; register: (id: string, i: T) => void; unregister: (id: string) => void; get: (id: string) => T | undefined },
    makeInstance: () => T,
) {
    describe(name, () => {
        beforeEach(() => {
            setActivePinia(createPinia())
        })

        it('register добавляет инстанс в Map', () => {
            const store = useStore()
            const instance = makeInstance()

            store.register('a', instance)

            expect(store.instances.has('a')).toBe(true)
        })

        it('get возвращает зарегистрированный инстанс', () => {
            const store = useStore()
            const instance = makeInstance()
            store.register('a', instance)

            expect(store.get('a')).toBe(instance)
        })

        it('get возвращает undefined для незарегистрированного id', () => {
            const store = useStore()

            expect(store.get('unknown')).toBeUndefined()
        })

        it('unregister удаляет инстанс из Map', () => {
            const store = useStore()
            store.register('a', makeInstance())

            store.unregister('a')

            expect(store.instances.has('a')).toBe(false)
            expect(store.get('a')).toBeUndefined()
        })

        it('unregister несуществующего id не бросает ошибку', () => {
            const store = useStore()

            expect(() => store.unregister('ghost')).not.toThrow()
        })

        it('register перезаписывает инстанс при повторной регистрации того же id', () => {
            const store = useStore()
            const first = makeInstance()
            const second = makeInstance()
            store.register('a', first)

            store.register('a', second)

            expect(store.get('a')).toBe(second)
        })

        it('несколько инстансов регистрируются независимо', () => {
            const store = useStore()
            const a = makeInstance()
            const b = makeInstance()
            store.register('a', a)
            store.register('b', b)

            expect(store.get('a')).toBe(a)
            expect(store.get('b')).toBe(b)
            expect(store.instances.size).toBe(2)
        })

        it('после unregister одного инстанса остальные не затрагиваются', () => {
            const store = useStore()
            const a = makeInstance()
            const b = makeInstance()
            store.register('a', a)
            store.register('b', b)

            store.unregister('a')

            expect(store.get('a')).toBeUndefined()
            expect(store.get('b')).toBe(b)
        })
    })
}

describeRegistry('useEdgeScrollStore', useEdgeScrollStore, makeEdgeScrollInstance)
describeRegistry('useSwipeGestureStore', useSwipeGestureStore, makePausableInstance)
describeRegistry('useTouchScrollStore', useTouchScrollStore, makePausableInstance)