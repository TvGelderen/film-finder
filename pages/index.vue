<template>
    <MovieCarrousel :movies="data?.results" />
</template>

<script setup lang="ts">
    import type { MovieResponse } from '../types/movie-db/MovieResponse';

    const { data } = await useFetch<MovieResponse>('/api/movies/trending');
</script>

<style>
</style>