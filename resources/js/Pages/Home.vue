<script setup lang="ts">
import BaseLayout from "@/Layouts/BaseLayout.vue";

interface Props {
    message: string,
}

defineProps<Props>()
</script>

<template>
    <BaseLayout>
        <div class="home-page">
            <h1 class="message">{{ message }}</h1>
        </div>
    </BaseLayout>
</template>

<style scoped lang="scss">
.message {
    margin-top: 5000px;
    color: #e4ecef;
}
</style>
