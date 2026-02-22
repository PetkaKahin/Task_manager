<script setup lang="ts">

import Header from "@/Blocks/Header.vue";
import AsideMenu from "@/Blocks/AsideMenu.vue";
import {useSidebar} from "@/composables/ui/useSidebar.ts";
import BaseBackdrop from "@/UI/Backdrops/BaseBackdrop.vue";
import {onMounted} from "vue";
import {apiRequest} from "@/shared/api/apiRequest.ts";
import {route} from "ziggy-js";
import type {IProject} from "@/Types/models.ts";
import {useProjectStore} from "@/stores/project.store.ts";
import {sidebarService} from "@/services/sidebarService.ts";
import {projectService} from "@/services/api/projectService.ts";

const {isOpen} = useSidebar()
const projectStore = useProjectStore()

sidebarService().innit()

onMounted(async () => {
    const response = await projectService().getProjects()
    projectStore.setProjects(response.data)
})
</script>

<template>
    <div class="base-layout">
        <div class="base-layout__header">
            <Header/>
        </div>
        <BaseBackdrop/>
        <div
            class="base-layout__sidebar"
            :class="{'base-layout__sidebar--open' : isOpen}"
        >
            <AsideMenu/>
        </div>
        <div class="base-layout__content">
            <slot/>
        </div>
    </div>
</template>

<style lang="scss">
@use "@scss/base";

.base-layout {
    height: 100vh;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas:
        "header header"
        "sidebar content";
    overflow: hidden;
}

.base-layout__header {
    grid-area: header;
    z-index: 2;
}

.base-layout__sidebar {
    grid-area: sidebar;
    overflow-y: auto;
}

.base-layout__content {
    grid-area: content;
    overflow-y: auto;
}

@media (max-width: 1024px) {
    .base-layout {
        &__sidebar {
            position: absolute;
            height: 100vh;
            z-index: 3;
            left: -100%;
            transition-duration: 0.3s;

            &--open {
                left: 0;
                transition-duration: 0.3s;
            }
        }
    }
}
</style>
