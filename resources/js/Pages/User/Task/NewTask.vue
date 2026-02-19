<script setup lang="ts">

import BaseLayout from "@/Layouts/BaseLayout.vue";
import {useForm} from "@inertiajs/vue3";
import TaskForm from "@/UI/Forms/TaskForm.vue";

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
            <TaskForm :form="form" :submitAction="submit"/>
        </section>
    </BaseLayout>
</template>

<style scoped lang="scss">

.new-task {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}

@media (max-width: 425px) {
    .new-task {
        margin: 0;
        height: 100%;
    }
}
</style>
