import {computed, ref} from "vue";

export interface Subscriber {
    key: string,
    unsubscribeCallback: () => void,
}

const subscribers = ref<Subscriber[]>([])

export function useBackdrop() {

    const isVisible = computed(() => {
        return subscribers.value.length !== 0
    })

    const toggle = (subscriber: Subscriber): void => {
        if (subscribers.value.findIndex(s => s.key === subscriber.key) === -1) {
            open(subscriber)
        } else {
            close(subscriber.key)
        }
    }

    const open = (subscriber: Subscriber): void => {
        const subscriberIndex: number = subscribers.value.findIndex(
            s => s.key === subscriber.key
        )

        if (subscriberIndex !== -1)
            return console.warn(`Ключ "${subscriber.key}" уже используется`)

        subscribers.value.push(subscriber)
    }

    const close = (key: string): void => {
        const subscriberIndex: number = subscribers.value.findIndex(
            s => s.key === key
        )

        if (subscriberIndex === -1)
            return console.warn(`Попытка удалить несуществующий элемент по ключу: "${key}"`)


        subscribers.value[subscriberIndex]!.unsubscribeCallback()
        subscribers.value.splice(subscriberIndex, 1)
    }

    const closeLast = (): void => {
        if (subscribers.value.length === 0) return

        const indexLastSubscriber: number = subscribers.value.length - 1

        subscribers.value[indexLastSubscriber]!.unsubscribeCallback()
        subscribers.value.pop()
    }

    const closeAll = (): void => {
        for (let i = subscribers.value.length; i > 0; i--) {
            subscribers.value[i]!.unsubscribeCallback()
            subscribers.value.splice(i, 1)
        }
    }

    return {
        isVisible,
        open,
        close,
        closeLast,
        toggle,
    }
}
