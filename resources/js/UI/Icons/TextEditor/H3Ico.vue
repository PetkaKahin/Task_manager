<script setup lang="ts">
interface IProps {
    size?: number,
    color?: string,
}

const props = withDefaults(defineProps<IProps>(), {
    size: 20,
    color: 'currentColor',
})
</script>

<template>
    <svg
        viewBox="0 0 20 20"
        :width="props.size"
        :height="props.size"
        fill="none"
        class="h-3-ico"
    >
        <path d="M1 2L1 18" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
        <path d="M10 2L10 18" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
        <path d="M1.5 10L9.5 10" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
        <path d="M14 8L19 8L15.5 12.5C17.5 12.5 19 13.5 19 15.5C19 17.5 17.5 18 16.5 18C15.3095 18 14.5 17.5 14 16.95" fill-rule="nonzero" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
    </svg>
</template>

<style scoped lang="scss">
.h-3-ico {
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
}
</style>
