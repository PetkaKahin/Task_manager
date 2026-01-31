import { ref, computed, onMounted, onUnmounted } from 'vue'

const width = ref(typeof window !== 'undefined' ? window.innerWidth : 0)
let subscriberCount = 0

const BREAKPOINTS = {
    mobile: 425,
    tablet: 1024,
    laptop: 1280,
} as const

const updateWidth = () => {
    width.value = window.innerWidth
}

export function useBreakpoints() {
    onMounted(() => {
        if (subscriberCount === 0) {
            window.addEventListener('resize', updateWidth)
        }
        subscriberCount++
    })

    onUnmounted(() => {
        subscriberCount--
        if (subscriberCount === 0) {
            window.removeEventListener('resize', updateWidth)
        }
    })

    return {
        width,
        isMobile: computed(() => width.value < BREAKPOINTS.mobile),
        isTablet: computed(() => width.value >= BREAKPOINTS.mobile),
        isLaptop: computed(() => width.value >= BREAKPOINTS.tablet),
        isDesktop: computed(() => width.value >= BREAKPOINTS.laptop),

        breakpoint: computed(() => {
            if (width.value < BREAKPOINTS.mobile) return 'mobile'
            if (width.value < BREAKPOINTS.tablet) return 'tablet'
            if (width.value < BREAKPOINTS.laptop) return 'laptop'
            return 'desktop'
        }),
    }
}
