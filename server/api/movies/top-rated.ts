import { useMovieDbFetch } from "~/composables/useMovieDbFetch";

export default defineEventHandler(() => {
    return useMovieDbFetch('/movie/top_rated?language=en-US&page=1');
});