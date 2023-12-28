import { fetchFromMovieDB } from "~/utils/fetchFromMovieDB";

export default defineEventHandler(() => {
    return fetchFromMovieDB('/trending/movie/week?language=en-US');
});