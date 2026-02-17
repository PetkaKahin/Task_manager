<template>
    <article class="tiptap-task" :class="props.className">
        <div class="tiptap-wrapper">
            <EditorContent :editor="editor"/>
        </div>
        <span class="text">Markdown</span>
    </article>
</template>

<script setup lang="ts">
import {useEditor, EditorContent} from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

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
    ],
    editable: true,
    injectCSS: false,
})
</script>

<style scoped lang="scss">
@use "@scss/variables/colors";

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
}
</style>
