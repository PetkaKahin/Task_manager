<script setup lang="ts">

import BaseLayout from "@/Layouts/BaseLayout.vue";
import Tiptap from "@/Blocks/Tiptap/TiptapTask.vue";
import TextInput from "@/UI/Inputs/TextInput.vue";
import BaseButton from "@/UI/Buttons/BaseButton.vue";
import {useForm} from "@inertiajs/vue3";
import {onMounted} from "vue";
import {useSidebar} from "@/composables/ui/useSidebar.ts";
import type {IProject, ITask} from "@/Types/models.ts";
import {useKanbanStore} from "@/stores/kanban.store.ts";

interface IProps {
    projects: IProject[],
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

onMounted(() => {
    useSidebar().setProjectsList(props.projects)
})

// TODO сделать общего родителя для EditTask и NewTask
</script>

<template>
    <BaseLayout>
        <section class="new-task">
            <form
                class="form"
                @submit.prevent="submit"
            >
                <TextInput
                    id="title"
                    name="title"
                    label="Заголовок"
                    className="form__input"
                    :error="form.errors.title"
                    v-model="form.title"
                />
                <Tiptap
                    className="form__tiptap"
                    :error="form.errors.content"
                    v-model="form.content"
                />
                <BaseButton text="Сохранить" className="form__submit-button"/>
            </form>
        </section>
    </BaseLayout>
</template>

<style scoped lang="scss">
@use '@scss/variables/colors';
@use '@scss/variables/sizes';

.new-task {
    margin-top: 20px;

    display: flex;
    flex-direction: column;
    align-items: center;
}

.form {
    background-color: colors.$bg-elevated;
    padding: 20px;
    border: 1px solid colors.$border-default;
    border-radius: 5px;

    display: flex;
    flex-direction: column;
    gap: 15px;
    width: fit-content;

    &__submit-button {
        padding: 5px;
    }

    &__input,
    &__tiptap {
        width: sizes.$card-max-width;
        max-width: sizes.$card-max-width;
    }
}

@media (max-width: 425px) {
    .new-task {
        margin: 0;
        height: 100%;
    }

    .form {
        border: none;
        border-radius: 0;
        width: 100%;
        height: 100%;
        padding: 20px 5px;
        box-sizing: border-box;

        &__input,
        &__tiptap {
            width: 100%;
            max-width: none;
        }
    }
}
</style>
