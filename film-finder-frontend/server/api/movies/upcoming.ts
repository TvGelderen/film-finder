import { fetchFromMovieDB } from "~/utils/fetchFromMovieDB";

export default defineEventHandler(() => {
    return fetchFromMovieDB('/movie/upcoming?language=en-US');
});
