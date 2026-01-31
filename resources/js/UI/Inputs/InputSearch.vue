<script setup lang="ts">
import SearchIco from "@/UI/Icons/SearchIco.vue";
import {ref} from "vue";

interface Props {
    class?: string,
    placeholder?: string,
}

interface Emits {
    search: [value: string],
}

const searchField = ref<string>("");
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function search() {
    emit('search', searchField.value)
}
</script>

<template>
    <div :class="props.class" class="base-search">
        <input
            class="base-search__input"
            type="text"
            :placeholder="props.placeholder"
            id="search-input"
            name="search-input"
            v-model="searchField"
            @input="search"
            @keyup.enter="search"
        >
        <div class="base-search__vertical-line"></div>
        <SearchIco
            class="base-search__ico"
            :size="14"
            @click="search"
        />
    </div>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

.base-search {
    border: 1px solid colors.$border-default;
    background-color: colors.$bg-elevated;
    border-radius: 0.5rem;
    height: fit-content;
    min-height: 30px;
    display: flex;
    align-items: center;

    &:focus-within, &:hover {
        border-color: colors.$border-focus;
    }

    &__input {
        outline: none;
        background-color: colors.$bg-elevated;
        border: none;
        height: 100%;
        width: 100%;
        border-radius: 0.5rem;
        padding: 0.2rem 0.5rem;
        box-sizing: border-box;

        &::placeholder {
            color: colors.$text-muted;
        }
    }

    &__vertical-line {
        width: 1px;
        color: colors.$border-default;
    }

    &__ico {
        padding: 0.2rem 0.5rem;
        height: 16px;
        width: 16px;
        color: colors.$ico-muted;
        cursor: pointer;

        &:hover {
            color: colors.$ico-focus;
        }
    }
}
</style>
