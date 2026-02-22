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
        class="check-mark-ico"
        :width="props.size"
        :height="props.size"
        fill="none"
    >
        <!-- Контур (опционально) -->
        <path
            d="M19 8L19 17.5C19 18.3284 18.3284 19 17.5 19L2.5 19C1.67158 19 1 18.3284 1 17.5L1 2.5C1 1.67158 1.67158 1 2.5 1L13 1"
            :stroke="props.color"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
        />

        <!-- Галочка -->
        <path
            d="M6 8L11 12L18.5 1.5"
            :stroke="props.color"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
        />
    </svg>
</template>

<style scoped lang="scss">
.check-mark-ico {
    display: inline-block;
    cursor: pointer;
}
</style>
