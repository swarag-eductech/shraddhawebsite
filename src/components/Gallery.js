import React, { useEffect, useState, useMemo } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; 
import { motion, useAnimation } from "framer-motion";
import "./Gallery.css";
import Confetti from "react-confetti";

const Gallery = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // new: separate desktop / mobile sources and chosen display image
  const [desktopImage, setDesktopImage] = useState(null);
  const [mobileImage, setMobileImage] = useState(null);
  const [displayImage, setDisplayImage] = useState(null);

  // Animation controls
  const controls = useAnimation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Memoize animationSequence so its reference doesn't change every render
  const animationSequence = useMemo(() => ({
    x: ["0%", "-50%", "0%"], // Pans from left to right and back
    scale: [1.05, 1.1, 1.05], // Gentle zoom in and out
    transition: {
      duration: 40, // Slow 40-second cycle
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    },
  }), []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // desktop image (existing)
        const mainRef = doc(db, "gallery", "main");
        const mainSnap = await getDoc(mainRef);
        const mainUrl = mainSnap.exists() ? mainSnap.data().url : null;

        // mobile image (new: "main1")
        const mobileRef = doc(db, "gallery", "main1");
        const mobileSnap = await getDoc(mobileRef);
        const mobileUrl = mobileSnap.exists() ? mobileSnap.data().url : null;

        setDesktopImage(mainUrl);
        setMobileImage(mobileUrl);

        // set initial display image based on current screen
        const isMobile = window.innerWidth < 768;
        setDisplayImage(isMobile ? (mobileUrl || mainUrl) : mainUrl);
      } catch (err) {
        setError("Failed to fetch image(s): " + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  // update displayImage on resize (live switch)
  useEffect(() => {
    const onResize = () => {
      const isMobile = window.innerWidth < 768;
      setDisplayImage(isMobile ? (mobileImage || desktopImage) : desktopImage);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mobileImage, desktopImage]);

  // confetti when chosen display image becomes available
  useEffect(() => {
    if (!isLoading && displayImage) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
    }
  }, [isLoading, displayImage]);

  // Reset imageLoaded whenever the displayed image source changes
  useEffect(() => {
    setImageLoaded(false);
  }, [displayImage]);

  useEffect(() => {
    const handleAnimation = () => {
      // Require the image to be loaded before starting the animation on mobile
      if (window.innerWidth < 768 && displayImage && imageLoaded) {
        controls.start(animationSequence);
        setIsPlaying(true);
      } else {
        controls.stop();
        controls.set({ x: "0%", scale: 1 });
        setIsPlaying(false);
      }
    };
    handleAnimation();
    window.addEventListener("resize", handleAnimation);
    return () => window.removeEventListener("resize", handleAnimation);
  }, [displayImage, controls, animationSequence, imageLoaded]);

  const togglePlay = () => {
    // Don't attempt to start animation before image is loaded
    if (!imageLoaded) return;
    if (isPlaying) {
      controls.stop();
      setIsPlaying(false);
    } else {
      controls.start(animationSequence);
      setIsPlaying(true);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="gallery-container">
      {showConfetti && <Confetti numberOfPieces={120} recycle={false} />}
      <h2 className="gallery-title">Memories</h2>
      {displayImage ? (
        <div className="gallery-single-image" style={{ textAlign: "center" }}>
          <picture>
            <source
              srcSet={displayImage.endsWith('.png') || displayImage.endsWith('.jpg') ? displayImage.replace(/\.(png|jpg)$/i, '.webp') : displayImage}
              type="image/webp"
            />
            <motion.img
              src={displayImage}
              alt="Gallery"
              loading="eager"
              width="1600"
              height="550"
              className="gallery-image-mobile"
              animate={controls}
              initial={{ x: "0%", scale: 1.05 }}
              onClick={togglePlay}
              onLoad={() => setImageLoaded(true)}
            />
          </picture>
          {window.innerWidth < 768 && (
            <button
              className={`gallery-play-toggle ${isPlaying ? "playing" : ""}`}
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause Animation" : "Play Animation"}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
          )}
        </div>
      ) : (
        <p>No image available 📷</p>
      )}
    </div>
  );
};

export default Gallery;






