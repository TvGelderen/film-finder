import { postToFilmFinder } from "~/utils/postToFilmFinder";

export default defineEventHandler((event) => {
    return postToFilmFinder(event, '/movies');
});
