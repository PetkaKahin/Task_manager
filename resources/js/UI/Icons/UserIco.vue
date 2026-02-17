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
        class="user-ico"
    >
        <circle
            cx="10"
            cy="6"
            r="4"
            :stroke="props.color"
            stroke-width="1.5"
        />
        <path
            d="M3 18C3 14.134 6.13401 11 10 11C13.866 11 17 14.134 17 18"
            :stroke="props.color"
            stroke-width="1.5"
            stroke-linecap="round"
        />
    </svg>
</template>

<style scoped lang="scss">
.user-ico {
    display: inline-block;
    vertical-align: middle;
}
</style>
