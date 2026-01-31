<script setup lang="ts">

import UserIco from "@/UI/Icons/UserIco.vue";
import DropdownMenu from "@/Dropdowns/DropdownMenu.vue";
import DropdownMenuItemSettings from "@/Dropdowns/Items/DropdownMenuItemSettings.vue";
import DropdownMenuItemProfile from "@/Dropdowns/Items/DropdownMenuItemProfile.vue";
import DropdownMenuItemLogout from "@/Dropdowns/Items/DropdownMenuItemLogout.vue";

const menuItems = [
    DropdownMenuItemProfile,
    DropdownMenuItemSettings,
    DropdownMenuItemLogout,
]
</script>

<template>
    <div class="user-dropdown">
        <UserIco class="user-dropdown__ico"/>
        <DropdownMenu
            :menu-items="menuItems"
            class="user-dropdown__menu"
        />
    </div>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

$margin-top-dropdown: 20px;
$min-width-dropdown-menu: 100px;

.user-dropdown {
    position: relative;
    box-sizing: border-box;
    border: 1px solid colors.$border-primary;
    border-radius: 50%;
    cursor: pointer;

    &:hover {
        border-color: colors.$border-focus;
    }

    &:hover &__menu,
    &:hover::after
    {
        display: block;
    }

    &::after {
        content: '';
        position: absolute;
        right: 0;
        min-width: $min-width-dropdown-menu;
        height: $margin-top-dropdown;
        display: none;
        cursor: default;
    }

    &__ico {
        color: colors.$ico-primary;
        width: 100%;
        height: 100%;
        padding: 5px;
        box-sizing: border-box;
    }

    &__menu {
        position: absolute;
        right: 0;
        display: none;
        margin-top: $margin-top-dropdown;
        min-width: $min-width-dropdown-menu;
    }
}
</style>
