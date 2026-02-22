<script setup lang="ts">
interface IProps {
    className?: string
    size?: number
    color?: string
}

const props = withDefaults(defineProps<IProps>(), {
    size: 24,
    color: 'currentColor',
})
</script>

<template>
    <svg class="eye-ico" :class="props.className" viewBox="0 0 20 19" xmlns="http://www.w3.org/2000/svg"
         :width="props.size" :height="props.size" fill="none">
        <path
            d="M19 10.8672C19 8.02819 14.9706 3.86719 10 3.86719C5.02945 3.86719 1 8.03109 1 10.8672C1 13.7033 5.02945 17.8672 10 17.8672C14.9706 17.8672 19 13.7062 19 10.8672Z"
            fill-rule="evenodd" :stroke="props.color" stroke-linejoin="round" stroke-width="1.500000"/>
        <path
            d="M13 10.8672C13 9.21034 11.6568 7.86719 10 7.86719C8.34315 7.86719 7 9.21034 7 10.8672C7 12.524 8.34315 13.8672 10 13.8672C11.6568 13.8672 13 12.524 13 10.8672Z"
            fill-rule="nonzero" :stroke="props.color" stroke-linejoin="round" stroke-width="1.500000"/>
        <path d="M4.63184 3L5.92909 4.8101" :stroke="props.color" stroke-linecap="round"
              stroke-width="1.500000"/>
        <path d="M15.8124 3.22266L14.5151 5.03281" :stroke="props.color" stroke-linecap="round"
              stroke-width="1.500000"/>
        <path d="M10.0044 0.867188L10.0044 3.86719" :stroke="props.color" stroke-linecap="round"
              stroke-width="1.500000"/>
    </svg>
</template>

<style scoped lang="scss">
.eye-ico {
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
}
</style>
