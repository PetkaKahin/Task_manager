<script setup lang="ts">
interface IProps {
    size?: number
    color?: string
    className?: string
}

const props = withDefaults(defineProps<IProps>(), {
    size: 24,
    color: 'currentColor',
})

const WIDTH_SCALE = 0.22
</script>

<template>
    <svg
        class="more-ico"
        :class="props.className"
        viewBox="0 0 6 18"
        xmlns="http://www.w3.org/2000/svg"
        :width="props.size * WIDTH_SCALE"
        :height="props.size"
        fill="none"
    >
        <circle cx="3" cy="2" r="2"  :fill="props.color" />
        <circle cx="3" cy="9" r="2"  :fill="props.color" />
        <circle cx="3" cy="16" r="2" :fill="props.color" />
    </svg>
</template>

<style scoped lang="scss">
.more-ico {
    display: block;
}
</style>
