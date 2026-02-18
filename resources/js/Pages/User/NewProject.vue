<script setup lang="ts">

import BaseLayout from "@/Layouts/BaseLayout.vue";
import type {IProject} from "@/Types/models.ts";
import {useSidebar} from "@/composables/ui/useSidebar.ts";
import TextInput from "@/UI/Inputs/TextInput.vue";
import BaseButton from "@/UI/Buttons/BaseButton.vue";
import {useForm, usePage} from "@inertiajs/vue3";
import {onMounted} from "vue";

interface IProps {
    projects: IProject[];
}

const props = defineProps<IProps>()
const form = useForm({
    title: '',
})
const page = usePage()

function submit() {
    form.post(page.url)
}

onMounted(() => {
    useSidebar().setProjectsList(props.projects)
})
</script>

<template>
    <BaseLayout>
        <div class="new-project">
            <form class="form" @submit.prevent="submit">
                <h2 class="form__header-text">Создание проекта</h2>
                <TextInput
                    id="title"
                    name="title"
                    label="Название проекта"
                    v-model="form.title"
                    :error="form.errors.title"
                />
                <BaseButton text="Создать" className="form__submit-button"/>
            </form>
        </div>
    </BaseLayout>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

.new-project {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.form {
    padding: 20px;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 20px;

    background-color: colors.$bg-elevated;
    border: 1px solid colors.$border-default;
    border-radius: 5px;

    &__header-text {
        margin: 0 10px 10px 10px;
        text-align: center;
    }

    &__submit-button {
        padding: 5px;
    }
}

@media (max-width: 425px) {
    .new-project {
        margin: 0;
        height: 100%;
    }

    .form {
        border: none;
        border-radius: 0;
        width: 100%;
        height: 100%;
        padding: 20px 20px;
        box-sizing: border-box;
    }
}
</style>
