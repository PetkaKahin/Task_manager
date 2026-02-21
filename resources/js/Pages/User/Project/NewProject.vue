<script setup lang="ts">

import {useForm} from "@inertiajs/vue3";
import ProjectForm from "@/UI/Forms/ProjectForm.vue";
import BaseLayout from "@/Layouts/BaseLayout.vue";
import {useGoBack} from "@/composables/useGoBack.ts";

const form = useForm({
    title: '',
})

function submit() {
    form.post(route('project.store'))
}
</script>

<template>
    <BaseLayout>
        <section class="project">
            <ProjectForm
                :form="form"
                :goBackAction="useGoBack().dashboard"
                :submitAction="submit"
                titleText="Создать проект"
                submitText="Создать"
            />
        </section>
    </BaseLayout>
</template>

<style scoped lang="scss">
.project {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}

@media (max-width: 425px) {
    .project {
        margin: 0;
        height: 100%;
    }
}
</style>
