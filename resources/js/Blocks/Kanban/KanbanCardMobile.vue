<script setup lang="ts">
import {useDraggable} from '@vue-dnd-kit/core'
import {computed} from 'vue'
import DragHangle from "@/UI/Icons/DragHangle.vue";
import type {ITask} from "@/Types/models.ts";
import {EditorContent, useEditor} from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import EditIco from "@/UI/Icons/EditIco.vue";
import DeleteIco from "@/UI/Icons/DeleteIco.vue";
import axios from "axios";
import {route} from "ziggy-js";
import {useKanbanStore} from "@/stores/kanban.store.ts";
import {useModal} from "@/composables/ui/useModal.ts";
import {Link} from "@inertiajs/vue3";

interface IProps {
    task: ITask
    source: any[]
    index: number
}

const kanbanStore = useKanbanStore()
const modal = useModal()
const props = defineProps<IProps>()

const {elementRef, handleDragStart, isDragging, isOvered} = useDraggable({
    data: computed(() => ({
        source: props.source,
        index: props.index,
    })),
    groups: ['kanban-cards'],
})

const editor = useEditor({
    content: props.task.content,
    extensions: [
        StarterKit,
    ],
    editable: false,
})

function taskDelete() {
    modal.addActionClosing(
        'delete.task',
        () => {
            kanbanStore.deleteTask(props.task)
            axios.delete(route('task.destroy', props.task.id))
        }
    )
    modal.open()
}

// TODO сделать общего родителя для KanbanCard и KanbanCardMobile
</script>

<template>
    <article
        ref="elementRef"
        class="kanban-card"
        :class="{
            'kanban-card--is-dragging': isDragging,
            'kanban-card--is-overed': isOvered,
        }"
    >
        <div class="kanban-card__left-block">

            <!-- TODO а нужен ли этот title для .md? -->

            <header class="kanban-card__header header">
                <h4 class="header__title">{{ task.title }}</h4>
            </header>
            <div class="kanban-card__content">
                <EditorContent :editor="editor" />
            </div>
        </div>
        <div class="kanban-card__right-block">
            <DragHangle
                class-name="kanban-card__drag"
                @pointerdown="handleDragStart"
            />
            <Link :href="route('task.edit', props.task.id)">
                <EditIco class="ico" :size="16"/>
            </Link>
            <DeleteIco @click="taskDelete" class="ico" :size="16"/>
        </div>
    </article>
</template>

<style scoped lang="scss">
@use '@scss/variables/colors';
@use '@scss/variables/sizes';

.kanban-card-wrapper {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.kanban-card {
    touch-action: none;
    border: 1px solid colors.$border-default;
    border-radius: 5px;
    background-color: colors.$bg-base;
    padding: 10px;
    width: 100%;
    box-sizing: border-box;

    display: flex;
    justify-content: space-between;
    gap: 15px;

    &--is-dragging {
        opacity: 0.6;
    }

    &__left-block, &__right-block {
        display: flex;
        flex-direction: column;
    }

    &__left-block {
        gap: 15px;
    }

    &__right-block {
        align-items: flex-end;
        gap: 15px;
    }
}

.header {
    display: flex;
    justify-content: space-between;
    gap: 20px;

    &__title {
        margin: 0;
    }
}

.horizontal-line {
    width: 100%;
    height: 3px;
    border-radius: 3px;
    background-color: colors.$border-focus;
}

.ico {
    color: colors.$ico-inactive;
    cursor: pointer;

    &:hover {
        color: colors.$text-focus;
    }
}
</style>
