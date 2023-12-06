<template>
    <div class="hero">
        <img
            class="hero-image"
            :src="posterUrl"
            :alt="movie?.title"
            loading="lazy"
        />
        <div class="hero-content">
            <h1>{{ movie?.title }}</h1>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Movie } from '~/types/movie-db/MovieTypes';

const props = defineProps({
    movie: {
        type: Object as PropType<Movie>
    }
})

const config = useRuntimeConfig();
const posterUrl = computed(() => props.movie?.poster_path != null ?
    `${config.public.MOVIE_DB_IMG_URL_BACKDROP}${props.movie?.backdrop_path}` :
    'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png');
</script>

<style scoped>
.hero {
    width: 100%;
    max-height: 60vh;
    position: relative;
}

.hero-image {
    width: 100%;
}

.hero-content {
    position: absolute;
    bottom: 0;
}
</style>
