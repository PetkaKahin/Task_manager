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
        class="bold-ico"
    >
        <path d="M15 6C15 3.79086 13.2512 2 11.0939 2L6 2L6 10L11.0939 10C13.2512 10 15 8.20912 15 6Z" fill-rule="evenodd" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.500000" />
        <path d="M15.9998 14C15.9998 11.7909 14.1814 10 11.9384 10L6 10L6 18L11.9384 18C14.1814 18 15.9998 16.2091 15.9998 14Z" fill-rule="evenodd" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.500000" />
    </svg>
</template>

<style scoped lang="scss">
.bold-ico {
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
}
</style>
