<template>
    <div class="movie-card">
        <div class="movie-poster-container">
            <img 
                class="movie-poster"
                :src="posterUrl"
                :alt="movie?.original_title"
            />
        </div>
        <div class="movie-info-container">
            {{ props.movie?.original_title }}
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { PropType } from 'vue';
    import type { Movie } from '~/types/movie-db/Movie';

    const props = defineProps({
        movie: {
            type: Object as PropType<Movie>
        }
    })

    const config = useRuntimeConfig();
    const posterUrl = computed(() => props.movie?.poster_path != null ?
      `${config.public.MOVIE_DB_IMG_URL_THUMBNAIL}${props.movie?.poster_path}` :
      'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png')
</script>

<style scoped>
    .movie-card {
        position: relative;
        width: 200px;
        cursor: pointer;
        user-select: none;
        margin: 4px 8px;
    }

    .movie-card:hover .movie-info-container {
        display: flex;
    }

    .movie-poster-container img {
        width: 100%;
        font-style: italic;
        border-radius: 12px;
    }

    .movie-info-container {
        position: absolute;
        inset: 0;
        display: none;
        justify-content: center;
        align-items: center;
        padding: 8px;
        border-radius: 12px;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.65);
    }
</style>