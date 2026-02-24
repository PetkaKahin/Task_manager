import {router} from "@inertiajs/vue3";
import {route} from "ziggy-js";

export function useGoBack() {
    const dashboard = (id = null) => {
        if (id) {
            return router.visit(route('projects.show', id))
        }
        if (route().params.from_project_id) {
            return router.visit(route('projects.show', route().params.from_project_id))
        }

        return router.visit(route('home'))
    }

    return {
        dashboard,
    };
}
