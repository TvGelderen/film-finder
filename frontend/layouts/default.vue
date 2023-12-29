<template>
    <header :data-open="navOpen">
        <div class="header-bar">
            <nav>
                <div class="logo-container">
                    <div class="logo link" @click="() => goTo('/')">
                        <img src="/img/logo.png" />
                    </div>
                </div>
                <div class="nav-options">
                    <div class="genres">
                        <div id="genre-option" class="nav-option" @click="toggleShowGenreContainer">
                            Genre
                        </div>
                        <div :class="`genre-container ${showGenreContainer ? '' : 'hidden'}`">
                            <div class="genre link" @click="() => goTo(`/genre/${genre.name}`)" v-for="genre in genres">
                                {{ genre.name }}
                            </div>
                        </div>
                    </div>
                    <div class="nav-option">
                        <div class="link" @click="() => goTo('/mylist')">My List</div>
                    </div>
                </div>
                <Icon class="nav-icon" :name="navOpen ? 'mdi:window-close' : 'mdi:menu'" size="32" @click="toggleNav" />
            </nav>
            <div class="header-right">
                <div class="search-container">
                    <form @submit="handleSearch">
                        <input class="search-input" placeholder="Search..." v-model="searchText" />
                    </form>
                </div>
                <div class="user-container">
                    <Icon name="mdi:account" size="30" @click="toggleShowUserDropdown" />
                    <div class="user-dropdown" v-if="showUserDropdown">
                        <div v-if="user">
                            <p>Hello, {{ user.name }}</p>
                            <button @click="logout">Logout</button>
                        </div>
                        <div v-else>
                            <button @click="goToLogin">Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <main>
        <div class="page-container">
            <slot />
        </div>
    </main>
</template>

<script setup lang="ts">
import type { GenreResponse, Genre } from '~/types/movie-db/GenreTypes';
import type { UserInfoResponse } from '~/types/auth/AuthTypes';

const user = useAuth();
const savedMovies = useSavedMovies();

useHead({
    title: 'FilmFinder',
});

let genres: Genre[];

const { data } = useFetch<GenreResponse>('/api/movies/genres');

if (data.value) {
    genres = data.value.genres;
}

const showGenreContainer = ref(false);
const showUserDropdown = ref(false);
const searchText = ref("");
const navOpen = ref(false);

const toggleShowGenreContainer = () => {
    showGenreContainer.value = !showGenreContainer.value;
    function handleOutsideClick(e: MouseEvent) {
        const target = e.target as HTMLElement;
        if (target.id == "genre-option" && showGenreContainer.value == true) {
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

const toggleShowUserDropdown = () => {
    showUserDropdown.value = !showUserDropdown.value;
    function handleOutsideClick(e: MouseEvent) {
        const target = e.target as HTMLElement;
        if ((target.className == "user-container" ||
            target.parentElement?.className == "user-container" ||
            target.parentElement?.parentElement?.className == "user-container") && showUserDropdown.value == true) {
            return;
        }
        if (target.className != "user-dropdown") {
            showUserDropdown.value = false;
            document.removeEventListener("click", handleOutsideClick);
        }
    }
    if (showUserDropdown.value) {
        document.addEventListener("click", handleOutsideClick);
    }
}

const toggleNav = () => {
    navOpen.value = !navOpen.value;
}

const goTo = async (url: string) => {
    navOpen.value = false;
    
    await navigateTo(url);
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

const goToLogin = async () => {
    showUserDropdown.value = false;
    await navigateTo('/login');
}

const logout = async () => {
    try {
        await $fetch('/api/film-finder/auth/logout', {
            method: 'POST',
            headers: useRequestHeaders(['cookies']),
            credentials: 'include'
        });

        user.value = null;
    } catch (err: any) {
        console.log(err.data);
    }
}

onMounted(async () => {
    try {
        const userData = await $fetch('/api/film-finder/users', {
            method: 'GET',
            headers: useRequestHeaders(['cookies']),
            credentials: 'include'
        }) as UserInfoResponse;

        user.value = {
            name: userData.name,
            email: userData.email
        }

        if (savedMovies.value.length == 0) {
            const movieData = await $fetch('/api/film-finder/movies', {
                method: 'GET',
                headers: useRequestHeaders(['cookies']),
                credentials: 'include'
            }) as number[];

            savedMovies.value = movieData;
        }
    } catch (err: any) {
        console.log(err.data);
    }
});
</script>

<style scoped>
header {
    width: 100%;
    height: 4rem;
    background-color: var(--background-color-secondary);
}

.header-bar {
    width: min(100%, 1640px);
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
}

nav {
    display: flex;
    align-items: center;
}

.header-right {
    display: flex;
    align-items: center;
    margin-right: 1.25rem;
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

.user-container {
    position: relative;
}

.user-container svg {
    cursor: pointer;
}

.user-dropdown {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 2.5rem;
    right: 0;
    width: 150px;
    height: 85px;
    border-radius: 8px;
    background-color: var(--background-color-tertiary);
    z-index: 2;
}

.user-dropdown p {
    margin-bottom: 0.75rem;
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
    color: currentColor;
    cursor: pointer;
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
    display: flex;
    margin-left: 2rem;
}

.nav-option {
    font-size: 1.25rem;
    margin-left: 2rem;
}

.genres {
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.genre-container {
    position: absolute;
    top: 110%;
    left: 2rem;
    display: grid;
    grid-template-columns: repeat(2, 10em);
    padding: 0.5rem 0;
    border-radius: 8px;
    background-color: var(--background-color-tertiary);
    z-index: 1;
    cursor: default;
}

.genre-container.hidden {
    display: none;
}

.genre {
    padding: 0.35rem 1rem;
    font-size: 1.1rem;
    transition: color 0.2s;
}

.genre:hover {
    color: var(--theme-color-secondary);
}

button {
    padding: 0.5rem 1.5rem;
    font-size: 1rem;
    background-color: var(--background-color-secondary);
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: var(--theme-color);
}

.nav-icon {
    display: none;
}

@media screen and (max-width: 750px) {
    nav {
        width: 100%;
        justify-content: space-between;
    }

    .nav-icon {
        display: block;
        margin-right: 1rem;
    }

    .nav-options,
    .header-right {
        display: none;
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .nav-option {
        margin-left: 1rem;
        margin-top: 1.5rem;
        font-size: 1.75rem;
    }

    .genres {
        display: block;
    }

    .genre-container {
        position: relative;
        display: flex;
        flex-direction: column;
        background-color: transparent;
    }

    .genre-container.hidden {
        display: flex;
    }

    .genre-container .genre {
        font-size: 1.25rem;
    }

    header[data-open="true"] nav .nav-options {
        display: block;
        position: absolute;
        top: 4rem;
        left: 0;
        right: 0;
        height: calc(100% - 4rem);
        margin-left: 0;
        background-color: var(--background-color-secondary);
        z-index: 2;
    }
}
</style>
