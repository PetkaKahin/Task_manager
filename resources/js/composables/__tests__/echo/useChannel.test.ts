import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref, nextTick, defineComponent, createApp } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { usePresenceChannel, _resetPresenceChannels } from '@/composables/echo/usePresenceChannel'
import { usePrivateChannel, _resetPrivateChannels } from '@/composables/echo/usePrivateChannel'

// ── Mock echo ────────────────────────────────────────────────────────────────

const echoMock = vi.hoisted(() => ({
    join: vi.fn(),
    private: vi.fn(),
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

// ── Параметризованные тесты для обоих каналов ─────────────────────────────────
// usePresenceChannel использует echo.join(), usePrivateChannel — echo.private().
// Поведение идентично, поэтому один набор тестов прогоняется для обоих.

function describeChannel(
    label: string,
    useChannel: typeof usePresenceChannel,
    joinKey: 'join' | 'private',
    resetFn: () => void,
) {
    describe(label, () => {
        let channelMock: ReturnType<typeof makeChannelMock>

        beforeEach(() => {
            setActivePinia(createPinia())
            vi.clearAllMocks()
            resetFn()
            channelMock = makeChannelMock()
            echoMock[joinKey].mockReturnValue(channelMock)
        })

        // ── join / leave ──────────────────────────────────────────────────────

        it('присоединяется к каналу сразу если channelName задан (immediate)', () => {
            withSetup(() => useChannel(ref('Room.1')))

            expect(echoMock[joinKey]).toHaveBeenCalledWith('Room.1')
        })

        it('не присоединяется если channelName равен null', () => {
            withSetup(() => useChannel(ref(null)))

            expect(echoMock[joinKey]).not.toHaveBeenCalled()
        })

        it('присоединяется когда channelName меняется с null на строку', async () => {
            const name = ref<string | null>(null)
            withSetup(() => useChannel(name))

            name.value = 'Room.1'
            await nextTick()

            expect(echoMock[joinKey]).toHaveBeenCalledWith('Room.1')
        })

        it('покидает старый канал и входит в новый при смене channelName', async () => {
            const name = ref<string | null>('Room.1')
            withSetup(() => useChannel(name))

            name.value = 'Room.2'
            await nextTick()

            expect(echoMock.leave).toHaveBeenCalledWith('Room.1')
            expect(echoMock[joinKey]).toHaveBeenCalledWith('Room.2')
        })

        it('покидает канал когда channelName становится null', async () => {
            const name = ref<string | null>('Room.1')
            withSetup(() => useChannel(name))

            name.value = null
            await nextTick()

            expect(echoMock.leave).toHaveBeenCalledWith('Room.1')
            expect(echoMock[joinKey]).toHaveBeenCalledTimes(1) // новый join не вызывался
        })

        it('не вызывает leave при смене если канал не был открыт (null → null)', async () => {
            const name = ref<string | null>(null)
            withSetup(() => useChannel(name))

            // остаётся null — watch не должен ничего делать
            await nextTick()

            expect(echoMock.leave).not.toHaveBeenCalled()
        })

        // ── listeners ─────────────────────────────────────────────────────────

        it('регистрирует все переданные listeners через .listen()', () => {
            const h1 = vi.fn()
            const h2 = vi.fn()
            withSetup(() => useChannel(ref('Room.1'), [
                { event: '.EventA', handler: h1 },
                { event: '.EventB', handler: h2 },
            ]))

            expect(channelMock.listen).toHaveBeenCalledWith('.EventA', h1)
            expect(channelMock.listen).toHaveBeenCalledWith('.EventB', h2)
            expect(channelMock.listen).toHaveBeenCalledTimes(2)
        })

        it('не вызывает .listen() если listeners не переданы', () => {
            withSetup(() => useChannel(ref('Room.1')))

            expect(channelMock.listen).not.toHaveBeenCalled()
        })

        it('listener получает данные события', () => {
            const handler = vi.fn()
            withSetup(() => useChannel(ref('Room.1'), [{ event: '.MyEvent', handler }]))

            channelMock.trigger('.MyEvent', { payload: 42 })

            expect(handler).toHaveBeenCalledWith({ payload: 42 })
        })

        // ── persistent subscription (НЕ отписывается при unmount) ────────────

        it('НЕ вызывает leave при unmount компонента', () => {
            const { unmount } = withSetup(() => useChannel(ref('Room.1')))

            unmount()

            expect(echoMock.leave).not.toHaveBeenCalled()
        })

        it('при remount НЕ создаёт дублирующую подписку', () => {
            const name = ref<string | null>('Room.1')
            const { unmount } = withSetup(() => useChannel(name))
            unmount()
            withSetup(() => useChannel(name))

            // join вызван только 1 раз (при первом mount)
            expect(echoMock[joinKey]).toHaveBeenCalledTimes(1)
        })

        it('при remount обработчики всё ещё работают', () => {
            const handler = vi.fn()
            const name = ref<string | null>('Room.1')

            const { unmount } = withSetup(() => useChannel(name, [{ event: '.MyEvent', handler }]))
            unmount()
            withSetup(() => useChannel(name, [{ event: '.MyEvent', handler }]))

            channelMock.trigger('.MyEvent', { payload: 42 })

            // Обработчик с первого mount работает, дублирующий НЕ добавлен
            expect(handler).toHaveBeenCalledTimes(1)
            expect(handler).toHaveBeenCalledWith({ payload: 42 })
        })

        it('ручной leave() работает', () => {
            const { result } = withSetup(() => useChannel(ref('Room.1')))

            result.leave()
            expect(echoMock.leave).toHaveBeenCalledTimes(1)
            expect(echoMock.leave).toHaveBeenCalledWith('Room.1')
        })
    })
}

describeChannel('usePresenceChannel', usePresenceChannel, 'join', _resetPresenceChannels)
describeChannel('usePrivateChannel', usePrivateChannel, 'private', _resetPrivateChannels)
