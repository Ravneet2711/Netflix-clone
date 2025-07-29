import {
  Check,
  Plane,
  Play,
  Plus,
  ThumbsUp,
  Volume2,
  VolumeOff,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useUtilsContext } from "../context/UtilsContext";
import VideoPlayer from "./VideoPlayer";
import { tmdbApi } from "../tmdb";
import SImilarMoviesCard from "./SImilarMoviesCard";
import { useNavigate } from "react-router-dom";

const Modal = ({ isOpen, onClose, movieData }) => {
  const [addedToFavourite, setAddedToFavourite] = useState(false);
  const [muted, setMuted] = useState(true);
  const [videoId, setVideoId] = useState("UJI5G0rumDA");
  const { addToFavouriteList, randomDuration } = useUtilsContext();
  const [movieDetails, setMovieDetails] = useState(null);
  const [similarMovies, setsimilarMovies] = useState([]);
  const [loadingSimilarMovies, setLoadingSimilarMovies] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let list = JSON.parse(localStorage.getItem("movieList") || "[]");
    setAddedToFavourite(list.some((item) => item.id === movieData.id));

    const fetchData = async () => {
      setLoadingSimilarMovies(true);
      const [trailerResponse, movieDetailResponse, similarMoviesResponse] =
        await Promise.all([
          tmdbApi.getMovieTrailer(movieData.id),
          tmdbApi.getMovieDetails(movieData.id),
          tmdbApi.getSimilarMovies(movieData.id),
        ]);
      setLoadingSimilarMovies(false);
      if (trailerResponse.error) {
        setVideoId("");
      } else if (trailerResponse.data) {
        setVideoId(trailerResponse.data?.results[0].key);
      }
      if (movieDetailResponse.error) {
        setMovieDetails(null);
      } else if (movieDetailResponse.data) {
        setMovieDetails(movieDetailResponse.data);
      }
      if (similarMoviesResponse.error) {
        setsimilarMovies([]);
      } else if (similarMoviesResponse.data) {
        setsimilarMovies(similarMoviesResponse.data.results);
        console.log(similarMoviesResponse.data.results);
      }
    };
    fetchData();
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="h-[90vh] overflow-x-hidden w-[85%] md:w-[80%] lg:w-[50%] bg-[#141414] text-white rounded-lg relative"
      >
        <button
          onClick={onClose}
          className="absolute z-50 top-5 right-6 text-white bg-black p-3 rounded-full"
        >
          <X size={20} />
        </button>

        {videoId ? (
          <div className=" relative ">
            <div className="absolute inset-0 z-20 bottom-0 bg-gradient-to-t from-[#141414] to-transparent"></div>

            <div className="absolute z-50 left-6 md:left-12 bottom-2 w-[90%]">
              <p className="text-4xl font-bold mb-4">{movieData.title}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      navigate(`/watch/${videoId}`);
                      onClose();
                    }}
                    className="flex text-2xl items-center gap-2 bg-white text-black p-2 px-4 md:px-12 py-2 rounded-md hover:bg-gray-200 transition-all"
                  >
                    <Play size={20} />
                    <span className="font-semibold lg:block hidden">Play</span>
                  </button>
                  <button
                    className="rounded-full p-2 md:p-4 border-2 border-gray-700 hover:border-white transition"
                    onClick={() => {
                      addToFavouriteList(movieData);
                      setAddedToFavourite(!addedToFavourite);
                    }}
                  >
                    {addedToFavourite ? (
                      <Check className=" text-white h-6 w-6" />
                    ) : (
                      <Plus className=" text-white h-6 w-6" />
                    )}
                  </button>
                  <button className="rounded-full p-2 md:p-4 border-2 border-gray-700 hover:border-white transition">
                    <ThumbsUp className=" text-white h-6 w-6" />
                  </button>
                </div>
                <div className="pr-2">
                  <button
                    className="rounded-full p-2 md:p-4 border-2 border-gray-700 hover:border-white transition"
                    onClick={() => setMuted(!muted)}
                  >
                    {muted ? <VolumeOff /> : <Volume2 />}
                  </button>
                </div>
              </div>
            </div>
            <div className="pointer-events-none overflow-hidden">
              <VideoPlayer
                customHeight="60"
                videoId={videoId}
                isMuted={muted}
              />
            </div>
          </div>
        ) : (
          <div
            className="p-6 md:p-12
          relative"
          >
            <p>Video Not Available...</p>
          </div>
        )}
        <div
          className="p-6 md:p-12
          relative"
        >
          <div className="absolute inset-0 h-[20px] bottom-0 bg-gradient-to-b from-[#141414] to-transparent"></div>
          <div className="flex-col md:flex-row flex">
            <div className="w-[100%] md:w-[60%] pr-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-green-400">
                  {movieDetails?.vote_average
                    ? `${(movieDetails?.vote_average * 10).toFixed(0)}% Match`
                    : "N/A"}
                </span>
                <span className="border border-gray-600 px-2 rounded-sm">
                  {movieDetails.adult ? "18+" : "13+"}
                </span>
                <span className="font-bold">
                  {movieDetails.runtime
                    ? `${movieDetails.runtime}min`
                    : "2hrs 14min"}
                </span>
                <span className="border border-gray-600 px-2 rounded-sm">
                  4K
                </span>
              </div>
              <p>{movieDetails?.overview || "No overview is available..."}</p>
            </div>
            <div className="mt-4 flex-1 flex flex-col">
              <p>
                <strong>Generes: &nbsp;</strong>
                {movieDetails?.generes?.map((genre) => genre.name).join(", ") ||
                  "N/A"}
              </p>
              <p>
                <strong>Language: &nbsp;</strong>
                {movieDetails?.spoken_languages
                  ?.map((lang) => lang.name)
                  .join(", ") || "N/A"}
              </p>
            </div>
          </div>
          {loadingSimilarMovies && (
            <p className="mt-4 text-center">Loading Similar Movies...</p>
          )}

          {similarMovies.length == 0 && !loadingSimilarMovies && (
            <p className="mt-4 text-center">No Similar Movies Found...</p>
          )}
          {similarMovies.length > 0 && !loadingSimilarMovies && (
            <div className="mt-4">
              <h3 className="text-xl font-bold mb-4">More Like This</h3>
              <div className="grid grid-cols-2  md:grid-cols-3 gap-4">
                {similarMovies
                  .filter((item) => item.backdrop_path)
                  .slice(0, 12)
                  .map((movie) => (
                    <SImilarMoviesCard
                      key={movie.id}
                      id={movie.id}
                      duration={randomDuration()}
                      title={movie.title}
                      description={movie.overview}
                      imageUrl={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
