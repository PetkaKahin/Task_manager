<script setup lang="ts">

import NodesBlock from "@/Blocks/Tiptap/NodesBlock.vue";
import type {Editor} from "@tiptap/vue-3";
import DragHandleIco from "@/UI/Icons/DragHandleIco.vue";
import {useDraggable} from "@/composables/ui/useDraggable.ts";
import {ref, type Ref} from "vue";

interface IProps {
    editor?: Editor
    className?: string
}

const props = defineProps<IProps>()
const rootRef: Ref<HTMLElement | null> = ref(null)
const handleRef: Ref<HTMLElement | null> = ref(null)

const {position} = useDraggable({
    handle: handleRef,
})
</script>

<template>
    <article
        class="nodes-block-pc"
        :class="props.className"
        ref="rootRef"
        :style="{
            transform: `translate(${position.x}px, ${position.y}px)`
        }"
    >
        <div class="left-block">
            <div ref="handleRef">
                <DragHandleIco
                    class="ico"
                    :size="15"
                />
            </div>
        </div>
        <div class="right-block">
            <NodesBlock :editor="props.editor" />
        </div>
    </article>
</template>

<style scoped lang="scss">
@use '@scss/variables/colors';

.nodes-block-pc {
    position: absolute;
    top: 0;
    z-index: 1;

    padding: 10px;
    background-color: colors.$bg-base;
    border: 1px solid colors.$border-default;
    border-radius: 5px;

    display: flex;
    gap: 10px;
    width: max-content;
}

.ico {
    color: colors.$border-default;
}
</style>
