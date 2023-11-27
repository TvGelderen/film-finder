import { fetchFromMovieDB } from "~/utils/fetchFromMovieDB";

export default defineEventHandler(() => {
    return fetchFromMovieDB('/movie/top_rated?language=en-US&page=1');
});