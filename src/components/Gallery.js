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

  useEffect(() => {
    const fetchImage = async () => {
      try {
        // Fetch only one image document from Firestore
        const docRef = doc(db, "gallery", "main");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setImage(data.url);
        } else {
          setImage(null);
        }
      } catch (err) {
        setError("Failed to fetch image: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImage();
  }, []);

  useEffect(() => {
    if (!isLoading && image) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
    }
  }, [isLoading, image]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="gallery-container">
      {showConfetti && <Confetti numberOfPieces={120} recycle={false} />}
      <h2 className="gallery-title">Memories</h2>
      {image ? (
        <div className="gallery-single-image" style={{ textAlign: "center" }}>
          <picture>
            <source
              srcSet={image.endsWith('.png') || image.endsWith('.jpg') ? image.replace(/\.(png|jpg)$/i, '.webp') : image}
              type="image/webp"
            />
            <img
              src={image}
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






