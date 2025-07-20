import fetch from "node-fetch";
import {
  OMDbMovie,
  OMDbSearchResult,
  TMDbMovie,
  TMDbSearchResult,
  TMDbMovieDetails,
  MovieInfo,
  SearchResult,
} from "./types.js";

const OMDB_API_KEY = process.env.OMDB_API_KEY || "demo"; // Usar 'demo' para testing limitado
const TMDB_API_KEY = process.env.TMDB_API_KEY || "";
const OMDB_BASE_URL = "http://www.omdbapi.com/";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

/**
 * Buscar películas usando OMDb API
 */
export async function searchMoviesOMDb(
  title: string,
  year?: string
): Promise<SearchResult[]> {
  try {
    const params = new URLSearchParams({
      apikey: OMDB_API_KEY,
      s: title,
      type: "movie",
    });

    if (year) {
      params.append("y", year);
    }

    const response = await fetch(`${OMDB_BASE_URL}?${params}`);
    const data = (await response.json()) as OMDbSearchResult;

    if (data.Response === "False") {
      return [];
    }

    return data.Search.map((movie) => ({
      title: movie.Title,
      year: movie.Year,
      id: movie.imdbID,
      type: movie.Type,
      poster: movie.Poster,
      source: "omdb" as const,
    }));
  } catch (error) {
    console.error("Error searching movies in OMDb:", error);
    return [];
  }
}

/**
 * Obtener detalles de película usando OMDb API
 */
export async function getMovieDetailsOMDb(
  imdbId: string
): Promise<MovieInfo | null> {
  try {
    const params = new URLSearchParams({
      apikey: OMDB_API_KEY,
      i: imdbId,
      plot: "full",
    });

    const response = await fetch(`${OMDB_BASE_URL}?${params}`);
    const data = (await response.json()) as OMDbMovie;

    if (data.Response === "False") {
      return null;
    }

    return {
      title: data.Title,
      year: data.Year,
      director: data.Director,
      actors: data.Actors,
      plot: data.Plot,
      genre: data.Genre,
      rating: data.imdbRating,
      poster: data.Poster,
      imdbId: data.imdbID,
      runtime: data.Runtime,
      language: data.Language,
      country: data.Country,
      awards: data.Awards,
      boxOffice: data.BoxOffice,
      source: "omdb",
    };
  } catch (error) {
    console.error("Error getting movie details from OMDb:", error);
    return null;
  }
}

/**
 * Buscar películas usando TMDb API
 */
export async function searchMoviesTMDb(
  title: string,
  year?: string
): Promise<SearchResult[]> {
  if (!TMDB_API_KEY) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      query: title,
      language: "en-US",
    });

    if (year) {
      params.append("year", year);
    }

    const response = await fetch(`${TMDB_BASE_URL}/search/movie?${params}`);
    const data = (await response.json()) as TMDbSearchResult;

    return data.results.slice(0, 10).map((movie) => ({
      title: movie.title,
      year: movie.release_date ? movie.release_date.split("-")[0] : "",
      id: movie.id.toString(),
      type: "movie",
      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "N/A",
      source: "tmdb" as const,
    }));
  } catch (error) {
    console.error("Error searching movies in TMDb:", error);
    return [];
  }
}

/**
 * Obtener detalles de película usando TMDb API
 */
export async function getMovieDetailsTMDb(
  tmdbId: string
): Promise<MovieInfo | null> {
  if (!TMDB_API_KEY) {
    return null;
  }

  try {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      language: "en-US",
      append_to_response: "credits",
    });

    const response = await fetch(`${TMDB_BASE_URL}/movie/${tmdbId}?${params}`);
    const data = (await response.json()) as TMDbMovieDetails & {
      credits?: any;
    };

    const director =
      data.credits?.crew?.find((person: any) => person.job === "Director")
        ?.name || "N/A";
    const actors =
      data.credits?.cast
        ?.slice(0, 5)
        .map((actor: any) => actor.name)
        .join(", ") || "N/A";

    return {
      title: data.title,
      year: data.release_date ? data.release_date.split("-")[0] : "",
      director: director,
      actors: actors,
      plot: data.overview,
      genre: data.genres.map((g) => g.name).join(", "),
      rating: data.vote_average.toString(),
      poster: data.poster_path
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : "N/A",
      imdbId: data.imdb_id,
      runtime: data.runtime ? `${data.runtime} min` : "N/A",
      language: data.original_language,
      country: data.production_countries.map((c) => c.name).join(", "),
      awards: "N/A", // TMDb no proporciona premios directamente
      boxOffice: data.revenue ? `$${data.revenue.toLocaleString()}` : "N/A",
      source: "tmdb",
    };
  } catch (error) {
    console.error("Error getting movie details from TMDb:", error);
    return null;
  }
}

/**
 * Buscar películas en ambas APIs y combinar resultados
 */
export async function searchMovies(
  title: string,
  year?: string
): Promise<SearchResult[]> {
  const [omdbResults, tmdbResults] = await Promise.all([
    searchMoviesOMDb(title, year),
    searchMoviesTMDb(title, year),
  ]);

  // Combinar resultados y eliminar duplicados por título
  const allResults = [...omdbResults, ...tmdbResults];
  const uniqueResults = allResults.filter(
    (movie, index, self) =>
      index ===
      self.findIndex((m) => m.title.toLowerCase() === movie.title.toLowerCase())
  );

  return uniqueResults.slice(0, 20); // Limitar a 20 resultados
}

/**
 * Obtener detalles de película de cualquier API
 */
export async function getMovieDetails(
  id: string,
  source: "omdb" | "tmdb" = "omdb"
): Promise<MovieInfo | null> {
  if (source === "omdb") {
    return await getMovieDetailsOMDb(id);
  } else {
    return await getMovieDetailsTMDb(id);
  }
}

/**
 * Obtener recomendaciones de películas por género usando TMDb
 */
export async function getMovieRecommendations(
  genre?: string
): Promise<SearchResult[]> {
  if (!TMDB_API_KEY) {
    return [];
  }

  try {
    let endpoint = `${TMDB_BASE_URL}/movie/popular`;
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      language: "en-US",
      page: "1",
    });

    if (genre) {
      // Basic genre mapping
      const genreMap: { [key: string]: string } = {
        action: "28",
        adventure: "12",
        animation: "16",
        comedy: "35",
        crime: "80",
        documentary: "99",
        drama: "18",
        family: "10751",
        fantasy: "14",
        history: "36",
        horror: "27",
        music: "10402",
        mystery: "9648",
        romance: "10749",
        "science fiction": "878",
        "sci-fi": "878",
        thriller: "53",
        war: "10752",
        western: "37",
      };

      const genreId = genreMap[genre.toLowerCase()];
      if (genreId) {
        endpoint = `${TMDB_BASE_URL}/discover/movie`;
        params.append("with_genres", genreId);
      }
    }

    const response = await fetch(`${endpoint}?${params}`);
    const data = (await response.json()) as TMDbSearchResult;

    return data.results.slice(0, 10).map((movie) => ({
      title: movie.title,
      year: movie.release_date ? movie.release_date.split("-")[0] : "",
      id: movie.id.toString(),
      type: "movie",
      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "N/A",
      source: "tmdb" as const,
    }));
  } catch (error) {
    console.error("Error getting movie recommendations:", error);
    return [];
  }
}

/**
 * Buscar películas populares/trending
 */
export async function getTrendingMovies(): Promise<SearchResult[]> {
  if (!TMDB_API_KEY) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      language: "en-US",
    });

    const response = await fetch(
      `${TMDB_BASE_URL}/trending/movie/week?${params}`
    );
    const data = (await response.json()) as TMDbSearchResult;

    return data.results.slice(0, 15).map((movie) => ({
      title: movie.title,
      year: movie.release_date ? movie.release_date.split("-")[0] : "",
      id: movie.id.toString(),
      type: "movie",
      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "N/A",
      source: "tmdb" as const,
    }));
  } catch (error) {
    console.error("Error getting trending movies:", error);
    return [];
  }
}
