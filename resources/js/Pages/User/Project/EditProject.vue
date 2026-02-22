<script setup lang="ts">
  import type {IProject} from "@/Types/models.ts";
  import {useForm} from "@inertiajs/vue3";
  import {useGoBack} from "@/composables/useGoBack.ts";
  import BaseLayout from "@/Layouts/BaseLayout.vue";
  import ProjectForm from "@/UI/Forms/ProjectForm.vue";

  interface IProps {
      project: IProject,
  }

  const props = defineProps<IProps>()

  const form = useForm({
      title: props.project.title,
  })

  function submit() {
      form.patch(route('project.update', props.project.id))
  }
</script>

<template>
    <BaseLayout>
        <section class="project">
            <ProjectForm
                :form="form"
                :goBackAction="useGoBack().dashboard"
                :submitAction="submit"
                titleText="Редактировать проект"
                submitText="Сохранить"
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