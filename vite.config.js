import {defineConfig} from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import {resolve} from 'path';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/scss/base.scss', 'resources/js/app.js'],
            refresh: true,
        }),
        vue(),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
        host: 'localhost',
        cors: true,
        hmr: {
            host: 'localhost',
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'resources/js'),
            '@scss': resolve(__dirname, 'resources/scss'),
            '@variables': resolve(__dirname, 'resources/scss/variables'),
            'ziggy-js': path.resolve('vendor/tightenco/ziggy'),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
                loadPaths: [resolve(__dirname, 'resources/scss')],
            },
        },
    },
});
