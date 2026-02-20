<script setup lang="ts">
interface IProps {
    className?: string
    size?: number
    color?: string
}
const props = withDefaults(defineProps<IProps>(), {
    size: 24,
    color: 'currentColor'
})

const HEIGHT_SCALE = 1.62
</script>

<template>
    <svg
        viewBox="0 0 15 23"
        xmlns="http://www.w3.org/2000/svg"
        :class="className"
        :width="size"
        :height="size * HEIGHT_SCALE"
    >
        <circle cx="3.5" cy="3.5" r="2.5" :fill="props.color" />
        <circle cx="11.5" cy="3.5" r="2.5" :fill="props.color" />
        <circle cx="3.5" cy="19.5" r="2.5" :fill="props.color" />
        <circle cx="11.5" cy="19.5" r="2.5" :fill="props.color" />
        <circle cx="3.5" cy="11.5" r="2.5" :fill="props.color" />
        <circle cx="11.5" cy="11.5" r="2.5" :fill="props.color" />
    </svg>
</template>

<style scoped lang="scss">
svg {
    cursor: grab;
}
</style>
