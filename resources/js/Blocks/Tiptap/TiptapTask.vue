<script setup lang="ts">
import {useEditor, EditorContent} from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import {TaskItem, TaskList} from "@tiptap/extension-list";
import BulletListIco from "@/UI/Icons/BulletListIco.vue";
import HorizontalRuleIco from "@/UI/Icons/HorizontalRuleIco.vue";
import CheckMarkIco from "@/UI/Icons/CheckMarkIco.vue";
import TextIco from "@/UI/Icons/TextIco.vue";

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
            <TextIco class="ico ico-text" text="H1" :size="24" @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"/>
            <TextIco class="ico ico-text" text="H2" :size="24" @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"/>
            <TextIco class="ico ico-text" text="H3" :size="24" @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"/>

            <TextIco class="ico ico-text" text="S" :strikethrough="true" :size="24" @click="editor?.chain().focus().toggleStrike().run()"/>
            <TextIco class="ico ico-text" text="U" :underline="true" :size="24" @click="editor?.chain().focus().toggleUnderline().run()"/>
            <TextIco class="ico ico-text" text="B" :bold="true" :size="24" @click="editor?.chain().focus().toggleBold().run()"/>
            <TextIco class="ico ico-text" text="I" :italic="true" :size="24" @click="editor?.chain().focus().toggleItalic().run()"/>

            <BulletListIco class="ico" :size="18" @click="editor?.chain().focus().toggleBulletList().run()"/>
            <HorizontalRuleIco class="ico" :size="18" @click="editor?.chain().focus().setHorizontalRule().run()"/>
            <CheckMarkIco
                class="ico"
                :size="18"
                @click="editor?.chain().focus().toggleTaskList().run()"
                :class="{ 'is-active': editor?.isActive('taskList') }"
            />
        </div>
        <div class="tiptap-wrapper">
            <EditorContent :editor="editor"/>
        </div>
        <span class="text">Markdown</span>
    </article>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

.tiptap-task {
    margin-top: 20px;
}

.nodes-block {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 15px;
    gap: 5px;
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

.ico-text {
    padding: 2px;
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

    h1, h2, h3 {
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
}
</style>
