<script setup lang="ts">
import LogoutIco from "@/UI/Icons/LogoutIco.vue";
import DropdownMenuItemBase from "@/Dropdowns/Items/DropdownMenuItemBase.vue";
import {useForm} from "@inertiajs/vue3";

const form = useForm()

function logout() {
  form.post('/logout')
}
</script>

<template>
  <div class="menu-item" @click="logout">
    <DropdownMenuItemBase class="logout" :ico="LogoutIco" text="Выйти" url="#"/>
  </div>
</template>

<style scoped lang="scss">
.logout {
    //margin-top: 30px;
}
</style>
