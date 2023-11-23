export default defineEventHandler(() => {
    const config = useRuntimeConfig();

    return $fetch('https://api.themoviedb.org/3/trending/movie/week?language=en-US', {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${config.public.MOVIE_DB_ACCESS_TOKEN}`
        }
    });
})