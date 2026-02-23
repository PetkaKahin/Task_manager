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
        class="h-5-ico"
    >
        <path d="M1 1.49512L1 17.4951" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
        <path d="M10 1.49512L10 17.4951" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
        <path d="M1.5 9.49512L9.5 9.49512" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
        <path d="M18 8L14 8L14 11.5124C14 11.4953 15 10.9953 16.5 10.9953C17.3457 10.9953 17.8736 11.398 18.1731 12.1048C18.4048 12.6516 18.5 13.3804 18.5 14.2453C18.5 16.2284 18 17.4953 16 17.4953C14.5 17.4953 14 16.4953 14 15.4993" fill-rule="nonzero" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
    </svg>
</template>

<style scoped lang="scss">
.h-5-ico {
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
}
</style>
