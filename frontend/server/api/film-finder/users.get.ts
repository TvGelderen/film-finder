import { fetchFromFilmFinder } from '~/utils/fetchFromFilmFinder'

export default defineEventHandler((event) => {
    return fetchFromFilmFinder(event, '/users');
});
