import {router} from "@inertiajs/vue3";
import {route} from "ziggy-js";

export function useGoBack() {
    const dashboard = () => {
        if (route().params.from_project_id) {
            router.visit(route('dashboard.index', route().params.from_project_id))
        }
    }

    return {
        dashboard,
    };
}
