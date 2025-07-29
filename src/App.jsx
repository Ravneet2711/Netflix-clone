import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Watch from "./pages/Watch";
import NotFound from "./pages/NotFound";
import MyList from "./pages/MyList";
import { MovieProvider, useMovieContext } from "./context/MovieContext";
import { CardProvider, useCardContext } from "./context/CardContext";
import PopupCard from "./components/PopupCard";
import { UtilsProvider } from "./context/UtilsContext";
import Modal from "./components/Modal";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <MovieProvider>
      <CardProvider>
        <UtilsProvider>
          <Router>
            <InnerApp />
          </Router>
        </UtilsProvider>
      </CardProvider>
    </MovieProvider>
  );
}

export function InnerApp() {
  const { cardState } = useCardContext();
  const { selectedMovie, isModalOpen, setIsModalOpen } = useMovieContext();

  const modalOpenHandler = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <>
      <Toaster position="top-right" />
      <Navbar />
      <PopupCard
        isHovered={cardState.isHovered}
        x={cardState.position?.x || 0}
        y={cardState.position?.y || 0}
      />
      {selectedMovie && (
        <Modal
          movieData={selectedMovie}
          isOpen={isModalOpen}
          onClose={modalOpenHandler}
        />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watch/:id" element={<Watch />} />
        <Route path="/myList" element={<MyList />} />
        <Route path="/search/:query" element={<Search />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
export default App;
