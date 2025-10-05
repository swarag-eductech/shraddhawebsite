import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";


const TeachersAchievementImages = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Fetch all achievement images from Firestore collection "teachersAchievementImages"
        const querySnapshot = await getDocs(collection(db, "teachersAchievementImages"));
        const imageList = querySnapshot.docs.map(doc => doc.data().url).filter(Boolean);
        setImages(imageList);
      } catch (error) {
        setImages([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  return (
    <div className="gallery-container">
      <h2 className="gallery-title">Teachers Achievement Images</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : images.length > 0 ? (
        <div className="gallery-grid">
          {images.map((img, idx) => (
            <div key={idx} className="gallery-image-wrapper">
              <img
                src={img}
                alt={`Teacher Achievement ${idx + 1}`}
                className="gallery-image"
                style={{ borderRadius: "12px", boxShadow: "0 5px 15px rgba(0,0,0,0.12)" }}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>No achievement images available.</p>
      )}
    </div>
  );
};

export default TeachersAchievementImages;
