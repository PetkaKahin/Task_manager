import { watch, type Ref } from 'vue'
import echo from '@/echo'
import type { Channel } from 'laravel-echo'

interface EventListener<T = any> {
    event: string
    handler: (data: T) => void
}

/**
 * Кеш активных подписок на приватные каналы.
 * Подписка живёт пока не изменится channelName (напр. logout),
 * а НЕ привязана к lifecycle компонента.
 * Это критично, потому что BaseLayout НЕ persistent —
 * при Inertia-навигации SideMenu unmount/remount,
 * и без кеша между leave/rejoin есть окно,
 * когда вкладка пропускает бродкасты.
 */
const activeChannels = new Map<string, Channel>()

export function usePrivateChannel(
    channelName: Ref<string | null>,
    listeners: EventListener[] = [],
) {
    let currentName: string | null = null

    function leave() {
        if (currentName) {
            activeChannels.delete(currentName)
            echo.leave(currentName)
            currentName = null
        }
    }

    function join(name: string) {
        currentName = name

        // Канал уже подписан (remount после Inertia-навигации) — не дублируем
        if (activeChannels.has(name)) return

        const channel = echo.private(name)
        activeChannels.set(name, channel)

        for (const { event, handler } of listeners) {
            channel.listen(event, handler)
        }
    }

    watch(channelName, (newName, oldName) => {
        if (newName === oldName) return
        if (oldName) leave()
        if (newName) join(newName)
    }, { immediate: true })

    return { leave }
}

export function _resetPrivateChannels() {
    activeChannels.clear()
}
