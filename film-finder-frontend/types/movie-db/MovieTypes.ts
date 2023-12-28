export type Movie = {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    genre_ids: number[];
    popularity: number;
    vote_average: number;
    vote_count: number;
}

export type MovieResponse = {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}