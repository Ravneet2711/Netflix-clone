import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Helper function for input validation
const validatePage = (page) => {
  const parsedPage = parseInt(page, 10);
  return !isNaN(parsedPage) && parsedPage > 0 ? parsedPage : 1;
};

const validateTimeWindow = (timeWindow) => {
  return ["week", "day"].includes(timeWindow) ? timeWindow : "week";
};

const validateId = (id) => {
  const parsedId = parseInt(id, 10);
  return !isNaN(parsedId) && parsedId > 0 ? parsedId : null;
};

const validateKeyword = (keyword) => {
  return typeof keyword === 'string' ? keyword : '';
};


export const get = async (url, config = {}) => {
  try {
    const response = await axiosInstance.get(url, config);
    return { data: response?.data };
  } catch (error) {
    const status = error?.response?.status;
    const details = error?.response.data;
    toast.error(`Error ${status}:Something went wrong!! Please try again.`, {
      id: "toast",
    });
    return {
      error: {
        message: `Failed to get the data from ${url}`,
        status,
        details,
        name: "TMDB_API_ERROR",
      },
    };
  }
};

export const tmdbApi = {
  fetchPopularMovies: (page = 1) => {
    const validatedPage = validatePage(page);
    return get(`/movie/popular`, { params: { page: validatedPage } });
  },

  fetchTrendingMovies: (timeWindow = "week") => {
    const validatedTimeWindow = validateTimeWindow(timeWindow);
    return get(`/trending/movie/${validatedTimeWindow}`);
  },

  fetchTopRatedMovies: (page = 1) => {
    const validatedPage = validatePage(page);
    return get(`/movie/top_rated`, { params: { page: validatedPage } });
  },

  getGenres: () => get(`/genre/movie/list`),

  getMoviesByGenre: (genreId, page = 1) => {
    const validatedGenreId = validateId(genreId);
    const validatedPage = validatePage(page);
    if (!validatedGenreId) {
      console.error("Invalid genreId provided to getMoviesByGenre");
      return { error: { message: "Invalid genre ID", name: "VALIDATION_ERROR" } };
    }
    return get(`/discover/movie`, { params: { with_genres: validatedGenreId, page: validatedPage } });
  },

  getMovieTrailer: (movieId) => {
    const validatedMovieId = validateId(movieId);
    if (!validatedMovieId) {
      console.error("Invalid movieId provided to getMovieTrailer");
      return { error: { message: "Invalid movie ID", name: "VALIDATION_ERROR" } };
    }
    return get(`/movie/${validatedMovieId}/videos`);
  },

  getMovieDetails: (movieId) => {
    const validatedMovieId = validateId(movieId);
    if (!validatedMovieId) {
      console.error("Invalid movieId provided to getMovieDetails");
      return { error: { message: "Invalid movie ID", name: "VALIDATION_ERROR" } };
    }
    return get(`/movie/${validatedMovieId}`);
  },

  getSimilarMovies: (movieId, page = 1) => {
    const validatedMovieId = validateId(movieId);
    const validatedPage = validatePage(page);
    if (!validatedMovieId) {
      console.error("Invalid movieId provided to getSimilarMovies");
      return { error: { message: "Invalid movie ID", name: "VALIDATION_ERROR" } };
    }
    return get(`/movie/${validatedMovieId}/similar`, { params: { page: validatedPage } });
  },
  searchMovies: (keyword, page = 1) => {
    const validatedKeyword = validateKeyword(keyword);
    const validatedPage = validatePage(page);
    if (!validatedKeyword) {
      console.error("Empty or invalid keyword provided to searchMovies");
      return { error: { message: "Invalid keyword", name: "VALIDATION_ERROR" } };
    }
    return get(`/search/movie`, { params: { query: validatedKeyword, page: validatedPage } });
  },
};
