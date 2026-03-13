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
import {computed, nextTick, onMounted, toRef, watch} from "vue";
import {useProjectStore} from "@/stores/project.store.ts";
import {useKanbanStore} from "@/stores/kanban.store.ts";
import {TaskItem, TaskList} from "@tiptap/extension-list";
import {useDeleteConfirm} from "@/composables/useDeleteConfirm.ts";
import DeleteModal from "@/UI/Modals/DeleteModal.vue";
import {useBreakpoints} from "@/composables/useBreakpoints.ts";
import {useApiTasks} from "@/composables/api/useApiTasks.ts";
import {useCardEditMode} from "@/composables/ui/useCardEditMode.ts";
import NodesBlockPC from "@/Blocks/Tiptap/NodesBlockPC.vue";
import {useEdgeScrollStore} from "@/stores/edgeScroll.store.ts";
import {useSwipeGestureStore} from "@/stores/swipeGesture.store.ts";

interface IProps {
    task: ITask
    source: any[]
    index: number
    categoryRef?: HTMLElement | null
    iconsSize?: number
}

const props = defineProps<IProps>()
const projectStore = useProjectStore()
const kanbanCard = useKanbanCard()
const kanbanStore = useKanbanStore()
const {updateTask} = useApiTasks()
const {isLaptop: isDesktop} = useBreakpoints()
const edgeScrollStore = useEdgeScrollStore()
const swipeGestureStore = useSwipeGestureStore()
const {
    elementRef,
    handleDragStart,
    isDragging,
    isOvered
} = kanbanCard.getDraggableData(props.source, computed(() => props.index));

let initialContent = JSON.stringify(props.task.content)

async function saveContent(json: Record<string, any> | null) {
    const currentContent = JSON.stringify(json)
    if (currentContent === initialContent) return

    props.task.content = json
    initialContent = currentContent

    const taskData = {...props.task, content: json}
    const realId = await kanbanStore.awaitRealId(taskData.id)
    if (!realId) return

    taskData.id = realId
    const {execute} = updateTask(taskData)
    execute()
}

const editor = useEditor({
    content: props.task.content,
    extensions: [
        StarterKit,
        TaskList.configure({
            HTMLAttributes: {class: 'task-item-list'},
        }),
        TaskItem.configure({
            HTMLAttributes: {class: 'task-item'},
            nested: true,
        }),
    ],
    editable: true,
    editorProps: {
        attributes: !isDesktop.value ? {inputmode: 'none'} : {},
        handleKeyDown: (_, event) => {
            if (!isDesktop.value && !isEditing.value) {
                const allowed = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
                if (!allowed.includes(event.key)) return true
            }
            return false
        },
        handlePaste: () => !isDesktop.value && !isEditing.value,
        handleDrop: () => !isDesktop.value && !isEditing.value,
        handleTextInput: () => !isDesktop.value && !isEditing.value,
    },
    onUpdate({editor: e}) {
        saveContent(e.getJSON())
    },
})

watch(() => props.task.content, (newContent) => {
    if (!editor.value) return
    const current = JSON.stringify(editor.value.getJSON())
    const incoming = JSON.stringify(newContent)
    if (current === incoming) return
    initialContent = incoming
    editor.value.commands.setContent(newContent, false)
})

const {isEditing, cardPlaceholderRef, backdropComponent, start: startEdit, stop: stopEdit} = useCardEditMode(
    toRef(props, 'categoryRef'), elementRef, {
    onClose() {
        saveContent(editor.value?.getJSON() ?? null)
    },
})
const {isOpen: isDeleteModal, target: targetDelete, confirm: deleteConfirm} = useDeleteConfirm<ITask>()

function taskDelete() {
    if (targetDelete.value) kanbanCard.taskDelete(props.task)
}

function handleEditorClick(event: MouseEvent) {
    if (!isDesktop.value) return

    const target = event.target as HTMLElement
    if (target.closest('a, input')) return

    startEdit(() => editor.value?.commands.focus())
}

function pointerDrug(e: PointerEvent) {
    if (!isEditing.value) {
        swipeGestureStore.get('mobile-content')?.pause()
        handleDragStart(e)
        edgeScrollStore.get('mobile-header')?.startDrag(e)

        const catIndex = kanbanStore.getCategoryIndexByTaskId(props.task.id)
        const catId = kanbanStore.categories[catIndex]?.id
        if (catId != null) {
            edgeScrollStore.get(`category-${catId}`)?.startDrag(e)
        }

        window.addEventListener('pointerup', () => {
            swipeGestureStore.get('mobile-content')?.resume()
        }, {once: true})
    }
}

onMounted(async () => {
    if (kanbanStore.pendingEditTaskId === props.task.id) {
        kanbanStore.pendingEditTaskId = null
        await nextTick()
        elementRef.value?.scrollIntoView({block: 'nearest'})
        startEdit(() => editor.value?.commands.focus())
        kanbanStore.animationsEnabled = true
    }
})
</script>

<template>
    <div>
        <Teleport to="#mount-point" :disabled="!isEditing">
            <component :is="backdropComponent" @click="stopEdit"/>
                <article
                    ref="elementRef"
                    class="kanban-card"
                    :class="{
                        'kanban-card--is-dragging': isDragging,
                        'kanban-card--is-overed': isOvered,
                        'kanban-card--is-editing': isEditing,
                    }"
                >
                    <NodesBlockPC :editor="editor" v-if="isEditing" className="nodes"/>

                    <div class="kanban-card__left-block" @click="handleEditorClick">
                        <div class="kanban-card__content">
                            <EditorContent :editor="editor"/>
                        </div>
                    </div>
                    <div class="kanban-card__right-block">
                        <DragHandleIco
                            class="kanban-card__drag"
                            :class="{ 'kanban-card__drag--inactive': isEditing }"
                            @pointerdown="pointerDrug"
                            :size="iconsSize ? iconsSize - 3 : 14"
                        />
                        <Link
                            v-if="!isDesktop"
                            :href="route('tasks.edit', props.task.id)"
                            :data="{from_project_id: projectStore.currentProject?.id,}"
                        >
                            <EditIco class="ico" :size="iconsSize ?? 16"/>
                        </Link>
                        <DeleteIco @click="deleteConfirm(task)" class="ico" :size="iconsSize ?? 16"/>
                    </div>
                </article>
        </Teleport>

        <DeleteModal v-model="isDeleteModal" :onDelete="taskDelete"/>
        <div class="card-void" v-if="isEditing" ref="cardPlaceholderRef"></div>
    </div>
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
    pointer-events: auto;
    box-sizing: border-box;

    display: flex;
    justify-content: space-between;
    gap: 15px;

    &--is-dragging {
        opacity: 0.6;
    }

    &--is-editing {
        position: fixed;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
        justify-content: center;

        .kanban-card__left-block {
            flex-basis: auto;
            overflow-x: hidden;
            overflow-y: auto;

        }
    }

    &__left-block, &__right-block {
        display: flex;
        flex-direction: column;
    }

    &__left-block {
        gap: 15px;
        flex: 1 1 0;
        overflow: hidden;
        padding-bottom: 1px;
        cursor: text;
    }

    &__right-block {
        align-items: flex-end;
        gap: 10px;
    }

    &__drag {
        color: colors.$border-default;
        touch-action: none; // обязательно для управления тачами

        &--inactive {
            color: colors.$bg-elevated;
            cursor: default;
        }
    }

    .tiptap {
        user-select: text;
        min-height: 1em;
        width: 100%;
    }

    .nodes {
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
        top: -135px;
    }

    ul[data-type="taskList"] input[type="checkbox"] {
        pointer-events: auto;
        cursor: pointer;
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
