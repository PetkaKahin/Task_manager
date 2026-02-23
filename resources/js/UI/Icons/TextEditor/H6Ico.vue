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
        class="h-6-ico"
    >
        <path d="M1 1L1 17" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
        <path d="M10 1L10 17" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
        <path d="M1.5 9L9.5 9" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
        <path d="M19 14.25C19 12.7312 17.7688 11.5 16.25 11.5C14.7312 11.5 13.5 12.7312 13.5 14.25C13.5 15.7688 14.7312 17 16.25 17C17.7688 17 19 15.7688 19 14.25Z" fill-rule="nonzero" :stroke="props.color" stroke-width="1.500000" />
        <path d="M18.7981 9.3696C18.3889 8.27305 17.4022 7.5 16.25 7.5C14.7312 7.5 13.5 8.84315 13.5 10.5L13.5 14" fill-rule="nonzero" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
    </svg>
</template>

<style scoped lang="scss">
.h-6-ico {
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
}
</style>
