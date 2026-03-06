import { watch, onUnmounted, type Ref } from 'vue'
import echo from '@/echo'
import type { PresenceChannel } from 'laravel-echo'

interface EventListener<T = any> {
    event: string
    handler: (data: T) => void
}

export function usePresenceChannel(
    channelName: Ref<string | null>,
    listeners: EventListener[] = [],
) {
    let channel: PresenceChannel | null = null
    let currentName: string | null = null

    function leave() {
        if (currentName) {
            echo.leave(currentName)
            channel = null
            currentName = null
        }
    }

    function join(name: string) {
        channel = echo.join(name)
        currentName = name

        for (const { event, handler } of listeners) {
            channel.listen(event, handler)
        }
    }

    watch(channelName, (newName, oldName) => {
        if (oldName) leave()
        if (newName) join(newName)
    }, { immediate: true })

    onUnmounted(leave)

    return { leave }
}