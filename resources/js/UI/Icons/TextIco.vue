<script setup lang="ts">
import {computed} from "vue";

interface Props {
    text?: string
    size?: number
    bold?: boolean
    italic?: boolean
    underline?: boolean
    strikethrough?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    text: 'H1',
    size: 24,
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
})

const textDecoration = computed(() => {
    const parts: string[] = []
    if (props.underline) parts.push('underline')
    if (props.strikethrough) parts.push('line-through')
    return parts.length ? parts.join(' ') : undefined
})
</script>

<template>
  <span
      class="text-icon"
      :style="{
      width: `${size}px`,
      height: `${size}px`,
      fontSize: `${size * 0.65}px`,
      fontWeight: bold ? 800 : 600,
      fontStyle: italic ? 'italic' : 'normal',
      textDecorationLine: textDecoration,
    }"
  >
    {{ text }}
  </span>
</template>

<style scoped lang="scss">
.text-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    line-height: 1;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
}
</style>