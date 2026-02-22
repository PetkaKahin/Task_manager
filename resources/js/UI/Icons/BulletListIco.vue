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
        class="bullet-list-ico"
        :width="props.size"
        :height="props.size"
        fill="none"
    >
        <path d="M2 5C3.10455 5 4 4.1046 4 3C4 1.89543 3.10455 1 2 1C0.89543 1 0 1.89543 0 3C0 4.1046 0.89543 5 2 5Z" :fill="props.color" fill-rule="nonzero" />
        <path d="M2 12C3.10455 12 4 11.1046 4 10C4 8.89543 3.10455 8 2 8C0.89543 8 0 8.89543 0 10C0 11.1046 0.89543 12 2 12Z" :fill="props.color" fill-rule="nonzero" />
        <path d="M2 19C3.10455 19 4 18.1046 4 17C4 15.8954 3.10455 15 2 15C0.89543 15 0 15.8954 0 17C0 18.1046 0.89543 19 2 19Z" :fill="props.color" fill-rule="nonzero" />
        <path d="M8 10L19 10" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
        <path d="M8 17L19 17" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
        <path d="M8 3L19 3" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
    </svg>
</template>

<style scoped lang="scss">
.bullet-list-ico {
    display: inline-block;
    cursor: pointer;
}
</style>
