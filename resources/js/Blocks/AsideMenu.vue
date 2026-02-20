<script setup lang="ts">

import BaseButton from "@/UI/Buttons/BaseButton.vue";
import BaseDivider from "@/UI/Dividers/BaseDivider.vue";
import {useSidebar} from "@/composables/ui/useSidebar.ts";
import {Link} from "@inertiajs/vue3";
import {useProjectStore} from "@/stores/project.store.ts";

const {isDesktop, projectsList} = useSidebar()

function toggleSidebar() {
    useSidebar().toggle()
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
            from_project_id: useProjectStore()!.currentProject!.id
        })">
            <BaseButton text="+ Добавить проект" className="sidebar-menu__add-project"/>
        </Link>

        <div class="sidebar-menu__content">
            <h5 class="sidebar-menu__header-text">Проекты:</h5>
            <ul class="sidebar-menu__list projects-list">
                <li
                    v-for="project in projectsList"
                    class="projects-list__item"
                >
                    <Link :href="route('dashboard.index', project.id)">
                        <span>{{ project.title }}</span>
                    </Link>
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
    }

    &__content {
        margin-top: 30px;
    }
}

.projects-list {
    margin: 5px 0;
    padding: 0;
    color: colors.$text-primary;

    &__item {
        padding: 5px 0;
    }
}

.divider {
    margin: 20px 0;
}
</style>
