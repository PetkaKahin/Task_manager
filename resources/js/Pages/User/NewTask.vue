<script setup lang="ts">

import BaseLayout from "@/Layouts/BaseLayout.vue";
import Tiptap from "@/Blocks/Tiptap/TiptapTask.vue";
import TextInput from "@/UI/Inputs/TextInput.vue";
import BaseButton from "@/UI/Buttons/BaseButton.vue";
import {useForm} from "@inertiajs/vue3";
import {onMounted} from "vue";
import {useSidebar} from "@/composables/ui/useSidebar.ts";
import type {IProject} from "@/Types/models.ts";

interface IProps {
    projects: IProject[]
}

const props = defineProps<IProps>()
const form = useForm({
    title: '',
    content: '<p>Можешь писать любой текст</p>',
    category_id: route().params.category_id,
})

function submit() {
    form.post(route('task.store'))
}

onMounted(() => {
    useSidebar().setProjectsList(props.projects)
})

// TODO Сделать общий шаблон. newTask и editTask
</script>

<template>
    <BaseLayout>
        <section class="new-task">
            <h2 class="new-task__logo-text">Новая задача</h2>
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
                    className="form-tiptap"
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

    &__tiptap {
        border: 1px solid colors.$border-default;
        background-color: colors.$bg-base;
        border-radius: 5px;
    }

    &__input, &__tiptap {
        width: sizes.$card-max-width;
    }
}

@media (max-width: 425px) {
    .new-task {
        margin: 0;
        height: 100%;

        &__logo-text {
            display: none;
        }
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
