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
        class="h-4-ico"
    >
        <path d="M1 2L1 18" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
        <path d="M10 2L10 18" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
        <path d="M1.5 10L9.5 10" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
        <path d="M17.4883 18L17.4883 8L13 14.4984L13 15.51L19 15.51" fill-rule="nonzero" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
    </svg>
</template>

<style scoped lang="scss">
.h-4-ico {
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
}
</style>
