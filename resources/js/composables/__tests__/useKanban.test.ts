import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useKanban } from '@/composables/ui/useKanban'
import { useKanbanStore } from '@/stores/kanban.store'
import { useProjectStore } from '@/stores/project.store'
import type { ICategory, ITask } from '@/Types/models'

// ── Mocks ─────────────────────────────────────────────────────────────────────

const categoryServiceMock = vi.hoisted(() => ({ updatePosition: vi.fn() }))
const taskServiceMock = vi.hoisted(() => ({ updatePosition: vi.fn() }))

vi.mock('@/services/api/categoryService', () => ({ categoryService: categoryServiceMock }))
vi.mock('@/services/api/taskService', () => ({ taskService: taskServiceMock }))
// apiRequest и echo не нужны — сервисы замоканы
vi.mock('@/echo', () => ({ default: { socketId: vi.fn(() => null) } }))

// ── Фабрики ───────────────────────────────────────────────────────────────────

function makeTask(overrides: Partial<ITask> = {}): ITask {
    return { id: 1, category_id: 10, content: null, ...overrides }
}

function makeCategory(overrides: Partial<ICategory> = {}): ICategory {
    return { id: 10, project_id: 1, title: 'Cat', description: '', tasks: [], ...overrides }
}

// Минимальный payload для DnD, который понимает extractTaskDataFromPayload
function makePayload(source: ITask[], index: number) {
    return {
        items: [{ data: { source, index } }],
    } as any
}

// ── Тесты ─────────────────────────────────────────────────────────────────────

describe('useKanban', () => {
    let kanbanStore: ReturnType<typeof useKanbanStore>
    let projectStore: ReturnType<typeof useProjectStore>
    let kanban: ReturnType<typeof useKanban>

    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
        kanbanStore = useKanbanStore()
        projectStore = useProjectStore()
        kanban = useKanban()
    })

    // ── categoryMoved ─────────────────────────────────────────────────────────

    describe('categoryMoved', () => {
        it('не вызывает API при oldCategoryIndex < 0', async () => {
            await kanban.categoryMoved(-1)

            expect(categoryServiceMock.updatePosition).not.toHaveBeenCalled()
        })

        it('не вызывает API если позиция не изменилась после nextTick', async () => {
            kanbanStore.categories = [makeCategory({ id: 1 }), makeCategory({ id: 2 })]
            projectStore.setCurrentProject({ id: 1, title: 'P', position: 'a' })

            // Вызываем, но НЕ меняем порядок → позиция та же
            await kanban.categoryMoved(0)

            expect(categoryServiceMock.updatePosition).not.toHaveBeenCalled()
        })

        it('не вызывает API если currentProject не установлен', async () => {
            kanbanStore.categories = [makeCategory({ id: 1 }), makeCategory({ id: 2 })]
            // projectStore.currentProject не установлен

            const promise = kanban.categoryMoved(1)
            // Перемещаем категорию чтобы позиция изменилась
            kanbanStore.categories = [makeCategory({ id: 2 }), makeCategory({ id: 1 })]
            await promise

            expect(categoryServiceMock.updatePosition).not.toHaveBeenCalled()
        })

        it('вызывает updatePosition с moveAfter=null если категория перемещена на первое место', async () => {
            const catA = makeCategory({ id: 1 })
            const catB = makeCategory({ id: 2 })
            const catC = makeCategory({ id: 3 })
            kanbanStore.categories = [catA, catB, catC]
            projectStore.setCurrentProject({ id: 1, title: 'P', position: 'a' })

            // categoryMoved(2) захватывает catC (id=3) синхронно,
            // затем ждёт nextTick. Мы меняем порядок до nextTick.
            const promise = kanban.categoryMoved(2)
            kanbanStore.categories = [makeCategory({ id: 3 }), makeCategory({ id: 1 }), makeCategory({ id: 2 })]
            await promise

            // catC теперь на позиции 0 → предыдущей нет → moveAfter=null
            expect(categoryServiceMock.updatePosition).toHaveBeenCalledWith(3, null)
        })

        it('вызывает updatePosition с id предыдущей категории', async () => {
            const catA = makeCategory({ id: 1 })
            const catB = makeCategory({ id: 2 })
            const catC = makeCategory({ id: 3 })
            kanbanStore.categories = [catA, catB, catC]
            projectStore.setCurrentProject({ id: 1, title: 'P', position: 'a' })

            // Перемещаем catA (id=1) на позицию 1 (после catB)
            const promise = kanban.categoryMoved(0)
            kanbanStore.categories = [makeCategory({ id: 2 }), makeCategory({ id: 1 }), makeCategory({ id: 3 })]
            await promise

            // catA на позиции 1 → предыдущая catB (id=2) → moveAfter=2
            expect(categoryServiceMock.updatePosition).toHaveBeenCalledWith(1, 2)
        })
    })

    // ── taskMoved ─────────────────────────────────────────────────────────────

    describe('taskMoved', () => {

        // ── невалидные payload ────────────────────────────────────────────────

        it('не вызывает API при пустом payload', async () => {
            await kanban.taskMoved({ items: [] } as any)

            expect(taskServiceMock.updatePosition).not.toHaveBeenCalled()
        })

        it('не вызывает API если data.source отсутствует', async () => {
            await kanban.taskMoved({ items: [{ data: { index: 0 } }] } as any)

            expect(taskServiceMock.updatePosition).not.toHaveBeenCalled()
        })

        it('не вызывает API если задача по индексу не найдена', async () => {
            await kanban.taskMoved(makePayload([], 5))

            expect(taskServiceMock.updatePosition).not.toHaveBeenCalled()
        })

        // ── позиция не изменилась ─────────────────────────────────────────────

        it('не вызывает API если задача осталась на той же позиции', async () => {
            kanbanStore.categories = [
                makeCategory({ id: 10, tasks: [makeTask({ id: 1, category_id: 10 })] }),
            ]
            const tasks = kanbanStore.categories[0]!.tasks

            // Не меняем порядок перед nextTick
            await kanban.taskMoved(makePayload(tasks as any, 0))

            expect(taskServiceMock.updatePosition).not.toHaveBeenCalled()
        })

        // ── перемещение внутри одной категории ───────────────────────────────

        it('вызывает updatePosition при перемещении на первое место (moveAfter=null)', async () => {
            kanbanStore.categories = [
                makeCategory({
                    id: 10,
                    tasks: [
                        makeTask({ id: 1, category_id: 10 }),
                        makeTask({ id: 2, category_id: 10 }),
                        makeTask({ id: 3, category_id: 10 }),
                    ],
                }),
            ]
            const tasks = kanbanStore.categories[0]!.tasks
            // Захватываем задачу id=3 (индекс 2)
            const promise = kanban.taskMoved(makePayload(tasks as any, 2))

            // Перемещаем id=3 в начало до nextTick
            kanbanStore.reorderTasks(10, [3, 1, 2])
            await promise

            // Позиция 0 → нет предыдущей → moveAfter=null, категория не изменилась
            expect(taskServiceMock.updatePosition).toHaveBeenCalledWith(3, null, undefined)
        })

        it('вызывает updatePosition с id предыдущей задачи', async () => {
            kanbanStore.categories = [
                makeCategory({
                    id: 10,
                    tasks: [
                        makeTask({ id: 1, category_id: 10 }),
                        makeTask({ id: 2, category_id: 10 }),
                        makeTask({ id: 3, category_id: 10 }),
                    ],
                }),
            ]
            const tasks = kanbanStore.categories[0]!.tasks
            // Захватываем id=1 (индекс 0)
            const promise = kanban.taskMoved(makePayload(tasks as any, 0))

            // Перемещаем id=1 на позицию 1 (после id=2)
            kanbanStore.reorderTasks(10, [2, 1, 3])
            await promise

            // Позиция 1 → предыдущая id=2 → moveAfter=2
            expect(taskServiceMock.updatePosition).toHaveBeenCalledWith(1, 2, undefined)
        })

        // ── перемещение между категориями ─────────────────────────────────────

        it('передаёт newCategoryId при переходе в другую категорию', async () => {
            kanbanStore.categories = [
                makeCategory({ id: 10, tasks: [makeTask({ id: 1, category_id: 10 })] }),
                makeCategory({ id: 20, tasks: [] }),
            ]
            const srcTasks = kanbanStore.categories[0]!.tasks
            const promise = kanban.taskMoved(makePayload(srcTasks as any, 0))

            // Перемещаем задачу в категорию 20
            kanbanStore.moveTask(makeTask({ id: 1, category_id: 10 }), 20, 0)
            await promise

            expect(taskServiceMock.updatePosition).toHaveBeenCalledWith(1, null, 20)
        })

        it('при переходе в другую категорию на позицию после задачи — передаёт moveAfter', async () => {
            kanbanStore.categories = [
                makeCategory({ id: 10, tasks: [makeTask({ id: 1, category_id: 10 })] }),
                makeCategory({
                    id: 20,
                    tasks: [
                        makeTask({ id: 2, category_id: 20 }),
                        makeTask({ id: 3, category_id: 20 }),
                    ],
                }),
            ]
            const srcTasks = kanbanStore.categories[0]!.tasks
            const promise = kanban.taskMoved(makePayload(srcTasks as any, 0))

            // Вставляем id=1 между id=2 и id=3 в категории 20
            kanbanStore.moveTask(makeTask({ id: 1, category_id: 10 }), 20, 1)
            await promise

            // Предыдущая задача — id=2 → moveAfter=2, newCategoryId=20
            expect(taskServiceMock.updatePosition).toHaveBeenCalledWith(1, 2, 20)
        })

        // ── задача с tempId ───────────────────────────────────────────────────

        it('не вызывает API если awaitRealId вернул null (tempId без pending promise)', async () => {
            const tempId = -1
            kanbanStore.categories = [
                makeCategory({
                    id: 10,
                    tasks: [
                        makeTask({ id: tempId, category_id: 10 }),
                        makeTask({ id: 2, category_id: 10 }),
                    ],
                }),
            ]
            const tasks = kanbanStore.categories[0]!.tasks
            const promise = kanban.taskMoved(makePayload(tasks as any, 0))

            kanbanStore.reorderTasks(10, [2, tempId])
            await promise

            // awaitRealId(tempId=-1) → нет pending promise → null → выходим
            expect(taskServiceMock.updatePosition).not.toHaveBeenCalled()
        })

        it('ждёт разрешения tempId через awaitRealId перед отправкой', async () => {
            const tempId = -1
            kanbanStore.categories = [
                makeCategory({
                    id: 10,
                    tasks: [
                        makeTask({ id: tempId, category_id: 10 }),
                        makeTask({ id: 2, category_id: 10 }),
                    ],
                }),
            ]

            let resolveTemp!: (id: number) => void
            const tempPromise = new Promise<number>(r => { resolveTemp = r })
            kanbanStore.registerPendingTask(tempId, tempPromise)

            const tasks = kanbanStore.categories[0]!.tasks
            const promise = kanban.taskMoved(makePayload(tasks as any, 0))

            kanbanStore.reorderTasks(10, [2, tempId])

            // Разрешаем tempId → реальный id = 99
            resolveTemp(99)
            await promise

            expect(taskServiceMock.updatePosition).toHaveBeenCalledWith(99, 2, undefined)
        })
    })
})