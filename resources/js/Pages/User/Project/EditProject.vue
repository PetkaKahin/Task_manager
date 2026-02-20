<script setup lang="ts">
  import BaseProject from "@/Pages/User/Project/BaseProject.vue";
  import type {IProject} from "@/Types/models.ts";
  import {useForm} from "@inertiajs/vue3";

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
  <BaseProject
      titleText="Редактировать проект"
      buttonText="Сохранить"
      :form="form"
      :submitAction="submit"
  />
</template>

<style scoped lang="scss">

</style>