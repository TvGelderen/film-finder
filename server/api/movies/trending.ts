import { useMovieDbFetch } from "~/composables/useMovieDbFetch";

export default defineEventHandler(() => {
    return useMovieDbFetch('/trending/movie/week?language=en-US');
});