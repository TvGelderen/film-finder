import { Movie, MovieResponse } from "~/types/movie-db/MovieTypes";
import { fetchFromMovieDB } from "~/utils/fetchFromMovieDB";

export default defineEventHandler(async (event) => {
    const { searchText, page, fetchSize, count, start } = getQuery(event);
    
    if (!page) return;

    const pageNumber = Number.parseInt(page.toString());

    if (pageNumber <= 0) return;

    if (!fetchSize || !count || !start) {
        const response = await fetchFromMovieDB(`/search/movie?query=${searchText}&include_adult=false&language=en-US&page=${page}`) as MovieResponse;
        return response.results;
    }

    const fetchSizeNumber = Number.parseInt(fetchSize.toString());
    const countNumber = Number.parseInt(count.toString());
    const startNumber = Number.parseInt(start?.toString());
    
    const startIndex = startNumber % fetchSizeNumber;
    const startPage = Math.max(Math.ceil(startNumber / fetchSizeNumber), 1);
    const endPage = startPage + Math.ceil((countNumber - (fetchSizeNumber - startIndex)) / fetchSizeNumber);
    const endIndex = (startIndex + countNumber) % fetchSizeNumber == 0 ? fetchSizeNumber : (startIndex + countNumber) % fetchSizeNumber;

    let response: Movie[] | null = null;

    for (let i = startPage; i <= endPage; i++) {
        const apiResponse = await fetchFromMovieDB(`/search/movie?query=${searchText}&include_adult=false&language=en-US&page=${page}`) as MovieResponse;

        if (response == null) {
            if (startPage == endPage) {
                response = apiResponse.results.slice(startIndex, endIndex);
            } else {                
                response = apiResponse.results.slice(startIndex);
            }
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