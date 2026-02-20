<script setup lang="ts">

import {useForm, usePage} from "@inertiajs/vue3";
import BaseProject from "@/Pages/User/Project/BaseProject.vue";

const form = useForm({
    title: '',
})
const page = usePage()

function submit() {
    form.post(page.url)
}
</script>

<template>
    <BaseProject
        titleText="Создание проекта"
        buttonText="Создать"
        :form="form"
        :submitAction="submit"
    />
</template>

<style scoped lang="scss">

</style>
