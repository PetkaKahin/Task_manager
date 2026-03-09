import { watch, type Ref } from 'vue'
import echo from '@/echo'
import type { PresenceChannel } from 'laravel-echo'

interface EventListener<T = any> {
    event: string
    handler: (data: T) => void
}

const activeChannels = new Map<string, PresenceChannel>()

export function usePresenceChannel(
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

        if (activeChannels.has(name)) return

        const channel = echo.join(name)
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

export function _resetPresenceChannels() {
    activeChannels.clear()
}
