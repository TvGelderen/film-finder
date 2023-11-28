<template>
    <div class="page-container">
        <h2 class="header">{{ genre }}</h2>
        <div class="movie-grid">
            <div v-for="movie in movies">
                <MovieCard :movie="movie" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { GenreResponse } from '~/types/movie-db/GenreTypes';
import type { Movie, MovieResponse } from '~/types/movie-db/MovieTypes';

const route = useRoute();

const page = ref(1);
const genreId = ref(0);

const genre = computed(() => route.params.genre);
const url = computed(() => `/api/movies/genre/${genreId.value}?page=${page.value}`);

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

let movies: Movie[];

const { data } = await useFetch<MovieResponse>(url);

if (data.value) {
    movies = data.value.results;
}
</script>

<style scoped>
.page-container {
    width: min(90%, 1800px);
    margin: 2rem auto;
}

.header {
    font-size: 2rem;
    margin-bottom: 2rem;
    margin-left: 0.5rem;
}

.movie-grid {
    overflow: auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, var(--movie-card-width));
    gap: 0.5rem 1rem;
    justify-content: center;
}
</style>