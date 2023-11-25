export default defineEventHandler(() => {
    const config = useRuntimeConfig();

    return $fetch(`${config.public.MOVIE_DB_BASE_URL}/trending/movie/week?language=en-US`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${config.public.MOVIE_DB_ACCESS_TOKEN}`
        }
    });
});