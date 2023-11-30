<template>
    <header>
        <nav>
            <div class="logo-container">
                <NuxtLink class="logo link" to="/">
                    <img src="/img/logo.png" />
                </NuxtLink>
            </div>
            <div class="nav-options">
                <div class="genres">
                    <div class="genre-option" @click="toggleShowGenreContainer">
                        Genre
                    </div>
                    <div class="genre-container" v-if="showGenreContainer">
                        <NuxtLink class="genre link" :to="`/genre/${genre.name}`" v-for="genre in genres">
                            {{  genre.name }}
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </nav> 
        <div class="search-container">
            <form @submit="handleSearch">
                <input class="search-input" placeholder="Search..." v-model="searchText" />
            </form>
        </div>
    </header>
    <main>
        <slot />
    </main>
</template>

<script setup lang="ts">
import type { GenreResponse, Genre } from '~/types/movie-db/GenreTypes';

useHead({
  title: 'FilmFinder',
});

let genres: Genre[];

const { data } = useFetch<GenreResponse>('/api/movies/genres');

if (data.value) {
    genres = data.value.genres;
}
 
const showGenreContainer = ref(false);
const searchText = ref("");

const toggleShowGenreContainer = () => {    
    showGenreContainer.value = !showGenreContainer.value;

    function handleOutsideClick(e: MouseEvent) {
        const target = e.target as HTMLElement;

        if (target.className == "genre-option" && showGenreContainer.value == true) {
            return;
        }

        if (target.className != "genre-container") {
            showGenreContainer.value = false;

            document.removeEventListener("click", handleOutsideClick);
        }
    }

    if (showGenreContainer.value) {
        document.addEventListener("click", handleOutsideClick);
    }
}

const handleSearch = async (event: Event) => {
    event.preventDefault();

    await navigateTo({
        path: `/search`,
        query: {
            searchText: `${searchText.value}`
        }
    });
}
</script>

<style scoped>
header {
    width: 100%;
    height: 4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--background-color-secondary);
}

nav {
    display: flex;
    align-items: center;
}

.search-container {
    margin-right: 1.25rem;
}

.search-input {
    background-color: var(--background-color);
    font-size: 1rem;
    padding: 0.75rem;
    border-radius: 50px;
    border: none;
}

.search-input:focus {
    outline: solid var(--theme-color-secondary) 2px;
}

main {
    background-color: var(--background-color);
    height: calc(100vh - 4rem);
    overflow-y: auto;
}

main::-webkit-scrollbar {
    width: 8px;
    background-color: #424242;
}

main::-webkit-scrollbar-thumb {
    background-color: var(--theme-color);
}

.link {
    text-decoration: none;
}

.logo {
    width: 14rem;
    margin-left: 1rem;
    display: flex;
    align-items: center;
}

.logo img {
    width: 100%;
}

.nav-options {
    height: 100%;
    margin-left: 4rem;
}

.genres {
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 0.75rem;
    cursor: pointer;
}

.genre-option {
    font-size: 1.5rem;
}

.genre-container {
    position: absolute;
    top: 110%;
    display: grid;
    grid-template-columns: repeat(2, 10em);
    padding: 0.5rem 0;
    border-radius: 8px;
    background-color: var(--background-color-tertiary);
    z-index: 1;
    cursor: default;
}

.genre {
    padding: 0.35rem 1rem;
    font-size: 1.1rem;
    transition: color 0.2s;
}

.genre:hover {
    color: var(--theme-color-secondary);
}
</style>