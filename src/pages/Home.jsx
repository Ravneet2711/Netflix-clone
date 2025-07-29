import React, { useEffect, useState } from "react";
import { get, tmdbApi } from "../tmdb";
import { useMovieContext } from "../context/MovieContext";
import Hero from "../components/Hero";
import Carousel from "../components/Carousel";
import toast from "react-hot-toast";

const Home = () => {
  const [genresWithMovies, setGenresWithMovies] = useState([]);

  const {
    selectedMovie,
    setSelectedMovie,
    popularMovies,
    setPopularMovies,
    topRatedMovies,
    setTopRatedMovies,
    trendingMovies,
    setTrendingMovies,
  } = useMovieContext();

  useEffect(() => {
    const loadMovies = async () => {
      const [
        popularMoviesData,
        topRatedMoviesData,
        trendingMoviesData,
        allGenres,
      ] = await Promise.all([
        tmdbApi.fetchPopularMovies(),
        tmdbApi.fetchTopRatedMovies(),
        tmdbApi.fetchTrendingMovies(),
        tmdbApi.getGenres(),
      ]);

      if (allGenres?.error) {
        setGenresWithMovies([]);
      }

      if (allGenres?.data) {
        const allGenresWithMovies = await Promise.all(
          allGenres.data.genres.map(async (genre) => {
            const movies = await tmdbApi.getMoviesByGenre(genre.id);
            return {
              id: genre.id,
              name: genre.name,
              movies: movies.data.results, // ✅ correct access
            };
          })
        );

        setGenresWithMovies(allGenresWithMovies);
      }

      if (popularMoviesData?.error) {
        setPopularMovies([]);
      } else if (popularMoviesData?.data) {
        const randomIndex = Math.floor(
          Math.random() * popularMoviesData.data?.results.length
        );
        const randomMovie = popularMoviesData.data?.results[randomIndex];
        setSelectedMovie(randomMovie);
        setPopularMovies(popularMoviesData.data.results);
      }

      if (topRatedMoviesData?.error) {
        setTopRatedMovies([]);
      } else if (topRatedMoviesData?.data) {
        setTopRatedMovies(topRatedMoviesData.data.results);
      }

      if (trendingMoviesData?.error) {
        setTrendingMovies([]);
      } else if (trendingMoviesData.data) {
        setTrendingMovies(trendingMoviesData.data.results);
      }
    };
    loadMovies();
  }, []);

  return (
    <div>
      <Hero />
      <div className="absolute w-full top-[31vh] i-pad:top-[37.5vh] i-pad-mini:top-[42vh] md:top-[65vh] lg:top-[85vh] pl-10 flex flex-col space-y-4">
        {popularMovies && (
          <Carousel title="Popular Movies" items={popularMovies} />
        )}
        {trendingMovies && (
          <Carousel title="Trending Movies" items={trendingMovies} />
        )}
        {topRatedMovies && (
          <Carousel title="Top-Rated Movies" items={topRatedMovies} />
        )}
        {genresWithMovies &&
          genresWithMovies.map((movieList) => (
            <Carousel
              title={`${movieList.name} Movies`}
              items={movieList.movies}
            />
          ))}
      </div>
    </div>
  );
};

export default Home;
