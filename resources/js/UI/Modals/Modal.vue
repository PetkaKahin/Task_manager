<script setup lang="ts">
import {useBackdrop} from "@/composables/ui/useBackdrop.ts"
import {watch} from "vue";

const {open, close, component} = useBackdrop()
const isActive = defineModel<boolean>()

// чтобы не нарушать порядок бэкдропа
watch(isActive, (value) => {
    if (value) open(() => isActive.value = false)
    else close()
})
</script>

<template>
    <Teleport to="body" v-if="isActive">
        <div class="modal">
            <component
                :is="component"
                @click="close"
            />
            <div class="modal__content">
                <slot/>
            </div>
        </div>
    </Teleport>
</template>

<style scoped lang="scss">
.modal{
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;

    &__content {
        position: relative;
        z-index: 1;
    }
}
</style>