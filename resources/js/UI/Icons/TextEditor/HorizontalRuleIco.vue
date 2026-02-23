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
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        class="horizontal-rule-ico"
        :width="props.size"
        :height="props.size"
        fill="none"
    >
        <path
            d="M3 10L17 10"
            :stroke="props.color"
            stroke-width="1.5"
            stroke-linecap="round"
        />
    </svg>
</template>

<style scoped lang="scss">
.horizontal-rule-ico {
    display: inline-block;
    cursor: pointer;
}
</style>
