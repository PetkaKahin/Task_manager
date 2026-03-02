<script setup lang="ts">
import {useEditor, EditorContent} from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import {TaskItem, TaskList} from "@tiptap/extension-list";
import NodesBlock from "@/Blocks/Tiptap/NodesBlock.vue";

interface IProps {
    className: string,
}

const model = defineModel<Record<string, any> | null>()
const props = defineProps<IProps>()

const editor = useEditor({
    content: model.value,
    onUpdate: ({ editor }) => {
        model.value = editor.getJSON()
    },
    extensions: [
        StarterKit,
        TaskList.configure({
            HTMLAttributes: {
                class: 'task-item-list',
            },
        }),
        TaskItem.configure({
            HTMLAttributes: {
                class: 'task-item',
            },
            nested: true,
        })
    ],
    editable: true,
    injectCSS: false,
})
</script>

<template>
    <article class="tiptap-task" :class="props.className">
        <div class="nodes-block">
            <NodesBlock :editor="editor" class="nodes" />
            <div class="nodes-block__border"/>
            <div class="nodes-block__border-bg"/>
        </div>
        <div class="tiptap-wrapper">
            <EditorContent :editor="editor"/>
        </div>
        <span class="text">Markdown</span>
    </article>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

$component-margin-top: 20px;

.tiptap-task {

}

.nodes-block {
    position: sticky;
    top: -$component-margin-top;

    &__border {
        border: 1px solid colors.$border-default;
        border-bottom: none;
        width: calc(100% - 2px);
        height: 9px;
        border-radius: 5px 5px 0 0;

        position: absolute;
        bottom: -10px;
    }

    &__border-bg {
        background-color: colors.$bg-elevated;
        width: 100%;
        height: 5px;
        position: absolute;
        bottom: -5px;
        z-index: -1;
    }
}

.text {
    display: inline-block;
    width: 100%;
    text-align: right;
    color: colors.$text-muted;

    box-sizing: border-box;
    padding: 3px 3px 0 0;
    font-size: 12px;
}

.tiptap-wrapper {
    padding: 5px;
    box-sizing: border-box;
    border: 1px solid colors.$border-default;
    border-radius: 5px;
}
</style>
