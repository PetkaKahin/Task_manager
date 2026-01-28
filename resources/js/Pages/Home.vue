<script setup lang="ts">
import BaseLayout from "@/Layouts/BaseLayout.vue";

interface defineProps {
    message: string,
}

defineProps<defineProps>()
</script>

<template>
    <BaseLayout>
        <h1 class="message">{{ message }}</h1>
    </BaseLayout>
</template>

<style scoped lang="scss">
.message {
    color: #e4ecef;
}
</style>
