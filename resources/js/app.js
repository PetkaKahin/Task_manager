import './bootstrap';
import {createApp, h} from 'vue'
import {createInertiaApp} from '@inertiajs/vue3'
import {createPinia} from 'pinia'
import VueDnDKitPlugin from '@vue-dnd-kit/core';
import {ZiggyVue} from 'ziggy-js';
import {Ziggy} from "./ziggy.js";

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.vue', {eager: true})
        return pages[`./Pages/${name}.vue`]
    },
    setup({el, App, props, plugin}) {
        const pinia = createPinia()

        createApp({render: () => h(App, props)})
            .use(plugin)
            .use(pinia)
            .use(ZiggyVue, Ziggy)
            .use(VueDnDKitPlugin, {
                defaultOverlay: {
                    styles: {
                        opacity: 1,
                    },
                },
            })
            .mount(el)
    },
    defaults: {
        form: {
            recentlySuccessfulDuration: 5000,
        },
        prefetch: {
            cacheFor: "1m",
            hoverDelay: 150,
        },
    },
})
