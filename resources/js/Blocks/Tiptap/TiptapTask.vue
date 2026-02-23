<script setup lang="ts">
import {useEditor, EditorContent} from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import {TaskItem, TaskList} from "@tiptap/extension-list";
import BulletListIco from "@/UI/Icons/TextEditor/BulletListIco.vue";
import HorizontalRuleIco from "@/UI/Icons/TextEditor/HorizontalRuleIco.vue";
import CheckMarkIco from "@/UI/Icons/TextEditor/CheckMarkIco.vue";
import H1Ico from "@/UI/Icons/TextEditor/H1Ico.vue";
import H2Ico from "@/UI/Icons/TextEditor/H2Ico.vue";
import H3Ico from "@/UI/Icons/TextEditor/H3Ico.vue";
import H4Ico from "@/UI/Icons/TextEditor/H4Ico.vue";
import H5Ico from "@/UI/Icons/TextEditor/H5Ico.vue";
import H6Ico from "@/UI/Icons/TextEditor/H6Ico.vue";
import ItalicIco from "@/UI/Icons/TextEditor/ItalicIco.vue";
import UnderlineIco from "@/UI/Icons/TextEditor/UnderlineIco.vue";
import StrikethroughIco from "@/UI/Icons/TextEditor/StrikethroughIco.vue";
import BoldIco from "@/UI/Icons/TextEditor/BoldIco.vue";

interface IProps {
    className: string,
}

const model = defineModel<string>()
const props = defineProps<IProps>()

const editor = useEditor({
    content: model.value,
    onUpdate: ({ editor }) => {
        model.value = editor.getHTML()
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
            <div class="nodes-block__line">
                <H1Ico class="ico" text="H1" :size="18" @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"/>
                <H2Ico class="ico" text="H2" :size="18" @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"/>
                <H3Ico class="ico" text="H3" :size="18" @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"/>
                <H4Ico class="ico" text="H4" :size="18" @click="editor?.chain().focus().toggleHeading({ level: 4 }).run()"/>
                <H5Ico class="ico" text="H5" :size="18" @click="editor?.chain().focus().toggleHeading({ level: 5 }).run()"/>
                <H6Ico class="ico" text="H6" :size="18" @click="editor?.chain().focus().toggleHeading({ level: 6 }).run()"/>
            </div>
            <div class="nodes-block__line">
                <StrikethroughIco class="ico" :size="18" @click="editor?.chain().focus().toggleStrike().run()"/>
                <UnderlineIco class="ico" :size="18" @click="editor?.chain().focus().toggleUnderline().run()"/>
                <BoldIco class="ico" :size="18" @click="editor?.chain().focus().toggleBold().run()"/>
                <ItalicIco class="ico" :size="18" @click="editor?.chain().focus().toggleItalic().run()"/>
            </div>
            <div class="nodes-block__line">
                <BulletListIco class="ico" :size="18" @click="editor?.chain().focus().toggleBulletList().run()"/>
                <HorizontalRuleIco class="ico" :size="18" @click="editor?.chain().focus().setHorizontalRule().run()"/>
                <CheckMarkIco
                    class="ico"
                    :size="18"
                    @click="editor?.chain().focus().toggleTaskList().run()"
                    :class="{ 'is-active': editor?.isActive('taskList') }"
                />
            </div>
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
    margin-top: $component-margin-top;
}

.nodes-block {
    display: flex;
    flex-direction: column;
    gap: 5px;
    z-index: 1;
    background-color: colors.$bg-elevated;
    position: sticky;
    top: 0 - $component-margin-top;
    padding: 10px 0;

    &__line {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
    }

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

.ico {
    color: colors.$ico-disabled;
    border: 1px solid colors.$border-default;
    border-radius: 5px;
    padding: 5px;
    user-select: none;

    &:hover {
        color: colors.$border-focus;
    }
}
</style>

<style lang="scss">
@use "@scss/variables/colors";

.tiptap {
    outline: none;

    code {
        background-color: var(--purple-light);
        border-radius: 0.4rem;
        color: var(--black);
        font-size: 0.85rem;
        padding: 0.25em 0.3em;
    }

    ul {
        margin: 0;
        padding-left: 30px;

        &[data-type="taskList"] li[data-checked="true"] p {
            text-decoration: line-through;
            opacity: 0.6;
        }
    }

    hr {
        border-bottom: 1px solid colors.$border-default !important;
        margin: 5px 0 !important;
    }

    pre {
        background: var(--black);
        border-radius: 0.5rem;
        color: var(--white);
        font-family: 'JetBrainsMono', monospace;
        margin: 1.5rem 0;
        padding: 0.75rem 1rem;

        code {
            background: none;
            color: inherit;
            font-size: 0.8rem;
            padding: 0;
        }
    }

    blockquote {
        border-left: 3px solid var(--gray-3);
        margin: 1.5rem 0;
        padding-left: 1rem;
    }

    hr {
        border: none;
        border-top: 1px solid var(--gray-2);
        margin: 2rem 0;
    }

    p {
        margin: 0;
    }

    .task-item {
        display: flex;
        gap: 5px;
    }

    .task-item-list {
        padding-left: 0;
    }

    h1, h2, h3, h4, h5, h6 {
        margin: 0;
    }

    h1 {
        font-size: 20px;
    }

    h2 {
        font-size: 18px;
    }

    h3 {
        font-size: 16px;
    }

    h4 {
        font-size: 14px;
    }

    h5 {
        font-size: 12px;
    }

    h6 {
        font-size: 10px;
    }

    input[type="checkbox"] {
        margin-left: 8px;
    }
}
</style>
