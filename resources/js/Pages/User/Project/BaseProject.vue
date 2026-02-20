<script setup lang="ts">

import BaseLayout from "@/Layouts/BaseLayout.vue";
import TextInput from "@/UI/Inputs/TextInput.vue";
import {type InertiaForm} from "@inertiajs/vue3";
import BaseForm from "@/UI/Forms/BaseForm.vue";
import {useGoBack} from "@/composables/useGoBack.ts";

interface IProps {
    titleText: string
    buttonText: string
    form: InertiaForm<{title: string}>
    submitAction: () => void
}

const goBack = useGoBack()
const props = defineProps<IProps>()
</script>

<template>
    <BaseLayout>
        <section class="new-project">
            <BaseForm
                className="form"
                :submitAction="submitAction"
                :goBackAction="goBack.dashboard"
                :submitText="props.buttonText">
                <template #header>
                    <h2 class="form__header-text">{{ props.titleText }}</h2>
                </template>
                <template #body>
                    <TextInput
                        id="title"
                        name="title"
                        label="Название проекта"
                        v-model="form.title"
                        :error="form.errors.title"
                    />
                </template>
            </BaseForm>
        </section>
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
    &__header-text {
        margin: 0 10px 10px 10px;
        text-align: center;
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
