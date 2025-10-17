import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const Hero = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);
  const [loaded, setLoaded] = useState([]); // track loaded state per image
  const intervalRef = useRef(null);

  // New: left content wrapper to sit on white area
  const leftContentStyle = {
    position: 'relative',
    zIndex: 6,
    maxWidth: '520px',
    padding: '18px 8px', // less padding for mobile
    marginLeft: 'clamp(8px, 2vw, 24px)', // smaller margin for mobile
    marginTop: '16px', // less top margin for mobile
    textAlign: 'center', // center text for mobile
    width: '100%',
    boxSizing: 'border-box'
  };
  const headingMainColor = { color: '#2c3e50' }; // dark text on white
  const headingAccent = { color: '#d95821' };    // orange accent

  // Desktop-only left content style — completely isolated from mobile
  const leftContentStyleDesktop = {
    position: 'relative',
    zIndex: 6,
    maxWidth: '520px',
    padding: '28px 24px',
    marginLeft: 'clamp(40px, 6vw, 80px)',
    marginTop: 0,
    textAlign: 'left',
    width: '100%',
    boxSizing: 'border-box'
  };

  useEffect(() => {
  const fetchImages = async () => {
    try {
      // ✅ Sort images by 'index' field in Firestore
      const querySnapshot = await getDocs(collection(db, "headerimage"));
      const sortedDocs = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 0)); // sort safely by index

      const urls = sortedDocs
        .map((item) => item.url)
        .filter((url) => url && typeof url === "string" && url.trim() !== "")
        .map((url) => {
          if (url.includes(".jpg") || url.includes(".png")) {
            return url.replace(/\.(jpg|png)$/i, ".webp");
          }
          return url;
        });

      // ✅ Split images for desktop and mobile
      const desktopImages = urls.slice(0, 3); // first 3
      const mobileImages = urls.slice(3, 6);  // next 3

      // ✅ Choose based on screen width
      if (window.innerWidth < 992) {
        setImages(mobileImages.length ? mobileImages : desktopImages);
      } else {
        setImages(desktopImages.length ? desktopImages : mobileImages);
      }

      // ✅ Preload first image for better LCP
      const firstUrl =
        (window.innerWidth < 992 ? mobileImages[0] : desktopImages[0]) ||
        urls[0];
      if (firstUrl) {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = firstUrl;
        link.fetchPriority = "high";
        document.head.appendChild(link);
      }
    } catch (error) {
      console.error("Error fetching header images:", error);
    }
  };

  fetchImages();
}, []);


  useEffect(() => {
    if (images.length === 0) return;

    // initialize loaded flags
    setLoaded(new Array(images.length).fill(false));

    // Preload all images, mark loaded when each finishes
    images.forEach((src, idx) => {
      const img = new window.Image();
      // Give first image high priority
      try { img.fetchPriority = idx === 0 ? "high" : "low"; } catch(e) {}
      img.onload = () => {
        setLoaded(prev => {
          const next = [...prev];
          next[idx] = true;
          return next;
        });
        // mark firstImageLoaded when first image loads (LCP)
        if (idx === 0) setFirstImageLoaded(true);
      };
      img.onerror = () => {
        // still mark as loaded to avoid blocking slideshow
        setLoaded(prev => {
          const next = [...prev];
          next[idx] = true;
          return next;
        });
        if (idx === 0) setFirstImageLoaded(true);
      };
      img.src = src;
    });
  }, [images]);

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (images.length <= 1) return;

    // Only start slideshow once at least the first image is loaded
    if (!loaded || loaded.length === 0) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        // try to find the next loaded slide (wrap around)
        let next = (prev + 1) % images.length;
        for (let i = 0; i < images.length; i++) {
          if (loaded[next]) return next;
          next = (next + 1) % images.length;
        }
        // fallback: if none loaded yet, keep previous
        return prev;
      });
    }, 4000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [images, loaded]);

  const renderSlides = () => {
    return images.map((img, idx) => (
      <div
        key={`${idx}-${img}`}
        className={`hero-bg-slide ${idx === currentIndex ? "active" : ""}`}
        style={{ backgroundImage: `url(${img})` }}
        aria-hidden="true"
      ></div>
    ));
  };

  return (
    <header className="hero-section" id="hero" role="banner">
      {/* Mobile Layout Only: Stack slider above content */}
      <div className="d-block d-lg-none">
        {/* Mobile Slider Section */}
        <div className="hero-slider" style={{ height: '50vh', position: 'relative' }}>
          {renderSlides()}
          {firstImageLoaded && <div className="hero-gradient-overlay" aria-hidden="true"></div>}
        </div>

        {/* Mobile Content Section */}
        <div style={{ minHeight: '50vh', backgroundColor: '#f8f9fa', padding: '2rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            className="hero-content-left"
            style={{
              position: 'relative',
              zIndex: 6,
              maxWidth: '100%',
              padding: '0',
              marginLeft: '0',
              marginTop: '0',
              textAlign: 'center',
              width: '100%',
              boxSizing: 'border-box'
            }}
            data-aos="fade-up"
            itemScope
            itemType="https://schema.org/EducationalOrganization"
          >
            {/* Trust badges first */}
            <div
              className="trust-badges d-flex align-items-center justify-content-center"
              aria-hidden="true"
              style={{
                flexWrap: 'wrap',
                width: '100%',
                marginBottom: '0.7rem',
                gap: '1.2rem',
                rowGap: '0.7rem',
                justifyContent: 'center'
              }}
            >
              <div className="trust-badge-item d-flex align-items-center" style={{ minWidth: 0 }}>
                <div className="trust-icon me-2" style={{ color: '#d95821', width: 28, height: 28 }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" d="M12 2l2.09 4.24L18.9 7l-3.45 2.9L15.82 14 12 11.77 8.18 14l.37-4.1L5.1 7l4.81-.76L12 2z"/>
                    <path fill="currentColor" d="M12 13.2l3.09 1.63-.59 3.41L12 17.27l-2.5 1.97-.59-3.41L12 13.2z"/>
                  </svg>
                </div>
                <span className="trust-text" style={{ color: '#555', fontSize: '0.97rem' }}>600+ Certified Teachers</span>
                <span className="sr-only">600 plus certified teachers</span>
              </div>
              <div className="trust-badge-item d-flex align-items-center" style={{ minWidth: 0 }}>
                <div className="trust-icon me-2" style={{ color: '#d95821', width: 28, height: 28 }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                </div>
                <span className="trust-text" style={{ color: '#555', fontSize: '0.97rem' }}>4.9/5 Rating</span>
                <span className="sr-only">4.9 out of 5 rating</span>
              </div>
            </div>

            {/* Heading / subtitle next */}
            <h1 className="hero-title mb-3" itemProp="name" style={{ lineHeight: 1.12, fontSize: 'clamp(1.3rem, 7vw, 2.1rem)' }}>
              <div className="hero-title-line hero-title-single-line">
                <span style={headingMainColor}>Elevate Your Teaching with</span>
              </div>
              <div className="hero-title-line">
                <span style={headingAccent}>Master Abacus and Vedic</span>
              </div>
              <div className="hero-title-line hero-title-no-wrap">
                <span style={headingAccent}>Math Certification</span>
              </div>
            </h1>

            <div className="hero-subtitle-container mb-4" style={{ marginBottom: '0.7rem' }}>
              <p
                className="hero-subtitle-primary desktop-subtitle"
                itemProp="description"
                style={{ color: '#444', fontSize: 'clamp(0.95rem, 3vw, 1.1rem)' }}
              >
                <strong>
                  {/* Mobile: single line */}
                  <span className="d-lg-none">
                    Transform into a sought-after mental math instructor through our prestigious training program
                  </span>

                  {/* Desktop: explicit two lines (visible lg+) */}
                  <span className="d-none d-lg-block desktop-subtitle-line">
                    Transform into a sought-after mental math instructor
                  </span>
                  <span className="d-none d-lg-block desktop-subtitle-line">
                    through our prestigious training program
                  </span>
                </strong>
              </p>
            </div>

            {/* Buttons last */}
            <div
              className="hero-buttons d-flex gap-2 mb-4"
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'stretch',
                width: '100%',
                maxWidth: 400,
                margin: '0 auto 0.7rem auto',
                flexWrap: 'nowrap'
              }}
            >
              <Link to="/contact" className="btn btn-orange" style={{ fontSize: '0.98rem', padding: '0.7rem 0.5rem', borderRadius: 30, minWidth: 0, width: '100%' }}>
                Enroll Now
              </Link>
              <Link to="/contact" className="btn btn-orange" style={{ fontSize: '0.98rem', padding: '0.7rem 0.5rem', borderRadius: 30, minWidth: 0, width: '100%' }}>
                Free Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout: Original structure with subtitle fix */}
      <div className="d-none d-lg-block">
        {/* Background Slider */}
        <div className="hero-slider">
          {renderSlides()}
        </div>

        {/* Gradient Overlay */}
        {firstImageLoaded && <div className="hero-gradient-overlay" aria-hidden="true"></div>}

        {/* Main Content: two-column layout so text sits in white area on left */}
        <div className="container-fluid px-0">
          <div className="row align-items-center min-vh-100 g-0">
            <div className="col-lg-5 col-xl-4 d-flex align-items-center justify-content-center">
              <div
                className="hero-content-left desktop-only"
                style={leftContentStyleDesktop}
                data-aos="fade-up"
                itemScope
                itemType="https://schema.org/EducationalOrganization"
              >
                {/* Trust badges first */}
                <div
                  className="trust-badges d-flex align-items-center justify-content-center"
                  aria-hidden="true"
                  style={{
                    flexWrap: 'wrap',
                    width: '100%',
                    marginBottom: '0.7rem',
                    gap: '1.2rem', // add horizontal gap between badges
                    rowGap: '0.7rem', // add vertical gap if badges wrap
                    justifyContent: 'center'
                  }}
                >
                  <div className="trust-badge-item d-flex align-items-center" style={{ minWidth: 0 }}>
                    <div className="trust-icon me-2" style={{ color: '#d95821', width: 28, height: 28 }}>
                      {/* Certificate / badge icon */}
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M12 2l2.09 4.24L18.9 7l-3.45 2.9L15.82 14 12 11.77 8.18 14l.37-4.1L5.1 7l4.81-.76L12 2z"/>
                        <path fill="currentColor" d="M12 13.2l3.09 1.63-.59 3.41L12 17.27l-2.5 1.97-.59-3.41L12 13.2z"/>
                      </svg>
                    </div>
                    <span className="trust-text" style={{ color: '#555', fontSize: '0.97rem' }}>600+ Certified Teachers</span>
                    <span className="sr-only">600 plus certified teachers</span>
                  </div>
                  <div className="trust-badge-item d-flex align-items-center" style={{ minWidth: 0 }}>
                    <div className="trust-icon me-2" style={{ color: '#d95821', width: 28, height: 28 }}>
                      {/* Star / rating icon */}
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                      </svg>
                    </div>
                    <span className="trust-text" style={{ color: '#555', fontSize: '0.97rem' }}>4.9/5 Rating</span>
                    <span className="sr-only">4.9 out of 5 rating</span>
                  </div>
                  <div className="trust-badge-item d-flex align-items-center d-none d-lg-flex" style={{ minWidth: 0 }}>
                    <div className="trust-icon me-2" style={{ color: '#d95821', width: 28, height: 28 }}>
                      {/* Location / marker icon */}
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/>
                      </svg>
                    </div>
                    <span className="trust-text" style={{ color: '#555', fontSize: '0.97rem' }}>60+ Cities Across India</span>
                    <span className="sr-only">sixty plus cities across India</span>
                  </div>
                </div>

                {/* Heading / subtitle next */}
                <h1 className="hero-title mb-3" itemProp="name" style={{ lineHeight: 1.12, fontSize: 'clamp(1.3rem, 7vw, 2.1rem)' }}>
                  <div className="hero-title-line hero-title-single-line">
                    <span style={headingMainColor}>Elevate Your Teaching with</span>
                  </div>
                  <div className="hero-title-line">
                    <span style={headingAccent}>Master Abacus and Vedic</span>
                  </div>
                  <div className="hero-title-line hero-title-no-wrap">
                    <span style={headingAccent}>Math Certification</span>
                  </div>
                </h1>

                <div className="hero-subtitle-container mb-4" style={{ marginBottom: '0.7rem' }}>
                  <p
                    className="hero-subtitle-primary desktop-subtitle"
                    itemProp="description"
                  >
                    <strong>
                      <span className="desktop-subtitle-line">Transform into a sought-after mental math instructor</span>
                      <span className="desktop-subtitle-line">through our prestigious training program</span>
                    </strong>
                  </p>
                </div>

                {/* Buttons last */}
                <div
                  className="hero-buttons d-flex gap-2 mb-4"
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'stretch',
                    width: '100%',
                    maxWidth: 400,
                    margin: '0 auto 0.7rem auto',
                    flexWrap: 'nowrap'
                  }}
                >
                  <Link to="/contact" className="btn btn-orange" style={{ fontSize: '0.98rem', padding: '0.7rem 0.5rem', borderRadius: 30, minWidth: 0, width: '100%' }}>
                    Enroll Now
                  </Link>
                  <Link to="/contact" className="btn btn-orange" style={{ fontSize: '0.98rem', padding: '0.7rem 0.5rem', borderRadius: 30, minWidth: 0, width: '100%' }}>
                    Free Demo
                  </Link>
                </div>
              </div>
            </div>
            {/* right column shows image area (keeps slider visible) */}
            <div className="col-lg-7 col-xl-8 d-none d-lg-block"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;