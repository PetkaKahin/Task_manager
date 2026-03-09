import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { flushPromises } from '@vue/test-utils'
import { useKanbanCategory } from '@/composables/ui/useKanbanCategory'
import { useKanbanStore } from '@/stores/kanban.store'
import type { ICategory } from '@/Types/models'

// ── Mocks ─────────────────────────────────────────────────────────────────────

const apiRequestMock = vi.hoisted(() => ({ delete: vi.fn().mockResolvedValue({}) }))
const routeMock = vi.hoisted(() => vi.fn((_name: string, id?: number) => `/${id ?? ''}`))

vi.mock('@/shared/api/apiRequest', () => ({ apiRequest: apiRequestMock }))
vi.mock('ziggy-js', () => ({ route: routeMock }))
vi.mock('@/echo', () => ({ default: { socketId: vi.fn(() => null) } }))
vi.mock('@vue-dnd-kit/core', () => ({
    useDraggable: vi.fn(() => ({
        elementRef: { value: null },
        handleDragStart: vi.fn(),
        isDragging: { value: false },
        isOvered: { value: false },
    })),
    useDroppable: vi.fn(() => ({ elementRef: { value: null }, isOvered: { value: false } })),
    DnDOperations: { applyTransfer: vi.fn() },
}))
vi.mock('@/composables/ui/useKanban', () => ({
    cardDragState: { hasMoved: false },
    useKanban: vi.fn(() => ({ taskMoved: vi.fn(), categoryMoved: vi.fn() })),
}))

// ── Фабрика ───────────────────────────────────────────────────────────────────

function makeCategory(overrides: Partial<ICategory> = {}): ICategory {
    return { id: 10, project_id: 1, title: 'Cat', description: '', tasks: [], ...overrides }
}

// ── Тесты ─────────────────────────────────────────────────────────────────────

describe('useKanbanCategory', () => {
    let kanbanStore: ReturnType<typeof useKanbanStore>

    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
        kanbanStore = useKanbanStore()
    })

    // ── categoryDelete ────────────────────────────────────────────────────────

    describe('categoryDelete', () => {
        it('удаляет категорию из store немедленно (optimistic delete)', () => {
            const cat = makeCategory({ id: 10 })
            kanbanStore.categories = [cat]

            useKanbanCategory().categoryDelete(cat)

            expect(kanbanStore.categories).toHaveLength(0)
        })

        it('вызывает DELETE запрос с id категории', async () => {
            const cat = makeCategory({ id: 55 })
            kanbanStore.categories = [cat]

            useKanbanCategory().categoryDelete(cat)
            await flushPromises()

            expect(apiRequestMock.delete).toHaveBeenCalledOnce()
            expect(routeMock).toHaveBeenCalledWith('categories.destroy', 55)
        })

        it('восстанавливает категорию на прежнюю позицию при ошибке API', async () => {
            apiRequestMock.delete.mockRejectedValueOnce(new Error('fail'))

            const catA = makeCategory({ id: 1 })
            const catB = makeCategory({ id: 2 })
            const catC = makeCategory({ id: 3 })
            kanbanStore.categories = [catA, catB, catC]

            // Удаляем catB — она была на индексе 1
            useKanbanCategory().categoryDelete(catB)
            await flushPromises()

            // После ошибки catB должна вернуться на позицию 1
            expect(kanbanStore.categories).toHaveLength(3)
            expect(kanbanStore.categories[1]!.id).toBe(2)
        })

        it('не восстанавливает категорию при успешном DELETE', async () => {
            const cat = makeCategory({ id: 10 })
            kanbanStore.categories = [cat]

            useKanbanCategory().categoryDelete(cat)
            await flushPromises()

            expect(kanbanStore.categories).toHaveLength(0)
        })
    })
})