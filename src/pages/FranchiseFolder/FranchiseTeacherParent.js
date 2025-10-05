import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaClipboardCheck, 
  FaUserGraduate, 
  FaMoneyBillWave, 
  FaShieldAlt,
  FaGraduationCap,
  FaDollarSign,
  FaLaptopHouse,
  FaHandsHelping,
  FaUsers,
  FaChild,
  FaClock,
  FaStar
} from 'react-icons/fa';
import './FranchiseTeacherParent.css';
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const FranchiseTeacherParent = () => {
  const [heroImage, setHeroImage] = useState("");
  
  // Enhanced benefits specifically for teachers and parents
  const benefits = [
    { 
      title: "Work From Home", 
      desc: "Perfect for parents and teachers. Run your center from home with flexible hours that suit your family schedule.",
      icon: <FaLaptopHouse className="benefit-icon" />,
      bgColor: "rgba(234, 88, 12, 0.1)",
      audience: ["Parents", "Teachers"]
    },
    { 
      title: "No Experience Needed", 
      desc: "Complete training provided. Perfect for homemakers and educators looking to start their own business.",
      icon: <FaGraduationCap className="benefit-icon" />,
      bgColor: "rgba(34, 197, 94, 0.1)",
      audience: ["Everyone"]
    },
    { 
      title: "Low Investment", 
      desc: "Start with just ₹10,000. Affordable for teachers and parents wanting to build a secure future.",
      icon: <FaDollarSign className="benefit-icon" />,
      bgColor: "rgba(59, 130, 246, 0.1)",
      audience: ["Parents", "Teachers"]
    },
    { 
      title: "Complete Support", 
      desc: "From training to marketing - we provide everything you need to succeed as an education entrepreneur.",
      icon: <FaHandsHelping className="benefit-icon" />,
      bgColor: "rgba(168, 85, 247, 0.1)",
      audience: ["Everyone"]
    }
  ];

  // Earning potential examples
  const earningExamples = [
    { 
      level: "Part-time", 
      hours: "1-2 hours/week", 
      students: "15-20", 
      income: "₹15,000-20,000/month",
      idealFor: "Homemakers, Teachers"
    },
    { 
      level: "Full-time", 
      hours: "4-6 hours/week", 
      students: "30-40", 
      income: "₹30,000-40,000/month",
      idealFor: "Career-focused Parents"
    },
    { 
      level: "Expanded", 
      hours: "6-8 hours/week", 
      students: "50+", 
      income: "₹40,000-60,000/month",
      idealFor: "Ambitious Educators"
    }
  ];

  const steps = [
    { 
      number: 1, 
      icon: <FaClipboardCheck className="step-icon" />, 
      title: "Apply & Consult", 
      desc: "Share your background and goals with our advisor",
      duration: "1-2 days"
    },
    { 
      number: 2, 
      icon: <FaUserGraduate className="step-icon" />, 
      title: "Complete Training", 
      desc: "2-week intensive Abacus & Vedic Math certification",
      duration: "2 weeks"
    },
    { 
      number: 3, 
      icon: <FaMoneyBillWave className="step-icon" />, 
      title: "Start Earning", 
      desc: "Launch your center with our marketing support",
      duration: "Immediate"
    }
  ];

  // Why choose for teachers and parents specifically
  const whyChoose = [
    {
      title: "For Teachers",
      icon: <FaUserGraduate className="why-icon" />,
      points: [
        "Supplement your income after school hours",
        "Use your existing teaching skills",
        "No additional qualification needed",
        "Proven curriculum and methodology"
      ]
    },
    {
      title: "For Parents",
      icon: <FaChild className="why-icon" />,
      points: [
        "Work around your children's schedule",
        "Be involved in your child's education",
        "Build a business from home",
        "Secure financial independence"
      ]
    },
    {
      title: "Flexible Timing",
      icon: <FaClock className="why-icon" />,
      points: [
        "Choose your working hours",
        "Weekend batches available",
        "Online or offline classes",
        "Scale at your own pace"
      ]
    }
  ];

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const docRef = doc(db, "franchiseHero", "heroImage");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const url = data.url;
          if (url && typeof url === "string" && url.startsWith("http")) {
            setHeroImage(url);
          } else {
            setHeroImage("/images/franchise-hero-default.jpg");
          }
        }
      } catch (error) {
        console.error("Error fetching hero image:", error);
        setHeroImage("/images/franchise-hero-default.jpg");
      }
    };

    fetchHeroImage();
  }, []);

  return (
    <>
      <Helmet>
        <title>Abacus & Vedic Math Franchise for Teachers & Parents | Shraddha Institute</title>
        <meta name="description" content="Perfect work-from-home opportunity for teachers and parents. Start your Abacus & Vedic Math center with ₹10,000 investment. Earn ₹15,000-₹60,000/month." />
        <meta name="keywords" content="teacher franchise, parent business, home tuition, abacus franchise, vedic math business, work from home, education franchise" />
        <meta property="og:title" content="Teacher & Parent Franchise Opportunity | Shraddha Institute" />
        <meta property="og:description" content="Start your education business from home. Perfect for teachers and parents. Complete training and support." />
      </Helmet>

      <div className="franchise-teacher-parent-page" style={{ fontFamily: 'sans-serif' }}>
        {/* Announcement Bar */}
        <div className="announcement-bar">
          <Container>
            <div className="announcement-content">
              <span className="announcement-badge">Limited Time Offer</span>
              <div className="announcement-text">
                Enroll now and get 20% OFF franchise fee! Perfect opportunity for teachers and parents.
              </div>
            </div>
          </Container>
        </div>

        {/* Enhanced Hero Section */}
        <section 
          className="franchise-teacher-parent-hero-section"
          style={{
            backgroundImage: heroImage ? `url(${heroImage})` : 'linear-gradient(135deg, #fd7e14 0%, #ff9f43 100%)',
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="franchise-teacher-parent-hero-overlay"></div>
          <Container>
            <Row className="align-items-center justify-content-center text-center">
              <Col lg={10} className="franchise-teacher-parent-hero-content">
                <Badge className="franchise-teacher-parent-hero-badge mb-3" style={{ fontSize: '0.9rem' }}>
                  <FaShieldAlt className="me-2" />
                  Perfect for Teachers & Parents
                </Badge>
                
                <h1 className="franchise-teacher-parent-hero-title">
                  Start Your Learning Center from <span className="highlight">Home</span>
                </h1>

                <div className="franchise-teacher-parent-hero-stats">
                  <div className="franchise-teacher-parent-stat-item">
                    <div className="franchise-teacher-parent-stat-number hero-stat-white">
                      Flexible Hours
                    </div>
                    <div className="franchise-teacher-parent-stat-label hero-stat-white">Teach when you want, fit your lifestyle</div>
                  </div>
                  <div className="franchise-teacher-parent-stat-item">
                    <div className="franchise-teacher-parent-stat-number hero-stat-white">
                      Complete Training
                    </div>
                    <div className="franchise-teacher-parent-stat-label hero-stat-white">Get certified & start with confidence</div>
                  </div>
                  <div className="franchise-teacher-parent-stat-item">
                    <div className="franchise-teacher-parent-stat-number hero-stat-white">
                      Work From Home
                    </div>
                    <div className="franchise-teacher-parent-stat-label hero-stat-white">No commute, earn from your own space</div>
                  </div>
                </div>

               
              </Col>
            </Row>
          </Container>
        </section>

        {/* Why Perfect for Teachers & Parents */}
        <section className="audience-section">
          <Container>
            <Row className="text-center mb-5">
              <Col lg={8} className="mx-auto">
                <h2 className="section-title" style={{ fontFamily: 'sans-serif' }}>
                  {/* Font type: set in CSS, e.g. font-family: 'Montserrat', Arial, sans-serif; */}
                  Why This Franchise is Perfect For
                </h2>
                <p className="section-subtitle">Designed specifically for educators and parents seeking flexible opportunities</p>
              </Col>
            </Row>
            
            <Row className="g-4">
              {whyChoose.map((item, index) => (
                <Col lg={4} md={6} key={index}>
                  <Card className="audience-card h-100 text-center">
                    <Card.Body className="p-4">
                      <div className="audience-icon">
                        {item.icon}
                      </div>
                      <h5 className="audience-title" style={{ fontFamily: 'sans-serif' }}>
                        {/* Font type: set in CSS, e.g. font-family: 'Montserrat', Arial, sans-serif; */}
                        {item.title}
                      </h5>
                      <ul className="audience-points">
                        {item.points.map((point, i) => (
                          <li key={i} className="audience-point">
                            <FaStar className="text-warning me-2" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Benefits Section */}
        <section className="benefits-section">
          <Container>
            <Row className="text-center mb-5">
              <Col lg={8} className="mx-auto">
                <h2 className="section-title">Everything You Need to Succeed</h2>
                <p className="section-subtitle">Complete support system for education entrepreneurs</p>
              </Col>
            </Row>

            <Row className="g-4">
              {benefits.map((benefit, index) => (
                <Col lg={3} md={6} key={index}>
                  <Card className="benefit-card h-100 text-center">
                    <Card.Body className="p-4">
                      <div className="benefit-icon-container">
                        {benefit.icon}
                      </div>
                      <h5 className="benefit-title" style={{ fontFamily: 'sans-serif' }}>
                        {/* Font type: set in CSS, e.g. font-family: 'Montserrat', Arial, sans-serif; */}
                        {benefit.title}
                      </h5>
                      <p className="benefit-text">{benefit.desc}</p>
                      <div className="benefit-audience">
                        {benefit.audience.map((aud, i) => (
                          <span key={i} className="audience-tag">{aud}</span>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Earning Potential */}
        <section className="earnings-section bg-light">
          <Container>
            <Row className="text-center mb-5">
              <Col lg={8} className="mx-auto">
                <h2 className="section-title">Your Earning Potential</h2>
                <p className="section-subtitle">Flexible options based on your time commitment</p>
              </Col>
            </Row>

            <Row className="g-4">
              {earningExamples.map((example, index) => (
                <Col lg={4} md={6} key={index}>
                  <Card className="earning-card h-100 text-center">
                    <Card.Body className="p-4">
                      <div className="earning-level" style={{ fontFamily: 'sans-serif' }}>
                        {/* Font type: set in CSS, e.g. font-family: 'Montserrat', Arial, sans-serif; */}
                        {example.level}
                      </div>
                      <div className="earning-income">{example.income}</div>
                      <div className="earning-details">
                        <div className="earning-detail">
                          <FaClock className="me-2" />
                          {example.hours}
                        </div>
                        <div className="earning-detail">
                          <FaUsers className="me-2" />
                          {example.students} students
                        </div>
                      </div>
                      <div className="earning-audience">
                        Ideal for: {example.idealFor}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Steps Section */}
        <section className="steps-section">
          <Container>
            <Row className="text-center mb-5">
              <Col lg={8} className="mx-auto">
                <h2 className="section-title">Start in 3 Simple Steps</h2>
                <p className="section-subtitle">We guide you through the entire process</p>
              </Col>
            </Row>

            <Row className="justify-content-center g-4">
              {steps.map((step, index) => (
                <Col lg={4} md={6} key={index}>
                  <Card className="step-card h-100 text-center">
                    <Card.Body className="p-4">
                      <div className="step-number">{step.number}</div>
                      <div className="step-icon-container">
                        {step.icon}
                      </div>
                      <h5 className="step-title" style={{ fontFamily: 'sans-serif' }}>
                        {/* Font type: set in CSS, e.g. font-family: 'Montserrat', Arial, sans-serif; */}
                        {step.title}
                      </h5>
                      <p className="step-desc">{step.desc}</p>
                      <div className="step-duration">
                        <FaClock className="me-2" />
                        {step.duration}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Final CTA */}
        <section className="cta-section">
          <Container>
            <Row className="text-center">
              <Col lg={8} className="mx-auto">
                <h2 className="cta-title" style={{ fontFamily: 'sans-serif' }}>
                  {/* Font type: set in CSS, e.g. font-family: 'Montserrat', Arial, sans-serif; */}
                  Ready to Start Your Teaching Business?
                </h2>
                <p className="cta-subtitle">
                  Join 50+ successful teachers and parents who transformed their careers with our franchise
                </p>
                
                <div className="cta-buttons">
                  <Link to="/contact" className="btn btn-primary btn-lg px-5">
                    Start My Franchise Journey
                  </Link>
                </div>
                
                <div className="cta-guarantee">
                  <FaShieldAlt className="me-2" />
                  Complete training • Ongoing support • Proven success
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    </>
  );
};

export default FranchiseTeacherParent;