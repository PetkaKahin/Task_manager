<script setup lang="ts">

import BaseButton from "@/UI/Buttons/BaseButton.vue";
import BaseDivider from "@/UI/Dividers/BaseDivider.vue";
import {useSidebar} from "@/composables/ui/useSidebar.ts";

const {isDesktop} = useSidebar()

function toggleSidebar() {
    useSidebar().toggle()
}
</script>

<template>
    <aside class="sidebar-menu">
        <div
            class="sidebar-menu__header"
            v-if="isDesktop === false"
        >
            <BaseButton class="sidebar-menu__toggle" text="X" @click="toggleSidebar" />
        </div>

        <BaseDivider
            class="divider"
            v-if="isDesktop === false"
        />

        <div class="sidebar-menu__content">
            <BaseButton class="sidebar-menu__button" text="+ Новая задача"/>

            <h5 class="sidebar-menu__header-text">Проекты:</h5>
            <ul class="sidebar-menu__list projects-list">
                <li class="projects-list__item">
                    <span>Проект 1</span>
                </li>
                <li class="projects-list__item">
                    <span>Проект 2</span>
                </li>
                <li class="projects-list__item">
                    <span>Проект 3</span>
                </li>
                <li class="projects-list__item projects-list__item--no-dot">
                    <span>+ Добавить</span>
                </li>
            </ul>
        </div>
    </aside>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

.sidebar-menu {
    border-right: 1px solid colors.$border-default;
    background-color: colors.$bg-base;
    height: 100%;
    min-width: 150px;
    max-width: 300px;
    box-sizing: border-box;
    padding: 5px;

    &__button {
        margin: 15px;
        padding: 10px 5px;
    }

    &__header-text {
        margin: 15px 15px 0 15px;
    }

    &__header {
        display: flex;
        justify-content: flex-end;
    }

    &__toggle {
        margin: 15px 15px 0 15px;
        padding-top: 2px;
    }
}

.projects-list {
    margin: 5px 0;
    padding: 0;
    color: colors.$text-primary;

    &__item {
        padding: 5px 0 5px 30px;
        list-style-position: inside;

        &--no-dot {
            list-style-type: none;
            padding-left: -30px;
        }
    }
}

.divider {
    margin: 20px 0;
}
</style>
