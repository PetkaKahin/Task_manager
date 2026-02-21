<script setup lang="ts">
import type {Component} from "vue";

interface IProps {
    ico: Component,
    text: string,
    className?: string
}

const props = defineProps<IProps>()
</script>

<template>
    <div
        class="dropdown-menu-item"
        :class="props.className"
    >
        <span class="dropdown-menu-item__ico">
            <component :is="props.ico"/>
        </span>
        <p class="dropdown-menu-item__text">{{ props.text}}</p>
    </div>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

.dropdown-menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    text-decoration: none;

    &:hover &__ico {
        color: colors.$ico-focus;
    }

    &:hover &__text {
        color: colors.$text-focus;
    }

    &__ico {
        color: colors.$ico-primary;
    }

    &__text {
        margin: 0;
    }
}
</style>
