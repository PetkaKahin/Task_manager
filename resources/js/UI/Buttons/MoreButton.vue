<script setup lang="ts">
import {type Component} from "vue";
import MoreIco from "@/UI/Icons/MoreIco.vue";
import DropdownMenu from "@/Dropdowns/DropdownMenu.vue";
import {useDropdown} from "@/composables/ui/useDropdown.ts";

interface IProps {
    menuItems?: Component[]
}

const props = defineProps<IProps>()
const {buttonRef, dropdownRef, isOpen, toggle, dropdownStyle} = useDropdown()
</script>

<template>
    <button ref="buttonRef" class="more-button" type="button" @click="toggle">
        <MoreIco className="more-button__ico" :size="24"/>
        <Teleport to="body">
            <div
                v-if="isOpen"
                ref="dropdownRef"
                class="dropdown"
                :style="dropdownStyle"
            >
                <DropdownMenu :menuItems="props.menuItems"/>
            </div>
        </Teleport>
    </button>
</template>

<style scoped lang="scss">
@use '@scss/variables/colors';

.more-button {
    background-color: transparent;
    border: none;
    border-radius: 5px;
    padding: 0 10px;
    position: relative;
    box-sizing: border-box;

    &:hover {
        background-color: colors.$bg-active;
    }

    &__ico {
        color: colors.$text-disabled;
    }
}
</style>

<style lang="scss">
.dropdown {
    position: fixed;
    min-width: 100px;
    padding: 5px;
}
</style>