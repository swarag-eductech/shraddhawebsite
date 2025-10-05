import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const Hero = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "headerimage"));
        if (!querySnapshot.empty) {
          const urls = querySnapshot.docs
            .map((doc) => doc.data().url)
            .filter((url) => url && typeof url === 'string' && url.trim() !== '')
            // Prioritize WebP images
            .map(url => {
              // Convert to WebP if not already
              if (url.includes('.jpg') || url.includes('.png')) {
                return url.replace(/\.(jpg|png)$/i, '.webp');
              }
              return url;
            });
          setImages(urls);
          
          // Preload first image immediately for LCP
          if (urls.length > 0) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = urls[0];
            link.fetchPriority = 'high';
            document.head.appendChild(link);
          }
        } else {
          setImages([]);
        }
      } catch (error) {
        console.error("Error fetching header images:", error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length === 0) return;
    
    // Critical: Load first image with high priority
    const img = new window.Image();
    img.fetchPriority = 'high';
    img.onload = () => {
      setFirstImageLoaded(true);
      // Start slideshow only after first image loads
      if (images.length > 1) {
        setTimeout(() => {
          setCurrentIndex(1);
        }, 4000);
      }
    };
    img.onerror = () => setFirstImageLoaded(true);
    img.src = images[0];
    
    // Preload remaining images with lower priority
    const preloadRemainingImages = () => {
      images.slice(1).forEach((src, index) => {
        const preloadImg = new window.Image();
        preloadImg.fetchPriority = 'low';
        preloadImg.src = src;
      });
    };
    
    // Use requestIdleCallback for non-critical preloading
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => preloadRemainingImages(), { timeout: 1000 });
    } else {
      setTimeout(preloadRemainingImages, 500);
    }
  }, [images]);

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [images]);

  return (
    <header className="hero-section" id="hero" role="banner">
      {/* Background Slider */}
      <div className="hero-slider">
        {images.map((img, idx) => (
          <div
            key={`${idx}-${img}`}
            className={`hero-bg-slide ${idx === currentIndex ? "active" : ""}`}
            style={{ backgroundImage: `url(${img})` }}
            aria-hidden="true"
          ></div>
        ))}
      </div>

      {/* Gradient Overlay */}
      {firstImageLoaded && <div className="hero-gradient-overlay" aria-hidden="true"></div>}

      {/* Main Content */}
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div
            className="col-lg-10 text-center"
            data-aos="fade-up"
            itemScope
            itemType="https://schema.org/EducationalOrganization"
          >
            {/* Main Title */}
            <h1 className="hero-title mb-3" itemProp="name">
              <div className="hero-title-line">
                <span className="text-white">Elevate Your Teaching with</span>
              </div>
              <div className="hero-title-line">
                <span className="text-orange">Master Abacus and Vedic Math</span>
              </div>
              <div className="hero-title-line">
                <span className="text-orange">Certification</span>
              </div>
            </h1>

            {/* Primary Subtitle */}
            <div className="hero-subtitle-container">
              <p className="hero-subtitle-primary mb-4" itemProp="description">
                <strong>Transform into a sought-after mental math instructor through our prestigious training program</strong>
              </p>
            </div>

            {/* Action Buttons - Always in one line on mobile */}
            <div className="hero-buttons">
              <Link
                to="/contact"
                className="btn btn-orange"
                aria-label="Enroll in teacher training program"
              >
                Enroll Now
              </Link>
              <Link
                to="/contact"
                className="btn btn-outline-white"
                aria-label="Sign up for free demo class"
              >
                Free Demo
              </Link>
            </div>

            {/* Trust Badges - Below buttons */}
            <div
              className="trust-badges"
              itemProp="aggregateRating"
              itemScope
              itemType="https://schema.org/AggregateRating"
            >
              <meta itemProp="ratingValue" content="4.9" />
              <meta itemProp="reviewCount" content="500" />
              <div className="trust-badges-container trust-badges-inline">
                <div className="trust-badge-item">
                  <div className="trust-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <span className="trust-text">600+ Certified Teachers</span>
                </div>
                <div className="trust-badge-item">
                  <div className="trust-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                  </div>
                  <span className="trust-text">4.9/5 Rating</span>
                </div>
                <div className="trust-badge-item">
                  <div className="trust-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M9 11a3 3 0 1 0 6 0 3 3 0 0 0-6 0z"></path>
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"></path>
                    </svg>
                  </div>
                  <span className="trust-text">60+ Cities Across India</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;