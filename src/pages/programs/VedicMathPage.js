import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Accordion, Badge } from 'react-bootstrap';
import { LightningFill, ClockFill, AwardFill, GraphUp, CheckCircleFill } from 'react-bootstrap-icons';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // adjust path if needed
import './vedicMathPage.css';

const VedicMathPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [successStories, setSuccessStories] = useState([]);

  // ✅ Fetch testimonials from Firestore
  useEffect(() => {
    const fetchSuccessStories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "successStories"));
        const stories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSuccessStories(stories);
      } catch (error) {
        console.error("Error fetching success stories:", error);
      }
    };
    fetchSuccessStories();
  }, []);

  const benefits = [
    {
      title: "Trick-Based Learning",
      description: "Master 16 Vedic sutras that dramatically reduce calculation time for complex problems.",
      icon: <LightningFill size={24} color="#fd7e14" />
    },
    {
      title: "Improved Accuracy",
      description: "Reduce errors by 70% in school exams and competitive tests with systematic approaches.",
      icon: <AwardFill size={24} color="#fd7e14" />
    },
    {
      title: "Mental Agility",
      description: "Develop lightning-fast mental math skills that last a lifetime.",
      icon: <ClockFill size={24} color="#fd7e14" />
    }
  ];

  const curriculum = [
    {
      level: "Level 1: Base Vedic Techniques",
      content: "Master the foundational 16 sutras, Nikhilam multiplication, and digit-sum verification methods.",
      duration: "8 weeks",
      skills: ["Basic Sutras", "Nikhilam Multiplication", "Digit-Sum Verification"]
    },
    {
      level: "Level 2: Intermediate Applications",
      content: "Advanced techniques for square roots, cube roots, algebraic equations, and percentage calculations.",
      duration: "10 weeks",
      skills: ["Square Roots", "Cube Roots", "Algebraic Equations", "Percentages"]
    },
    {
      level: "Level 3: Competitive Exam Prep",
      content: "Application in real-world scenarios including Olympiads, SAT, and entrance examinations.",
      duration: "12 weeks",
      skills: ["Exam Strategies", "Speed Techniques", "Problem Patterns"]
    }
  ];

  const stats = [
    { value: "10x", label: "Faster Calculations", icon: <GraphUp size={32} color="#fd7e14" /> },
    { value: "94%", label: "Accuracy Improvement", icon: <AwardFill size={32} color="#fd7e14" /> },
    { value: "900+", label: "Happy Students", icon: <LightningFill size={32} color="#fd7e14" /> }
  ];

  return (
    <div className="vedic-math-page">
      {/* Hero Section */}
      <section className="vedic-hero-section" style={{ background: 'linear-gradient(135deg, #ff9f43 0%, #fd7e14 100%)', color: 'white', padding: '80px 0' }}>
        <div className="container">
          <div className="row justify-content-center align-items-center" style={{ minHeight: '300px' }}>
            <div className="col-lg-8 text-center mx-auto">
              <h1 className="display-4 fw-bold mb-3 text-white">Vedic Math – Ancient Speed, Modern Success!</h1>
              <p className="lead mb-4 text-white">Empower your child with Vedic Math techniques for lightning-fast calculations, improved accuracy, and a lifelong love for numbers!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5 bg-light">
        <Container>
          <Row className="g-4 justify-content-center">
            {stats.map((stat, index) => (
              <Col md={4} key={index} className="text-center">
                <div className="stat-card p-4 rounded-3 bg-white shadow-sm h-100">
                  <div className="stat-icon mb-3">{stat.icon}</div>
                  <h3 className="display-5 fw-bold text-orange">{stat.value}</h3>
                  <p className="mb-0 text-muted">{stat.label}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section py-5">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={8} className="text-center">
              <h2 className="section-title mb-3">
                Why <span className="text-orange">Vedic Math</span> Works
              </h2>
              <p className="section-subtitle lead text-muted">Scientifically-proven techniques that make math enjoyable and effortless</p>
            </Col>
          </Row>
          <Row className="g-4">
            {benefits.map((benefit, index) => (
              <Col lg={4} key={index}>
                <div className="benefit-card h-100 d-flex flex-column align-items-center justify-content-center p-4 rounded-4 shadow-sm bg-white">
                  <div className="icon-container mb-4 d-flex align-items-center justify-content-center rounded-circle bg-orange-light" style={{ width: '80px', height: '80px' }}>
                    {benefit.icon}
                  </div>
                  <h3 className="h4 fw-bold mb-3 text-center">{benefit.title}</h3>
                  <p className="text-muted mb-0 text-center">{benefit.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Curriculum Section */}
      <section className="curriculum-section py-5 bg-light">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={8} className="text-center">
              <h2 className="section-title mb-3">Our <span className="text-orange">Structured</span> Curriculum</h2>
              <p className="section-subtitle lead text-muted">Progressive learning path designed for maximum results</p>
            </Col>
          </Row>
          <Row>
            <Col lg={10} className="mx-auto">
              <Accordion flush className="curriculum-accordion">
                {curriculum.map((item, index) => (
                  <Accordion.Item eventKey={index.toString()} key={index} className="mb-3 border-0">
                    <Accordion.Header className="accordion-header p-4">
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <div>
                          <h3 className="h5 mb-1 fw-bold">{item.level}</h3>
                          <Badge bg="orange" className="me-2">{item.duration}</Badge>
                        </div>
                        <div className="d-none d-md-block">
                          {item.skills.map((skill, i) => (
                            <Badge key={i} bg="light" text="dark" className="me-2">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body className="p-4 bg-white">
                      <p>{item.content}</p>
                      <div className="mt-3">
                        <h4 className="h6 fw-bold mb-2">You'll Learn:</h4>
                        <ul className="list-unstyled">
                          {item.skills.map((skill, i) => (
                            <li key={i} className="mb-2">
                              <CheckCircleFill className="text-success me-2" />
                              {skill}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Success Stories from Firestore */}
      <section className="testimonial-marquee py-5 bg-light-orange">
        <Container className="text-center mb-5">
          <Badge bg="orange" className="mb-3 px-3 py-2 fs-6">SUCCESS STORIES</Badge>
          <h2 className="display-5 fw-bold mb-3 text-dark">
            Transforming <span className="text-orange">Lives Through Math</span>
          </h2>
          <p className="lead text-muted">
            Real results from students, parents, and teachers who have experienced the Vedic Math difference
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
                  {lang === "english" ? "English" :
                   lang === "hindi" ? "हिंदी" :
                   lang === "marathi" ? "मराठी" :
                   "ಕನ್ನಡ"}
                </button>
              ))}
            </div>
          </div>
        </Container>

        <div className="marquee-wrapper">
          <div className="marquee-track marquee-animate">
            {successStories.map((story, index) => (
              <div key={`${story.id}-${index}`} className="marquee-slide">
                <div className="testimonial-card bg-white p-4 rounded-3 shadow-sm h-100 text-center mx-2">
                  <div className="mb-3">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="rounded-circle img-fluid"
                      style={{ width: "80px", height: "80px", objectFit: "cover" }}
                    />
                  </div>
                  <h4 className="h5 fw-bold mb-2">{story.name}</h4>
                  <p className="mb-3">
                    "{story.content?.[selectedLanguage]}"
                  </p>
                  <div className="text-orange fs-5">
                    {"★".repeat(story.rating || 5)}
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

export default VedicMathPage;
