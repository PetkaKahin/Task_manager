<script setup lang="ts">

import DropdownItemLink from "@/Dropdowns/Items/DropdownItemLink.vue";
import EditIco from "@/UI/Icons/EditIco.vue";
import {h} from "vue";

interface IProps {
    url: string
}

const props = defineProps<IProps>()
const ico = h(
    EditIco, {
        size: 16
    }
)
</script>

<template>
    <DropdownItemLink
        className="item-edit"
        :ico="ico"
        text="Редактировать"
        :url="props.url"/>
</template>

<style scoped lang="scss">
:deep(.item-edit) {
    padding: 10px;
}
</style>