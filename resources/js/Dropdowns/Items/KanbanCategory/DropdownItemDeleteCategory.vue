<script setup lang="ts">

import {h} from "vue";
import DeleteIco from "@/UI/Icons/DeleteIco.vue";
import type {ICategory} from "@/Types/models.ts";
import {useKanbanCategory} from "@/composables/ui/useKanbanCategory.ts";
import DropdownItemBase from "@/Dropdowns/Items/DropdownItemBase.vue";

interface IProps {
    category: ICategory
}

const props = defineProps<IProps>()
const ico = h(
    DeleteIco, {
        size: 16,
    }
)

const categoryDelete = () => useKanbanCategory().categoryDelete(props.category)
</script>

<template>
    <DropdownItemBase
        @click="categoryDelete"
        className="item-edit"
        :ico="ico"
        text="Удалить"
    />
</template>

<style scoped lang="scss">
@use '@scss/variables/colors';

.item-edit {
    padding: 10px;
}
</style>