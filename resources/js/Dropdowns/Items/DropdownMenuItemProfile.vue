<script setup lang="ts">
import DropdownMenuItemBase from "@/Dropdowns/Items/DropdownMenuItemBase.vue";
import UserIco from "@/UI/Icons/UserIco.vue";
</script>

<template>
    <!--  TODO сделать рабочую ссылку  -->
    <!--  TODO Не плодить 100500 итемов меню (Плодить только уникальные) -->
    <DropdownMenuItemBase :ico="UserIco" text="Профиль" url="#"/>
</template>

<style scoped lang="scss">

</style>
