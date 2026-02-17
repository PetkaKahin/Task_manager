import {readonly, ref} from "vue";
import {useBreakpoints} from "@/composables/useBreakpoints.ts";
import {useBackdrop, type Subscriber} from "@/composables/ui/useBackdrop.ts";
import type {IProject} from "@/Types/models.ts";
import {router} from "@inertiajs/vue3";

const isOpen = ref<boolean>(false)
const backdrop = useBackdrop()

const SIDEBAR_KEY = "sidebar"

const subscriber: Subscriber = {
    key: SIDEBAR_KEY,
    unsubscribeCallback: () => isOpen.value = false,
}

const projectsList = ref<IProject[]>([])

export function useSidebar()
{
    const setProjectsList = (projects: IProject[]) => {
        projectsList.value = projects
    }

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

    // TODO вынести в сервис
    router.on('navigate', () => {
        if (isOpen.value && !useBreakpoints().isDesktop.value) {
            close()
        }
    })

    return {
        isOpen: readonly(isOpen),
        isDesktop: useBreakpoints().isDesktop,
        projectsList: projectsList,
        setProjectsList,
        toggle,
        open,
        close,
    }
}
