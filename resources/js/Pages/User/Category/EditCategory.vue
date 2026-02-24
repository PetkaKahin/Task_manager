<script setup lang="ts">

import {useForm} from "@inertiajs/vue3";
import type {ICategory} from "@/Types/models.ts";
import CategoryForm from "@/UI/Forms/CategoryForm.vue";
import {useGoBack} from "@/composables/useGoBack.ts";
import {route} from "ziggy-js";
import BaseLayout from "@/Layouts/BaseLayout.vue";

interface IProps {
    category: ICategory
}

const props = defineProps<IProps>()

const form = useForm({
    title: props.category.title,
})

function submit() {
    form.patch(route('categories.update', props.category.id))
}
</script>

<template>
    <BaseLayout>
        <section class="category">
            <CategoryForm
                :form="form"
                :goBackAction="useGoBack().dashboard"
                :submitAction="submit"
                titleText="Редактировать категорию"
                submitText="Сохранить"
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