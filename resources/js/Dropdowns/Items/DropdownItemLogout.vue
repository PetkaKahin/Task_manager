<script setup lang="ts">
import LogoutIco from "@/UI/Icons/LogoutIco.vue";
import DropdownItemBase from "@/Dropdowns/Items/DropdownItemBase.vue";
import {useForm} from "@inertiajs/vue3";

const form = useForm()

function logout() {
  form.post('/logout')
}
</script>

<template>
  <div class="menu-item" @click="logout">
    <DropdownItemBase class="logout" :ico="LogoutIco" text="Выйти" url="#"/>
  </div>
</template>

<style scoped lang="scss">
.logout {
    //margin-top: 30px;
    padding: 10px 15px;
}
</style>
