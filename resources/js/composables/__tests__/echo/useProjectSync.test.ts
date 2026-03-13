import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createApp, defineComponent, nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { useProjectSync } from '@/composables/echo/useProjectSync'
import { useKanbanStore } from '@/stores/kanban.store'
import { useProjectStore } from '@/stores/project.store'
import { _resetPresenceChannels } from '@/composables/echo/usePresenceChannel'
import type { ICategory, ITask } from '@/Types/models'

// ── Mock echo ────────────────────────────────────────────────────────────────

const echoMock = vi.hoisted(() => ({
    join: vi.fn(),
    leave: vi.fn(),
    socketId: vi.fn(() => null),
}))

vi.mock('@/echo', () => ({ default: echoMock }))

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeChannelMock() {
    const handlers = new Map<string, (data: any) => void>()
    const mock = {
        listen: vi.fn().mockImplementation((event: string, handler: (data: any) => void) => {
            handlers.set(event, handler)
            return mock
        }),
        trigger(event: string, data: any) {
            handlers.get(event)?.(data)
        },
    }
    return mock
}

function withSetup<T>(composable: () => T) {
    let result!: T
    const app = createApp(defineComponent({
        setup() { result = composable(); return () => {} },
    }))
    app.mount(document.createElement('div'))
    return { result, unmount: () => app.unmount() }
}

function makeTask(overrides: Partial<ITask> = {}): ITask {
    return { id: 1, category_id: 10, content: null, ...overrides }
}

function makeCategory(overrides: Partial<ICategory> = {}): ICategory {
    return { id: 10, project_id: 1, title: 'Cat', description: '', tasks: [], ...overrides }
}

// ── Тесты ────────────────────────────────────────────────────────────────────

describe('useProjectSync', () => {
    let channelMock: ReturnType<typeof makeChannelMock>
    let kanbanStore: ReturnType<typeof useKanbanStore>
    let projectStore: ReturnType<typeof useProjectStore>

    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
        _resetPresenceChannels()
        channelMock = makeChannelMock()
        echoMock.join.mockReturnValue(channelMock)
        kanbanStore = useKanbanStore()
        projectStore = useProjectStore()
    })

    // ── channel name ──────────────────────────────────────────────────────────

    it('подключается к каналу Project.{id} если currentProject установлен', () => {
        projectStore.setCurrentProject({ id: 5, title: 'P', position: 'a' })

        withSetup(() => useProjectSync())

        expect(echoMock.join).toHaveBeenCalledWith('Project.5')
    })

    it('не подключается к каналу если currentProject не установлен', () => {
        withSetup(() => useProjectSync())

        expect(echoMock.join).not.toHaveBeenCalled()
    })

    it('реактивно: подключается к каналу когда currentProject появляется', async () => {
        withSetup(() => useProjectSync())

        projectStore.setCurrentProject({ id: 7, title: 'P', position: 'a' })
        await nextTick()

        expect(echoMock.join).toHaveBeenCalledWith('Project.7')
    })

    it('реактивно: покидает старый канал и входит в новый при смене проекта', async () => {
        projectStore.setCurrentProject({ id: 5, title: 'P', position: 'a' })
        withSetup(() => useProjectSync())

        projectStore.setCurrentProject({ id: 9, title: 'P2', position: 'b' })
        await nextTick()

        expect(echoMock.leave).toHaveBeenCalledWith('Project.5')
        expect(echoMock.join).toHaveBeenCalledWith('Project.9')
    })

    // ── task events ───────────────────────────────────────────────────────────

    describe('task events', () => {
        beforeEach(() => {
            projectStore.setCurrentProject({ id: 1, title: 'P', position: 'a' })
            kanbanStore.categories = [makeCategory({ id: 10, tasks: [] })]
            withSetup(() => useProjectSync())
        })

        it('.Task.CreatedTask добавляет задачу в правильную категорию', () => {
            channelMock.trigger('.Task.CreatedTask', {
                task: makeTask({ id: 42, category_id: 10 }),
            })

            expect(kanbanStore.categories[0]!.tasks.map(t => t.id)).toContain(42)
        })

        it('.Task.UpdatedTask обновляет содержимое задачи', () => {
            kanbanStore.categories = [
                makeCategory({ id: 10, tasks: [makeTask({ id: 1, category_id: 10, content: { text: 'old' } })] }),
            ]

            channelMock.trigger('.Task.UpdatedTask', {
                task: makeTask({ id: 1, category_id: 10, content: { text: 'new' } }),
            })

            expect(kanbanStore.categories[0]!.tasks[0]!.content).toEqual({ text: 'new' })
        })

        it('.Task.UpdatedTask перемещает задачу в другую категорию', () => {
            kanbanStore.categories = [
                makeCategory({ id: 10, tasks: [makeTask({ id: 1, category_id: 10 })] }),
                makeCategory({ id: 20, tasks: [] }),
            ]

            channelMock.trigger('.Task.UpdatedTask', {
                task: makeTask({ id: 1, category_id: 20 }),
            })

            expect(kanbanStore.categories[0]!.tasks).toHaveLength(0)
            expect(kanbanStore.categories[1]!.tasks).toHaveLength(1)
        })

        it('.Task.DeletedTask удаляет задачу из стора', () => {
            kanbanStore.categories = [
                makeCategory({ id: 10, tasks: [makeTask({ id: 1, category_id: 10 })] }),
            ]

            channelMock.trigger('.Task.DeletedTask', { task_id: 1 })

            expect(kanbanStore.categories[0]!.tasks).toHaveLength(0)
        })

        it('.Task.ReorderedTask переставляет задачи внутри категории', () => {
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

            channelMock.trigger('.Task.ReorderedTask', { category_id: 10, task_ids: [3, 1, 2] })

            expect(kanbanStore.categories[0]!.tasks.map(t => t.id)).toEqual([3, 1, 2])
        })
    })

    // ── category events ───────────────────────────────────────────────────────

    describe('category events', () => {
        beforeEach(() => {
            projectStore.setCurrentProject({ id: 1, title: 'P', position: 'a' })
            kanbanStore.categories = [makeCategory({ id: 10 }), makeCategory({ id: 20 })]
            withSetup(() => useProjectSync())
        })

        it('.Category.CreatedCategory добавляет категорию в конец списка', () => {
            channelMock.trigger('.Category.CreatedCategory', {
                category: makeCategory({ id: 99, title: 'New' }),
            })

            expect(kanbanStore.categories.map(c => c.id)).toEqual([10, 20, 99])
        })

        it('.Category.UpdatedCategory обновляет метаданные категории', () => {
            channelMock.trigger('.Category.UpdatedCategory', {
                category: { id: 10, project_id: 1, title: 'Updated title', description: 'desc' },
            })

            expect(kanbanStore.categories[0]!.title).toBe('Updated title')
        })

        it('.Category.UpdatedCategory сохраняет задачи категории', () => {
            kanbanStore.categories = [
                makeCategory({ id: 10, tasks: [makeTask({ id: 1, category_id: 10 })] }),
            ]

            channelMock.trigger('.Category.UpdatedCategory', {
                category: { id: 10, project_id: 1, title: 'New title', description: '' },
            })

            expect(kanbanStore.categories[0]!.tasks).toHaveLength(1)
        })

        it('.Category.DeletedCategory удаляет категорию', () => {
            channelMock.trigger('.Category.DeletedCategory', { category_id: 10 })

            expect(kanbanStore.categories.map(c => c.id)).toEqual([20])
        })

        it('.Category.DeletedCategory игнорирует несуществующую категорию', () => {
            channelMock.trigger('.Category.DeletedCategory', { category_id: 999 })

            expect(kanbanStore.categories).toHaveLength(2)
        })

        it('.Category.ReorderedCategory переставляет категории', () => {
            channelMock.trigger('.Category.ReorderedCategory', { category_ids: [20, 10] })

            expect(kanbanStore.categories.map(c => c.id)).toEqual([20, 10])
        })
    })
})