<script setup lang="ts">
import SettingsIco from "@/UI/Icons/SettingsIco.vue";
import DropdownMenuItemBase from "@/Dropdowns/Items/DropdownMenuItemBase.vue";
</script>

<template>
    <!--  TODO сделать рабочую ссылку  -->
    <!--  TODO Не плодить 100500 итемов меню (Плодить только уникальные) -->
    <DropdownMenuItemBase :ico="SettingsIco" text="Настройки" url="#"/>
</template>

<style scoped lang="scss">

</style>
