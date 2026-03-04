<script setup lang="ts">

import StrikethroughIco from "@/UI/Icons/TextEditor/StrikethroughIco.vue";
import H5Ico from "@/UI/Icons/TextEditor/H5Ico.vue";
import CheckMarkIco from "@/UI/Icons/TextEditor/CheckMarkIco.vue";
import H6Ico from "@/UI/Icons/TextEditor/H6Ico.vue";
import ItalicIco from "@/UI/Icons/TextEditor/ItalicIco.vue";
import BulletListIco from "@/UI/Icons/TextEditor/BulletListIco.vue";
import H4Ico from "@/UI/Icons/TextEditor/H4Ico.vue";
import HorizontalRuleIco from "@/UI/Icons/TextEditor/HorizontalRuleIco.vue";
import H2Ico from "@/UI/Icons/TextEditor/H2Ico.vue";
import BoldIco from "@/UI/Icons/TextEditor/BoldIco.vue";
import H3Ico from "@/UI/Icons/TextEditor/H3Ico.vue";
import H1Ico from "@/UI/Icons/TextEditor/H1Ico.vue";
import UnderlineIco from "@/UI/Icons/TextEditor/UnderlineIco.vue";
import type {Editor} from "@tiptap/vue-3";

interface IProps {
    editor?: Editor;
}

const props = defineProps<IProps>()
</script>

<template>
    <article class="nodes-block">
        <div class="nodes-block__line">
            <H1Ico class="ico" text="H1" :size="18" @click="props.editor?.chain().focus().toggleHeading({ level: 1 }).run()"/>
            <H2Ico class="ico" text="H2" :size="18" @click="props.editor?.chain().focus().toggleHeading({ level: 2 }).run()"/>
            <H3Ico class="ico" text="H3" :size="18" @click="props.editor?.chain().focus().toggleHeading({ level: 3 }).run()"/>
            <H4Ico class="ico" text="H4" :size="18" @click="props.editor?.chain().focus().toggleHeading({ level: 4 }).run()"/>
            <H5Ico class="ico" text="H5" :size="18" @click="props.editor?.chain().focus().toggleHeading({ level: 5 }).run()"/>
            <H6Ico class="ico" text="H6" :size="18" @click="props.editor?.chain().focus().toggleHeading({ level: 6 }).run()"/>
        </div>
        <div class="nodes-block__line">
            <StrikethroughIco class="ico" :size="18" @click="props.editor?.chain().focus().toggleStrike().run()"/>
            <UnderlineIco class="ico" :size="18" @click="props.editor?.chain().focus().toggleUnderline().run()"/>
            <BoldIco class="ico" :size="18" @click="props.editor?.chain().focus().toggleBold().run()"/>
            <ItalicIco class="ico" :size="18" @click="props.editor?.chain().focus().toggleItalic().run()"/>
        </div>
        <div class="nodes-block__line">
            <BulletListIco class="ico" :size="18" @click="props.editor?.chain().focus().toggleBulletList().run()"/>
            <HorizontalRuleIco class="ico" :size="18" @click="props.editor?.chain().focus().setHorizontalRule().run()"/>
            <CheckMarkIco
                class="ico"
                :size="18"
                @click="props.editor?.chain().focus().toggleTaskList().run()"
                :class="{ 'is-active': props.editor?.isActive('taskList') }"
            />
        </div>

    </article>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

.nodes-block {
    display: flex;
    flex-direction: column;
    gap: 5px;

    &__line {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
    }
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
