<script setup lang="ts">
import {useSlots} from "vue";

defineOptions({ inheritAttrs: false })

interface Props {
    id: string,
    name: string,
    type?: string,
    error?: string,
    autocomplete?: string,
    label?: string,
    className?: string,
}

const props = withDefaults(defineProps<Props>(), {
    type: 'text',
})
const model = defineModel<string>()

const slots = useSlots()
</script>

<template>
    <div class="base-input" :class="className">
        <div
            class="base-input__field"
            :class="{ 'base-input__field--error': props.error }"
        >
            <input
                class="base-input__input"
                v-model="model"
                :type="props.type"
                :name="props.name"
                :id="props.id"
                :autocomplete="props.autocomplete"
                placeholder=" "
            >
            <label
                v-if="props.label"
                class="base-input__label"
                :for="props.id"
            >
                {{ props.label }}
            </label>
            <div
              v-if="slots.append"
              class="base-input__append"
            >
                <slot name="append" />
            </div>
        </div>
        <span
            v-if="props.error"
            class="base-input__error"
        >
            {{ props.error }}
        </span>
    </div>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

.base-input {
    display: flex;
    flex-direction: column;

    &__field {
        position: relative;
        display: flex;
        align-items: center;
        border: 1px solid colors.$border-default;
        border-radius: 5px;

        &:hover, &:focus-within {
            border-color: colors.$border-focus;
        }

        &--error {
            border-color: colors.$color-error;

            &:hover, &:focus-within {
                border-color: colors.$color-error;
            }
        }
    }

    &__input {
        flex: 1;
        min-width: 0;
        border: none;
        outline: none;
        padding: 7px 12px 5px 12px;
    }

    &__label {
        position: absolute;
        color: colors.$text-muted;
        cursor: text;
        top: 0;
        left: 0;
        padding: 7px 12px 5px 12px;
        font-size: 1rem;
        transition: 0.1s;
        pointer-events: none;
    }

    &__input:focus + &__label,
    &__input:not(:placeholder-shown) + &__label {
        background-color: colors.$bg-elevated;
        padding: 0 4px;
        top: -10px;
        left: 8px;
        font-size: 0.75rem;
    }

    &__append {
        display: flex;
        align-items: center;
        padding-right: 6px;
    }

    &__error {
        color: colors.$color-error;
        padding: 5px 10px;
    }
}
</style>
