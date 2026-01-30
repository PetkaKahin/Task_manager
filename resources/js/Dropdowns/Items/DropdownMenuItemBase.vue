<script setup lang="ts">
import type {Component} from "vue";

interface Props {
    ico: Component,
    text: string,
    url?: string,
}

const props = withDefaults(defineProps<Props>(), {
    url: '#',
})
</script>

<template>

    <a
        class="dropdown-menu-item"
        :href="url"
    >
        <component :is="props.ico" class="dropdown-menu-item__ico"/>
        <p class="dropdown-menu-item__text">{{ props.text}}</p>
    </a>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

.dropdown-menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 12px;
    cursor: pointer;
    text-decoration: none;

    &:hover &__ico, {
        color: colors.$ico-focus;
    }

    &:hover &__text {
        color: colors.$text-focus;
    }

    &__ico {
        color: colors.$ico-primary;
        height: 20px;
        width: 20px;
    }

    &__text {
        margin: 0;
    }
}
</style>
