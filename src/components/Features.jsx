import { useGSAP } from "@gsap/react";
import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { explore1Img, explore2Img, exploreVideo } from "../utils";

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
  const videoRef = useRef();

  useGSAP(() => {
    gsap.to("#expVideo", {
      scrollTrigger: {
        trigger: "#expVideo",
        toggleActions: "play pause resume restart",
        start: "-10% bottom",
      },
      onComplete: () => {
        videoRef.current.play();
      },
    });
  }, []);

  useGSAP(() => {
    gsap.to("#features_title", {
      opacity: 1,
      y: 0,
      scrollTrigger: {
        trigger: "#features_title",
        toggleActions: "restart none none none",
      },
    });
    gsap.to(".g_grow", {
      scale: 1,
      opacity: 1,
      ease: "power1",
      scrollTrigger: {
        scrub: 5.5,
        trigger: ".g_grow",
        toggleActions: "restart reverse restart reverse",
      },
    });
    gsap.to(".g_text", {
      opacity: 1,
      y: 0,
      ease: "power2.inOut",
      duration: 1,
    });
  }, []);
  return (
    <section className="h-full common-padding bg-zinc relative overflow-hidden">
      <div className="screen-max-width">
        <div className="mb-12 w-full">
          <h1 id="features_title" className="section-heading">
            Explore the full story
          </h1>
        </div>

        <div className="flex flex-col justify-center items-center overflow-hidden">
          <div className="mt-32 mb-24 pl-24">
            <h2 className="text-5xl lg:text-7xl">IPhone.</h2>
            <h2 className="text-5xl lg:text-7xl">Forged in Titanium.</h2>
          </div>
          <div className="flex-center flex-col sm:px-10">
            <div className="relative h-[50vh] w-full flex item-cenetr">
              <video
                playsInline
                id="expVideo"
                className="w-full h-full object-cover object-center"
                preload="none"
                muted
                autoPlay
                ref={videoRef}
              >
                <source src={exploreVideo} type="video/mp4" />
              </video>
            </div>
            <div className="flex flex-col w-full relative">
              <div className=" feature-video-container">
                <div className="overflow-hidden flex-1 h-[50vh]">
                  <img
                    src={explore1Img}
                    alt="img"
                    className="feature-video g_grow"
                  />
                </div>
                <div className="overflow-hidden flex-1 h-[50vh]">
                  <img
                    src={explore2Img}
                    alt="img"
                    className="feature-video g_grow"
                  />
                </div>
              </div>
              <div className="feature-text-container">
                <div className="flex-1 flex-center">
                  <p className="feature-text g_text">
                    Iphone 15 Pro is{" "}
                    <span className="text-white">
                      the first iPhone to feature an aerospace-grade titanium
                      design
                    </span>
                    , using the same alloy that spececrafts use for missions to
                    mars.
                  </p>
                </div>
                <div className="flex-1 flex-center">
                  <p className="feature-text g_text">
                    Titanium has on of the best strength-to-weight ratios of any
                    metal,making thesse our{" "}
                    <span className="text-white">Lighest Pro models ever.</span>
                    you notice the difference the moment when you pick one up.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
