import { fetchFromMovieDB } from "~/utils/fetchFromMovieDB";

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');

    return fetchFromMovieDB(`/movie/${id}?language=en-US`);
});
