<script setup lang="ts">
interface Props {
    size?: number,
    color?: string,
}

const props = withDefaults(defineProps<Props>(), {
    size: 24,
    color: 'currentColor',
})
</script>

<template>
    <svg
        class="delete-ico"
        viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" :width="props.size" :height="props.size" fill="none"
    >
        <path d="M3.5 21L18.5 21L18.5 4L3.5 4L3.5 21Z" fill-rule="nonzero" :stroke="color" stroke-linejoin="round" stroke-width="1.500000" />
        <path d="M9 9L9 15.5" :stroke="color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
        <path d="M13 9L13 15.5" :stroke="color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
        <path d="M1 4L21 4" :stroke="color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
        <path d="M8.6445 1L13.3885 1L15 4L7 4L8.6445 1Z" fill-rule="nonzero" :stroke="color" stroke-linejoin="round" stroke-width="1.500000" />
    </svg>
</template>

<style scoped lang="scss">
.delete-ico {
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
}
</style>
