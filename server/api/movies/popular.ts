import { useMovieDbFetch } from "~/composables/useMovieDbFetch";

export default defineEventHandler(() => {
    return useMovieDbFetch('/movie/popular?language=en-US&page=1');
});