import { Movie, MovieResponse } from "~/types/movie-db/MovieTypes";
import { fetchFromMovieDB } from "~/utils/fetchFromMovieDB";

export default defineEventHandler(async (event) => {
    const genre = getRouterParam(event, 'genre');
    const { page, fetchSize, count } = getQuery(event);

    if (!page) return;

    const pageNumber = Number.parseInt(page.toString());

    if (pageNumber <= 0) return;

    if (!fetchSize || !count) {
        const response = await fetchFromMovieDB(`/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=${genre}`) as MovieResponse;
        return response.results;
    }

    const fetchSizeNumber = Number.parseInt(fetchSize.toString());
    const countNumber = Number.parseInt(count.toString());
    
    const startPage = Math.max(Math.ceil((pageNumber - 1) * countNumber / fetchSizeNumber), 1);
    const startIndex = (pageNumber - 1) * countNumber % fetchSizeNumber;
    const endPage = startPage + Math.ceil((countNumber - (fetchSizeNumber - startIndex)) / fetchSizeNumber); //Math.floor(pageNumber * countNumber / fetchSizeNumber) + 1;
    const endIndex = (startIndex + countNumber) % fetchSizeNumber == 0 ? fetchSizeNumber : (startIndex + countNumber) % fetchSizeNumber;

    let response: Movie[] | null = null;

    for (let i = startPage; i <= endPage; i++) {
        const apiResponse = await fetchFromMovieDB(`/discover/movie?include_adult=false&include_video=false&language=en-US&page=${i}&sort_by=popularity.desc&with_genres=${genre}`) as MovieResponse;

        if (response == null) {
            response = apiResponse.results.slice(startIndex)
        } else {
            if (i == endPage) {
                response.push(...apiResponse.results.slice(0, endIndex));
            } else {
                response.push(...apiResponse.results);
            }
        }
    }
    
    return response;
});