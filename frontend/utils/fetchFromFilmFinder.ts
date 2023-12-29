import type { H3Event, EventHandlerRequest } from 'h3'

export const fetchFromFilmFinder = (event: H3Event<EventHandlerRequest>, endpoint: string) => {
    const config = useRuntimeConfig();
    const accessToken = getCookie(event, "AccessToken");

    return $fetch(`${config.public.FILM_FINDER_API_HOST}${endpoint}`, {
        method: event.method,
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
}
