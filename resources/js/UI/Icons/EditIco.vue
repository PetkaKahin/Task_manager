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
        :width="props.size"
        :height="props.size"
        fill="none"
        class="edit-ico"
    >
        <rect :width="props.size" :height="props.size" x="0.000000" y="0.000000" />
        <path d="M1 19L19 19" :stroke="props.color" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.500000" />
        <path d="M3 15L6.6586 15L17 4.65405L13.3476 1L3 11.36L3 15Z" fill-rule="nonzero" :stroke="props.color" stroke-linejoin="round" stroke-width="1.500000" />
    </svg>

</template>

<style scoped lang="scss">
.edit-ico {
    display: inline-block;
    vertical-align: middle;
}
</style>
