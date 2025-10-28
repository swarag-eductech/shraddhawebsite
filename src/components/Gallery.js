import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; 
import "./Gallery.css";
import Confetti from "react-confetti";

const Gallery = () => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // new: separate desktop / mobile sources and chosen display image
  const [desktopImage, setDesktopImage] = useState(null);
  const [mobileImage, setMobileImage] = useState(null);
  const [displayImage, setDisplayImage] = useState(null);

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
            <img
              src={displayImage}
              alt="Gallery"
              loading="eager"
              width="1600"
              height="550"
              className="gallery-image-mobile"
              style={{ 
                background: "#f8f8f8", 
                borderRadius: "12px", 
                boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
                width: "100%",
                height: "550px",
                objectFit: "cover"
              }}
            />
          </picture>
        </div>
      ) : (
        <p>No image available 📷</p>
      )}
    </div>
  );
};

export default Gallery;






