import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createApp, defineComponent, nextTick, reactive } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { useUserSync } from '@/composables/echo/useUserSync'
import { useProjectStore } from '@/stores/project.store'
import { _resetPrivateChannels } from '@/composables/echo/usePrivateChannel'
import type { IProject } from '@/Types/models'

// ── Mocks ─────────────────────────────────────────────────────────────────────

const echoMock = vi.hoisted(() => ({
    private: vi.fn(),
    leave: vi.fn(),
    socketId: vi.fn(() => null),
}))
const routerMock = vi.hoisted(() => ({ visit: vi.fn() }))
const routeMock = vi.hoisted(() => vi.fn((_name: string, id?: number) => `/${id ?? ''}`))

vi.mock('@/echo', () => ({ default: echoMock }))
vi.mock('ziggy-js', () => ({ route: routeMock }))

// usePage возвращает реактивный объект — так computed в useUserSync корректно
// реагирует на изменения auth.user.id
let mockPage: { props: { auth: any } }

vi.mock('@inertiajs/vue3', () => ({
    usePage: vi.fn(() => mockPage),
    router: routerMock,
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

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

function makeProject(overrides: Partial<IProject> = {}): IProject {
    return { id: 1, title: 'Project', position: 'a', ...overrides }
}

// ── Тесты ─────────────────────────────────────────────────────────────────────

describe('useUserSync', () => {
    let channelMock: ReturnType<typeof makeChannelMock>
    let projectStore: ReturnType<typeof useProjectStore>

    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
        _resetPrivateChannels()
        channelMock = makeChannelMock()
        echoMock.private.mockReturnValue(channelMock)
        mockPage = reactive({ props: { auth: null } })
        projectStore = useProjectStore()
        routeMock.mockImplementation((_name: string, id?: number) => `/${id ?? ''}`)
    })

    // ── channel name ──────────────────────────────────────────────────────────

    it('подключается к каналу User.{id} если пользователь аутентифицирован', () => {
        mockPage.props.auth = { user: { id: 42 } }

        withSetup(() => useUserSync())

        expect(echoMock.private).toHaveBeenCalledWith('User.42')
    })

    it('не подключается к каналу если auth равен null', () => {
        withSetup(() => useUserSync())

        expect(echoMock.private).not.toHaveBeenCalled()
    })

    it('реактивно: подключается к каналу когда пользователь появляется', async () => {
        withSetup(() => useUserSync())

        mockPage.props.auth = { user: { id: 10 } }
        await nextTick()

        expect(echoMock.private).toHaveBeenCalledWith('User.10')
    })

    it('реактивно: покидает старый канал и входит в новый при смене пользователя', async () => {
        mockPage.props.auth = { user: { id: 1 } }
        withSetup(() => useUserSync())

        mockPage.props.auth = { user: { id: 2 } }
        await nextTick()

        expect(echoMock.leave).toHaveBeenCalledWith('User.1')
        expect(echoMock.private).toHaveBeenCalledWith('User.2')
    })

    // ── persistent subscription (не отписываемся при unmount) ────────────────

    it('НЕ отписывается от канала при unmount компонента', () => {
        mockPage.props.auth = { user: { id: 1 } }
        const { unmount } = withSetup(() => useUserSync())

        unmount()

        expect(echoMock.leave).not.toHaveBeenCalled()
    })

    it('при remount НЕ создаёт дублирующую подписку', () => {
        mockPage.props.auth = { user: { id: 1 } }

        const { unmount } = withSetup(() => useUserSync())
        unmount()
        withSetup(() => useUserSync())

        // echo.private вызван только 1 раз (при первом mount)
        expect(echoMock.private).toHaveBeenCalledTimes(1)
    })

    it('при remount обработчики всё ещё работают', () => {
        mockPage.props.auth = { user: { id: 1 } }
        projectStore.projects = [makeProject({ id: 10 })]

        const { unmount } = withSetup(() => useUserSync())
        unmount()
        withSetup(() => useUserSync())

        // Триггерим событие — обработчик с первого mount всё ещё работает
        channelMock.trigger('.Project.CreatedProject', {
            project: makeProject({ id: 99, title: 'New' }),
        })

        expect(projectStore.projects.map(p => p.id)).toEqual([99, 10])
    })

    // ── project events ────────────────────────────────────────────────────────

    describe('project events', () => {
        beforeEach(() => {
            mockPage.props.auth = { user: { id: 1 } }
            projectStore.projects = [makeProject({ id: 10 }), makeProject({ id: 20 })]
            withSetup(() => useUserSync())
        })

        it('.Project.CreatedProject добавляет проект в начало списка', () => {
            channelMock.trigger('.Project.CreatedProject', {
                project: makeProject({ id: 99, title: 'New' }),
            })

            expect(projectStore.projects.map(p => p.id)).toEqual([99, 10, 20])
        })

        it('.Project.CreatedProject не дублирует уже существующий проект', () => {
            channelMock.trigger('.Project.CreatedProject', {
                project: makeProject({ id: 10, title: 'Duplicate' }),
            })

            expect(projectStore.projects.map(p => p.id)).toEqual([10, 20])
        })

        it('.Project.UpdatedProject обновляет данные проекта', () => {
            channelMock.trigger('.Project.UpdatedProject', {
                project: makeProject({ id: 10, title: 'Updated' }),
            })

            expect(projectStore.projects[0]!.title).toBe('Updated')
        })

        it('.Project.UpdatedProject обновляет currentProject если это он', () => {
            projectStore.setCurrentProject(makeProject({ id: 10, title: 'Old' }))

            channelMock.trigger('.Project.UpdatedProject', {
                project: makeProject({ id: 10, title: 'New title' }),
            })

            expect(projectStore.currentProject?.title).toBe('New title')
        })

        it('.Project.DeletedProject удаляет проект из списка', () => {
            channelMock.trigger('.Project.DeletedProject', { project_id: 10 })

            expect(projectStore.projects.map(p => p.id)).toEqual([20])
        })

        it('.Project.DeletedProject игнорирует несуществующий проект', () => {
            channelMock.trigger('.Project.DeletedProject', { project_id: 999 })

            expect(projectStore.projects).toHaveLength(2)
        })

        it('.Project.DeletedProject сбрасывает currentProject при удалении активного проекта', () => {
            projectStore.setCurrentProject(makeProject({ id: 10 }))

            channelMock.trigger('.Project.DeletedProject', { project_id: 10 })

            expect(projectStore.currentProject).toBeUndefined()
        })

        it('.Project.DeletedProject перенаправляет на первый оставшийся проект', () => {
            routeMock.mockImplementation((_name: string, id?: number) => `/${id}`)
            channelMock.trigger('.Project.DeletedProject', { project_id: 10 })

            expect(routerMock.visit).toHaveBeenCalledWith('/20')
        })

        it('.Project.DeletedProject перенаправляет на home если проектов не осталось', () => {
            projectStore.projects = [makeProject({ id: 10 })]
            routeMock.mockImplementation((name: string) => `/${name}`)

            channelMock.trigger('.Project.DeletedProject', { project_id: 10 })

            expect(routerMock.visit).toHaveBeenCalledWith('/home')
        })

        it('.Project.ReorderedProject переставляет проекты', () => {
            channelMock.trigger('.Project.ReorderedProject', { project_ids: [20, 10] })

            expect(projectStore.projects.map(p => p.id)).toEqual([20, 10])
        })
    })
})
