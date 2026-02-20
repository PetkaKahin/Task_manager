<script setup lang="ts">
import BaseLayout from "@/Layouts/BaseLayout.vue";
import type {ICategory, IProject} from "@/Types/models.ts";
import KanbanBoard from "@/Blocks/Kanban/KanbanBoard.vue";
import {watch} from "vue";
import {useKanbanStore} from "@/stores/kanban.store.ts";
import {useProjectStore} from "@/stores/project.store.ts";
import DeleteModal from "@/Blocks/Modal/DeleteModal.vue";
import {useBreakpoints} from "@/composables/useBreakpoints.ts";
import KanbanBoardMobile from "@/Blocks/Kanban/KanbanBoardMobile.vue";
import EditIco from "@/UI/Icons/EditIco.vue";
import {Link} from "@inertiajs/vue3";

interface IProps {
    project: IProject,
    categories: ICategory[],
}

const props = defineProps<IProps>()
const kanbanStore = useKanbanStore()
const projectStore = useProjectStore()
const breakpoints = useBreakpoints()

// Для навигации Inertia назад
watch(() => props.categories, (categories) => {
    kanbanStore.setColumns(categories)
}, { immediate: true })
watch(() => props.project, (project) => {
    projectStore.setProject(project)
}, { immediate: true })

</script>

<template>
    <BaseLayout>
        <DeleteModal/>
        <main class="home-page">
            <header class="home-page__header header">
                <h2 class="header__text">
                    {{ props.project.title }}
                </h2>
                <Link :href="route('project.edit', {
                    id: project.id,
                    from_project_id: project,
                })">
                    <EditIco class="header__ico" :size="22"/>
                </Link>
            </header>

            <KanbanBoard v-if="breakpoints.isLaptop.value"/>
            <KanbanBoardMobile v-else/>
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

    &__kanban {
        display: flex;
        gap: 20px;
        flex: 1;
        min-height: 0;
        overflow-x: auto;
    }
}

.header {
    display: flex;
    gap: 15px;
    align-items: center;
    margin-bottom: 20px;

    &__text {
        font-weight: 300;
        margin: 0;
    }

    &__ico {
        color: colors.$text-disabled;

        &:hover {
            color: colors.$text-focus;
        }
    }
}

@media (max-width: 768px) {
    .home-page {
        padding: 0;
    }

    .header {
        display: none;
    }
}
</style>
