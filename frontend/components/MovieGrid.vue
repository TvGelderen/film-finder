<template>
    <div class="grid-container">
        <div class="header" v-if="title">
            {{ title }}
        </div>
        <div class="movie-grid" ref="gridRef">
            <div class="movie-grid-item" v-if="loading" v-for="_ in gridItemsPerRow * numberOfRows">
                <div class="skeleton" />
            </div>
            <div class="movie-grid-item" v-else v-for="movie in movies">
                <MovieCard :movie="movie" :saved="savedMovies.indexOf(movie?.id) !== -1" @movie-saved="handleMovieSaved" />
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
import type { Movie } from '~/types/movie-db/MovieTypes';

const props = defineProps({
    title: {
        type: String
    },
    baseEndpoint: {
        type: String
    },
    numberOfRows: {
        type: Number,
        default: 5
    }
})

watch(() => props.baseEndpoint, async (newVal) => {
    page.value = 1;
    baseEndpoint.value = newVal;
    await fetchPageData();
});

const savedMovies = useSavedMovies();

const loading = ref(true);
const baseEndpoint = ref(props.baseEndpoint);
const page = ref(1);
const gridRef = ref<HTMLElement | null>(null);
const gridItemsPerRow = ref(5);
const firstItemIndex = ref(0);
const movies = ref<Movie[] | null>(null);

const itemsOnScreen = computed(() => gridItemsPerRow.value * props.numberOfRows);

let fetchSize: number;

const { data } = await useFetch<Movie[]>(`${baseEndpoint.value}page=${page.value}`);

if (data.value) {
    movies.value = data.value;
    fetchSize = data.value.length;
}

const previousPage = async () => {
    page.value--;
    firstItemIndex.value -= itemsOnScreen.value;
    scrollToPageTop();
    await fetchPageData();
}

const nextPage = async () => {
    page.value++;
    firstItemIndex.value += itemsOnScreen.value;
    scrollToPageTop();
    await fetchPageData();
};

const scrollToPageTop = () => {
    const page = document.getElementsByTagName("main")[0];
    page.scrollTop = 0;
}

const fetchPageData = async () => {
    loading.value = true;
    if (gridRef.value != null) {
        const gridItem = document.querySelector(".movie-grid-item");

        if (gridItem == null) return;

        gridItemsPerRow.value = Math.floor(gridRef.value.clientWidth / gridItem.clientWidth);

        const response = await $fetch(`${baseEndpoint.value}page=${page.value}&fetchSize=${fetchSize}&count=${itemsOnScreen.value}&start=${firstItemIndex.value}`) as Movie[];

        if (response) {
            movies.value = response;
            loading.value = false;
        }
    }
}

const handleMovieSaved = async (id: number) => {
    const wasSaved = savedMovies.value.includes(id);

    try {
        await $fetch('/api/film-finder/movies', {
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

watch(() => savedMovies.value, async () => {
    await fetchPageData(); 
});

onMounted(async () => {
    await fetchPageData();

    window.addEventListener("resize", async () => {
        const gridItem = document.querySelector(".movie-grid-item");

        if (gridRef.value == null || gridItem == null) return;

        if (Math.floor(gridRef.value.clientWidth / gridItem.clientWidth) != gridItemsPerRow.value) {
            await fetchPageData();
        }
    });
});
</script>

<style scoped>
.header {
    font-size: 1.75rem;
    margin: 2rem;
}

.grid-container {
    width: min(92%, 1800px);
    margin: 2rem auto;
}

.movie-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, calc(var(--movie-card-width) + 1rem));
    gap: 0.5rem 0;
    justify-content: center;
}

.movie-grid-item {
    width: calc(var(--movie-card-width) + 1rem);
    display: flex;
    justify-content: center;
}

.movie-grid-item .skeleton {
    width: var(--movie-card-width);
    aspect-ratio: 300/450;
    border-radius: 12px;
    animation: pulse 1s infinite;
}

.pagination-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 18px;
    margin-top: 2rem;
}

.page-button {
    width: 8rem;
    padding: 0.75rem 0;
    background-color: var(--theme-color-secondary);
    cursor: pointer;
    text-align: center;
    user-select: none;
    border-radius: 8px;
}

.page-button.disabled {
    opacity: 0.5;
    pointer-events: none;
}
</style>
