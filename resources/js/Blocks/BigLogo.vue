<script setup lang="ts">
interface IProps {
    url: string,
}

const props = withDefaults(defineProps<IProps>(), {
    url: "#",
})
</script>

<template>
    <a
        class="page-header__logo logo"
        :href="props.url"
    >
        <h2 class="logo__text">Менеджер задач</h2>
    </a>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

.logo {
    text-decoration: none;

    &:hover &__text {
        color: colors.$text-focus;
    }

    &__text {
        margin: 0;
        font-weight: 400;
    }
}
</style>
