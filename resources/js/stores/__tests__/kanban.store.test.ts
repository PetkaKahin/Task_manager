import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { useKanbanStore } from '@/stores/kanban.store'
import type { ICategory, ITask } from '@/Types/models'

// ─── Фабрики ────────────────────────────────────────────────────────────────

function makeTask(overrides: Partial<ITask> = {}): ITask {
    return { id: 1, category_id: 10, content: null, ...overrides }
}

function makeCategory(overrides: Partial<ICategory> = {}): ICategory {
    return { id: 10, project_id: 1, title: 'Category', description: '', tasks: [], ...overrides }
}

// ─── Тесты ──────────────────────────────────────────────────────────────────

describe('useKanbanStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    // ── addTask ──────────────────────────────────────────────────────────────

    describe('addTask', () => {
        it('добавляет задачу в нужную категорию', () => {
            const store = useKanbanStore()
            const task = makeTask({ id: 1, category_id: 10 })
            store.categories = [makeCategory({ id: 10, tasks: [] })]

            store.addTask(10, task)

            expect(store.categories[0]!.tasks).toHaveLength(1)
            // Pinia оборачивает значения в реактивный Proxy — сравниваем по содержимому
            expect(store.categories[0]!.tasks[0]).toStrictEqual(task)
        })

        it('добавляет несколько задач в одну категорию', () => {
            const store = useKanbanStore()
            store.categories = [makeCategory({ id: 10, tasks: [] })]

            store.addTask(10, makeTask({ id: 1 }))
            store.addTask(10, makeTask({ id: 2 }))

            expect(store.categories[0]!.tasks).toHaveLength(2)
            expect(store.categories[0]!.tasks.map(t => t.id)).toEqual([1, 2])
        })

        it('не изменяет ничего при несуществующем categoryId', () => {
            const store = useKanbanStore()
            store.categories = [makeCategory({ id: 10, tasks: [] })]

            store.addTask(999, makeTask())

            expect(store.categories[0]!.tasks).toHaveLength(0)
        })

        it('реактивно: длина массива tasks обновляется', () => {
            const store = useKanbanStore()
            store.categories = [makeCategory({ id: 10, tasks: [] })]
            const tasksBefore = store.categories[0]!.tasks.length

            store.addTask(10, makeTask())

            expect(store.categories[0]!.tasks.length).toBe(tasksBefore + 1)
        })
    })

    // ── updateTask ───────────────────────────────────────────────────────────

    describe('updateTask', () => {
        it('обновляет свойства задачи на месте в той же категории', () => {
            const store = useKanbanStore()
            const task = makeTask({ id: 1, category_id: 10, content: { text: 'old' } })
            store.categories = [makeCategory({ id: 10, tasks: [task] })]

            const originalRef = store.categories[0]!.tasks[0]
            store.updateTask({ id: 1, category_id: 10, content: { text: 'new' } })

            // Object.assign мутирует объект — ссылка не меняется
            expect(store.categories[0]!.tasks[0]).toBe(originalRef)
            expect(store.categories[0]!.tasks[0]!.content).toEqual({ text: 'new' })
            expect(store.categories[0]!.tasks).toHaveLength(1)
        })

        it('не перемещает задачу при обновлении в той же категории', () => {
            const store = useKanbanStore()
            store.categories = [
                makeCategory({ id: 10, tasks: [makeTask({ id: 1, category_id: 10 })] }),
                makeCategory({ id: 20, tasks: [] }),
            ]

            store.updateTask({ id: 1, category_id: 10, content: { text: 'updated' } })

            expect(store.categories[0]!.tasks).toHaveLength(1)
            expect(store.categories[1]!!.tasks).toHaveLength(0)
        })

        it('перемещает задачу из старой категории в новую', () => {
            const store = useKanbanStore()
            store.categories = [
                makeCategory({ id: 10, tasks: [makeTask({ id: 1, category_id: 10 })] }),
                makeCategory({ id: 20, tasks: [] }),
            ]

            store.updateTask({ id: 1, category_id: 20, content: null })

            expect(store.categories[0]!.tasks).toHaveLength(0)
            expect(store.categories[1]!.tasks).toHaveLength(1)
            expect(store.categories[1]!.tasks[0]!.id).toBe(1)
            expect(store.categories[1]!.tasks[0]!.category_id).toBe(20)
        })

        it('добавляет задачу в новую категорию если задача нигде не числилась', () => {
            const store = useKanbanStore()
            store.categories = [
                makeCategory({ id: 10, tasks: [] }),
                makeCategory({ id: 20, tasks: [] }),
            ]

            store.updateTask({ id: 99, category_id: 20, content: null })

            expect(store.categories[1]!.tasks).toHaveLength(1)
            expect(store.categories[1]!.tasks[0]!.id).toBe(99)
        })

        it('не изменяет ничего если задача нигде не найдена и целевой категории нет', () => {
            const store = useKanbanStore()
            store.categories = [makeCategory({ id: 10, tasks: [] })]

            store.updateTask({ id: 99, category_id: 999, content: null })

            expect(store.categories[0]!.tasks).toHaveLength(0)
        })

        it('реактивно: перемещение обновляет длины обоих массивов tasks', () => {
            const store = useKanbanStore()
            store.categories = [
                makeCategory({ id: 10, tasks: [makeTask({ id: 1, category_id: 10 })] }),
                makeCategory({ id: 20, tasks: [] }),
            ]

            store.updateTask({ id: 1, category_id: 20, content: null })

            expect(store.categories[0]!.tasks.length).toBe(0)
            expect(store.categories[1]!.tasks.length).toBe(1)
        })
    })

    // ── updateCategory ───────────────────────────────────────────────────────

    describe('updateCategory', () => {
        it('обновляет метаданные категории', () => {
            const store = useKanbanStore()
            store.categories = [makeCategory({ id: 10, title: 'Old', description: 'old desc' })]

            store.updateCategory(makeCategory({ id: 10, title: 'New', description: 'new desc' }))

            expect(store.categories[0]!.title).toBe('New')
            expect(store.categories[0]!.description).toBe('new desc')
        })

        it('сохраняет существующие задачи при обновлении категории', () => {
            const store = useKanbanStore()
            const existingTask = makeTask({ id: 1, category_id: 10 })
            store.categories = [makeCategory({ id: 10, tasks: [existingTask] })]

            // В обновлении tasks — пустой массив, но задачи должны остаться
            store.updateCategory(makeCategory({ id: 10, title: 'New', tasks: [] }))

            expect(store.categories[0]!.tasks).toHaveLength(1)
            // Pinia оборачивает значения в реактивный Proxy — проверяем по id
            expect(store.categories[0]!.tasks[0]!.id).toBe(existingTask.id)
        })

        it('не изменяет ничего при несуществующей категории', () => {
            const store = useKanbanStore()
            store.categories = [makeCategory({ id: 10, title: 'Unchanged' })]

            store.updateCategory(makeCategory({ id: 999, title: 'Ghost' }))

            expect(store.categories[0]!.title).toBe('Unchanged')
            expect(store.categories).toHaveLength(1)
        })
    })

    // ── reorderTasks ─────────────────────────────────────────────────────────

    describe('reorderTasks', () => {
        it('переставляет задачи в нужный порядок', () => {
            const store = useKanbanStore()
            store.categories = [
                makeCategory({
                    id: 10,
                    tasks: [
                        makeTask({ id: 1, category_id: 10 }),
                        makeTask({ id: 2, category_id: 10 }),
                        makeTask({ id: 3, category_id: 10 }),
                    ],
                }),
            ]

            store.reorderTasks(10, [3, 1, 2])

            expect(store.categories[0]!.tasks.map(t => t.id)).toEqual([3, 1, 2])
        })

        it('задачи вне taskIds добавляются в конец в оригинальном порядке', () => {
            const store = useKanbanStore()
            store.categories = [
                makeCategory({
                    id: 10,
                    tasks: [
                        makeTask({ id: 1, category_id: 10 }),
                        makeTask({ id: 2, category_id: 10 }),
                        makeTask({ id: 3, category_id: 10 }),
                    ],
                }),
            ]

            store.reorderTasks(10, [2])

            const ids = store.categories[0]!.tasks.map(t => t.id)
            expect(ids[0]).toBe(2)
            expect(ids).toContain(1)
            expect(ids).toContain(3)
            expect(ids).toHaveLength(3)
        })

        it('реактивно: мутирует исходный массив через splice — ссылка не меняется', () => {
            const store = useKanbanStore()
            store.categories = [
                makeCategory({
                    id: 10,
                    tasks: [
                        makeTask({ id: 1, category_id: 10 }),
                        makeTask({ id: 2, category_id: 10 }),
                    ],
                }),
            ]
            const originalTasksRef = store.categories[0]!.tasks

            store.reorderTasks(10, [2, 1])

            // splice мутирует тот же массив — ссылка не меняется (важно для реактивности)
            expect(store.categories[0]!.tasks).toBe(originalTasksRef)
            expect(store.categories[0]!.tasks.map(t => t.id)).toEqual([2, 1])
        })

        it('не изменяет ничего при несуществующей категории', () => {
            const store = useKanbanStore()
            store.categories = [makeCategory({ id: 10, tasks: [makeTask()] })]

            store.reorderTasks(999, [1])

            expect(store.categories[0]!.tasks).toHaveLength(1)
        })
    })

    // ── deleteTask ───────────────────────────────────────────────────────────

    describe('deleteTask', () => {
        it('удаляет задачу из категории', () => {
            const store = useKanbanStore()
            const task = makeTask({ id: 1, category_id: 10 })
            store.categories = [makeCategory({ id: 10, tasks: [task] })]

            store.deleteTask(task)

            expect(store.categories[0]!.tasks).toHaveLength(0)
        })

        it('удаляет нужную задачу среди нескольких', () => {
            const store = useKanbanStore()
            store.categories = [
                makeCategory({
                    id: 10,
                    tasks: [
                        makeTask({ id: 1, category_id: 10 }),
                        makeTask({ id: 2, category_id: 10 }),
                        makeTask({ id: 3, category_id: 10 }),
                    ],
                }),
            ]

            store.deleteTask(makeTask({ id: 2 }))

            expect(store.categories[0]!.tasks.map(t => t.id)).toEqual([1, 3])
        })

        it('не изменяет ничего если задача не найдена', () => {
            const store = useKanbanStore()
            store.categories = [makeCategory({ id: 10, tasks: [makeTask({ id: 1 })] })]

            store.deleteTask(makeTask({ id: 999 }))

            expect(store.categories[0]!.tasks).toHaveLength(1)
        })
    })

    // ── addCategory ──────────────────────────────────────────────────────────

    describe('addCategory', () => {
        it('вставляет категорию в начало (index 0)', () => {
            const store = useKanbanStore()
            store.categories = [makeCategory({ id: 10 })]

            store.addCategory(0, makeCategory({ id: 20 }))

            expect(store.categories.map(c => c.id)).toEqual([20, 10])
        })

        it('вставляет категорию в конец', () => {
            const store = useKanbanStore()
            store.categories = [makeCategory({ id: 10 })]

            store.addCategory(1, makeCategory({ id: 20 }))

            expect(store.categories.map(c => c.id)).toEqual([10, 20])
        })

        it('вставляет категорию по произвольному индексу', () => {
            const store = useKanbanStore()
            store.categories = [makeCategory({ id: 1 }), makeCategory({ id: 3 })]

            store.addCategory(1, makeCategory({ id: 2 }))

            expect(store.categories.map(c => c.id)).toEqual([1, 2, 3])
        })

        it('реактивно: длина categories увеличивается', () => {
            const store = useKanbanStore()
            store.categories = [makeCategory({ id: 1 })]
            const before = store.categories.length

            store.addCategory(0, makeCategory({ id: 2 }))

            expect(store.categories.length).toBe(before + 1)
        })
    })

    // ── reorderCategories ────────────────────────────────────────────────────

    describe('reorderCategories', () => {
        it('переставляет категории в нужный порядок', () => {
            const store = useKanbanStore()
            store.categories = [
                makeCategory({ id: 1 }),
                makeCategory({ id: 2 }),
                makeCategory({ id: 3 }),
            ]

            store.reorderCategories([3, 1, 2])

            expect(store.categories.map(c => c.id)).toEqual([3, 1, 2])
        })

        it('категории вне списка добавляются в конец', () => {
            const store = useKanbanStore()
            store.categories = [
                makeCategory({ id: 1 }),
                makeCategory({ id: 2 }),
                makeCategory({ id: 3 }),
            ]

            store.reorderCategories([3])

            expect(store.categories[0]!.id).toBe(3)
            expect(store.categories.map(c => c.id)).toContain(1)
            expect(store.categories.map(c => c.id)).toContain(2)
            expect(store.categories).toHaveLength(3)
        })

        it('реактивно: мутирует исходный массив через splice — ссылка не меняется', () => {
            const store = useKanbanStore()
            store.categories = [makeCategory({ id: 1 }), makeCategory({ id: 2 })]
            const originalRef = store.categories

            store.reorderCategories([2, 1])

            expect(store.categories).toBe(originalRef)
            expect(store.categories.map(c => c.id)).toEqual([2, 1])
        })
    })

    // ── deleteCategory ───────────────────────────────────────────────────────

    describe('deleteCategory', () => {
        it('удаляет нужную категорию', () => {
            const store = useKanbanStore()
            const cat = makeCategory({ id: 10 })
            store.categories = [cat, makeCategory({ id: 20 })]

            store.deleteCategory(cat)

            expect(store.categories.map(c => c.id)).toEqual([20])
        })

        it('не изменяет ничего если категория не найдена', () => {
            const store = useKanbanStore()
            store.categories = [makeCategory({ id: 10 })]

            store.deleteCategory(makeCategory({ id: 999 }))

            expect(store.categories).toHaveLength(1)
        })

        it('реактивно: длина categories уменьшается', () => {
            const store = useKanbanStore()
            const cat = makeCategory({ id: 10 })
            store.categories = [cat, makeCategory({ id: 20 })]
            const before = store.categories.length

            store.deleteCategory(cat)

            expect(store.categories.length).toBe(before - 1)
        })
    })

    // ── setCategory ──────────────────────────────────────────────────────────

    describe('setCategory', () => {
        it('заменяет все категории', () => {
            const store = useKanbanStore()
            store.categories = [makeCategory({ id: 1 })]
            const newCats = [makeCategory({ id: 2 }), makeCategory({ id: 3 })]

            store.setCategory(newCats)

            // Vue оборачивает присвоенный массив в реактивный Proxy — ссылки не совпадут,
            // но содержимое должно быть идентичным
            expect(store.categories).toStrictEqual(newCats)
        })

        it('немедленно отключает animationsEnabled', () => {
            const store = useKanbanStore()

            store.setCategory([makeCategory()])

            expect(store.animationsEnabled).toBe(false)
        })

        it('включает animationsEnabled после nextTick', async () => {
            const store = useKanbanStore()

            store.setCategory([makeCategory()])
            expect(store.animationsEnabled).toBe(false)

            await nextTick()

            expect(store.animationsEnabled).toBe(true)
        })
    })

    // ── registerPendingTask / awaitRealId ────────────────────────────────────

    describe('registerPendingTask / awaitRealId', () => {
        it('awaitRealId возвращает taskId напрямую если id >= 0', async () => {
            const store = useKanbanStore()

            expect(await store.awaitRealId(0)).toBe(0)
            expect(await store.awaitRealId(5)).toBe(5)
        })

        it('awaitRealId возвращает null если нет зарегистрированного promise', async () => {
            const store = useKanbanStore()

            expect(await store.awaitRealId(-1)).toBeNull()
        })

        it('registerPendingTask заменяет tempId на реальный id в задаче', async () => {
            const store = useKanbanStore()
            const tempId = -1
            store.categories = [
                makeCategory({ id: 10, tasks: [makeTask({ id: tempId, category_id: 10 })] }),
            ]

            let resolve!: (value: number) => void
            const promise = new Promise<number>(r => { resolve = r })
            store.registerPendingTask(tempId, promise)

            // До разрешения — tempId на месте
            expect(store.categories[0]!.tasks[0]!.id).toBe(tempId)

            resolve(42)
            // awaitRealId возвращает внутренний .then()-промис — ждём его завершения
            await store.awaitRealId(tempId)

            expect(store.categories[0]!.tasks[0]!.id).toBe(42)
        })

        it('awaitRealId ждёт pending promise и возвращает реальный id', async () => {
            const store = useKanbanStore()
            const tempId = -2
            store.categories = [
                makeCategory({ id: 10, tasks: [makeTask({ id: tempId, category_id: 10 })] }),
            ]

            let resolve!: (value: number) => void
            const promise = new Promise<number>(r => { resolve = r })
            store.registerPendingTask(tempId, promise)

            const waiting = store.awaitRealId(tempId)
            resolve(99)

            expect(await waiting).toBe(99)
        })

        it('registerPendingTask удаляет tempId из Map после разрешения', async () => {
            const store = useKanbanStore()
            const tempId = -3
            store.categories = [
                makeCategory({ id: 10, tasks: [makeTask({ id: tempId, category_id: 10 })] }),
            ]

            // Promise.resolve() — уже разрешён, .then() сразу попадает в очередь
            const promise = Promise.resolve<number | null>(77)
            store.registerPendingTask(tempId, promise)

            await promise // ждём завершения внутреннего .then() (он зарегистрирован первым)

            // Map очищен — awaitRealId вернёт null
            expect(await store.awaitRealId(tempId)).toBeNull()
        })

        it('не обновляет id задачи если promise вернул null', async () => {
            const store = useKanbanStore()
            const tempId = -4
            store.categories = [
                makeCategory({ id: 10, tasks: [makeTask({ id: tempId, category_id: 10 })] }),
            ]

            const promise = Promise.resolve<number | null>(null)
            store.registerPendingTask(tempId, promise)

            await promise

            expect(store.categories[0]!.tasks[0]!.id).toBe(tempId)
        })
    })

    // ── вспомогательные геттеры ──────────────────────────────────────────────

    describe('getCategoryIndex', () => {
        it('возвращает правильный индекс', () => {
            const store = useKanbanStore()
            store.categories = [makeCategory({ id: 10 }), makeCategory({ id: 20 })]

            expect(store.getCategoryIndex(10)).toBe(0)
            expect(store.getCategoryIndex(20)).toBe(1)
        })

        it('возвращает -1 если категория не найдена', () => {
            const store = useKanbanStore()
            store.categories = [makeCategory({ id: 10 })]

            expect(store.getCategoryIndex(999)).toBe(-1)
        })
    })

    describe('getCategoryIndexByTaskId', () => {
        it('находит категорию по id задачи', () => {
            const store = useKanbanStore()
            store.categories = [
                makeCategory({ id: 10, tasks: [] }),
                makeCategory({ id: 20, tasks: [makeTask({ id: 5, category_id: 20 })] }),
            ]

            expect(store.getCategoryIndexByTaskId(5)).toBe(1)
        })

        it('возвращает -1 если задача нигде не найдена', () => {
            const store = useKanbanStore()
            store.categories = [makeCategory({ id: 10, tasks: [] })]

            expect(store.getCategoryIndexByTaskId(999)).toBe(-1)
        })
    })

    describe('getTaskIndex', () => {
        it('возвращает правильный индекс задачи внутри категории', () => {
            const store = useKanbanStore()
            store.categories = [
                makeCategory({
                    id: 10,
                    tasks: [
                        makeTask({ id: 1, category_id: 10 }),
                        makeTask({ id: 2, category_id: 10 }),
                    ],
                }),
            ]

            expect(store.getTaskIndex(1, 0)).toBe(0)
            expect(store.getTaskIndex(2, 0)).toBe(1)
        })

        it('возвращает -1 если задача не найдена в категории', () => {
            const store = useKanbanStore()
            store.categories = [makeCategory({ id: 10, tasks: [] })]

            expect(store.getTaskIndex(999, 0)).toBe(-1)
        })

        it('возвращает -1 если columnIndex вне диапазона', () => {
            const store = useKanbanStore()
            store.categories = []

            expect(store.getTaskIndex(1, 99)).toBe(-1)
        })
    })

    // ── moveTask ─────────────────────────────────────────────────────────────

    describe('moveTask', () => {

        // ── та же категория ──────────────────────────────────────────────────

        it('перемещает задачу в начало той же категории (index 0)', () => {
            const store = useKanbanStore()
            store.categories = [
                makeCategory({
                    id: 10,
                    tasks: [
                        makeTask({ id: 1, category_id: 10 }),
                        makeTask({ id: 2, category_id: 10 }),
                        makeTask({ id: 3, category_id: 10 }),
                    ],
                }),
            ]

            store.moveTask(makeTask({ id: 3, category_id: 10 }), 10, 0)

            expect(store.categories[0]!.tasks.map(t => t.id)).toEqual([3, 1, 2])
        })

        it('перемещает задачу в середину той же категории', () => {
            const store = useKanbanStore()
            store.categories = [
                makeCategory({
                    id: 10,
                    tasks: [
                        makeTask({ id: 1, category_id: 10 }),
                        makeTask({ id: 2, category_id: 10 }),
                        makeTask({ id: 3, category_id: 10 }),
                        makeTask({ id: 4, category_id: 10 }),
                    ],
                }),
            ]

            // Перемещаем задачу 4 на позицию 1
            store.moveTask(makeTask({ id: 4, category_id: 10 }), 10, 1)

            expect(store.categories[0]!.tasks.map(t => t.id)).toEqual([1, 4, 2, 3])
        })

        it('перемещает задачу в конец той же категории', () => {
            const store = useKanbanStore()
            store.categories = [
                makeCategory({
                    id: 10,
                    tasks: [
                        makeTask({ id: 1, category_id: 10 }),
                        makeTask({ id: 2, category_id: 10 }),
                        makeTask({ id: 3, category_id: 10 }),
                    ],
                }),
            ]

            // Перемещаем первую задачу в конец (после удаления длина = 2, поэтому index 2)
            store.moveTask(makeTask({ id: 1, category_id: 10 }), 10, 2)

            expect(store.categories[0]!.tasks.map(t => t.id)).toEqual([2, 3, 1])
        })

        it('количество задач не меняется при перемещении внутри той же категории', () => {
            const store = useKanbanStore()
            store.categories = [
                makeCategory({
                    id: 10,
                    tasks: [
                        makeTask({ id: 1, category_id: 10 }),
                        makeTask({ id: 2, category_id: 10 }),
                        makeTask({ id: 3, category_id: 10 }),
                    ],
                }),
            ]

            store.moveTask(makeTask({ id: 2, category_id: 10 }), 10, 0)

            expect(store.categories[0]!.tasks).toHaveLength(3)
        })

        // ── разные категории ─────────────────────────────────────────────────

        it('перемещает задачу в начало другой категории (index 0)', () => {
            const store = useKanbanStore()
            store.categories = [
                makeCategory({ id: 10, tasks: [makeTask({ id: 1, category_id: 10 })] }),
                makeCategory({
                    id: 20,
                    tasks: [
                        makeTask({ id: 2, category_id: 20 }),
                        makeTask({ id: 3, category_id: 20 }),
                    ],
                }),
            ]

            store.moveTask(makeTask({ id: 1, category_id: 10 }), 20, 0)

            expect(store.categories[0]!.tasks).toHaveLength(0)
            expect(store.categories[1]!.tasks.map(t => t.id)).toEqual([1, 2, 3])
        })

        it('перемещает задачу в середину другой категории', () => {
            const store = useKanbanStore()
            store.categories = [
                makeCategory({ id: 10, tasks: [makeTask({ id: 1, category_id: 10 })] }),
                makeCategory({
                    id: 20,
                    tasks: [
                        makeTask({ id: 2, category_id: 20 }),
                        makeTask({ id: 3, category_id: 20 }),
                        makeTask({ id: 4, category_id: 20 }),
                    ],
                }),
            ]

            store.moveTask(makeTask({ id: 1, category_id: 10 }), 20, 1)

            expect(store.categories[0]!.tasks).toHaveLength(0)
            expect(store.categories[1]!.tasks.map(t => t.id)).toEqual([2, 1, 3, 4])
        })

        it('перемещает задачу в конец другой категории', () => {
            const store = useKanbanStore()
            store.categories = [
                makeCategory({ id: 10, tasks: [makeTask({ id: 1, category_id: 10 })] }),
                makeCategory({
                    id: 20,
                    tasks: [
                        makeTask({ id: 2, category_id: 20 }),
                        makeTask({ id: 3, category_id: 20 }),
                    ],
                }),
            ]

            store.moveTask(makeTask({ id: 1, category_id: 10 }), 20, 2)

            expect(store.categories[0]!.tasks).toHaveLength(0)
            expect(store.categories[1]!.tasks.map(t => t.id)).toEqual([2, 3, 1])
        })

        it('вставляет задачу в пустую категорию на index 0', () => {
            const store = useKanbanStore()
            store.categories = [
                makeCategory({ id: 10, tasks: [makeTask({ id: 1, category_id: 10 })] }),
                makeCategory({ id: 20, tasks: [] }),
            ]

            store.moveTask(makeTask({ id: 1, category_id: 10 }), 20, 0)

            expect(store.categories[0]!.tasks).toHaveLength(0)
            expect(store.categories[1]!.tasks.map(t => t.id)).toEqual([1])
        })

        // ── задача нигде не числится (новая от сервера) ──────────────────────

        it('вставляет задачу в нужную позицию если она ещё не в сторе', () => {
            const store = useKanbanStore()
            store.categories = [
                makeCategory({
                    id: 10,
                    tasks: [
                        makeTask({ id: 1, category_id: 10 }),
                        makeTask({ id: 2, category_id: 10 }),
                    ],
                }),
            ]
            const newTask = makeTask({ id: 99, category_id: 10 })

            store.moveTask(newTask, 10, 1)

            expect(store.categories[0]!.tasks.map(t => t.id)).toEqual([1, 99, 2])
        })

        // ── граничные случаи ─────────────────────────────────────────────────

        it('не изменяет ничего если целевая категория не существует', () => {
            const store = useKanbanStore()
            store.categories = [
                makeCategory({ id: 10, tasks: [makeTask({ id: 1, category_id: 10 })] }),
            ]

            store.moveTask(makeTask({ id: 1, category_id: 10 }), 999, 0)

            // Задача удалена из старой категории, но некуда вставить — пропадёт
            // Это ожидаемое поведение при получении невалидных данных от сервера
            expect(store.categories[0]!.tasks).toHaveLength(0)
        })

        // ── реактивность ─────────────────────────────────────────────────────

        it('реактивно: мутирует массивы через splice — ссылки сохраняются', () => {
            const store = useKanbanStore()
            store.categories = [
                makeCategory({ id: 10, tasks: [makeTask({ id: 1, category_id: 10 })] }),
                makeCategory({ id: 20, tasks: [makeTask({ id: 2, category_id: 20 })] }),
            ]
            const srcTasksRef = store.categories[0]!.tasks
            const dstTasksRef = store.categories[1]!.tasks

            store.moveTask(makeTask({ id: 1, category_id: 10 }), 20, 0)

            // splice мутирует массивы — ссылки не меняются (важно для Vue reactivity)
            expect(store.categories[0]!.tasks).toBe(srcTasksRef)
            expect(store.categories[1]!.tasks).toBe(dstTasksRef)
        })

        it('реактивно: индекс задачи читается через getTaskIndex после перемещения', () => {
            const store = useKanbanStore()
            store.categories = [
                makeCategory({
                    id: 10,
                    tasks: [
                        makeTask({ id: 1, category_id: 10 }),
                        makeTask({ id: 2, category_id: 10 }),
                        makeTask({ id: 3, category_id: 10 }),
                    ],
                }),
            ]

            store.moveTask(makeTask({ id: 3, category_id: 10 }), 10, 0)

            expect(store.getTaskIndex(3, 0)).toBe(0)
            expect(store.getTaskIndex(1, 0)).toBe(1)
            expect(store.getTaskIndex(2, 0)).toBe(2)
        })
    })
})