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
import type { GenreResponse, Genre } from '~/types/movie-db/GenreTypes';
import type { Movie, MovieResponse } from '~/types/movie-db/MovieTypes';

const route = useRoute();

const page = ref(1);
const genreId = ref(0);

const genre = computed(() => route.params.genre);
const url = computed(() => `/api/movies/genre/${genreId.value}?page=${page.value}`);

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
    padding: 1.25rem 4rem;
}

.header {
    font-size: 2rem;
    margin-bottom: 2rem;
}

.movie-grid {
    overflow: auto;
    display: grid;
    grid-template-columns: repeat(6, var(--movie-card-width));
    gap: 8px 16px;
    justify-content: center;
}
</style>