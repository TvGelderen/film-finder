<template>
    <Hero :movie="movies[movieId]" />
    <MovieCarrousel title="Trending" apiEndpoint="/api/movies/trending" class="gradient-background" />
    <MovieCarrousel title="Popular" apiEndpoint="/api/movies/popular" />
    <MovieCarrousel title="Top Rated" apiEndpoint="/api/movies/top-rated" />
</template>

<script setup lang="ts">
import type { Movie, MovieResponse } from '~/types/movie-db/MovieTypes';

let movies: Movie[];
let movieId = ref(0);

const { data } = await useFetch<MovieResponse>("/api/movies/trending");

if (data.value) {
    movies = data.value.results;
    movieId.value = Math.floor(Math.random() * movies.length);
}
</script>
