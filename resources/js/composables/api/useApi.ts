import {ref, type Ref} from "vue";

export interface IUseApi<T> {
    data: Ref<T>
    isLoading: Ref<boolean>
    error: Ref<string | null>
    execute: (...args: any[]) => Promise<T | undefined>
}

/**
 * Универсальная обёртка для любого async-запроса.
 *
 * @param fn       — async-функция, которая возвращает данные
 * @param defaults — начальное значение data
 */
export function useApi<T>(
    fn: (...args: any[]) => Promise<T>,
    defaults: T,
): IUseApi<T> {
    const data = ref<T>(defaults) as Ref<T>
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    async function execute(...args: any[]): Promise<T | undefined> {
        isLoading.value = true
        error.value = null

        try {
            const result = await fn(...args)
            data.value = result
            return result
        } catch (e: any) {
            error.value =
                e.response?.data?.message
                ?? e.message
                ?? 'Неизвестная ошибка'
            return undefined
        } finally {
            isLoading.value = false
        }
    }

    return { data, isLoading, error, execute }
}
