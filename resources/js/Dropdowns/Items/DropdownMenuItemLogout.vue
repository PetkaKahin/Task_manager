<script setup lang="ts">
import LogoutIco from "@/UI/Icons/LogoutIco.vue";
import DropdownMenuItemBase from "@/Dropdowns/Items/DropdownMenuItemBase.vue";
</script>

<template>
    <!--  TODO сделать рабочую ссылку  -->
    <DropdownMenuItemBase class="logout" :ico="LogoutIco" text="Выйти" url="#"/>
</template>

<style scoped lang="scss">
.logout {
    margin-top: 30px;
}
</style>
