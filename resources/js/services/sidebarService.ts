import {router} from "@inertiajs/vue3";
import {useBreakpoints} from "@/composables/useBreakpoints.ts";
import {useSidebar} from "@/composables/ui/useSidebar.ts";

export const sidebarService = () => {
    const {isOpen, close} = useSidebar()

    const innit = () => {
        router.on('navigate', () => {
            if (isOpen.value && !useBreakpoints().isDesktop.value) {
                close()
            }
        })
    }

    return {
        innit,
    }
}
