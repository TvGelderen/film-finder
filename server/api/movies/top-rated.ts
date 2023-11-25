export default defineEventHandler(() => {
    const config = useRuntimeConfig();

    return $fetch(`${config.public.MOVIE_DB_BASE_URL}/movie/top_rated?language=en-US&page=1`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${config.public.MOVIE_DB_ACCESS_TOKEN}`
        }
    });
});