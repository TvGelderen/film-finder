export const useMovieDbFetch = (endpoint: string) => {
    const config = useRuntimeConfig();

    return $fetch(`${config.public.MOVIE_DB_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${config.public.MOVIE_DB_ACCESS_TOKEN}`
        }
    });
}