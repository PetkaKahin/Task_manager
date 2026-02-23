<script setup lang="ts">
interface IProps {
    size?: number,
    color?: string,
}

const props = withDefaults(defineProps<IProps>(), {
    size: 20,
    color: 'currentColor',
})

// TODO сделать общий стиль для иконок. Все иконки для TipTap с одинаковыми стилями
</script>

<template>
    <svg
        viewBox="0 0 20 20"
        :width="props.size"
        :height="props.size"
        fill="none"
        class="italic-ico"
    >
        <path d="M8 1.02393L16 1.02393" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
        <path d="M4 19.0239L12 19.0239" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
        <path d="M12.5 1L7.5 19.0238" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
    </svg>
</template>

<style scoped lang="scss">
.italic-ico {
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
}
</style>
