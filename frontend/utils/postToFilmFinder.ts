import type { H3Event, EventHandlerRequest } from 'h3'

export const postToFilmFinder = async (event: H3Event<EventHandlerRequest>, endpoint: string) => {
    const config = useRuntimeConfig();
    const accessToken = getCookie(event, "AccessToken");
    const body = await readBody(event);

    return $fetch(`${config.public.FILM_FINDER_API_HOST}${endpoint}`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${accessToken}`
        },
        body: body
    });
}
