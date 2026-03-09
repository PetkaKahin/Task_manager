import { describe, it, expect, vi } from 'vitest'
import { useApi } from '@/composables/api/useApi'

// useApi — чистая функция без зависимостей от store/echo/router.
// Мокаем только переданный fn.

describe('useApi', () => {

    // ── начальное состояние ───────────────────────────────────────────────────

    it('data инициализируется переданным defaults', () => {
        const { data } = useApi(() => Promise.resolve([]), [])

        expect(data.value).toEqual([])
    })

    it('isLoading изначально false', () => {
        const { isLoading } = useApi(() => Promise.resolve(null), null)

        expect(isLoading.value).toBe(false)
    })

    it('error изначально null', () => {
        const { error } = useApi(() => Promise.resolve(null), null)

        expect(error.value).toBeNull()
    })

    // ── успешный запрос ───────────────────────────────────────────────────────

    it('execute обновляет data при успехе', async () => {
        const { data, execute } = useApi(() => Promise.resolve(42), 0)

        await execute()

        expect(data.value).toBe(42)
    })

    it('execute возвращает результат при успехе', async () => {
        const { execute } = useApi(() => Promise.resolve('ok'), '')

        const result = await execute()

        expect(result).toBe('ok')
    })

    it('isLoading = false после успешного запроса', async () => {
        const { isLoading, execute } = useApi(() => Promise.resolve(1), 0)

        await execute()

        expect(isLoading.value).toBe(false)
    })

    it('error остаётся null после успешного запроса', async () => {
        const { error, execute } = useApi(() => Promise.resolve(1), 0)

        await execute()

        expect(error.value).toBeNull()
    })

    // ── isLoading во время запроса ────────────────────────────────────────────

    it('isLoading = true во время выполнения запроса', async () => {
        let resolveRequest!: (v: number) => void
        const pending = new Promise<number>(r => { resolveRequest = r })

        const { isLoading, execute } = useApi(() => pending, 0)

        const promise = execute()
        expect(isLoading.value).toBe(true)

        resolveRequest(1)
        await promise
        expect(isLoading.value).toBe(false)
    })

    it('error сбрасывается в null при повторном вызове execute', async () => {
        let shouldFail = true
        const fn = () => shouldFail
            ? Promise.reject(new Error('fail'))
            : Promise.resolve(1)

        const { error, execute } = useApi(fn, 0)

        await execute()
        expect(error.value).toBe('fail')

        shouldFail = false
        await execute()
        expect(error.value).toBeNull()
    })

    // ── обработка ошибок ──────────────────────────────────────────────────────

    it('execute возвращает undefined при ошибке', async () => {
        const { execute } = useApi(() => Promise.reject(new Error('fail')), 0)

        const result = await execute()

        expect(result).toBeUndefined()
    })

    it('data не изменяется при ошибке', async () => {
        const { data, execute } = useApi(() => Promise.reject(new Error('fail')), 99)

        await execute()

        expect(data.value).toBe(99)
    })

    it('isLoading = false после ошибки (finally)', async () => {
        const { isLoading, execute } = useApi(() => Promise.reject(new Error('fail')), 0)

        await execute()

        expect(isLoading.value).toBe(false)
    })

    // ── цепочка извлечения сообщения ошибки ──────────────────────────────────

    it('читает error из e.response.data.message (axios-формат)', async () => {
        const axiosError = { response: { data: { message: 'Validation failed' } } }
        const { error, execute } = useApi(() => Promise.reject(axiosError), null)

        await execute()

        expect(error.value).toBe('Validation failed')
    })

    it('fallback на e.message если нет e.response.data.message', async () => {
        const { error, execute } = useApi(() => Promise.reject(new Error('Network error')), null)

        await execute()

        expect(error.value).toBe('Network error')
    })

    it('fallback на "Неизвестная ошибка" если нет ни response ни message', async () => {
        const { error, execute } = useApi(() => Promise.reject({}), null)

        await execute()

        expect(error.value).toBe('Неизвестная ошибка')
    })

    it('e.response.data.message имеет приоритет над e.message', async () => {
        const error = {
            response: { data: { message: 'Server message' } },
            message: 'JS message',
        }
        const { error: errorRef, execute } = useApi(() => Promise.reject(error), null)

        await execute()

        expect(errorRef.value).toBe('Server message')
    })

    // ── передача аргументов ───────────────────────────────────────────────────

    it('execute передаёт аргументы в fn', async () => {
        const fn = vi.fn().mockResolvedValue('ok')
        const { execute } = useApi(fn, '')

        await execute('arg1', 42)

        expect(fn).toHaveBeenCalledWith('arg1', 42)
    })

    it('fn вызывается при каждом execute', async () => {
        const fn = vi.fn().mockResolvedValue(1)
        const { execute } = useApi(fn, 0)

        await execute()
        await execute()

        expect(fn).toHaveBeenCalledTimes(2)
    })
})