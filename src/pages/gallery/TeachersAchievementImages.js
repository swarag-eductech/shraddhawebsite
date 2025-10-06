import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";


const TeachersAchievementImages = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState(null);

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

  const openModal = (img) => {
    setModalImg(img);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalImg(null);
  };

  return (
    <div className="gallery-container">
      <style>
        {`
          .gallery-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 32px;
            margin-top: 2rem;
          }
          @media (max-width: 900px) {
            .gallery-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          @media (max-width: 600px) {
            .gallery-grid {
              grid-template-columns: 1fr;
            }
            .gallery-image {
              max-width: 100% !important;
              height: 520px !important;
            }
          }
          .gallery-image {
            width: 100%;
            max-width: 600px;
            height: 480px;
            object-fit: cover;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.12);
            cursor: pointer;
            transition: transform 0.2s;
          }
          .gallery-image:hover {
            transform: scale(1.04);
            box-shadow: 0 8px 24px rgba(0,0,0,0.18);
          }
          .gallery-modal {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.8);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}
      </style>
      <h2 className="gallery-title">Teachers Achievement Images</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : images.length > 0 ? (
        <div
          className="gallery-grid"
        >
          {images.map((img, idx) => (
            <div key={idx} className="gallery-image-wrapper" style={{ display: "flex", justifyContent: "center" }}>
              <img
                src={img}
                alt={`Teacher Achievement ${idx + 1}`}
                className="gallery-image"
                width={600}
                height={480}
                style={{
                  width: "100%",
                  maxWidth: "750px",
                  height: "850px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.12)",
                  cursor: "pointer"
                }}
                onClick={() => openModal(img)}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>No achievement images available.</p>
      )}

      {/* Modal for big image view */}
      {modalOpen && (
        <div
          className="gallery-modal"
          onClick={closeModal}
        >
          <img
            src={modalImg}
            alt="Big View"
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
              background: "#fff"
            }}
            onClick={e => e.stopPropagation()}
          />
          <button
            style={{
              position: "absolute",
              top: 30,
              right: 40,
              fontSize: "2rem",
              color: "#fff",
              background: "none",
              border: "none",
              cursor: "pointer"
            }}
            onClick={closeModal}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default TeachersAchievementImages;

