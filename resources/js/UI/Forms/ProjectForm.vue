<script setup lang="ts">

import TextInput from "@/UI/Inputs/TextInput.vue";
import BaseForm from "@/UI/Forms/BaseForm.vue";
import {type InertiaForm} from "@inertiajs/vue3";

interface IProps {
    titleText: string
    submitText: string
    form: InertiaForm<{
        title: string
    }>,
    submitAction?: () => void,
    goBackAction?: () => void,
}

const props = defineProps<IProps>()


</script>

<template>
    <BaseForm
        className="form"
        :submitText="submitText"
        :submitAction="props.submitAction"
        :goBackAction="props.goBackAction"
    >
        <template #header>
            <h2 class="form__header-text">{{ props.titleText }}</h2>
        </template>
        <template #body>
            <div class="content">
                <TextInput
                    id="title"
                    name="title"
                    label="Заголовок"
                    className="form__item"
                    :error="form.errors.title"
                    v-model="form.title"
                />
            </div>
        </template>
    </BaseForm>
</template>

<style scoped lang="scss">
@use '@scss/variables/sizes';

.form {
    &__item {
        width: sizes.$card-max-width;
        max-width: sizes.$card-max-width;
    }

    &__header-text {
        margin: 0 10px 10px 10px;
        text-align: center;
    }
}

.content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

@media (max-width: 425px) {
    .form {
        border: none;
        border-radius: 0;
        width: 100%;
        height: 100%;
        padding: 20px 20px;
        box-sizing: border-box;

        &__item {
            width: 100%;
            max-width: none;
        }
    }
}
</style>
