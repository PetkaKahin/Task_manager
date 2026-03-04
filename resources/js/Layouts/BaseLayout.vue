<script setup lang="ts">

import Header from "@/Blocks/Header.vue";
import SideMenu from "@/Blocks/SideMenu/SideMenu.vue";
import {useSidebar} from "@/composables/ui/useSidebar.ts";
import {onMounted} from "vue";
import {useProjectStore} from "@/stores/project.store.ts";
import {sidebarService} from "@/services/sidebarService.ts";
import {projectService} from "@/services/api/projectService.ts";
import {useBackdrop} from "@/composables/ui/useBackdrop.ts";
import BaseBackdrop from "@/UI/Backdrops/BaseBackdrop.vue";

const {isOpen: isOpenSidebar} = useSidebar()
const projectStore = useProjectStore()

sidebarService().init()

onMounted(async () => {
    const response = await projectService().getProjects()
    projectStore.setProjects(response.data)
    useBackdrop().init(BaseBackdrop)
})
</script>

<template>
    <div class="base-layout">
        <header class="base-layout__header">
            <Header/>
        </header>
        <div
            class="base-layout__sidebar"
            :class="{'base-layout__sidebar--open' : isOpenSidebar}"
        >
            <SideMenu/>
        </div>
        <div class="base-layout__content">
            <slot/>
        </div>
        <div class="mount-point" id="mount-point"></div>
    </div>
</template>

<style lang="scss">
@use "@scss/base";

.base-layout {
    min-height: 100vh;
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

#mount-point {
    z-index: 10;
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

<style lang="scss">
@use '@scss/tiptap';
</style>
