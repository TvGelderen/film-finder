export const useSavedMovies = () => useState<number[]>('savedMovies', () => [])
