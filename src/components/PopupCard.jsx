import {
  Check,
  ChevronDown,
  Play,
  Plus,
  ThumbsUp,
  Volume2,
  VolumeOff,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";
import { Link } from "react-router-dom";
import { useCardContext } from "../context/CardContext";
import { tmdbApi } from "../tmdb";
import { useUtilsContext } from "../context/UtilsContext";
import { useMovieContext } from "../context/MovieContext";

const PopupCard = ({ isHovered, x, y }) => {
  const [title, setTitle] = useState("Movie");
  const [muted, setMuted] = useState(true);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [addToFavourite, setAddToFavourite] = useState(false);
  const [movieId, setMovieId] = useState(0);
  const [favData, setFavData] = useState(null);

  const { setIsModalOpen, setSelectedMovie } = useMovieContext();
  const { cardState, setCardState } = useCardContext();
  const { addToFavouriteList } = useUtilsContext();

  useEffect(() => {
    const handleScroll = () => {
      if (cardState.isHovered) {
        setCardState((prev) => ({
          ...prev,
          isHovered: false,
        }));
      }
    };
    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [cardState.isHovered, setCardState]);

  useEffect(() => {
    if (!cardState.item) return;
    if (cardState.item) {
      setImageUrl(
        `https://image.tmdb.org/t/p/w500${cardState.item.backdrop_path}`
      );
      setTitle(cardState.item.title) || "MOVIE";
      setMovieId(cardState.item.id);
      setFavData(cardState.item);

      let list = JSON.parse(localStorage.getItem("movieList") || "[]");
      setAddToFavourite(list.some((item) => item.id === cardState.item.id));
    }

    const fetchTrailer = async () => {
      const trailerRes = await tmdbApi.getMovieTrailer(cardState.item.id);

      if (trailerRes.error) {
        setTrailerUrl("");
      } else if (trailerRes.data) {
        setTrailerUrl(trailerRes.data.results[0].key);
      }
    };
    fetchTrailer();
  }, [cardState]);

  const handlePopOverMouseleave = (e) => {
    e.stopPropagation();
    setCardState((prev) => ({
      ...prev,
      isHovered: false,
      cardId: null,
      item: null,
    }));
    setShowTrailer(false);
  };

  const styles = {
    popupCard: {
      backgroundColor: "rgb(20,20,20)",
      boxShadow:
        "rgba(0,0,0,0.2) 0px 2px 1px 1px rgba(0,0,0,0.14) 0px 1px 1px 0px rgba(0,0,0,0.12) 0px 1px 3px 0px",
      backgroundImage:
        "linear-gradient(rgba(255,255,255,0.05),rgba(255,255,255,0.05))",
      borderRadius: "8px",
      transformOrigin: "center",
      position: "fixed",
      width: "350px",
      zIndex: "1000",
      overflow: "hidden",
    },
    popupScaleDown: {
      transform: "translate(-50%, -100%)scale(0)",
      opacity: 0,
    },
    popupScaleUp: {
      transform: "translate(-50%, -100%)scale(1)",
      opacity: 1,
    },
    transitionAll: {
      transition: "transform 0.3s ease 0.1s, opacity 0.3s ease",
    },
  };
  return (
    <div
      className="text-white flex flex-col z-40"
      style={{
        ...styles.popupCard,
        top: `${y + 270}px`,
        left: `${
          x < 200 ? x + 60 : window.innerWidth - x < 200 ? x - 60 : x
        }px`,
        ...(isHovered ? styles.popupScaleUp : styles.popupScaleDown),
        ...styles.transitionAll,
      }}
      onMouseLeave={handlePopOverMouseleave}
    >
      <div
        className="relative w-full h-[198px] "
        onMouseEnter={() => {
          setShowTrailer(true);
        }}
        onMouseLeave={() => {
          setShowTrailer(false);
        }}
      >
        <div className="flex items-center">
          <p className="absolute top-36 left-2 text-ellipsis font-semibold text-xl">
            {title.length > 25 ? title.slice(0, 25) + "..." : title}
          </p>
          <span
            onClick={() => setMuted(!muted)}
            className="absolute cursor-pointer z-50 transition-colors duration-200 top-36 right-4 p-3 border-2 border-gray-700 rounded-full
                      hover:border-white"
          >
            {muted ? <VolumeOff size={20} /> : <Volume2 size={20} />}
          </span>
        </div>
        {trailerUrl && showTrailer ? (
          <div className="pointer-events-none w-full h-full border-gray-700">
            <VideoPlayer pip={true} isMuted={muted} videoId={trailerUrl} />
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt="Poster"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-[200px] bg-gray-500 flex items-center justify-center">
            <span className="text-white text-sm"> No Image Available</span>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center p-4">
        <div className="flex space-x-2">
          <Link
            to={`/watch/${trailerUrl}`}
            className="rounded-full transition-colors duration-200 p-3 border-gray-700 border-2 hover:border-white"
          >
            <Play size={20} className="h-6 w-6" />
          </Link>
          <button
            onClick={() => {
              addToFavouriteList(favData);
              setAddToFavourite((prev) => !prev);
            }}
            className="rounded-full transition-colors duration-200 p-3 border-gray-700 border-2 hover:border-white"
          >
            {addToFavourite ? (
              <Check size={20} className="h-6 w-6" />
            ) : (
              <Plus size={20} className="h-6 w-6" />
            )}
          </button>
          <button
            onClick={() => {}}
            className="rounded-full transition-colors duration-200 p-3 border-gray-700 border-2 hover:border-white"
          >
            <ThumbsUp size={20} className="h-6 w-6" />
          </button>
        </div>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setSelectedMovie(favData);
            setCardState((prev) => ({
              ...prev,
              isHovered: false,
              cardId: null,
              item: null,
            }));
          }}
          className="rounded-full transition-colors duration-200 p-3 border-gray-700 border-2 hover:border-white"
        >
          <ChevronDown size={20} className="h-6 w-6" />
        </button>
      </div>
      <div className="p-4">
        <div className="flex gap-3">
          <span className="text-green-400">70% Match</span>
          <span className="border-2 border-gray-600 rounded-sm text-sm">
            +13
          </span>
          <span className="font-bold">21m</span>
          <span className="border-2 border-gray-600 rounded-sm text-sm">
            4K
          </span>
        </div>
        <div className="mt-2 text-lg flex space-x-2">
          <span>Witty • Heartfelt • Drama</span>
        </div>
      </div>
    </div>
  );
};

export default PopupCard;
