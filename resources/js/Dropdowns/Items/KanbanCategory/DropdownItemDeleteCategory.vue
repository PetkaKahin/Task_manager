<script setup lang="ts">

import {h} from "vue";
import DeleteIco from "@/UI/Icons/DeleteIco.vue";
import type {ICategory} from "@/Types/models.ts";
import {useKanbanCategory} from "@/composables/ui/useKanbanCategory.ts";
import DropdownItemBase from "@/Dropdowns/Items/DropdownItemBase.vue";
import {useDeleteConfirm} from "@/composables/useDeleteConfirm.ts";
import DeleteModal from "@/UI/Modals/DeleteModal.vue";

interface IProps {
    category: ICategory
}

const props = defineProps<IProps>()
const ico = h(
    DeleteIco, {
        size: 16,
    }
)
const {isOpen: isDeleteModal, target: targetDelete, confirm: deleteConfirm} = useDeleteConfirm<ICategory>()

function deleteCategory() {
    if (targetDelete.value) useKanbanCategory().categoryDelete(targetDelete.value)
}
</script>

<template>
    <div>
        <DeleteModal v-model="isDeleteModal" :onDelete="deleteCategory"/>

        <DropdownItemBase
            @click="deleteConfirm(props.category)"
            className="item-edit"
            :ico="ico"
            text="Удалить"
        />
    </div>
</template>

<style scoped lang="scss">
@use '@scss/variables/colors';

.item-edit {
    padding: 10px;
}
</style>