<script setup lang="ts">

import {useForm} from "@inertiajs/vue3";
import {route} from "ziggy-js";
import {useGoBack} from "@/composables/useGoBack.ts";
import CategoryForm from "@/UI/Forms/CategoryForm.vue";
import BaseLayout from "@/Layouts/BaseLayout.vue";

const form = useForm({
    title: '',
    project_id: route().params.from_project_id,
})

function submit() {
    form.post(route('categories.store'))
}
</script>

<template>
    <BaseLayout>
        <section class="category">
            <CategoryForm
                :form="form"
                :goBackAction="useGoBack().dashboard"
                :submitAction="submit"
                titleText="Создать категорию"
                submitText="Создать"
            />
        </section>
    </BaseLayout>
</template>

<style scoped lang="scss">
.category {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}

@media (max-width: 425px) {
    .category {
        margin: 0;
        height: 100%;
    }
}
</style>