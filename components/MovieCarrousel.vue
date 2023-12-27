<template>
    <div class="movie-carrousel-wrapper">
        <div class="movie-carrousel-header" v-if="title">
            {{ title }}
        </div>
        <div :class="carrouselClass">
            <div class="movie-carrousel" ref="carrousel">
                <div v-if="loading">
                    <div class="movie-card-skeleton" />
                </div>
                <div class="movie-card-container" v-for="movie in movies">
                    <MovieCard :movie="movie" :saved="savedMovies.indexOf(movie?.id) !== -1" @movie-saved="handleMovieSaved" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Movie, MovieResponse } from '~/types/movie-db/MovieTypes';

const props = defineProps({
    title: {
        type: String
    },
    apiEndpoint: {
        type: String
    }
});

const config = useRuntimeConfig();
const savedMovies = useSavedMovies();

const loading = ref(true);
const showFadeLeft = ref(false);
const showFadeRight = ref(true);
const movies: Ref<Movie[]> = ref([]);
const carrousel: Ref<HTMLElement | null> = ref(null);

const carrouselClass = computed(() => `movie-carrousel-container ${showFadeLeft.value ? 'fade-left' : ''} ${showFadeRight.value ? 'fade-right' : ''}`);

const handleMovieSaved = async (id: number) => {
    const wasSaved = savedMovies.value.includes(id);

    try {
        await $fetch(`${config.public.FILM_FINDER_API_HOST}/movies`, {
            method: wasSaved ? 'DELETE' : 'POST',
            headers: useRequestHeaders(['cookies']),
            credentials: 'include',
            body: {
                movieId: id
            }
        });

        if (wasSaved) {
            const idx = savedMovies.value.indexOf(id);
            if (idx !== -1) {
                savedMovies.value.splice(idx, 1);
            }
        } else {
            savedMovies.value.push(id);
        }
    } catch (err: any) {
        console.error(err.data);
    }
}

onMounted(async () => {
    if (carrousel.value == null) {
        return;
    }

    let isDown = ref(false);
    let prevX = ref(0);

    carrousel.value.addEventListener("mousedown", (e) => mouseIsDown(e, isDown, prevX));
    carrousel.value.addEventListener("mouseup", () => mouseUp(isDown));
    carrousel.value.addEventListener("mouseleave", () => mouseLeave(isDown));
    carrousel.value.addEventListener("mousemove", (e) => mouseMove(e, isDown, prevX, carrousel.value));
    carrousel.value.addEventListener("scroll", () => updateFadeAfterScroll(carrousel.value));

    if (props.apiEndpoint) {
        const response = await $fetch<MovieResponse>(props.apiEndpoint);

        if (response.results) {
            movies.value = response.results;
            loading.value = false;
        }
    }

});

const mouseIsDown = (e: MouseEvent, isDown: Ref<Boolean>, prevX: Ref<number>) => {
    isDown.value = true;
    prevX.value = e.x;
}

const mouseUp = (isDown: Ref<Boolean>) => {
    isDown.value = false;
}

const mouseLeave = (isDown: Ref<Boolean>) => {
    isDown.value = false;
}

const mouseMove = (e: MouseEvent, isDown: Ref<Boolean>, prevX: Ref<number>, carrousel: HTMLElement | null) => {
    if (isDown.value && carrousel != null) {
        let scrollOffset = prevX.value - e.x;
        carrousel.scroll(carrousel.scrollLeft + scrollOffset, 0);
        prevX.value = e.x;

        updateFadeAfterScroll(carrousel);
    }
}

const updateFadeAfterScroll = (carrousel: HTMLElement | null) => {
    if (carrousel == null) return;

    if (!showFadeLeft.value && carrousel.scrollLeft > 0) {
        showFadeLeft.value = true;
    } else if (showFadeLeft.value && carrousel.scrollLeft == 0) {
        showFadeLeft.value = false;
    }

    if (showFadeRight.value && carrousel.scrollLeft == carrousel.scrollWidth - carrousel.clientWidth) {
        showFadeRight.value = false;
    } else if (!showFadeRight.value && carrousel.scrollLeft < carrousel.scrollWidth - carrousel.clientWidth) {
        showFadeRight.value = true;
    }
}
</script>

<style scoped>
.movie-carrousel-wrapper {
    position: relative;
    background-color: var(--background-color);
}

.movie-carrousel-wrapper.gradient-background {
    background-color: transparent;
    background-image: linear-gradient(to top, var(--background-color) 50%, transparent);
}

.movie-carrousel-header {
    margin: 1rem 0;
    margin-left: calc(var(--movie-carrousel-x-margin) / 2);
    font-size: 1.6rem;
}

.movie-carrousel-container {
    position: relative;
}

.movie-carrousel-container::before,
.movie-carrousel-container::after {
    content: '';
    height: 100%;
    width: calc(var(--movie-carrousel-x-margin) * 5);
    pointer-events: none;
    position: absolute;
    top: 0;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.1s;
}

.movie-carrousel-container::before {
    left: 0;
    background-image: linear-gradient(to right, var(--background-color) 5%, transparent);
}

.movie-carrousel-container::after {
    right: 0;
    background-image: linear-gradient(to left, var(--background-color) 5%, transparent);
}

.gradient-background .movie-carrousel-container::before {
    background-image: none;
}

.gradient-background .movie-carrousel-container::after {
    background-image: none;
}

.movie-carrousel-container.fade-left::before {
    opacity: 1;
}

.movie-carrousel-container.fade-right::after {
    opacity: 1;
}

.movie-carrousel {
    display: flex;
    gap: var(--movie-card-gap);
    overflow-x: auto;
    scrollbar-width: none;
}

.movie-carrousel::-webkit-scrollbar {
    display: none;
}

.movie-card-container:first-child {
    margin-left: calc(var(--movie-carrousel-x-margin) / 2);
}

.movie-card-container:last-child {
    margin-right: var(--movie-carrousel-x-margin);
}

.movie-card-skeleton {
    width: var(--movie-card-width);
    aspect-ratio: 300/450;
    border-radius: 12px;
    animation: pulse 1s infinite;
}

@keyframes pulse {
    0% {
        background-color: var(--background-color-tertiary);
    }
    50% {
        background-color: var(--background-color-secondary);
    }
    100% {
        background-color: var(--background-color-tertiary);
    }
}
</style>
