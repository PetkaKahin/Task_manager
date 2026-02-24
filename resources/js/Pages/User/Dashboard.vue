<script setup lang="ts">
import BaseLayout from "@/Layouts/BaseLayout.vue";
import type {ICategory, IProject} from "@/Types/models.ts";
import {defineAsyncComponent, watch} from "vue";
import {useKanbanStore} from "@/stores/kanban.store.ts";
import {useProjectStore} from "@/stores/project.store.ts";
import DeleteModal from "@/Blocks/Modal/DeleteModal.vue";
import {useBreakpoints} from "@/composables/useBreakpoints.ts";
import EditIco from "@/UI/Icons/EditIco.vue";
import {Link} from "@inertiajs/vue3";
import BaseButton from "@/UI/Buttons/BaseButton.vue";
import DeleteIco from "@/UI/Icons/DeleteIco.vue";
import {useKanbanProject} from "@/composables/ui/useKanbanProject.ts";

interface IProps {
    project: IProject,
    categories: ICategory[],
}

const props = defineProps<IProps>()
const kanbanStore = useKanbanStore()
const projectStore = useProjectStore()
const breakpoints = useBreakpoints()
const KanbanBoard = defineAsyncComponent(() => import('@/Blocks/Kanban/KanbanBoard.vue'))
const KanbanBoardMobile = defineAsyncComponent(() => import('@/Blocks/Kanban/KanbanBoardMobile.vue'))

// Для навигации Inertia назад
watch(() => props.categories, (categories) => {
    kanbanStore.setCategory(categories)
}, { immediate: true })
watch(() => props.project, (project) => {
    projectStore.setCurrentProject(project)
}, { immediate: true })

function deleteProject() {
    useKanbanProject().projectDelete(props.project)
}
</script>

<template>
    <BaseLayout>
        <DeleteModal/>
        <main class="home-page">
            <header class="home-page__header header">
                <div class="header__left-block">
                    <h2 class="header__text">
                        {{ props.project.title }}
                    </h2>
                    <Link :href="route('projects.edit', {
                        id: project.id,
                        from_project_id: project.id,
                    })">
                        <EditIco class="header__ico" :size="22"/>
                    </Link>
                    <DeleteIco class="header__ico" @click="deleteProject" :size="22"/>
                </div>
                <div class="header__right-block">
                    <Link :href="route('categories.create', {
                        from_project_id: project.id
                    })"
                          class="header__link"
                    >
                        <BaseButton className="header__button text-no-wrap" text="+ Добавить категорию"/>
                    </Link>
                </div>
            </header>

            <KanbanBoard v-if="breakpoints.isLaptop.value"/>
            <KanbanBoardMobile v-else/>
        </main>
    </BaseLayout>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

.home-page {
    padding: 10px 10px 10px 30px;
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
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    gap: 20px;

    &__text {
        font-weight: 300;
        margin: 0;
    }

    &__ico {
        color: colors.$text-disabled;
        cursor: pointer;
        min-width: 22px;
        min-height: 22px;

        &:hover {
            color: colors.$text-focus;
        }
    }

    &__button {
        padding: 5px;

        :deep(.text) {
            font-size: 16px;
        }
    }

    &__left-block {
        display: flex;
        gap: 15px;
        align-items: center;
    }

    &__link {
        text-decoration: none;
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
