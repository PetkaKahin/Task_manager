<script setup lang="ts">
import BaseInput from "@/UI/Inputs/BaseInput.vue";

interface Props {
    id: string,
    name: string,
    error?: string,
    autocomplete?: string,
    label?: string,
    className?: string,
}

defineProps<Props>()
const model = defineModel<string>()
</script>

<template>
    <BaseInput
        v-model="model"
        v-bind="$props"
        type="text"
    />
</template>
