import { ref, unref, onUnmounted, type Ref } from 'vue'
import { useEdgeScrollStore } from '@/stores/edgeScroll.store.ts'

interface EdgeScrollOptions {
    /** Уникальный id для регистрации в сторе (позволяет другим компонентам управлять скроллом) */
    id?: string
    /** Размер горячей зоны в px от края контейнера */
    zoneSize?: number
    /** Максимальная скорость скролла (px за кадр) */
    maxSpeed?: number
    /** Скроллить по горизонтали */
    horizontal?: boolean
    /** Скроллить по вертикали */
    vertical?: boolean
    /** Множитель скорости когда курсор ЗА пределами контейнера */
    outsideMultiplier?: number
    /** Не скроллить когда курсор за пределами контейнера */
    containerOnly?: boolean
}

/**
 * Автоскролл контейнера когда зажатый курсор приближается к краям.
 *
 * При вызове `startDrag` начинает отслеживать позицию курсора.
 * Если курсор попадает в горячую зону у края — контейнер плавно скроллится,
 * чем ближе к краю — тем быстрее. За пределами контейнера скорость максимальная.
 *
 * @param containerRef - ref на скроллируемый элемент
 * @param options - настройки поведения скролла
 * @returns `startDrag` / `stopDrag` — управление, `isDragging` — реактивный флаг
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { ref } from 'vue'
 * import { useEdgeScroll } from '@/composables/useEdgeScroll'
 *
 * const listRef = ref<HTMLElement | null>(null)
 * const { startDrag } = useEdgeScroll(listRef, { zoneSize: 60 })
 * </script>
 *
 * <template>
 *   <div ref="listRef" style="overflow-y: auto; height: 400px">
 *     <div v-for="item in items" :key="item.id" @pointerdown="startDrag($event)">
 *       {{ item.name }}
 *     </div>
 *   </div>
 * </template>
 * ```
 */
export function useEdgeScroll(
    containerRef: Ref<HTMLElement | null>,
    options: EdgeScrollOptions = {},
) {
    const {
        id,
        zoneSize = 50,
        maxSpeed = 12,
        horizontal = false,
        vertical = true,
        outsideMultiplier = 1.5,
        containerOnly = true,
    } = options

    const isDragging = ref(false)

    let animFrameId: number | null = null
    let currentMouseX = 0
    let currentMouseY = 0

    /**
     * Считает скорость скролла для одной оси.
     * Возвращает отрицательное значение для скролла к началу,
     * положительное — к концу, 0 — если курсор вне горячей зоны.
     */
    function calcSpeed(
        mousePos: number,
        edgeStart: number,
        edgeEnd: number,
    ): number {
        const distFromStart = mousePos - edgeStart
        const distFromEnd = edgeEnd - mousePos

        // Курсор ЗА пределами контейнера — скроллим быстрее
        if (distFromStart < 0) {
            return -maxSpeed * outsideMultiplier
        }
        if (distFromEnd < 0) {
            return maxSpeed * outsideMultiplier
        }

        // Курсор в горячей зоне у начала (верх / лево)
        if (distFromStart < zoneSize) {
            const ratio = 1 - distFromStart / zoneSize
            return -ratio * maxSpeed
        }

        // Курсор в горячей зоне у конца (низ / право)
        if (distFromEnd < zoneSize) {
            const ratio = 1 - distFromEnd / zoneSize
            return ratio * maxSpeed
        }

        return 0
    }

    function scrollTick() {
        const container = unref(containerRef)
        if (!container || !isDragging.value) {
            animFrameId = null
            return
        }

        const rect = container.getBoundingClientRect()

        // Курсор полностью за пределами контейнера — не скроллим
        if (containerOnly) {
            const outsideX = currentMouseX < rect.left || currentMouseX > rect.right
            const outsideY = currentMouseY < rect.top || currentMouseY > rect.bottom
            if (outsideX || outsideY) {
                animFrameId = requestAnimationFrame(scrollTick)
                return
            }
        }

        let scrolledAnything = false

        if (vertical) {
            const speedY = calcSpeed(currentMouseY, rect.top, rect.bottom)
            if (speedY !== 0) {
                container.scrollTop += speedY
                scrolledAnything = true
            }
        }

        if (horizontal) {
            const speedX = calcSpeed(currentMouseX, rect.left, rect.right)
            if (speedX !== 0) {
                container.scrollLeft += speedX
                scrolledAnything = true
            }
        }

        // Продолжаем цикл только если реально скроллим
        if (scrolledAnything) {
            animFrameId = requestAnimationFrame(scrollTick)
        } else {
            animFrameId = null
        }
    }

    function ensureTickRunning() {
        if (animFrameId === null) {
            animFrameId = requestAnimationFrame(scrollTick)
        }
    }

    function stopTick() {
        if (animFrameId !== null) {
            cancelAnimationFrame(animFrameId)
            animFrameId = null
        }
    }

    // --- Обработчики событий (вешаются на document) ---

    function updatePosition(x: number, y: number) {
        currentMouseX = x
        currentMouseY = y
        ensureTickRunning()
    }

    function onPointerMove(e: PointerEvent) {
        if (!isDragging.value) return
        updatePosition(e.clientX, e.clientY)
    }

    function onTouchMove(e: TouchEvent) {
        if (!isDragging.value || !e.touches.length) return
        updatePosition(e.touches[0]!.clientX, e.touches[0]!.clientY)
    }

    function cleanup() {
        isDragging.value = false
        stopTick()
        document.removeEventListener('pointermove', onPointerMove)
        document.removeEventListener('touchmove', onTouchMove)
        document.removeEventListener('pointerup', onPointerUp)
        document.removeEventListener('touchend', onTouchEnd)
        document.removeEventListener('touchcancel', onTouchEnd)
    }

    function onPointerUp() {
        cleanup()
    }

    function onTouchEnd() {
        cleanup()
    }

    // --- Публичный API ---

    /** Вызвать при начале перетаскивания (pointer или touch event) */
    function startDrag(e?: PointerEvent | TouchEvent) {
        isDragging.value = true

        if (e) {
            if ('touches' in e && e.touches.length) {
                currentMouseX = e.touches[0]!.clientX
                currentMouseY = e.touches[0]!.clientY
            } else if ('clientX' in e) {
                currentMouseX = e.clientX
                currentMouseY = e.clientY
            }
        }

        document.addEventListener('pointermove', onPointerMove)
        document.addEventListener('pointerup', onPointerUp)
        document.addEventListener('touchmove', onTouchMove, { passive: true })
        document.addEventListener('touchend', onTouchEnd)
        document.addEventListener('touchcancel', onTouchEnd)
    }

    /** Принудительная остановка (например, при Escape) */
    function stopDrag() {
        cleanup()
    }

    // --- Регистрация в сторе ---

    if (id) {
        const edgeScrollStore = useEdgeScrollStore()
        edgeScrollStore.register(id, { startDrag, stopDrag, isDragging })

        onUnmounted(() => {
            stopDrag()
            edgeScrollStore.unregister(id)
        })
    } else {
        onUnmounted(() => {
            stopDrag()
        })
    }

    return {
        isDragging,
        startDrag,
        stopDrag,
    }
}
