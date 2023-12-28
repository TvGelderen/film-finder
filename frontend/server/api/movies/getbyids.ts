import { fetchFromMovieDB } from "~/utils/fetchFromMovieDB";
import type { Movie } from "~/types/movie-db/MovieTypes";

export default defineEventHandler(async (event) => {
    const { ids } = await readBody(event);

    const response: Movie[] = [];

    for (let i = 0; i < ids.length; i++) {
        const movie = await fetchFromMovieDB(`/movie/${ids[i]}?language=en-US`) as Movie;
        response.push(movie);
    }

    return response;
});
