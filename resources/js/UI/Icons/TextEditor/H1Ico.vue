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
        class="h-1-ico"
    >
        <path d="M2 2L2 18" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
        <path d="M11.5 2L11.5 18" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
        <path d="M2 10L11.5 10" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
        <path d="M16.1133 10L18.5003 7.5083L18.5003 18" fill-rule="nonzero" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
    </svg>
</template>

<style scoped lang="scss">
.h-1-ico {
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
}
</style>
