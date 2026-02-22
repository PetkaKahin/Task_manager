<script setup lang="ts">
import DragHandleIco from "@/UI/Icons/DragHandleIco.vue";
import type {ITask} from "@/Types/models.ts";
import {EditorContent, useEditor} from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import EditIco from "@/UI/Icons/EditIco.vue";
import DeleteIco from "@/UI/Icons/DeleteIco.vue";
import {route} from "ziggy-js";
import {Link} from "@inertiajs/vue3";
import {useKanbanCard} from "@/composables/ui/useKanbanCard.ts";
import {computed} from "vue";
import {useProjectStore} from "@/stores/project.store.ts";
import {TaskItem, TaskList} from "@tiptap/extension-list";
import {apiRequest} from "@/shared/api/apiRequest.ts";
import {useKanbanStore} from "@/stores/kanban.store.ts";
import Heading from "@tiptap/extension-heading";

interface IProps {
    task: ITask
    source: any[]
    index: number
    iconsSize?: number
}

const props = defineProps<IProps>()
const {currentProject} = useProjectStore()
const {
    elementRef,
    handleDragStart,
    isDragging,
    isOvered
} = useKanbanCard().getDraggableData(props.source, computed(() => props.index));

const editor = useEditor({
    content: props.task.content,
    extensions: [
        StarterKit,
        TaskList.configure({
            HTMLAttributes: { class: 'task-item-list' },
        }),
        TaskItem.configure({
            HTMLAttributes: { class: 'task-item' },
            nested: true,
        }),
    ],
    editable: true,
    editorProps: {
        attributes: {
            inputmode: 'none',
        },
        handleKeyDown: () => true, // блокирует клавиатуру
        handlePaste: () => true,   // блокирует вставку
        handleDrop: () => true,    // блокирует drag&drop
    },
    onUpdate: ({ editor }) => {
        if (!currentProject) return
        apiRequest.patch(route('api.tasks.update', {
            projectId: currentProject.id,
            categoryId: props.task.category_id,
            taskId: props.task.id,
        }), {
            content: editor.getHTML()
        })
    },
})

const taskDelete = () => useKanbanCard().taskDelete(props.task)
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
                <EditorContent :editor="editor"/>
            </div>
        </div>
        <div class="kanban-card__right-block">
            <DragHandleIco
                className="kanban-card__drag"
                @pointerdown="handleDragStart"
                :size="iconsSize ? iconsSize - 3 : 14"
            />
            <Link
                :href="route('task.edit', {
                    id:props.task.id, from_project_id:
                    useProjectStore()!.currentProject!.id
                })"
            >
                <EditIco class="ico" :size="iconsSize ?? 16"/>
            </Link>
            <DeleteIco @click="taskDelete" class="ico" :size="iconsSize ?? 16"/>
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
    border: 1px solid colors.$border-default;
    border-radius: 5px;
    background-color: colors.$bg-base;
    padding: 10px;
    max-width: sizes.$card-max-width;
    user-select: none;
    pointer-events: auto;

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
        gap: 10px;
    }

    &__drag {
        color: colors.$border-default;
        touch-action: none; // обязательно для управления тачами
    }

    [contenteditable] {
        -webkit-user-modify: read-only;
        user-modify: read-only;
    }

    .tiptap {
        pointer-events: none;
    }

    ul[data-type="taskList"] input[type="checkbox"] {
        pointer-events: auto;
        cursor: pointer;
    }

    ul[data-type="taskList"] li {
        -webkit-user-select: auto;
        user-select: auto;
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

@media (max-width: 768px) {
    .kanban-card {
        width: 100%;
        max-width: none;
        box-sizing: border-box;
    }
}
</style>