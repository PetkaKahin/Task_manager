import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useKanbanProject } from '@/composables/ui/useKanbanProject'
import { useProjectStore } from '@/stores/project.store'
import type { IProject } from '@/Types/models'

// ── Mocks ─────────────────────────────────────────────────────────────────────

const apiRequestMock = vi.hoisted(() => ({ delete: vi.fn().mockResolvedValue({}) }))
const routeMock = vi.hoisted(() => vi.fn((_name: string, id?: number) => `/${id ?? ''}`))
const routerMock = vi.hoisted(() => ({ visit: vi.fn() }))
const projectServiceMock = vi.hoisted(() => ({ updatePosition: vi.fn() }))

vi.mock('@/shared/api/apiRequest', () => ({ apiRequest: apiRequestMock }))
vi.mock('ziggy-js', () => ({ route: routeMock }))
vi.mock('@inertiajs/vue3', () => ({ router: routerMock }))
vi.mock('@vue-dnd-kit/core', () => ({
    useDraggable: vi.fn(() => ({
        elementRef: { value: null },
        handleDragStart: vi.fn(),
        isDragging: { value: false },
        isOvered: { value: false },
    })),
    useDroppable: vi.fn(() => ({ elementRef: { value: null } })),
    DnDOperations: { applyTransfer: vi.fn() },
}))
vi.mock('@/services/api/projectService', () => ({
    projectService: vi.fn(() => projectServiceMock),
}))
vi.mock('@/echo', () => ({ default: { socketId: vi.fn(() => null) } }))

// ── Фабрика ───────────────────────────────────────────────────────────────────

function makeProject(overrides: Partial<IProject> = {}): IProject {
    return { id: 1, title: 'Project', position: 'a', ...overrides }
}

// ── Тесты ─────────────────────────────────────────────────────────────────────

describe('useKanbanProject', () => {
    let projectStore: ReturnType<typeof useProjectStore>

    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
        projectStore = useProjectStore()
        // route возвращает строку вида "/name/id" по умолчанию
        routeMock.mockImplementation((_name: string, id?: number) => `/${_name}/${id ?? ''}`)
    })

    // ── projectDelete ─────────────────────────────────────────────────────────

    describe('projectDelete', () => {
        it('удаляет проект из store', async () => {
            const project = makeProject({ id: 1 })
            projectStore.addProject(0, project)

            await useKanbanProject().projectDelete(project)

            expect(projectStore.projects).toHaveLength(0)
        })

        it('отправляет DELETE запрос на backend', async () => {
            const project = makeProject({ id: 42 })
            projectStore.addProject(0, project)

            await useKanbanProject().projectDelete(project)

            expect(apiRequestMock.delete).toHaveBeenCalledOnce()
        })

        it('перенаправляет на первый оставшийся проект если он есть', async () => {
            const p1 = makeProject({ id: 1 })
            const p2 = makeProject({ id: 2, position: 'b' })
            projectStore.addProject(0, p1)
            projectStore.addProject(1, p2)

            await useKanbanProject().projectDelete(p1)

            // После удаления p1 остаётся p2 — навигация на /projects.show/2
            expect(routerMock.visit).toHaveBeenCalledWith('/projects.show/2')
        })

        it('перенаправляет на home если проектов не осталось', async () => {
            const project = makeProject({ id: 1 })
            projectStore.addProject(0, project)

            routeMock.mockImplementation((name: string) => `/${name}`)
            await useKanbanProject().projectDelete(project)

            expect(routerMock.visit).toHaveBeenCalledWith('/home')
        })

        it('не выбрасывает ошибку если DELETE завершился с ошибкой', async () => {
            apiRequestMock.delete.mockRejectedValueOnce(new Error('Network error'))
            const project = makeProject({ id: 1 })
            projectStore.addProject(0, project)

            await expect(useKanbanProject().projectDelete(project)).resolves.not.toThrow()
        })

        it('навигация происходит даже при ошибке DELETE', async () => {
            apiRequestMock.delete.mockRejectedValueOnce(new Error('fail'))
            const project = makeProject({ id: 1 })
            projectStore.addProject(0, project)

            await useKanbanProject().projectDelete(project)

            expect(routerMock.visit).toHaveBeenCalledOnce()
        })

        it('currentProject сбрасывается после удаления активного проекта', async () => {
            const project = makeProject({ id: 1 })
            projectStore.addProject(0, project)
            projectStore.setCurrentProject(project)
            expect(projectStore.currentProject?.id).toBe(1)

            await useKanbanProject().projectDelete(project)

            expect(projectStore.currentProject).toBeUndefined()
        })
    })

    // ── projectMoved ──────────────────────────────────────────────────────────

    describe('projectMoved', () => {
        it('не вызывает API при oldIndex < 0', async () => {
            await useKanbanProject().projectMoved(-1)

            expect(projectServiceMock.updatePosition).not.toHaveBeenCalled()
        })

        it('не вызывает API если позиция не изменилась после nextTick', async () => {
            projectStore.addProject(0, makeProject({ id: 1 }))
            projectStore.addProject(1, makeProject({ id: 2, position: 'b' }))

            // Не меняем порядок → позиция та же
            await useKanbanProject().projectMoved(0)

            expect(projectServiceMock.updatePosition).not.toHaveBeenCalled()
        })

        it('вызывает updatePosition с moveAfter=null если проект перемещён на первое место', async () => {
            const p1 = makeProject({ id: 1 })
            const p2 = makeProject({ id: 2, position: 'b' })
            const p3 = makeProject({ id: 3, position: 'c' })
            projectStore.addProject(0, p1)
            projectStore.addProject(1, p2)
            projectStore.addProject(2, p3)

            // projectMoved(2) захватывает p3 синхронно, затем ждёт nextTick
            const promise = useKanbanProject().projectMoved(2)
            // Перемещаем p3 в начало до nextTick
            projectStore.reorderProjects([3, 1, 2])
            await promise

            // p3 на позиции 0 → нет предыдущего → moveAfter=null
            expect(projectServiceMock.updatePosition).toHaveBeenCalledWith(3, null)
        })

        it('вызывает updatePosition с id предыдущего проекта', async () => {
            const p1 = makeProject({ id: 1 })
            const p2 = makeProject({ id: 2, position: 'b' })
            const p3 = makeProject({ id: 3, position: 'c' })
            projectStore.addProject(0, p1)
            projectStore.addProject(1, p2)
            projectStore.addProject(2, p3)

            // Перемещаем p1 (индекс 0) после p2
            const promise = useKanbanProject().projectMoved(0)
            projectStore.reorderProjects([2, 1, 3])
            await promise

            // p1 на позиции 1 → предыдущий p2 (id=2) → moveAfter=2
            expect(projectServiceMock.updatePosition).toHaveBeenCalledWith(1, 2)
        })
    })
})