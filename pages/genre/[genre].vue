<template>
    <div class="page-container">
        <MovieGrid :title="genre.toString()" :base-endpoint="`/api/movies/genre/${genreId}?`" />
    </div>
</template>

<script setup lang="ts">
import type { GenreResponse } from '~/types/movie-db/GenreTypes';

const route = useRoute();
const genreId = ref(0);
const genre = computed(() => route.params.genre);

useHead({
  title: `FilmFinder - ${genre.value}`,
});

if (genre) {
    const { data } = await useFetch<GenreResponse>('/api/movies/genres');

    if (data.value) {
        const result = data.value.genres.find(g => g.name == genre.value);

        if (result) {
            genreId.value = result.id;
        }
    }
}
</script>

<style scoped>
.page-container {
    margin: 2rem auto;
}

.header {
    font-size: 2rem;
    margin-bottom: 2rem;
    margin-left: 0.5rem;
}
</style>