import {readonly, ref} from "vue";
import {useBreakpoints} from "@/composables/useBreakpoints.ts";
import {useBackdrop, type Subscriber} from "@/composables/ui/useBackdrop.ts";
import {router} from "@inertiajs/vue3";
import {useProjectStore} from "@/stores/project.store.ts";
import {storeToRefs} from "pinia";

const isOpen = ref<boolean>(false)
const backdrop = useBackdrop()
const SIDEBAR_KEY = "sidebar"

const subscriber: Subscriber = {
    key: SIDEBAR_KEY,
    unsubscribeCallback: () => isOpen.value = false,
}

export function useSidebar()
{
    const {projects: projectsList} = storeToRefs(useProjectStore())

    const toggle = (): void => {
        if (isOpen.value) {
            close()
        } else {
            open()
        }
    }

    const open = (): void => {
        isOpen.value = true
        backdrop.open(subscriber)
    }

    const close = (): void => {
        isOpen.value = false
        backdrop.close(subscriber.key)
    }

    return {
        isOpen: readonly(isOpen),
        isDesktop: useBreakpoints().isDesktop,
        projectsList: projectsList,
        toggle,
        open,
        close,
    }
}
