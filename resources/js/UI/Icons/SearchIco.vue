<script setup lang="ts">
interface Props {
    size?: number,
    color?: string,
}

const props = withDefaults(defineProps<Props>(), {
    size: 20,
    color: 'currentColor',
})
</script>

<template>
    <svg
        viewBox="0 0 21 21"
        :width="props.size"
        :height="props.size"
        fill="none"
        class="search-ico"
    >
        <circle
            cx="9.5"
            cy="9.5"
            r="8.5"
            :stroke="props.color"
            stroke-width="1.5"
        />
        <path
            d="M12.3285 6.17155C11.6046 5.4477 10.6046 5 9.5 5C8.3955 5 7.3955 5.4477 6.6716 6.17155"
            :stroke="props.color"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M15.6108 15.6108L19.8534 19.8535"
            :stroke="props.color"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
</template>

<style scoped lang="scss">

</style>
