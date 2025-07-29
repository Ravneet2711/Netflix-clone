import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useLocation } from "react-router-dom";

const VideoPlayer = ({ videoId, customHeight, isMuted, pip }) => {
  const location = useLocation();
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [mute] = useState(false);
  const [playing] = useState(true);
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    setVolume(mute ? 0 : 0.8);
  }, [mute]);

  const containerClass = classNames({
    "scale-110 relative pt-[56.25%] h-[190px]": pip,
    "h-[100vh]": location.pathname.startsWith("/watch"),
    [`h-[${customHeight}vh] relative pt-[56.25%] scale-150`]:
      !pip && !location.pathname.startsWith("/watch"),
  });

  return (
    <div className={containerClass} ref={containerRef}>
      <ReactPlayer
        ref={playerRef}
        url={`https://www.youtube.com/watch?v=${videoId}`}
        controls={location.pathname.startsWith("/watch") ? "true" : "false"}
        muted={location.pathname.startsWith("/watch") ? mute : isMuted}
        playing={playing}
        volume={volume}
        loop={true}
        width="100%"
        height="100%"
        className="absolute top-0 left-0"
        config={{
          youtube: {
            playerVars: {
              autoplay: 1,
              modestbranding: 1,
              rel: 0,
              disablekb: 1,
            },
          },
        }}
      />
    </div>
  );
};

export default VideoPlayer;
