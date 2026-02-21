<script setup lang="ts">

import DropdownItemBase from "@/Dropdowns/Items/DropdownItemBase.vue";
import type {Component} from "vue";
import {Link} from "@inertiajs/vue3";

interface IProps {
    ico: Component
    text: string
    url: string
    className?: string
}

const props = defineProps<IProps>()
</script>

<template>
    <Link :href="props.url" class="link">
        <DropdownItemBase :className="props.className" :ico="props.ico" :text="props.text"/>
    </Link>
</template>

<style scoped lang="scss">
.link {
    text-decoration: none;
}
</style>