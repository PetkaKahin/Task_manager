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
        class="strikethrough-ico"
    >
        <path d="M2 10L19 10" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
        <path d="M10.4853 10C17.7991 12.7 15.0564 19 10.4853 19C5.91418 19 5 15.4 5 15.4" fill-rule="nonzero" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
        <path d="M16 4.42857C16 4.42857 14.6442 1 10.5767 1C6.50928 1 4.89857 4.25693 6.78483 7" fill-rule="nonzero" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
        <path d="M5 15.5714C5 15.5714 6.82087 19 10.4627 19C14.1046 19 16.1822 15.7431 14.2823 13" fill-rule="nonzero" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
    </svg>
</template>

<style scoped lang="scss">
.strikethrough-ico {
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
}
</style>
