import { ref, onMounted, onUnmounted, type Ref } from 'vue'

interface Options {
    handle: Ref<HTMLElement | null>
}

export function useDraggable({ handle }: Options) {
    const position = ref({ x: 0, y: 0 })

    let startX = 0
    let startY = 0
    let initialX = 0
    let initialY = 0

    const onMouseMove = (e: MouseEvent) => {
        const dx = e.clientX - startX
        const dy = e.clientY - startY

        position.value.x = initialX + dx
        position.value.y = initialY + dy
    }

    const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
    }

    const onMouseDown = (e: MouseEvent) => {
        startX = e.clientX
        startY = e.clientY

        initialX = position.value.x
        initialY = position.value.y

        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', onMouseUp)
    }

    onMounted(() => {
        handle.value?.addEventListener('mousedown', onMouseDown)
    })

    onUnmounted(() => {
        handle.value?.removeEventListener('mousedown', onMouseDown)
    })

    return {
        position
    }
}
