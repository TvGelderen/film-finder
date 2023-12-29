export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const body = await readBody(event);

    try {
        const response = await $fetch.raw(`${config.public.FILM_FINDER_API_HOST}/auth/login`, {
            method: 'POST',
            body: body
        });

        const cookies = response.headers.getSetCookie()

        for (const cookie of cookies) {
            appendHeader(event, 'set-cookie', cookie)
        }

        return response._data;
    } catch (err: any) {
        if (err.data.error) {
            throw Error(err.data.error);
        }
        throw Error("Something went wrong while executing the request.")
    }
});
