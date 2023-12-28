import { fetchFromMovieDB } from "~/utils/fetchFromMovieDB";

export default defineEventHandler(() => {
    return fetchFromMovieDB('/movie/popular?language=en-US&page=1');
});