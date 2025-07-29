import { createContext, useContext, useState } from "react";
import { useCardContext } from "./CardContext";

const UtilsContext = createContext(null);

export const UtilsProvider = ({ children }) => {
  const { setCardState } = useCardContext();

  const [movieList, setMovieList] = useState(() => {
    const stored = localStorage.getItem("movieList");
    return stored ? JSON.parse(stored) : [];
  });

  const addToFavouriteList = (movie) => {
    const stored = localStorage.getItem("movieList");
    let parsedList = stored ? JSON.parse(stored) : [];

    const exists = parsedList.some((item) => item.id === movie.id);

    let newMovieList;

    if (exists) {
      newMovieList = parsedList.filter((item) => item.id !== movie.id);
    } else {
      newMovieList = [...parsedList, movie];
    }

    setMovieList(newMovieList);
    setCardState((prev) => ({
      ...prev,
      isHovered: false,
      item: null,
      cardId: null,
    }));

    try {
      localStorage.setItem("movieList", JSON.stringify(newMovieList));
    } catch (error) {
      console.error("Error saving to local storage:", error);
    }
  };

  const randomDuration = () => {
    const randomMins = Math.floor(Math.random() * (200 - 60 + 1)) + 60;
    const hrs = Math.floor(randomMins / 60);
    const mins = randomMins % 60;

    return `${hrs}h ${mins}m`;
  };
  return (
    <UtilsContext.Provider
      value={{ addToFavouriteList, movieList, randomDuration }}
    >
      {children}
    </UtilsContext.Provider>
  );
};

export const useUtilsContext = () => {
  const context = useContext(UtilsContext);

  if (!context) {
    throw new Error("useUtilsContext must be used within a UtilsProvider");
  }
  return context;
};
