<script setup lang="ts">
import BaseButton from "@/UI/Buttons/BaseButton.vue";
import Modal from "@/UI/Modals/Modal.vue";

interface IProps {
    onDelete: () => void
}

const props = defineProps<IProps>()
const isActive = defineModel<boolean>()

function deleteButton() {
    props.onDelete()
    isActive.value = false
}

function saveButton() {
    isActive.value = false
}
</script>

<template>
    <Modal v-model="isActive">
        <div class="delete-modal">
            <header class="delete-modal__header header">
                <h3 class="header__text">Удалить?</h3>
            </header>
            <footer class="delete-modal__footer">
                <BaseButton text="Да" className="button" @click="deleteButton"/>
                <BaseButton text="Нет" className="button" @click="saveButton"/>
            </footer>
        </div>
    </Modal>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

.delete-modal {
    background-color: colors.$bg-elevated;
    border: 1px solid colors.$border-default;
    border-radius: 5px;
    padding: 20px;

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
