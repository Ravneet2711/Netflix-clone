import { createContext, useContext, useState } from "react";

const MovieContext = createContext(null);

export const MovieProvider = ({ children }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState([]);
  const [playerMuted, setPlayerMuted] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <MovieContext.Provider
      value={{
        selectedMovie,
        setSelectedMovie,
        popularMovies,
        setPopularMovies,
        topRatedMovies,
        setTopRatedMovies,
        trendingMovies,
        setTrendingMovies,
        trailerUrl,
        setTrailerUrl,
        playerMuted,
        setPlayerMuted,
        isModalOpen,
        setIsModalOpen,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovieContext = () => {
  const context = useContext(MovieContext);

  if (!context) {
    throw new Error("useMovieContext must be used within a MovieProvider");
  }
  return context;
};
