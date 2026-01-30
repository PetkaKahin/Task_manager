<script setup lang="ts">

import InputSearch from "@/UI/Inputs/InputSearch.vue";
import UserDropdown from "@/Blocks/UserDropdown.vue";
import BigLogo from "@/Blocks/BigLogo.vue";

function onSearch(fieldSearch: string) {
    console.log(fieldSearch)
}
</script>

<template>
    <header class="page-header">
        <BigLogo class="page-header__big-logo" url="#"/>

        <nav class="page-header__nav header-navbar">
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
    padding: 0 50px;

    &__dropdown-profile {
        height: 32px;
        width: 32px;
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
</style>
