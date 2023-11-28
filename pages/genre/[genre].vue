<template>
    <div class="page-container">
        <h2 class="header">{{ genre }}</h2>
        <div class="movie-grid" ref="gridRef">
            <div class="movie-grid-item" v-for="movie in movies">
                <MovieCard :movie="movie" />
            </div>
        </div>
        <div class="pagination-container">
            <div :class="`page-button ${page == 1 ? 'disabled' : ''}`" @click="previousPage">
                Previous page
            </div>
            <div class="current-page">
                Page: {{ page }}
            </div>
            <div class="page-button" @click="nextPage">
                Next page
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
const gridRef = ref<HTMLElement | null>(null);
const movies = ref<Movie[] | null>(null);

const genre = computed(() => route.params.genre);
const url = computed(() => `/api/movies/genre/${genreId.value}?page=${page.value}`);

let fetchSize: number;

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

const { data } = await useFetch<Movie[]>(url);

if (data.value) {
    movies.value = data.value;
    fetchSize = data.value.length;
}

const previousPage = async () => {
    page.value--;
    scrollToPageTop();
    await fetchPageData();
}

const nextPage = async () => {
    page.value++;
    scrollToPageTop();
    await fetchPageData();
};

const scrollToPageTop = () => {
    const page = document.getElementsByTagName("main")[0];
    page.scrollTop = 0;
}

const fetchPageData = async () => {
    if (gridRef.value != null) {
        const movieCard = document.querySelector(".movie-grid-item");

        if (movieCard == null) return;

        const itemsPerRow = Math.floor(gridRef.value.clientWidth / movieCard?.clientWidth);
        const numberOfRows = 5;

        const response = await $fetch(`/api/movies/genre/${genreId.value}?page=${page.value}&fetchSize=${fetchSize}&count=${itemsPerRow * numberOfRows}`) as Movie[];

        if (response) {
            console.log(response)
            movies.value = response;
        }
    }
}

onMounted(async () => {
    await fetchPageData();
});
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
    display: grid;
    grid-template-columns: repeat(auto-fill, calc(var(--movie-card-width) + 1rem));
    gap: 0.5rem 0;
    justify-content: center;
    overflow: auto;
}

.movie-grid-item {
    padding: 0.5rem 1rem;
}

.pagination-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
}

.page-button {
    width: 8rem;
    padding: 1rem 0;
    background-color: var(--theme-color-secondary);
    cursor: pointer;
    text-align: center;
    user-select: none;
}

.page-button.disabled {
    opacity: 0.5;
    pointer-events: none;
}
</style>