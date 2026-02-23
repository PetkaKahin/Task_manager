<script setup lang="ts">

import BaseLayout from "@/Layouts/BaseLayout.vue";
import {useForm} from "@inertiajs/vue3";
import TaskForm from "@/UI/Forms/TaskForm.vue";
import {route} from "ziggy-js";
import {useGoBack} from "@/composables/useGoBack.ts";

const form = useForm({
    title: '',
    content: '<p>Можешь писать любой текст</p>',
    category_id: route().params.category_id,
})

function submit() {
    form.post(route('task.store'))
}
</script>

<template>
    <BaseLayout>
        <section class="new-task">
            <TaskForm
                :form="form"
                :submitAction="submit"
                :goBackAction="useGoBack().dashboard"
                submitText="Создать"
                titleText="Создать задачу"
            />
        </section>
    </BaseLayout>
</template>

<style scoped lang="scss">

.new-task {
    height: 100%;
    padding: 20px 0;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
}

@media (max-width: 425px) {
    .new-task {
        margin: 0;
    }
}
</style>
