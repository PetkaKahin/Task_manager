<script setup lang="ts">
import BaseLayout from "@/Layouts/BaseLayout.vue";
import TasksList from "@/Blocks/TasksList/TasksList.vue";

interface Props {
    message: string,
}

defineProps<Props>()
</script>

<template>
    <BaseLayout>
        <main class="home-page">
            <h2 class="home-page__header-text">
               Название проекта
            </h2>

            <section class="home-page__tasks">
                <TasksList header="Запланировано"/>
                <TasksList header="В работе"/>
                <TasksList header="Выполнено"/>
            </section>
        </main>
    </BaseLayout>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

.home-page {
    padding: 30px;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    &__tasks {
        display: flex;
        gap: 20px;
        flex: 1;
        min-height: 0;
        overflow-x: auto;
    }

    &__header-text {
        font-weight: 300;
        margin-top: 0;
    }
}
</style>
