import {ref, computed, nextTick, onMounted, onBeforeUnmount} from 'vue'

export function useDropdown(padding = 8, gap = 10) {
    const buttonRef = ref<HTMLElement>()
    const dropdownRef = ref<HTMLElement>()
    const isOpen = ref(false)
    const buttonRect = ref<DOMRect>()
    const dropdownRect = ref<DOMRect>()

    async function toggle() {
        if (!isOpen.value) {
            buttonRect.value = buttonRef.value?.getBoundingClientRect()
            isOpen.value = true
            await nextTick()
            dropdownRect.value = dropdownRef.value?.getBoundingClientRect()
        } else {
            isOpen.value = false
        }
    }

    function close() {
        isOpen.value = false
    }

    function onClickOutside(e: MouseEvent) {
        if (
            !buttonRef.value?.contains(e.target as Node) &&
            !dropdownRef.value?.contains(e.target as Node)
        ) {
            close()
        }
    }

    onMounted(() => document.addEventListener('click', onClickOutside))
    onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))

    const dropdownStyle = computed(() => {
        if (!buttonRect.value) return {}

        let top = buttonRect.value.bottom + gap
        let right = window.innerWidth - buttonRect.value.right

        if (dropdownRect.value) {
            const bottomOverflow = top + dropdownRect.value.height - window.innerHeight
            if (bottomOverflow > 0) {
                top = buttonRect.value.top - gap - dropdownRect.value.height
            }
            if (top < padding) {
                top = padding
            }

            const leftEdge = window.innerWidth - right - dropdownRect.value.width
            if (leftEdge < padding) {
                right = window.innerWidth - dropdownRect.value.width - padding
            }
        }

        if (right < padding) {
            right = padding
        }

        return {
            top: `${top}px`,
            right: `${right}px`,
        }
    })

    return {
        buttonRef,
        dropdownRef,
        isOpen,
        toggle,
        close,
        dropdownStyle,
    }
}