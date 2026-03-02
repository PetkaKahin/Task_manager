import {readonly, ref} from "vue";
import {useBreakpoints} from "@/composables/useBreakpoints.ts";
import {useProjectStore} from "@/stores/project.store.ts";
import {storeToRefs} from "pinia";

const isOpen = ref<boolean>(false)

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
    }

    const close = (): void => {
        isOpen.value = false
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
