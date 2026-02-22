<script setup lang="ts">

import BaseButton from "@/UI/Buttons/BaseButton.vue";
import BaseDivider from "@/UI/Dividers/BaseDivider.vue";
import {useSidebar} from "@/composables/ui/useSidebar.ts";
import {Link} from "@inertiajs/vue3";
import {useProjectStore} from "@/stores/project.store.ts";
import EditIco from "@/UI/Icons/EditIco.vue";
import DeleteIco from "@/UI/Icons/DeleteIco.vue";
import type {IProject} from "@/Types/models.ts";
import {useKanbanProject} from "@/composables/ui/useKanbanProject.ts";
import {ref} from "vue";

const {isDesktop, projectsList} = useSidebar()
const {currentProject} = useProjectStore()
const isItemActive = ref<boolean | number>(false)

function toggleSidebar() {
    useSidebar().toggle()
}

function deleteProject(project: IProject) {
    useKanbanProject().projectDelete(project)
}
</script>

<template>
    <aside class="sidebar-menu">
        <header
            class="sidebar-menu__header"
            v-if="isDesktop === false"
        >
            <BaseButton className="sidebar-menu__toggle" text="X" @click="toggleSidebar"/>
        </header>

        <BaseDivider
            class="divider"
            v-if="isDesktop === false"
        />

        <Link :href="route('project.create', {
            from_project_id: useProjectStore()?.currentProject?.id
        })">
            <BaseButton text="+ Добавить проект" className="sidebar-menu__add-project"/>
        </Link>

        <div class="sidebar-menu__content">
            <h5 class="sidebar-menu__header-text">Проекты:</h5>
            <ul class="sidebar-menu__list projects-list">
                <li
                    v-for="project in projectsList"
                    class="projects-list__item item"
                    :class="{'item--active': isItemActive == project.id}"
                >
                    <div class="item__wrapper">
                        <Link
                            :href="route('dashboard.index', project.id)"
                            class="item__link"
                            @mouseenter="isItemActive = project.id"
                            @mouseleave="isItemActive = false"
                        >
                            <span class="item__title">{{ project.title }}</span>
                        </Link>
                        <div class="item__icons">
                            <Link :href="route('project.edit', {
                                id: project.id,
                                from_project_id: currentProject?.id
                            })">
                                <EditIco class="item__ico" :size="16"/>
                            </Link>
                            <DeleteIco class="item__ico" :size="16" @click="deleteProject(project)"/>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </aside>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

.sidebar-menu {
    border-right: 1px solid colors.$border-default;
    background-color: colors.$bg-base;
    height: 100%;
    min-width: 150px;
    max-width: 350px;
    box-sizing: border-box;
    padding: 10px;

    &__button {
        margin: 15px;
        padding: 10px 5px;
    }

    &__header-text {
        margin: 15px 15px 0 15px;
    }

    &__header {
        display: flex;
        justify-content: flex-end;
    }

    &__toggle {
        margin: 15px 15px 0 15px;
        padding-top: 2px;
    }

    &__add-project {
        padding: 10px 5px;
        width: 100%;
    }

    &__content {
        margin-top: 30px;
    }
}

.projects-list {
    margin: 5px 0;
    padding: 0;
    color: colors.$text-primary;

    display: flex;
    flex-direction: column;
    gap: 5px;

    &__item {
        list-style-type: none;
    }
}

.item {
    border: 1px solid colors.$border-default;
    border-radius: 5px;
    background-color: colors.$bg-elevated;
    padding: 0;

    &--active {
        border-color: colors.$border-focus;
    }

    &__link {
        padding: 5px 8px;
        text-decoration: none;
        display: block;
        flex: 1;
        min-width: 0;

        &:hover {
            color: colors.$text-primary;
        }
    }

    &__title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
    }

    &__icons {
        display: flex;
        align-items: center;
        gap: 10px;
        padding-right: 8px;
    }

    &__wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
    }

    &__ico {
        z-index: 1;
        color: colors.$text-muted;
        cursor: pointer;

        &:hover {
            color: colors.$border-focus;
        }
    }
}

.divider {
    margin: 20px 0;
}

@media (max-width: 425px)  {
    .sidebar-menu {
        max-width: 300px;
    }
}
</style>
