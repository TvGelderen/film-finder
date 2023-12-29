import { deleteFromFilmFinder } from "~/utils/deleteFromFilmFinder";

export default defineEventHandler((event) => {
    return deleteFromFilmFinder(event, '/movies');
});
