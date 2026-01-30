<script setup lang="ts">
import LogoutIco from "@/UI/Icons/LogoutIco.vue";
import DropdownMenuItemBase from "@/Dropdowns/Items/DropdownMenuItemBase.vue";
</script>

<template>
    <!--  TODO сделать рабочую ссылку  -->
    <!--  TODO Не плодить 100500 итемов меню (Плодить только уникальные) -->
    <DropdownMenuItemBase :ico="LogoutIco" text="Выйти" url="#"/>
</template>

<style scoped lang="scss">

</style>
