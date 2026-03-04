import {nextTick, onUnmounted, ref, type Ref} from "vue"
import {useBackdrop} from "@/composables/ui/useBackdrop.ts"

/**
 * Управляет inline-редактированием карточки на канбан-доске.
 *
 * При активации карточка получает position: fixed (через CSS-класс --is-editing)
 * и телепортируется в #mount-point. На её месте остаётся placeholder,
 * который удерживает layout категории.
 *
 * Синхронизация:
 * - Позиция:  placeholder → card (card следует за placeholder'ом)
 * - Ширина:   card → placeholder (card подстраивается под контент,
 *             placeholder повторяет; min-width не даёт карте сжаться уже категории)
 * - Высота:   card → placeholder (ограничена высотой категории)
 * - Скролл:   категория автоскроллится чтобы placeholder оставался видимым
 * - maxHeight: если карта выше категории — включается внутренний скролл карты
 *
 * @param categoryRef - скролл-контейнер категории (body с overflow-y: auto)
 * @param cardRef     - элемент карточки (общий с drag-системой)
 * @param options
 * @param options.onClose - колбэк при завершении редактирования
 */
export function useCardEditMode(
    categoryRef: Ref<HTMLElement | null | undefined>,
    cardRef: Ref<HTMLElement | null>,
    options?: {
        onClose?: () => void
    }
) {
    const cardPlaceholderRef = ref<HTMLElement | null>(null)
    const isEditing = ref(false)
    const {open: backdropOpen, close: backdropClose, component: backdropComponent} = useBackdrop()

    let resizeObserver: ResizeObserver | null = null

    // --- Helpers ---

    const getRefs = () => {
        const card = cardRef.value
        const placeholder = cardPlaceholderRef.value
        return card && placeholder ? {card, placeholder} : null
    }

    const getCategoryRect = () => categoryRef.value?.getBoundingClientRect() ?? null

    // --- Sync ---

    /** Позиционирует card по координатам placeholder'а */
    const syncPosition = () => {
        const refs = getRefs()
        if (!refs) return

        const {top, left} = refs.placeholder.getBoundingClientRect()
        refs.card.style.top = `${top}px`
        refs.card.style.left = `${left}px`
    }

    /** Скроллит категорию чтобы placeholder оставался в видимой области */
    const scrollPlaceholderIntoView = () => {
        const category = categoryRef.value
        const placeholder = cardPlaceholderRef.value
        if (!category || !placeholder) return

        const pRect = placeholder.getBoundingClientRect()
        const cRect = category.getBoundingClientRect()

        if (pRect.bottom > cRect.bottom) {
            category.scrollTop += pRect.bottom - cRect.bottom
        } else if (pRect.top < cRect.top) {
            category.scrollTop -= cRect.top - pRect.top
        }
    }

    /**
     * Синхронизирует размеры card → placeholder.
     * Вызывается ResizeObserver'ом при изменении размера card.
     */
    const syncSize = () => {
        const refs = getRefs()
        if (!refs) return

        // Снимаем maxHeight чтобы замерить реальную высоту контента
        refs.card.style.maxHeight = ''

        const {width, height} = refs.card.getBoundingClientRect()
        const categoryRect = getCategoryRect()

        refs.placeholder.style.width = `${width}px`

        if (categoryRect) {
            refs.placeholder.style.height = `${Math.min(height, categoryRect.height)}px`
            scrollPlaceholderIntoView()
            syncPosition()

            if (height > categoryRect.height) {
                refs.card.style.maxHeight = `${categoryRect.height}px`
            }
        } else {
            refs.placeholder.style.height = `${height}px`
        }
    }

    // --- Tracking ---

    const startTracking = () => {
        document.addEventListener('scroll', syncPosition, {capture: true, passive: true})
        window.addEventListener('resize', syncSize)

        if (cardRef.value) {
            resizeObserver = new ResizeObserver(syncSize)
            resizeObserver.observe(cardRef.value)
        }
    }

    const stopTracking = () => {
        document.removeEventListener('scroll', syncPosition, {capture: true})
        window.removeEventListener('resize', syncSize)
        resizeObserver?.disconnect()
        resizeObserver = null
    }

    const resetStyles = () => {
        if (cardRef.value) {
            cardRef.value.style.top = ''
            cardRef.value.style.left = ''
            cardRef.value.style.minWidth = ''
            cardRef.value.style.maxHeight = ''
        }

        if (cardPlaceholderRef.value) {
            cardPlaceholderRef.value.style.width = ''
            cardPlaceholderRef.value.style.height = ''
        }
    }

    // --- Public API ---

    const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            e.preventDefault()
            stop()
        }
    }

    const start = (onStart?: () => void) => {
        if (!cardRef.value || isEditing.value) return

        const originalRect = cardRef.value.getBoundingClientRect()

        isEditing.value = true
        backdropOpen(() => stop())
        document.addEventListener('keydown', handleKeydown)

        nextTick(() => {
            const refs = getRefs()
            if (!refs) return

            // min-width от placeholder'а — карта не уже категории
            refs.card.style.minWidth = `${refs.placeholder.getBoundingClientRect().width}px`

            // Placeholder синхронизируется обратно с картой
            refs.placeholder.style.width = `${refs.card.getBoundingClientRect().width}px`
            refs.placeholder.style.height = `${originalRect.height}px`

            scrollPlaceholderIntoView()
            syncPosition()
            startTracking()
            onStart?.()
        })
    }

    const stop = () => {
        if (!isEditing.value) return

        isEditing.value = false
        backdropClose()
        document.removeEventListener('keydown', handleKeydown)
        options?.onClose?.()
        stopTracking()
        resetStyles()
    }

    onUnmounted(() => stopTracking())

    return {
        cardPlaceholderRef,
        backdropComponent,
        isEditing,
        start,
        stop,
    }
}
