<template>
    <div class="movie-carrousel-header" v-if="title">
        {{ title }}
    </div>
    <div :class="carrouselClass">
        <div class="movie-carrousel" ref="carrousel">
            <div class="movie-card-container" v-for="movie in movies">
                <MovieCard :movie="movie" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Movie } from '~/types/movie-db/Movie';
import type { MovieResponse } from '../types/movie-db/MovieResponse';

const props = defineProps({
    title: {
        type: String
    },
    apiEndpoint: {
        type: String
    }
});

let movies: Movie[];

if (props.apiEndpoint){
    const { data } = await useFetch<MovieResponse>(props.apiEndpoint);
    
    if (data.value) {
        movies = data.value.results;
    }
}

const showFadeLeft = ref(false);
const showFadeRight = ref(true);
const carrousel: Ref<HTMLElement | null> = ref(null);

const carrouselClass = computed(() => `movie-carrousel-container ${showFadeLeft.value ? 'fade-left' : ''} ${showFadeRight.value ? 'fade-right' : ''}`);

onMounted(() => {
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
.movie-carrousel-header {
    margin-left: var(--movie-carrousel-x-margin);
    margin-bottom: 0.5rem;
    font-size: 1.6rem;
}

.movie-carrousel-container {
    position: relative;
    padding: 0 var(--movie-carrousel-x-margin);
}

.movie-carrousel-container::before,
.movie-carrousel-container::after {
    content: '';
    height: 100%;
    width: calc(var(--movie-carrousel-x-margin) * 2.5);
    position: absolute;
    top: 0;
    pointer-events: none;
    z-index: 1;
    opacity: 0;
}

.movie-carrousel-container::before {
    left: 0;
    background-image: linear-gradient(to right, var(--background-color) 40%, transparent);
}

.movie-carrousel-container::after {
    right: 0;
    background-image: linear-gradient(to left, var(--background-color) 40%, transparent);
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

/* .movie-card-container:first-child {
    margin-left: var(--movie-carrousel-x-margin);
}

.movie-card-container:last-child {
    margin-right: var(--movie-carrousel-x-margin);
} */
</style>