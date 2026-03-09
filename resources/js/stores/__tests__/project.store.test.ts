import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useProjectStore } from '@/stores/project.store'
import type { IProject } from '@/Types/models'

// ─── Фабрика ─────────────────────────────────────────────────────────────────

function makeProject(overrides: Partial<IProject> = {}): IProject {
    return { id: 1, title: 'Project', position: 'a', ...overrides }
}

// ─── Тесты ───────────────────────────────────────────────────────────────────

describe('useProjectStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    // ── setCurrentProject ────────────────────────────────────────────────────

    describe('setCurrentProject', () => {
        it('устанавливает currentProject', () => {
            const store = useProjectStore()
            const project = makeProject({ id: 1 })

            store.setCurrentProject(project)

            expect(store.currentProject?.id).toBe(1)
        })

        it('перезаписывает предыдущий currentProject', () => {
            const store = useProjectStore()
            store.setCurrentProject(makeProject({ id: 1 }))
            store.setCurrentProject(makeProject({ id: 2 }))

            expect(store.currentProject?.id).toBe(2)
        })
    })

    // ── setProjects ──────────────────────────────────────────────────────────

    describe('setProjects', () => {
        it('заменяет список проектов', () => {
            const store = useProjectStore()
            store.projects = [makeProject({ id: 1 })]

            store.setProjects([makeProject({ id: 2 }), makeProject({ id: 3 })])

            expect(store.projects.map(p => p.id)).toEqual([2, 3])
        })

        it('реактивно: мутирует массив на месте — ссылка не меняется', () => {
            const store = useProjectStore()
            store.projects = [makeProject({ id: 1 })]
            const originalRef = store.projects

            store.setProjects([makeProject({ id: 2 })])

            expect(store.projects).toBe(originalRef)
        })

        it('корректно обнуляет список при передаче пустого массива', () => {
            const store = useProjectStore()
            store.projects = [makeProject({ id: 1 }), makeProject({ id: 2 })]

            store.setProjects([])

            expect(store.projects).toHaveLength(0)
        })
    })

    // ── findIndexProject ─────────────────────────────────────────────────────

    describe('findIndexProject', () => {
        it('возвращает правильный индекс', () => {
            const store = useProjectStore()
            store.projects = [makeProject({ id: 10 }), makeProject({ id: 20 })]

            expect(store.findIndexProject(10)).toBe(0)
            expect(store.findIndexProject(20)).toBe(1)
        })

        it('возвращает -1 если проект не найден', () => {
            const store = useProjectStore()
            store.projects = [makeProject({ id: 10 })]

            expect(store.findIndexProject(999)).toBe(-1)
        })

        it('возвращает -1 если список пустой', () => {
            const store = useProjectStore()

            expect(store.findIndexProject(1)).toBe(-1)
        })
    })

    // ── addProject ───────────────────────────────────────────────────────────

    describe('addProject', () => {
        it('вставляет проект в начало', () => {
            const store = useProjectStore()
            store.projects = [makeProject({ id: 2 })]

            store.addProject(0, makeProject({ id: 1 }))

            expect(store.projects.map(p => p.id)).toEqual([1, 2])
        })

        it('вставляет проект в конец', () => {
            const store = useProjectStore()
            store.projects = [makeProject({ id: 1 })]

            store.addProject(1, makeProject({ id: 2 }))

            expect(store.projects.map(p => p.id)).toEqual([1, 2])
        })

        it('вставляет проект по произвольному индексу', () => {
            const store = useProjectStore()
            store.projects = [makeProject({ id: 1 }), makeProject({ id: 3 })]

            store.addProject(1, makeProject({ id: 2 }))

            expect(store.projects.map(p => p.id)).toEqual([1, 2, 3])
        })
    })

    // ── deleteProject ────────────────────────────────────────────────────────

    describe('deleteProject', () => {
        it('удаляет проект из списка', () => {
            const store = useProjectStore()
            const project = makeProject({ id: 1 })
            store.projects = [project, makeProject({ id: 2 })]

            store.deleteProject(project)

            expect(store.projects.map(p => p.id)).toEqual([2])
        })

        it('не изменяет ничего если проект не найден', () => {
            const store = useProjectStore()
            store.projects = [makeProject({ id: 1 })]

            store.deleteProject(makeProject({ id: 999 }))

            expect(store.projects).toHaveLength(1)
        })

        it('удаляет нужный проект среди нескольких', () => {
            const store = useProjectStore()
            store.projects = [
                makeProject({ id: 1 }),
                makeProject({ id: 2 }),
                makeProject({ id: 3 }),
            ]

            store.deleteProject(makeProject({ id: 2 }))

            expect(store.projects.map(p => p.id)).toEqual([1, 3])
        })

        it('сбрасывает currentProject при удалении текущего проекта', () => {
            const store = useProjectStore()
            const project = makeProject({ id: 1 })
            store.projects = [project]
            store.setCurrentProject(project)

            store.deleteProject(project)

            // currentProject должен стать undefined после удаления
            expect(store.currentProject).toBeUndefined()
        })

        it('не сбрасывает currentProject при удалении другого проекта', () => {
            const store = useProjectStore()
            store.projects = [makeProject({ id: 1 }), makeProject({ id: 2 })]
            store.setCurrentProject(makeProject({ id: 1 }))

            store.deleteProject(makeProject({ id: 2 }))

            expect(store.currentProject?.id).toBe(1)
        })
    })

    // ── updateProject ────────────────────────────────────────────────────────

    describe('updateProject', () => {
        it('обновляет title проекта в списке', () => {
            const store = useProjectStore()
            store.projects = [makeProject({ id: 1, title: 'Old' })]

            store.updateProject(makeProject({ id: 1, title: 'New' }))

            expect(store.projects[0]!.title).toBe('New')
        })

        it('обновляет position проекта в списке', () => {
            const store = useProjectStore()
            store.projects = [makeProject({ id: 1, position: 'a' })]

            store.updateProject(makeProject({ id: 1, position: 'z' }))

            expect(store.projects[0]!.position).toBe('z')
        })

        it('не изменяет ничего если проект не найден', () => {
            const store = useProjectStore()
            store.projects = [makeProject({ id: 1, title: 'Unchanged' })]

            store.updateProject(makeProject({ id: 999, title: 'Ghost' }))

            expect(store.projects[0]!.title).toBe('Unchanged')
        })

        it('обновляет currentProject если это тот же проект', () => {
            const store = useProjectStore()
            store.projects = [makeProject({ id: 1, title: 'Old' })]
            store.setCurrentProject(makeProject({ id: 1, title: 'Old' }))

            store.updateProject(makeProject({ id: 1, title: 'New' }))

            expect(store.currentProject?.title).toBe('New')
        })

        it('не изменяет currentProject если обновляется другой проект', () => {
            const store = useProjectStore()
            store.projects = [makeProject({ id: 1 }), makeProject({ id: 2, title: 'Current' })]
            store.setCurrentProject(makeProject({ id: 2, title: 'Current' }))

            store.updateProject(makeProject({ id: 1, title: 'Updated other' }))

            expect(store.currentProject?.title).toBe('Current')
        })

        it('currentProject и projects[n] синхронизированы после обновления', () => {
            const store = useProjectStore()
            store.projects = [makeProject({ id: 1, title: 'Old' })]
            store.setCurrentProject(makeProject({ id: 1, title: 'Old' }))

            store.updateProject(makeProject({ id: 1, title: 'New', position: 'z' }))

            expect(store.currentProject?.title).toBe(store.projects[0]!.title)
            expect(store.currentProject?.position).toBe(store.projects[0]!.position)
        })

        it('не затирает currentProject если он не установлен', () => {
            const store = useProjectStore()
            store.projects = [makeProject({ id: 1 })]
            // currentProject намеренно не установлен

            store.updateProject(makeProject({ id: 1, title: 'New' }))

            expect(store.currentProject).toBeUndefined()
        })
    })

    // ── reorderProjects ──────────────────────────────────────────────────────

    describe('reorderProjects', () => {
        it('переставляет проекты в нужный порядок', () => {
            const store = useProjectStore()
            store.projects = [makeProject({ id: 1 }), makeProject({ id: 2 }), makeProject({ id: 3 })]

            store.reorderProjects([3, 1, 2])

            expect(store.projects.map(p => p.id)).toEqual([3, 1, 2])
        })

        it('проекты вне списка добавляются в конец', () => {
            const store = useProjectStore()
            store.projects = [makeProject({ id: 1 }), makeProject({ id: 2 }), makeProject({ id: 3 })]

            store.reorderProjects([3])

            expect(store.projects[0]!.id).toBe(3)
            expect(store.projects.map(p => p.id)).toContain(1)
            expect(store.projects.map(p => p.id)).toContain(2)
            expect(store.projects).toHaveLength(3)
        })

        it('реактивно: мутирует массив через splice — ссылка не меняется', () => {
            const store = useProjectStore()
            store.projects = [makeProject({ id: 1 }), makeProject({ id: 2 })]
            const originalRef = store.projects

            store.reorderProjects([2, 1])

            expect(store.projects).toBe(originalRef)
            expect(store.projects.map(p => p.id)).toEqual([2, 1])
        })
    })
})