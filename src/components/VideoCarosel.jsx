import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);
import { useEffect, useRef, useState } from "react";

import { hightlightsSlides } from "../constants";
import { pauseImg, playImg, replayImg } from "../utils";

const VideoCarousel = () => {
  const videoRefs = useRef([]);
  const progressBarRefs = useRef([]);
  const progressWrapperRefs = useRef([]);

  // State for managing video progress and playback
  const [videoState, setVideoState] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setLoadedData] = useState([]);
  const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = videoState;

  // GSAP animation hook
  useGSAP(() => {
    // Animate video slider to move horizontally between videos
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut",
    });

    // ScrollTrigger animation for video playback when in view
    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideoState((prevState) => ({
          ...prevState,
          startPlay: true,
          isPlaying: true,
        }));
      },
    });
  }, [isEnd, videoId]);

  // Handle progress bar updates and animations
  useEffect(() => {
    let currentProgress = 0;
    const progressBar = progressBarRefs.current[videoId];

    if (progressBar) {
      const animation = gsap.to(progressBar, {
        onUpdate: () => {
          // Update progress bar based on video progress
          const progress = Math.ceil(animation.progress() * 100);
          if (progress !== currentProgress) {
            currentProgress = progress;

            // Set the width of the progress bar depending on screen size
            gsap.to(progressWrapperRefs.current[videoId], {
              width:
                window.innerWidth < 760
                  ? "10vw" // Mobile
                  : window.innerWidth < 1200
                  ? "10vw" // Tablet
                  : "4vw", // Laptop
            });

            // Update progress bar width and color
            gsap.to(progressBar, {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },

        // On video completion, reset the progress bar and change color
        onComplete: () => {
          if (isPlaying) {
            gsap.to(progressWrapperRefs.current[videoId], { width: "12px" });
            gsap.to(progressBar, { backgroundColor: "#afafaf" });
          }
        },
      });

      // Restart animation if on the first video
      if (videoId === 0) {
        animation.restart();
      }

      // Update progress bar based on video time
      const updateProgressBar = () => {
        animation.progress(
          videoRefs.current[videoId].currentTime /
            hightlightsSlides[videoId].videoDuration
        );
      };

      if (isPlaying) {
        // Continuously update the progress bar while video is playing
        gsap.ticker.add(updateProgressBar);
      } else {
        // Remove progress bar updates when video is paused
        gsap.ticker.remove(updateProgressBar);
      }
    }
  }, [videoId, startPlay]);

  // Handle video play/pause state
  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRefs.current[videoId].pause();
      } else if (startPlay) {
        videoRefs.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  // Manage different video control actions
  const handleVideoAction = (actionType, index) => {
    switch (actionType) {
      case "video-end":
        setVideoState((prevState) => ({
          ...prevState,
          isEnd: true,
          videoId: index + 1,
        }));
        break;

      case "video-last":
        setVideoState((prevState) => ({
          ...prevState,
          isLastVideo: true,
        }));
        break;

      case "video-reset":
        setVideoState({
          isEnd: false,
          startPlay: false,
          videoId: 0,
          isLastVideo: false,
          isPlaying: false,
        });
        break;

      case "pause":
      case "play":
        setVideoState((prevState) => ({
          ...prevState,
          isPlaying: !prevState.isPlaying,
        }));
        break;

      default:
        return;
    }
  };

  // Store metadata of the loaded video
  const handleLoadedMetadata = (index, event) => {
    setLoadedData((prevState) => [...prevState, event]);
  };

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((slide, index) => (
          <div key={slide.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  playsInline
                  className={`${
                    slide.id === 2 ? "translate-x-44" : ""
                  } pointer-events-none`}
                  preload="auto"
                  muted
                  ref={(el) => (videoRefs.current[index] = el)}
                  onEnded={() =>
                    index !== 3
                      ? handleVideoAction("video-end", index)
                      : handleVideoAction("video-last")
                  }
                  onPlay={() =>
                    setVideoState((prevState) => ({
                      ...prevState,
                      isPlaying: true,
                    }))
                  }
                  onLoadedMetadata={(e) => handleLoadedMetadata(index, e)}
                >
                  <source src={slide.video} type="video/mp4" />
                </video>
              </div>

              <div className="absolute top-12 left-[5%] z-10">
                {slide.textLists.map((text, textIndex) => (
                  <p
                    key={textIndex}
                    className="md:text-2xl text-xl font-medium"
                  >
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRefs.current.map((_, index) => (
            <span
              key={index}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
              ref={(el) => (progressWrapperRefs.current[index] = el)}
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => (progressBarRefs.current[index] = el)}
              />
            </span>
          ))}
        </div>

        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={
              isLastVideo
                ? () => handleVideoAction("video-reset")
                : !isPlaying
                ? () => handleVideoAction("play")
                : () => handleVideoAction("pause")
            }
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
