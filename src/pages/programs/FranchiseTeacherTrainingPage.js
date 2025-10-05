import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import { GraphUp, ClockFill, StarFill, PeopleFill, CashCoin, GearFill,  CheckCircleFill } from "react-bootstrap-icons";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase";
import './FranchiseTeacherTrainingPage.css';

// Profit-focused benefits
const profitBenefits = [
  { icon: <GraphUp className="benefit-icon" />, title: "Income Growth", text: "Proven strategies to scale from 1 to 5+ batches and increase earnings" },
  { icon: <ClockFill className="benefit-icon" />, title: "Time Efficiency", text: "Ready lesson plans and tools to minimize prep time and maximize teaching" },
  { icon: <PeopleFill className="benefit-icon" />, title: "Student Retention", text: "Keep 90%+ students with engaging techniques and parent communication" },
  { icon: <CashCoin className="benefit-icon" />, title: "Pricing Strategy", text: "Optimize fees for your market while maintaining competitive edge" },
  { icon: <GearFill className="benefit-icon" />, title: "Business Automation", text: "Systems for attendance, payments, and communication to save time" },
];

// Earnings potential examples
const earningExamples = [
  { batches: 1, students: 15, revenue: "₹15,000-25,000", description: "Start with one batch" },
  { batches: 2, students: 30, revenue: "₹30,000-50,000", description: "Expand to two batches" },
  { batches: 3, students: 45, revenue: "₹45,000-75,000", description: "Grow to three batches" },
  { batches: 4, students: 60, revenue: "₹60,000-1,00,000", description: "Manage four batches" },
];

// Teacher journey timeline
const teacherJourney = [
  { step: 1, title: "Apply & Consult", description: "Share your background and goals with our advisor" },
  { step: 2, title: "Training Program", description: "Complete 2-week intensive certification" },
  { step: 3, title: "Setup Support", description: "Get help establishing your teaching center" },
  { step: 4, title: "Launch First Batch", description: "Start teaching with our marketing support" },
  { step: 5, title: "Scale Your Business", description: "Add batches and increase income" },
];

// Testimonials from TeacherTrainingPage
const teacherTestimonials = [
  {
    name: "Priya Sharma",
    role: "Math Teacher, Delhi",
    text: "After training, I launched 3 batches in 2 months! The student retention strategies helped me keep 95% of kids—and parents pay on time, every time.",
    rating: 5,
    image: "/images/teacher1.jpg"
  },
  {
    name: "Rahul Patel",
    role: "Home Tutor, Mumbai",
    text: "I doubled my income by adding abacus classes. The batch scaling guide showed me how to teach 20+ students at once without extra effort!",
    rating: 5,
    image: "/images/teacher2.jpg"
  },
  {
    name: "Meera Krishnan",
    role: "Center Owner, Bangalore",
    text: "The profit planning workshop was a game-changer. I now earn ₹40k/month from 2 batches—all with the tools provided in training!",
    rating: 4,
    image: "/images/teacher3.jpg"
  },
];

const FranchiseTeacherTrainingPage = () => {
  // Marquee state
  const [marqueeMessages, setMarqueeMessages] = useState([]);
  // Combined testimonials state
  const [allTestimonials, setAllTestimonials] = useState([]);
  const [translateX, setTranslateX] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("english");

  useEffect(() => {
    const fetchMarquees = async () => {
      try {
        const snap1 = await getDocs(collection(db, "marquee1"));
        const snap2 = await getDocs(collection(db, "marquee2"));
        const msgs1 = snap1.docs.map(doc => doc.data().text);
        const msgs2 = snap2.docs.map(doc => doc.data().text);
        setMarqueeMessages([...msgs1, ...msgs2]);
      } catch (err) {
        setMarqueeMessages(["Welcome to Franchise Teacher Training!", "Grow your business and teaching career with us."]);
      }
    };
    fetchMarquees();
  }, []);

  // Fetch testimonials from AbacusPage and VedicMathPage, then combine
  useEffect(() => {
    const fetchCombinedTestimonials = async () => {
      try {
        const abacusSnap = await getDocs(collection(db, "testimonials"));
        const abacusTestimonials = abacusSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), source: "abacus" }));

        const vedicSnap = await getDocs(collection(db, "successStories"));
        const vedicTestimonials = vedicSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), source: "vedic" }));

        // Use local testimonials if Firebase fails
        setAllTestimonials([...abacusTestimonials, ...vedicTestimonials, ...teacherTestimonials]);
      } catch (error) {
        console.error("Error fetching testimonials or success stories:", error);
        setAllTestimonials([...teacherTestimonials]);
      }
    };
    fetchCombinedTestimonials();
  }, []);

  // Marquee effect
  useEffect(() => {
    if (isPaused || allTestimonials.length === 0) return;
    const interval = setInterval(() => {
      setTranslateX(prev => {
        // Reset position when all testimonials have scrolled
        if (Math.abs(prev) > allTestimonials.length * 360) return 0;
        return prev - 1;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [isPaused, allTestimonials.length]);

  return (
    <div className="franchise-teacher-training-page">
      {/* Marquee for announcements */}
      <div className="announcement-bar">
        <div className="announcement-scroll">
          {marqueeMessages.join("   •   ")}
        </div>
      </div>

      {/* HERO SECTION */}
      <section 
        className="franchise-hero-section" 
        style={{ 
          background: 'linear-gradient(135deg, #ff9f43 0%, #fd7e14 100%)', 
          color: 'white', 
          padding: '80px 0',
          minHeight: '300px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div className="container h-100">
          <div className="row h-100 justify-content-center align-items-center">
            <div className="col-lg-10 text-center mx-auto">
              <Badge bg="light" text="dark" className="hero-badge mb-3">
                <i className="bi bi-trophy-fill me-2"></i>
                Franchise Opportunity for Teachers
              </Badge>
              <h1 className="hero-title fw-bold mb-3">
                Transform Your Teaching Career Into a Thriving Business
              </h1>
              <div className="hero-stats-row d-flex justify-content-center flex-wrap gap-4 mt-4">
                <div className="stat-item text-center">
                  <div className="stat-number small-hero-stat-number">600+</div>
                  <div className="stat-label small-hero-stat-label">Successful Teachers</div>
                </div>
                <div className="stat-item text-center">
                  <div className="stat-number small-hero-stat-number">95%</div>
                  <div className="stat-label small-hero-stat-label">Retention Rate</div>
                </div>
                <div className="stat-item text-center">
                  <div className="stat-number small-hero-stat-number">2-3x</div>
                  <div className="stat-label small-hero-stat-label">Income Increase</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY TEACHERS CHOOSE US - Horizontal Scrolling Section */}
      <section className="section why-section">
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <h2 className="section-title">Why Teachers Choose Our Franchise Program</h2>
              <p className="section-subtitle">Designed specifically for educators who want to build a successful business</p>
            </Col>
          </Row>
          
          {/* Horizontal scrolling benefits container */}
          <div className="benefits-container">
            <div className="benefits-row">
              {profitBenefits.map((item, index) => (
                <div key={index} className="benefit-card-wrapper">
                  <Card className="benefit-card">
                    <Card.Body className="text-center p-4">
                      <div className="benefit-icon-container mb-3">
                        {item.icon}
                      </div>
                      <h5 className="benefit-title">{item.title}</h5>
                      <p className="benefit-text">{item.text}</p>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          
          <div className="scroll-hint">
            <i className="bi bi-arrow-left-right"></i> Scroll to see more benefits
          </div>
        </Container>
      </section>

      {/* EARNING POTENTIAL */}
      <section className="section earnings-section">
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <h2 className="section-title">Your Earning Potential</h2>
              <p className="section-subtitle">Flexible teaching options with clear income progression</p>
            </Col>
          </Row>
          
          <Row className="justify-content-center">
            {earningExamples.map((example, index) => (
              <Col xl={3} lg={6} md={6} key={index} className="mb-4">
                <Card className="earning-card h-100 text-center">
                  <Card.Body className="p-4">
                    <div className="earning-batches">{example.batches} Batch{example.batches > 1 ? 'es' : ''}</div>
                    <div className="earning-students">{example.students} Students</div>
                    <div className="earning-revenue">{example.revenue}</div>
                    <div className="earning-description">{example.description}</div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          
          <Row className="mt-5">
            <Col className="text-center">
              <p className="earning-note">
                Most franchise teachers reach 2-3 batches within 6 months and 4+ batches within a year
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* TEACHER JOURNEY */}
       <section className="section journey-section">
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <h2 className="section-title">Your Journey to Franchise Teacher</h2>
              <p className="section-subtitle">From application to running your successful teaching business</p>
            </Col>
          </Row>
          <Row className="journey-timeline">
            {teacherJourney.map((step, index) => (
              <Col key={index} className="journey-step">
                <div className="step-number">{step.step}</div>
                <h5 className="step-title">{step.title}</h5>
                <p className="step-description">{step.description}</p>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* TESTIMONIALS */}
      {/* TESTIMONIALS */}
      {/* TESTIMONIALS MARQUEE */}
      <section className="testimonials-section py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="section-heading mb-3">Community Success Stories</h2>
              <p className="text-muted">Teachers & Franchise Owners who transformed their careers</p>
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
            </Col>
          </Row>
          {/* Marquee effect with proper gap and single row */}
          <div
            style={{
              overflow: "hidden",
              width: "100%",
              background: "#fff",
              borderRadius: "18px",
              marginBottom: "2rem",
              padding: "10px 0"
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              style={{
                display: "flex",
                gap: "32px",
                transform: `translateX(${translateX}px)`,
                transition: isPaused ? "transform 0.2s" : "none",
                width: "max-content",
                alignItems: "stretch"
              }}
            >
              {[...allTestimonials, ...allTestimonials].map((testimonial, idx) => {
                let testimonialText = testimonial.text;
                let name = testimonial.nameEn || testimonial.name;
                let role = testimonial.roleEn || testimonial.role;
                if (testimonial.content && typeof testimonial.content === "object") {
                  testimonialText =
                    testimonial.content[selectedLanguage] ||
                    testimonial.content.english ||
                    Object.values(testimonial.content)[0];
                } else {
                  if (selectedLanguage === "marathi") {
                    name = testimonial.name || name;
                    role = testimonial.role || role;
                    testimonialText = testimonial.content || testimonialText;
                  } else if (selectedLanguage === "hindi") {
                    name = testimonial.nameHi || name;
                    role = testimonial.roleHi || role;
                    testimonialText = testimonial.contentHi || testimonialText;
                  } else if (selectedLanguage === "kannada") {
                    name = testimonial.nameKn || name;
                    role = testimonial.roleKn || role;
                    testimonialText = testimonial.contentKn || testimonialText;
                  } else {
                    name = testimonial.nameEn || testimonial.name;
                    role = testimonial.roleEn || testimonial.role;
                    testimonialText = testimonial.contentEn || testimonial.content || testimonialText;
                  }
                }
                return (
                  <div key={testimonial.id || idx} style={{ minWidth: 340, maxWidth: 340, flex: "0 0 340px" }}>
                    <Card className="border-0 shadow-sm h-100 p-3 text-center d-flex flex-column align-items-center justify-content-between" style={{ height: "320px" }}>
                      <Card.Body className="d-flex flex-column align-items-center justify-content-between" style={{ height: "100%" }}>
                        {testimonial.image && (
                          <div className="mb-3">
                            <img
                              src={testimonial.image}
                              alt={name}
                              style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover" }}
                            />
                          </div>
                        )}
                        <h5 className="mb-1">{name}</h5>
                        <small className="text-muted mb-2">{role}</small>
                        <p className="italic mb-3 mt-2" style={{ minHeight: 60, fontSize: "1rem" }}>"{testimonialText}"</p>
                        <div className="mb-2">
                          <a
                            href="https://maps.app.goo.gl/8PwoeLTMV5KDffWc8"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange"
                            style={{ fontWeight: 600, textDecoration: "underline", fontSize: "0.95rem" }}
                          >
                            View Google Map Review
                          </a>
                        </div>
                        <div className="d-flex justify-content-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <StarFill
                              key={i}
                              color={i < (testimonial.rating || 5) ? "#fd7e14" : "#e9ecef"}
                              size={18}
                            />
                          ))}
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA SECTION */}
      <section className="section cta-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h2 className="cta-title">Ready to Build Your Teaching Business?</h2>
              <p className="cta-subtitle">
                Join our network of successful franchise teachers and start earning what you're truly worth
              </p>
              
              <div className="cta-features mb-4 d-flex flex-wrap justify-content-center gap-3">
                <div className="cta-feature">
                  <CheckCircleFill className="me-2" /> No business experience needed
                </div>
                <div className="cta-feature">
                  <CheckCircleFill className="me-2" /> Complete training & support
                </div>
                <div className="cta-feature">
                  <CheckCircleFill className="me-2" /> Proven teaching system
                </div>
              </div>
              
              
              
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default FranchiseTeacherTrainingPage;