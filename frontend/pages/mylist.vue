<template>
    <div class="saved-list-container">
        <div class="saved-movie-container" v-for="movie in movies">
            <img 
                class="movie-poster" 
                :src="movie.poster_path != null ?
                    `${config.public.MOVIE_DB_IMG_URL_BACKDROP}${movie?.backdrop_path}` :
                    'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png'"
                :alt="movie.title" 
            />
            <div class="overlay">
                <Icon name="mdi:window-close" class="close-icon" size="1.75rem" @click="() => removeMovie(movie.id)" />
                <p>{{ movie.title }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Movie } from '~/types/movie-db/MovieTypes';

const user = useAuth();
const savedMovies = useSavedMovies();
const movies: Ref<Movie[]> = ref([]);

const config = useRuntimeConfig();

const updateMovies = async (arr: number[]) => {
    try {
        const response = await $fetch(`/api/movies/getbyids`, {
            method: 'POST',
            body: {
                ids: arr
            }
        }) as Movie[];

        movies.value = response as Movie[];
    } catch (err: any) {
        console.error(err);
    }
}

const removeMovie = async (id: number) => {
    try {
        await $fetch(`${config.public.FILM_FINDER_API_HOST}/movies`, {
            method: 'DELETE',
            headers: useRequestHeaders(['cookies']),
            credentials: 'include',
            body: {
                movieId: id
            }
        });
        
        const idx = savedMovies.value.indexOf(id);
        if (idx !== -1) {
            savedMovies.value.splice(idx, 1);
        }

        movies.value = movies.value.filter(movie => movie.id !== id);
    } catch (err: any) {
        console.error(err.data);
    }
}

watch(() => savedMovies.value, async (newVal) => {
    updateMovies(newVal);
});

onMounted(async () => {
    if (user == null) {
        await navigateTo('/login');
    }

    await updateMovies(savedMovies.value);
});
</script>

<style scoped>
.saved-list-container {
    display: grid;
    gap: 12px;
}

.saved-movie-container {
    position: relative;
    width: min(90%, 650px);
    aspect-ratio: 16/9;
    margin: 0 auto;
    border-radius: 12px;
    animation: pulse 1s infinite;
}

.movie-poster {
    width: 100%;
    border-radius: 12px;
    margin-bottom: -5px;
}

.saved-movie-container .overlay {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    inset: 0 0 0 0; 
    padding: 0.5rem;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.75);
    border-radius: 12px;
    opacity: 0;
    transition: opacity 0.4s;
}

.overlay p {
    font-size: 1.5rem;
    font-weight: 600;
}

.saved-movie-container:hover .overlay {
    opacity: 1;
}

.overlay .close-icon {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    cursor: pointer;
}
</style>
