<template>
    <div class="movie-carrousel">
        <div v-for="movie in props.movies">
            <MovieCard :movie="movie" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { Movie } from '~/types/movie-db/Movie';

    const props = defineProps({
        movies: {
            type: Object as PropType<Movie[]>
        }
    })
</script>

<style scoped>
    .movie-carrousel {
        position: relative;
        display: flex;
        width: 95vw;
        margin: 0 auto;
        overflow-x: auto;
    }
</style>