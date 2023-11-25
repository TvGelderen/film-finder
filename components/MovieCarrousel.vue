<template>
    <div class="movie-carrousel-header" v-if="title">
        {{ title }}
    </div>
    <div class="movie-carrousel-container">
        <div class="movie-carrousel" :id="`movie-carrousel-${title}`">
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

</script>

<script lang="ts">
export default {
    methods: {
        mouseIsDown(e: MouseEvent, isDown: Ref<Boolean>, prevX: Ref<number>) {
            isDown.value = true;
            prevX.value = e.x;
        },
        mouseUp(isDown: Ref<Boolean>) {
            isDown.value = false;
        },
        mouseLeave(isDown: Ref<Boolean>) {
            isDown.value = false;
        },
        mouseMove(e: MouseEvent, isDown: Ref<Boolean>, prevX: Ref<number>, carrousel: HTMLElement) {
            if (isDown.value) {
                let scrollOffset = prevX.value - e.x;
                carrousel.scroll(carrousel.scrollLeft + scrollOffset, 0);
                prevX.value = e.x;
            }
        }
    },
    mounted () {
        let isDown = ref(false);
        let prevX = ref(0);
        const carrousel = document.getElementById(`movie-carrousel-${this.title}`);

        if (carrousel == null) {
            return;
        }

        carrousel.addEventListener("mousedown", (e) => this.mouseIsDown(e, isDown, prevX));
        carrousel.addEventListener("mouseup", (e) => this.mouseUp(isDown));
        carrousel.addEventListener("mouseleave", (e) => this.mouseLeave(isDown));
        carrousel.addEventListener("mousemove", (e) => this.mouseMove(e, isDown, prevX, carrousel));
    }
}
</script>

<style scoped>
.movie-carrousel-header {
    margin-left: calc(var(--carrousel-fade-width) / 1.5);
    margin-bottom: 0.5rem;
    font-size: 1.6rem;
}

.movie-carrousel-container {
    position: relative;
    width: 100%;
}

.movie-carrousel-container::before {
    content: '';
    height: 100%;
    width: var(--carrousel-fade-width);
    position: absolute;
    top: 0;
    left: 0;
    background-image: linear-gradient(to right, var(--background-color) 30%, transparent);
    z-index: 1;
    pointer-events: none;
}

.movie-carrousel-container::after {
    content: '';
    height: 100%;
    width: var(--carrousel-fade-width);
    position: absolute;
    top: 0;
    right: 0;
    background-image: linear-gradient(to left, var(--background-color) 30%, transparent);
    z-index: 1;
    pointer-events: none;
}

.movie-carrousel {
    display: flex;
    margin: 0 auto;
    overflow-x: auto;
    scrollbar-width: none;
}

.movie-carrousel::-webkit-scrollbar {
    display: none;
}

.movie-card-container:first-child {
    margin-left: calc(var(--carrousel-fade-width) / 2);
}

.movie-card-container:last-child {
    margin-right: calc(var(--carrousel-fade-width) / 2);
}
</style>