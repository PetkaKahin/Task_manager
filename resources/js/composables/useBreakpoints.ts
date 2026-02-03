import { ref, computed } from 'vue'

const width = ref(typeof window !== 'undefined' ? window.innerWidth : 0)

const BREAKPOINTS = {
    mobile: 425,
    tablet: 768,
    laptop: 1024,
} as const

const updateWidth = () => {
    width.value = window.innerWidth
}

if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateWidth)
}

export function useBreakpoints() {
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
