<script setup lang="ts">
interface IProps {
    text?: string,
    className?: string,
    action?: () => void,
    type?: "button" | "submit" | "reset" | undefined,
}

const props = defineProps<IProps>()

function action() {
    if (props.action) props.action()
}
</script>

<template>
    <button
        class="base-button"
        :class="props.className"
        :type="props.type ?? 'button'"
        @click="action"
    >
        <span v-if="props.text" class="base-button__text text">{{ props.text }}</span>
        <slot v-else></slot>
    </button>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

.base-button {
    background-color: colors.$button-secondary-bg;
    border: 1px solid colors.$border-default;
    border-radius: 5px;
    width: fit-content;

    &:hover {
        border-color: colors.$accent-primary;
    }

    &__text {
        display: block;
        margin: 4px 8px;
    }
}
</style>
