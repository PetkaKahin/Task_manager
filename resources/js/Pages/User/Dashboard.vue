<script setup lang="ts">
import BaseLayout from "@/Layouts/BaseLayout.vue";
import type {ICategory, IProject} from "@/Types/models.ts";
import {useSidebar} from "@/composables/ui/useSidebar.ts";
import KanbanBoard from "@/Blocks/Kanban/KanbanBoard.vue";
import {onMounted} from "vue";
import {useKanbanStore} from "@/stores/kanban.store.ts";
import {useProjectStore} from "@/stores/project.store.ts";
import DeleteModal from "@/Blocks/Modal/DeleteModal.vue";
import {useBreakpoints} from "@/composables/useBreakpoints.ts";
import KanbanBoardMobile from "@/Blocks/Kanban/KanbanBoardMobile.vue";

interface IProps {
    project: IProject,
    projects: IProject[],
    categories: ICategory[],
}

const props = defineProps<IProps>()
const kanbanStore = useKanbanStore()
const projectStore = useProjectStore()
const breakpoints = useBreakpoints()

onMounted(() => {
    useSidebar().setProjectsList(props.projects)
    kanbanStore.setColumns(props.categories)
    projectStore.setProject(props.project)
})
</script>

<template>
    <BaseLayout>
        <DeleteModal/>
        <main class="home-page">
            <h2 class="home-page__header-text">
                {{ props.project.title }}
            </h2>

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

    &__header-text {
        font-weight: 300;
        margin-top: 0;
    }
}

@media (max-width: 768px) {
    .home-page {
        padding: 0;

        &__header-text {
            display: none;
        }
    }
}
</style>
