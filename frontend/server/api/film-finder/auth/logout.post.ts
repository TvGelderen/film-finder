import { fetchFromFilmFinder } from "~/utils/fetchFromFilmFinder";

export default defineEventHandler((event) => {
    fetchFromFilmFinder(event, '/logout');
});
