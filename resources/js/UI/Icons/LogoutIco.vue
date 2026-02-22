<script setup lang="ts">
interface IProps {
    size?: number,
    color?: string,
}

const props = withDefaults(defineProps<IProps>(), {
    size: 24,
    color: 'currentColor',
})
</script>

<template>
    <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        :width="props.size"
        :height="props.size"
        fill="none"
        class="logout-ico"
    >
        <path
            fill-rule="nonzero"
            :stroke="props.color"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 21L5 21C3.89543 21 3 20.1046 3 19L3 5C3 3.89543 3.89543 3 5 3L9 3"
        />
        <path
            fill-rule="nonzero"
            :stroke="props.color"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M16 17L21 12L16 7"
        />
        <path
            fill-rule="nonzero"
            :stroke="props.color"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M21 12L9 12"
        />
    </svg>
</template>

<style scoped lang="scss">
.logout-ico {
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
}
</style>
