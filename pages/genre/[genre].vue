<template>
    <div class="page-container">
        <h2 class="header">{{ genre }}</h2>
        <!-- <div class="movie-grid" ref="gridRef">
            <div class="movie-grid-item" v-for="movie in movies">
                <MovieCard :movie="movie" />
            </div>
        </div>
        <div class="pagination-container">
            <div :class="`page-button ${page == 1 ? 'disabled' : ''}`" @click="previousPage">
                Previous page
            </div>
            <div class="current-page">
                Page: {{ page }}
            </div>
            <div class="page-button" @click="nextPage">
                Next page
            </div>
        </div> -->
        <MovieGrid :base-endpoint="`/api/movies/genre/${genreId}`" />
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
    width: min(93%, 1800px);
    margin: 2rem auto;
}

.header {
    font-size: 2rem;
    margin-bottom: 2rem;
    margin-left: 0.5rem;
}
</style>