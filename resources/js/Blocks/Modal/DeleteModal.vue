<script setup lang="ts">
import BaseModal from "@/Blocks/Modal/BaseModal.vue";
import BaseButton from "@/UI/Buttons/BaseButton.vue";
import {useModal} from "@/composables/ui/useModal.ts";

const modal = useModal()

function deleteButton() {
    modal.close()
    modal.runActionClosing('delete.task')
}

function saveButton() {
    modal.close()
}
</script>

<template>
    <BaseModal>
        <div class="delete-modal">
            <header class="delete-modal__header header">
                <h3 class="header__text">Удалить?</h3>
            </header>
            <footer class="delete-modal__footer">
                <BaseButton text="Да" className="button" @click="deleteButton"/>
                <BaseButton text="Нет" className="button" @click="saveButton"/>
            </footer>
        </div>
    </BaseModal>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

.delete-modal {
    &__footer {
        display: flex;
        gap: 20px;
    }
}

.header {
    &__text {
        margin: 0 0 40px 0;
        text-align: center;
    }
}

.button {
    padding: 5px;
    width: 70px;
}
</style>
