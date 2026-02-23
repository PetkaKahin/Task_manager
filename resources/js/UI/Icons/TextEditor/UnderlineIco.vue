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
        class="underline-ico"
    >
        <path d="M3 19L18 19" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
        <path d="M17 1C17 4.22917 17 5.47388 17 8.70308C17 12.1808 14.0899 15 10.5 15C6.91015 15 4 12.1808 4 8.70308C4 5.47388 4 4.22917 4 1" fill-rule="nonzero" :stroke="props.color" stroke-linecap="round" stroke-width="1.500000" />
    </svg>
</template>

<style scoped lang="scss">
.underline-ico {
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
}
</style>
