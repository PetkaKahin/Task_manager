// <reference types="vite/client" />
import { route as routeFn } from 'ziggy-js';

interface ImportMetaEnv {
    readonly VITE_APP_NAME: string;
    // добавь другие переменные окружения при необходимости
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}


declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}
