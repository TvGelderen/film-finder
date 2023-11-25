<template>
    <div class="movie-card">
        <img 
            class="movie-poster"
            :src="posterUrl"
            :alt="movie?.title"
        />
        <div class="movie-info-container">
            <div class="movie-title">
                {{ props.movie?.title }}
            </div>
            <div class="like-container" @click="likeMovie">
                <Icon :name="likeIcon" /> 
            </div>
            <div class="movie-rating">
                <Icon name="tdesign:star-filled" /> 
                <span class="rating">{{ props.movie?.vote_average.toFixed(1) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Movie } from '~/types/movie-db/Movie';

const props = defineProps({
    movie: {
        type: Object as PropType<Movie>
    }
})

let liked = ref(false);

const config = useRuntimeConfig();
const posterUrl = computed(() => props.movie?.poster_path != null ?
    `${config.public.MOVIE_DB_IMG_URL_THUMBNAIL}${props.movie?.poster_path}` :
    'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png');
const likeIcon = computed(() => liked.value ? 'mdi:heart' : 'mdi:heart-outline');

const likeMovie = () => {
    liked.value = !liked.value;
}
</script>

<style scoped>
.movie-card {
    position: relative;
    width: var(--movie-card-width);
    aspect-ratio: 300/450;
    cursor: pointer;
    user-select: none;
    margin: var(--movie-card-margin);
}

.movie-card:hover .movie-info-container {
    opacity: 1;
}

img {
    max-width: 100%;
    height: 100%;
    font-style: italic;
    border-radius: 12px;
}

.movie-info-container {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    inset: 0;
    padding: 8px;
    border-radius: 12px;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.75);
    opacity: 0;
    transition: opacity .4s;
}

.movie-title {
    font-size: 1.1rem;
}

.like-container {
    position: absolute;
    top: 2px;
    right: 6px;
    font-size: 1.5rem;
}

.movie-rating {
    position: absolute;
    bottom: 5%;
    left: 5%;
    display: flex;
    justify-content: center;
    margin-top: 12px;
}

.movie-rating :deep(svg path) {
    color: gold;
}

.movie-rating .rating {
    margin-left: 4px;
    font-size: .9rem;
}
</style>