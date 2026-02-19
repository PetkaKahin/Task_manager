<script setup lang="ts">

import Tiptap from "@/Blocks/Tiptap/TiptapTask.vue";
import TextInput from "@/UI/Inputs/TextInput.vue";
import BaseForm from "@/UI/Forms/BaseForm.vue";
import type {InertiaForm} from "@inertiajs/vue3";

interface IProps {
    form: InertiaForm<{
        title: string
        content: string
        category_id: string | undefined
    }>,
    submitAction?: () => void,
}

const props = defineProps<IProps>()
</script>

<template>
    <BaseForm className="form" :submitAction="props.submitAction" submitText="Сохранить">
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
                <Tiptap
                    className="form__item"
                    :error="form.errors.content"
                    v-model="form.content"
                />
            </div>
        </template>
    </BaseForm>
</template>

<style scoped lang="scss">
@use '@scss/variables/sizes';

.form {
    &__item{
        width: sizes.$card-max-width;
        max-width: sizes.$card-max-width;
    }
}

.content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

@media (max-width: 425px) {
    .form {
        &__item {
            width: 100%;
            max-width: none;
        }
    }
}
</style>
