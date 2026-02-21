<script setup lang="ts">

import BaseButton from "@/UI/Buttons/BaseButton.vue";
import {router} from "@inertiajs/vue3";
import {route} from "ziggy-js";

interface IProps {
    className?: string,
    submitAction?: () => void,
    submitText?: string,
    goBackAction?: () => void,
}

const props = defineProps<IProps>()

function submit() {
    props.submitAction?.()
}

const goBack = () => {
    if (props.goBackAction) return props.goBackAction()
    else router.visit(route("home"))
}
</script>

<template>
    <form
        class="base-form"
        :class="props.className"
        @submit.prevent="submit"
    >
        <header class="base-form__header">
            <slot name="header"></slot>
        </header>

        <main class="base-form__main">
            <slot name="body"/>
        </main>

        <footer class="base-form__footer">
            <BaseButton text="Назад" className="base-form__button" :action="goBack" type="button"/>
            <BaseButton :text="submitText ?? 'Создать'" className="base-form__button" type="submit"/>
        </footer>
    </form>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

.base-form {
    width: fit-content;
    padding: 20px;
    background-color: colors.$bg-elevated;

    display: flex;
    flex-direction: column;
    gap: 20px;

    border: 1px solid colors.$border-default;
    border-radius: 5px;

    &__footer {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
    }

    &__button {
        padding: 5px;
    }
}
</style>
