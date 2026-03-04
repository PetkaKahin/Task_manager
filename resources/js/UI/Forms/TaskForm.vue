<script setup lang="ts">

import Tiptap from "@/Blocks/Tiptap/TiptapTask.vue";
import BaseForm from "@/UI/Forms/BaseForm.vue";
import {type InertiaForm} from "@inertiajs/vue3";

interface IProps {
    submitText: string
    form: InertiaForm<{
        content: Record<string, any> | null
        category_id: string | undefined
    }>,
    submitAction?: () => void
    goBackAction?: () => void
    titleText?: string
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
        <template #body>
            <div class="content">
                <Tiptap
                    className="form__item"
                    :error="form.errors.content"
                    v-model="form.content"
                    :headerText="props.titleText"
                />
            </div>
        </template>
    </BaseForm>
</template>

<style scoped lang="scss">
@use '@scss/variables/sizes';

.form {
    gap: 0;

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
