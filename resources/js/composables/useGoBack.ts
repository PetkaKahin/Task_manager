import {router} from "@inertiajs/vue3";
import {route} from "ziggy-js";

export function useGoBack() {
    const dashboard = (id = null) => {
        if (id) {
            return router.visit(route('dashboard.index', id))
        }
        if (route().params.from_project_id) {
            return router.visit(route('dashboard.index', route().params.from_project_id))
        }
    }

    return {
        dashboard,
    };
}
