<script setup lang="ts">

import InputSearch from "@/UI/Inputs/InputSearch.vue";
import UserDropdown from "@/Blocks/UserDropdown.vue";
import BigLogo from "@/Blocks/BigLogo.vue";
import {useSidebar} from "@/composables/ui/useSidebar.ts";

function onSearch(fieldSearch: string) {
    console.log(fieldSearch)
}
function toggleSidebar() {
    useSidebar().toggle()
}
</script>

<template>
    <header class="page-header">
        <div class="page-header__left-block">
            <button
                class="page-header__toggle-sidebar toggle-menu"
                @click="toggleSidebar"
            >
                <span class="toggle-menu__line"></span>
                <span class="toggle-menu__line"></span>
                <span class="toggle-menu__line"></span>
            </button>
            <BigLogo class="page-header__big-logo" url="#"/>
        </div>

        <nav class="page-header__nav header-navbar page-header__right-block">
            <ul class="header-navbar__list">
                <li class="header-navbar__item">
                    <InputSearch
                        class="page-header__search"
                        placeholder="Поиск..."
                        @search="onSearch"
                    />
                </li>
                <li class="header-navbar__item">
                    <UserDropdown class="page-header__dropdown-profile"/>
                </li>
            </ul>
        </nav>
    </header>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid colors.$border-default;
    padding: 0 50px 0 20px;
    background-color: colors.$bg-base;

    &__dropdown-profile {
        height: 32px;
        width: 32px;
    }

    &__toggle-sidebar {
        display: none;
    }

    &__left-block {
        display: flex;
        gap: 20px;
    }
}

.header-navbar {
    &__list {
        display: flex;
        gap: 20px;
        margin: 10px;
        padding: 0;
    }

    &__item {
        list-style-type: none;
    }
}

.toggle-menu {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    background-color: colors.$bg-base;
    outline: none;
    border: none;
    width: 22px;

    &__line {
        display: block;
        border-radius: 2px;
        height: 2px;
        background-color: colors.$ico-primary;
    }
}

@media (max-width: 1024px)  {
    .page-header {
        padding: 0 20px;

        &__toggle-sidebar {
            display: flex;
        }
    }
}

@media (max-width: 425px)  {
    .page-header {
        padding: 0;

        &__big-logo {
            display: none;
        }
    }

    .toggle-menu {
        margin-left: 10px;
    }
}
</style>
