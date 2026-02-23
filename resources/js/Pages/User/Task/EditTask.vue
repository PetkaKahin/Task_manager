<script setup lang="ts">

import BaseLayout from "@/Layouts/BaseLayout.vue";
import {useForm} from "@inertiajs/vue3";
import type {ITask} from "@/Types/models.ts";
import TaskForm from "@/UI/Forms/TaskForm.vue";
import {useGoBack} from "@/composables/useGoBack.ts";

interface IProps {
    task: ITask,
}

const props = defineProps<IProps>()
const form = useForm({
    title: props.task.title,
    content: props.task.content,
    category_id: route().params.category_id,
})

function submit() {
    form.patch(route('task.update', props.task.id))
}
</script>

<template>
    <BaseLayout>
        <section class="task">
            <TaskForm
                :form="form"
                :submitAction="submit"
                :goBackAction="useGoBack().dashboard"
                submitText="Сохранить"
                titleText="Редактировать задачу"
            />
        </section>
    </BaseLayout>
</template>

<style scoped lang="scss">

.task {
    height: 100%;
    padding: 20px 0;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
}

@media (max-width: 425px) {
    .task {
        margin: 0;
    }
}
</style>
