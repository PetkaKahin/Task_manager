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
            <h2>Создание проекта</h2>
            <form class="form" @submit.prevent="submit">
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
    margin: 50px;
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

    &__submit-button {
        padding: 5px;
    }
}
</style>
