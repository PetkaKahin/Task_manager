<script setup lang="ts">

import BaseButton from "@/UI/Buttons/BaseButton.vue";
import BaseDivider from "@/UI/Dividers/BaseDivider.vue";
import {useSidebar} from "@/composables/ui/useSidebar.ts";
import {Link} from "@inertiajs/vue3";
import {useProjectStore} from "@/stores/project.store.ts";
import {watch, onUnmounted} from "vue";
import {useBackdrop} from "@/composables/ui/useBackdrop.ts";
import ProjectsList from "@/Blocks/SideMenu/ProjectsList.vue";
import {useUserSync} from "@/composables/echo/useUserSync.ts";

const {isDesktop, toggle, close, isOpen} = useSidebar()
useUserSync()
const {component: componentBackdrop, open: openBackdrop, close: closeBackdrop} = useBackdrop()

watch(isOpen, (value) => {
    if (value) openBackdrop()
    else closeBackdrop()
}, { immediate: true })

onUnmounted(() => {
    closeBackdrop()
})
</script>

<template>
    <component :is="componentBackdrop" @click="close"/>

    <aside class="sidebar-menu">
        <header
            class="sidebar-menu__header"
            v-if="isDesktop === false"
        >
            <BaseButton className="sidebar-menu__toggle" text="X" @click="toggle"/>
        </header>

        <BaseDivider
            class="divider"
            v-if="isDesktop === false"
        />

        <Link
            :href="route('projects.create')"
            :data="{from_project_id: useProjectStore()?.currentProject?.id}"
        >
            <BaseButton text="+ Добавить проект" className="sidebar-menu__add-project"/>
        </Link>

        <ProjectsList class="sidebar-menu__projects-list"/>
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
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;

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

    &__projects-list {
        margin-top: 20px;
        flex: 1;
        overflow-y: auto;
        min-height: 0;
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
