import { fetchFromMovieDB } from "~/utils/fetchFromMovieDB";

export default defineEventHandler(() => {
    return fetchFromMovieDB('/genre/movie/list?language=en');
});
