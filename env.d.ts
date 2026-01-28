// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

interface ImportMetaEnv {
    readonly VITE_APP_NAME: string;
    // добавь другие переменные окружения при необходимости
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
