<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from './BaseInput.vue'
import EyeIco from '@/UI/Icons/EyeIco.vue'

interface IProps {
    id: string,
    name: string,
    error?: string,
    autocomplete?: string,
    label?: string,
    className?: string,
}

defineProps<IProps>()
const model = defineModel<string>()
const isVisible = ref(false)
</script>

<template>
    <BaseInput
        v-model="model"
        v-bind="$props"
        :type="isVisible ? 'text' : 'password'"
    >
        <template #append>
            <button
                type="button"
                class="eye-button"
                @click="isVisible = !isVisible"
                tabindex="-1"
            >
                <div v-if="isVisible" class="eye-button__strike" />
                <EyeIco :size="18" />
            </button>
        </template>
    </BaseInput>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

.eye-button {
    all: unset;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: colors.$text-disabled;
    padding: 2px;
    border-radius: 3px;

    &:hover {
        color: colors.$accent-primary;

        .eye-button__strike {
            background-color: colors.$accent-primary;
        }
    }

    &__strike {
        position: absolute;
        height: 2px;
        width: 100%;
        transform: rotateZ(-45deg);
        background-color: colors.$text-disabled;
        border-radius: 2px;
    }
}
</style>
