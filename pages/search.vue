<template>
    <MovieGrid :title="`Search results for: ${searchText}`" :base-endpoint="`/api/movies/search?searchText=${searchText}&`" />
</template>

<script setup lang="ts">
const route = useRoute();

const searchText = computed(() => route.query.searchText);
</script>