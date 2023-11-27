import { fetchFromMovieDB } from "~/utils/fetchFromMovieDB";

export default defineEventHandler((event) => {
    const genre = getRouterParam(event, 'genre');
    const { page } = getQuery(event);

    return fetchFromMovieDB(`/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=${genre}`);
});