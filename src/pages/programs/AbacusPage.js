import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";

import { db } from "../../firebase";

import { collection, getDocs } from "firebase/firestore";
import "./AbacusPage.css";

import { FaBolt, FaBullseye, FaChartLine, FaSmileBeam } from "react-icons/fa";

const AbacusPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const snapshot = await getDocs(collection(db, "testimonials"));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTestimonials(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <div className="abacus-page">
      {/* Hero Section for Abacus Class */}
      <section className="abacus-hero-section" style={{ background: 'linear-gradient(135deg, #ff9f43 0%, #fd7e14 100%)', color: 'white', padding: '80px 0' }}>
        <div className="container">
          <div className="row justify-content-center align-items-center" style={{ minHeight: '300px' }}>
            <div className="col-lg-8 text-center mx-auto">
              <h1 className="display-4 fw-bold mb-3 text-white">Master Abacus – Mental Math for Life!</h1>
              <p className="lead mb-4 text-white">
                Unlock your child’s full potential with our proven Abacus training. Boost calculation speed, concentration, and confidence in a fun, interactive way!
              </p>
              {/* Enroll Now and Book Demo buttons styled like Hero section */}
              <div className="hero-buttons d-flex justify-content-center gap-3 mt-4">
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section py-5 bg-white">
        <Container>
          <div className="section-header text-center mb-5">
            <h2
              className="section-title fw-bold display-5 mb-3 text-orange"
              style={{ fontFamily: "sans-serif" }}
            >
              Benefits of Abacus Learning
            </h2>
            <p className="section-subtitle text-muted fs-5">
              Our program delivers measurable improvements in multiple cognitive areas
            </p>
          </div>

          <Row className="g-4">
            <Col md={6} lg={3}>
              <div className="benefit-card p-4 rounded-4 h-100 shadow-sm bg-white hover-shadow transition">
                <div
                  className="icon-wrapper bg-orange-light d-flex justify-content-center align-items-center rounded-circle mb-4 mx-auto"
                  style={{ width: "80px", height: "80px" }}
                >
                    <FaBolt size={40} className="text-orange" />
                </div>
                <div className="card-content text-center">
                  <h3 className="h5 fw-bold mb-3 text-dark">
                    Lightning Fast Calculations
                  </h3>
                  <p className="text-secondary mb-0">
                    Students perform complex arithmetic mentally with speed and
                    accuracy, reducing calculator dependency.
                  </p>
                </div>
              </div>
            </Col>

            <Col md={6} lg={3}>
              <div className="benefit-card p-4 rounded-4 h-100 shadow-sm bg-white hover-shadow transition">
                <div
                  className="icon-wrapper bg-orange-light d-flex justify-content-center align-items-center rounded-circle mb-4 mx-auto"
                  style={{ width: "80px", height: "80px" }}
                >
                    <FaBullseye size={40} className="text-orange" />
                </div>
                <div className="card-content text-center">
                  <h3 className="h5 fw-bold mb-3 text-dark">Enhanced Concentration</h3>
                  <p className="text-secondary mb-0">
                    Regular abacus practice significantly improves attention span,
                    focus, and visual memory retention.
                  </p>
                </div>
              </div>
            </Col>

            <Col md={6} lg={3}>
              <div className="benefit-card p-4 rounded-4 h-100 shadow-sm bg-white hover-shadow transition">
                <div
                  className="icon-wrapper bg-orange-light d-flex justify-content-center align-items-center rounded-circle mb-4 mx-auto"
                  style={{ width: "80px", height: "80px" }}
                >
                    <FaChartLine size={40} className="text-orange" />
                </div>
                <div className="card-content text-center">
                  <h3 className="h5 fw-bold mb-3 text-dark">Academic Excellence</h3>
                  <p className="text-secondary mb-0">
                    Abacus learners typically show 20–30% improvement in overall
                    academic performance, especially in mathematics.
                  </p>
                </div>
              </div>
            </Col>

            <Col md={6} lg={3}>
              <div className="benefit-card p-4 rounded-4 h-100 shadow-sm bg-white hover-shadow transition">
                <div
                  className="icon-wrapper bg-orange-light d-flex justify-content-center align-items-center rounded-circle mb-4 mx-auto"
                  style={{ width: "80px", height: "80px" }}
                >
                    <FaSmileBeam size={40} className="text-orange" />
                </div>
                <div className="card-content text-center">
                  <h3 className="h5 fw-bold mb-3 text-dark">Boosted Confidence</h3>
                  <p className="text-secondary mb-0">
                    Children gain tremendous self-confidence as they master skills
                    their peers find challenging.
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>


      {/* Testimonial Marquee Section */}
      <section className="testimonial-marquee py-5 bg-light-orange">
        <Container className="text-center mb-5">
          <h2 className="fw-bold display-5 mb-3">What Our Community Says</h2>
          <p className="text-muted fs-5">
            Trusted by parents, teachers, and schools across India
          </p>

          {/* Language Selector */}
          <div className="language-selector mb-4">
            <span className="me-3 text-muted small" style={{fontWeight: '600'}}>
              🌐 Select Language:
            </span>
            <div className="language-btn-group">
              {["english", "hindi", "marathi", "kannada"].map((lang) => (
                <button
                  key={lang}
                  className={`lang-btn ${selectedLanguage === lang ? "active" : ""}`}
                  onClick={() => setSelectedLanguage(lang)}
                >
                  {lang === "english"
                    ? "English"
                    : lang === "hindi"
                    ? "हिंदी"
                    : lang === "marathi"
                    ? "मराठी"
                    : "ಕನ್ನಡ"}
                </button>
              ))}
            </div>
          </div>
        </Container>

        <div className="marquee-wrapper">
          <div className="marquee-track marquee-animate">
            {testimonials.map((testimonial, index) => (
              <div key={`${testimonial.id}-${index}`} className="marquee-slide">
                <div className="testimonial-card bg-white p-4 rounded-3 shadow-sm h-100 text-center mx-2">
                  <div className="mb-3">
                    <img
                      src={testimonial.image}
                      alt={testimonial.nameEn || testimonial.name}
                      className="rounded-circle img-fluid"
                      style={{ width: "80px", height: "80px", objectFit: "cover" }}
                    />
                  </div>

                  <h4 className="h5 fw-bold mb-2">
                    {selectedLanguage === "marathi"
                      ? testimonial.name
                      : selectedLanguage === "hindi"
                      ? testimonial.nameHi || testimonial.nameEn
                      : selectedLanguage === "kannada"
                      ? testimonial.nameKn || testimonial.nameEn
                      : testimonial.nameEn || testimonial.name}
                  </h4>
                  <p className="text-muted small mb-3">
                    {selectedLanguage === "marathi"
                      ? testimonial.role
                      : selectedLanguage === "hindi"
                      ? testimonial.roleHi || testimonial.roleEn
                      : selectedLanguage === "kannada"
                      ? testimonial.roleKn || testimonial.roleEn
                      : testimonial.roleEn || testimonial.role}
                  </p>

                  <p className="mb-3">
                    "
                    {selectedLanguage === "marathi"
                      ? testimonial.content
                      : selectedLanguage === "hindi"
                      ? testimonial.contentHi || testimonial.contentEn
                      : selectedLanguage === "kannada"
                      ? testimonial.contentKn || testimonial.contentEn
                      : testimonial.contentEn || testimonial.content}
                    "
                  </p>
                  {/* Google Maps Review Link */}
                {testimonial.googlelink && (
  <div className="mb-2">
    <a
      href={testimonial.googlelink}
      target="_blank"
      rel="noopener noreferrer"
      className="text-orange"
      style={{ fontWeight: 600, textDecoration: "underline", fontSize: "0.95rem" }}
    >
      View Google Review
    </a>
  </div>
)}

                  <div className="text-orange fs-5">
                    {"★".repeat(testimonial.rating || 5)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AbacusPage;