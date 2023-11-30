<template>
    <div>
        {{ searchText }}
    </div>
</template>

<script setup lang="ts">
const route = useRoute();

const searchText = computed(() => route.query.searchText);
</script>

<style scoped>
</style>