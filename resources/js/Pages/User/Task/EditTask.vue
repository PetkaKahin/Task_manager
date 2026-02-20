<script setup lang="ts">

import BaseLayout from "@/Layouts/BaseLayout.vue";
import {useForm} from "@inertiajs/vue3";
import type {ITask} from "@/Types/models.ts";
import {useKanbanStore} from "@/stores/kanban.store.ts";
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
const kanbanStore = useKanbanStore()

function submit() {
    const indexColumn = kanbanStore.getColumnIndexByTaskId(props.task.id)
    const indexTask = kanbanStore.getTaskPosition(props.task.id, indexColumn)

    if (indexColumn === -1 || indexTask === -1) return

    kanbanStore.categories[indexColumn]!.tasks[indexTask]!.content = form.content
    form.patch(route('task.update', props.task.id))
}
</script>

<template>
    <BaseLayout>
        <section class="edit-task">
            <TaskForm
                :form="form"
                :submitAction="submit"
                :goBackAction="useGoBack().dashboard"
            />
        </section>
    </BaseLayout>
</template>

<style scoped lang="scss">

.edit-task {
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
