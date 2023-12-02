<template>
    <div class="grid-container">
        <div class="header" v-if="title">
            {{ title }}
        </div>
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

const page = ref(1);
const gridRef = ref<HTMLElement | null>(null);
const gridItemsPerRow = ref(0);
const firstItemIndex = ref(0);
const movies = ref<Movie[] | null>(null);

const itemsOnScreen = computed(() => gridItemsPerRow.value * props.numberOfRows);

let fetchSize: number;

const { data } = await useFetch<Movie[]>(`${props.baseEndpoint}page=${page.value}`);

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
    if (gridRef.value != null) {
        const gridItem = document.querySelector(".movie-grid-item");

        if (gridItem == null) return;

        gridItemsPerRow.value = Math.floor(gridRef.value.clientWidth / gridItem.clientWidth);

        const response = await $fetch(`${props.baseEndpoint}page=${page.value}&fetchSize=${fetchSize}&count=${itemsOnScreen.value}&start=${firstItemIndex.value}`) as Movie[];

        if (response) {
            movies.value = response;
        }
    }
}

onMounted(async () => {
    await fetchPageData();

    window.addEventListener("resize", async () => {
        const gridItem = document.querySelector(".movie-grid-item");

        if (gridRef.value == null || gridItem == null) return;

        if (Math.floor(gridRef.value.clientWidth / gridItem.clientWidth) != gridItemsPerRow.value) {
            await fetchPageData();
        }
    })
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