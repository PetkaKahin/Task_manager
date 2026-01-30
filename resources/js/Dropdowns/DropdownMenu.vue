<script setup lang="ts">
import type {Component} from "vue";

interface Props {
    menuItems?: Component[]
}

const props = defineProps<Props>()
</script>

<template>
    <nav class="dropdown-menu">
        <ul class="dropdown-menu__list">
            <li
                class="dropdown-menu__item"
                v-if="props.menuItems"
                v-for="(item, index) in props.menuItems"
                :key="index"
            >
                <component :is="item" class="dropdown-menu__content"/>
            </li>

            <li
                class="dropdown-menu__item"
                v-else
            >
                <span class="dropdown-menu__content">Пусто</span>
            </li>
        </ul>
    </nav>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

.dropdown-menu {
    background-color: colors.$bg-active;
    border: 1px solid colors.$border-default;
    border-radius: 0.3rem;
    cursor: default;

    &__item {
        list-style-type: none;
    }

    &__list {
        padding: 0;
    }
}
</style>
