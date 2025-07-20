// Tipos para OMDb API
export interface OMDbMovie {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
  Response: string;
  Error?: string;
}

export interface OMDbSearchResult {
  Search: Array<{
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
  }>;
  totalResults: string;
  Response: string;
  Error?: string;
}

// Tipos para TMDb API
export interface TMDbMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  video: boolean;
  original_language: string;
}

export interface TMDbSearchResult {
  page: number;
  results: TMDbMovie[];
  total_pages: number;
  total_results: number;
}

export interface TMDbMovieDetails extends TMDbMovie {
  budget: number;
  genres: Array<{
    id: number;
    name: string;
  }>;
  homepage: string;
  imdb_id: string;
  production_companies: Array<{
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }>;
  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;
  revenue: number;
  runtime: number;
  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
  status: string;
  tagline: string;
}

// Tipo unificado para respuestas
export interface MovieInfo {
  title: string;
  year: string;
  director?: string;
  actors?: string;
  plot: string;
  genre: string;
  rating: string;
  poster: string;
  imdbId?: string;
  runtime?: string;
  language?: string;
  country?: string;
  awards?: string;
  boxOffice?: string;
  source: "omdb" | "tmdb";
}

export interface SearchResult {
  title: string;
  year: string;
  id: string;
  type: string;
  poster: string;
  source: "omdb" | "tmdb";
}
