import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { flushPromises } from '@vue/test-utils'
import { useKanbanCard } from '@/composables/ui/useKanbanCard'
import { useKanbanStore } from '@/stores/kanban.store'
import type { ITask } from '@/Types/models'

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
}))
vi.mock('@/composables/ui/useKanban', () => ({
    cardDragState: { hasMoved: false },
    useKanban: vi.fn(() => ({ taskMoved: vi.fn(), categoryMoved: vi.fn() })),
}))

// ── Фабрика ───────────────────────────────────────────────────────────────────

function makeTask(overrides: Partial<ITask> = {}): ITask {
    return { id: 1, category_id: 10, content: null, ...overrides }
}

// ── Тесты ─────────────────────────────────────────────────────────────────────

describe('useKanbanCard', () => {
    let kanbanStore: ReturnType<typeof useKanbanStore>

    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
        kanbanStore = useKanbanStore()
    })

    // ── taskDelete ────────────────────────────────────────────────────────────

    describe('taskDelete', () => {
        it('удаляет задачу из store немедленно (optimistic delete)', async () => {
            kanbanStore.categories = [
                { id: 10, project_id: 1, title: 'Cat', description: '', tasks: [makeTask({ id: 1 })] },
            ]

            await useKanbanCard().taskDelete(makeTask({ id: 1 }))

            expect(kanbanStore.categories[0]!.tasks).toHaveLength(0)
        })

        it('вызывает DELETE запрос с реальным id задачи', async () => {
            kanbanStore.categories = [
                { id: 10, project_id: 1, title: 'Cat', description: '', tasks: [makeTask({ id: 42 })] },
            ]

            await useKanbanCard().taskDelete(makeTask({ id: 42 }))
            await flushPromises()

            expect(apiRequestMock.delete).toHaveBeenCalledOnce()
            expect(routeMock).toHaveBeenCalledWith('tasks.destroy', 42)
        })

        it('не вызывает API если awaitRealId вернул null (tempId без pending promise)', async () => {
            const tempId = -1
            kanbanStore.categories = [
                { id: 10, project_id: 1, title: 'Cat', description: '', tasks: [makeTask({ id: tempId })] },
            ]

            await useKanbanCard().taskDelete(makeTask({ id: tempId }))
            await flushPromises()

            expect(apiRequestMock.delete).not.toHaveBeenCalled()
        })

        it('ждёт разрешения tempId через awaitRealId перед отправкой', async () => {
            const tempId = -5
            let resolveTemp!: (id: number) => void
            const tempPromise = new Promise<number>(r => { resolveTemp = r })
            kanbanStore.categories = [
                { id: 10, project_id: 1, title: 'Cat', description: '', tasks: [makeTask({ id: tempId })] },
            ]
            kanbanStore.registerPendingTask(tempId, tempPromise)

            const deletePromise = useKanbanCard().taskDelete(makeTask({ id: tempId }))
            resolveTemp(99)
            await deletePromise
            await flushPromises()

            expect(routeMock).toHaveBeenCalledWith('tasks.destroy', 99)
        })

        it('восстанавливает задачу в store при ошибке API', async () => {
            apiRequestMock.delete.mockRejectedValueOnce(new Error('fail'))
            kanbanStore.categories = [
                { id: 10, project_id: 1, title: 'Cat', description: '', tasks: [makeTask({ id: 1, category_id: 10 })] },
            ]

            await useKanbanCard().taskDelete(makeTask({ id: 1, category_id: 10 }))
            await flushPromises()

            // После ошибки задача должна быть возвращена в store
            expect(kanbanStore.categories[0]!.tasks).toHaveLength(1)
        })
    })
})