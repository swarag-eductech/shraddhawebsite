import React, { useEffect, useState } from "react";
import { Container, Row, Col, Accordion, Card} from "react-bootstrap";
import { CheckCircleFill,  PeopleFill, AwardFill, BookFill, GearFill, GraphUp } from "react-bootstrap-icons";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import "./FranchiseTrainingPage.css";

// Franchise Benefits
const franchiseBenefits = [
  {
    icon: <GraphUp className="benefit-icon" />,
    title: "Low Investment",
    description: "Start with minimal cost and enjoy high ROI with proven business model",
  },
  {
    icon: <AwardFill className="benefit-icon" />,
    title: "Trusted Brand",
    description: "Be part of Shraddha Institute's nationwide network with 50+ centers",
  },
  {
    icon: <BookFill className="benefit-icon" />,
    title: "Ready Curriculum",
    description: "Use our proven Abacus & Vedic Maths course material and lesson plans",
  },
  {
    icon: <PeopleFill className="benefit-icon" />,
    title: "Ongoing Support",
    description: "Continuous teacher training, marketing assistance, and business guidance",
  },
];

// Training Audience
const trainingAudienceStatic = [
  {
    title: "Teachers",
    description: "Expand your teaching career with certified programs",
    image: "/images/teachers.jpg",
  },
  {
    title: "Housewives",
    description: "Start a rewarding career from home with flexible timings",
    image: "/images/housewives.jpg",
  },
  {
    title: "Entrepreneurs",
    description: "Build a profitable education business with our support",
    image: "/images/entrepreneurs.jpg",
  },
  {
    title: "Coaching Institutes",
    description: "Add premium courses to your existing institute",
    image: "/images/coaching.jpg",
  },
];

const FTrainingPage = () => {
  const [trainingAudience, setTrainingAudience] = useState([]);
  const [heroImage, setHeroImage] = useState(null);

  useEffect(() => {
    const fetchAudience = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "trainingAudience"));
        // Expecting each doc to have { url: "...", caption: "..." }
        const audienceData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTrainingAudience(audienceData);
      } catch (error) {
        console.error("Error fetching training audience:", error);
        // Fallback to static audience if Firestore fails
        setTrainingAudience(trainingAudienceStatic);
      }
    };

    fetchAudience();
  }, []);

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "heroImages"));
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data(); // first doc
          setHeroImage(data.url);
        }
      } catch (error) {
        console.error("Error fetching hero image:", error);
      }
    };

    fetchHeroImage();
  }, []);

  return (
    <div className="franchise-training-page">
      {/* HERO SECTION */}
     {/* HERO SECTION */}
{/* ENHANCED HERO SECTION - MOBILE OPTIMIZED */}
<section
  className="franchise-hero-section position-relative"
  style={
    heroImage
      ? {
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
        }
      : {
          background: "linear-gradient(135deg, #fd7e14 0%, #ff9f43 50%, #dc2626 100%)"
        }
  }
>
  {/* Enhanced Overlay for Better Readability */}
  <div
    className="hero-overlay"
   
  ></div>
  
  {/* Animated Background Elements */}
  <div className="hero-background-elements">
    <div className="floating-shape shape-1"></div>
    <div className="floating-shape shape-2"></div>
    <div className="floating-shape shape-3"></div>
  </div>

  <Container style={{ position: "relative", zIndex: 2 }}>
    <Row className="align-items-center justify-content-center text-center">
      <Col lg={10} className="hero-content-wrapper">
        {/* Trust Badges - Mobile Optimized */}
        <div className="hero-badges-mobile mb-3">
          <span className="hero-badge-mobile">
            <AwardFill className="me-1" size={19} />
            Since 2013
          </span>
        </div>

        {/* Main Heading - Mobile Optimized */}
        <h1 className="hero-title-mobile mb-3">
          Start Your Own{" "}
          <span className="brand-highlight-mobile text-orange">
            Shraddha Institute
          </span>{" "}
          Franchise
        </h1>

       
        {/* Enhanced Stats - Mobile Friendly */}
        <div className="hero-stats-mobile d-none d-md-flex">
         
          <div className="stat-item-mobile">
            <div className="stat-number-mobile">2-3x</div>
            <div className="stat-label-mobile">ROI</div>
          </div>
          <div className="stat-item-mobile">
            <div className="stat-number-mobile">100%</div>
            <div className="stat-label-mobile">Support</div>
          </div>
        </div>
        {/* For mobile, just add spacing */}
        <div className="hero-stats-mobile-spacer d-block d-md-none" style={{ height: "32px" }}></div>

        
        {/* Quick Features */}
        <div className="hero-features-mobile mt-3">
          <small className="text-white-80">
            ✅ No Teaching Experience Required • ✅ Complete Training • ✅ Ongoing Support
          </small>
        </div>

        {/* Scroll Indicator */}
        
      </Col>
    </Row>
  </Container>
</section>
      {/* BENEFITS SECTION */}
      <section className="section benefits-section">
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <h2 className="section-title">Why Choose Our Franchise?</h2>
              <p className="section-subtitle">
                Trusted by 50+ successful centers across India with proven track record
              </p>
            </Col>
          </Row>
          <Row className="justify-content-center">
            {franchiseBenefits.map((benefit, index) => (
              <Col lg={3} md={6} key={index} className="mb-4">
                <Card className="benefit-card h-100 text-center">
                  <Card.Body className="p-4">
                    <div className="benefit-icon-container mb-3">
                      {benefit.icon}
                    </div>
                    <h5 className="benefit-title">{benefit.title}</h5>
                    <p className="benefit-text">{benefit.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* COMPARISON SECTION */}
      <section className="section comparison-section bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <h2 className="section-title">Before vs After Franchise</h2>
              <p className="section-subtitle">See the transformation in your teaching journey</p>
            </Col>
          </Row>
          <Row className="g-4">
            <Col lg={6}>
              <Card className="comparison-card before-card h-100">
                <Card.Body className="p-4">
                  <div className="comparison-header mb-4">
                    <div className="comparison-icon danger">❌</div>
                    <h4 className="comparison-title text-danger">Before Franchise</h4>
                  </div>
                  <ul className="comparison-list">
                    <li>Uncertain teaching methods and curriculum</li>
                    <li>No brand recognition or trust factor</li>
                    <li>Struggle with student enrollment</li>
                    <li>Limited earnings potential</li>
                    <li>Managing everything alone</li>
                    <li>No systematic growth plan</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="comparison-card after-card h-100">
                <Card.Body className="p-4">
                  <div className="comparison-header mb-4">
                    <div className="comparison-icon success">✅</div>
                    <h4 className="comparison-title text-success">After Joining</h4>
                  </div>
                  <ul className="comparison-list">
                    <li>Certified Abacus & Vedic Math curriculum</li>
                    <li>Nationwide brand recognition and trust</li>
                    <li>Proven admission and marketing strategies</li>
                    <li>High ROI and growth potential</li>
                    <li>Complete ongoing training & support</li>
                    <li>Systematic business expansion plan</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* TRAINING MODULES & TARGET AUDIENCE MERGED */} 
     {/* TRAINING MODULES & TARGET AUDIENCE MERGED */} 
<section className="training-benefit-section py-5 gradient-bg">
  <Container>
    <Row className="text-center mb-5">
      <Col>
        <h2 className="fw-bold" style={{ color: "#fd7e14", fontSize: "2rem", textShadow: "0 2px 8px #fffbe6" }}>
          Our Training Helps
        </h2>
        <p style={{ color: "#fd7e14", fontSize: "1.15rem", textShadow: "0 1px 6px #fffbe6" }}>
          Ideal opportunity for various backgrounds
        </p>
      </Col>
    </Row>
    <Row className="justify-content-center">
      {trainingAudience.map((item, idx) => (
        <Col xs={12} sm={6} md={3} key={idx} className="mb-4"> {/* Changed xs={6} to xs={12} */}
          <Card className="benefit-card text-center h-100">
            <div className="benefit-img-wrapper">
              <Card.Img 
                src={item.url} 
                alt={item.caption || item.title || `Audience ${idx+1}`}
                style={{ height: "200px", objectFit: "cover" }}
              />
            </div>
            <Card.Body className="d-flex flex-column">
              <h5 className="fw-bold mb-3" style={{ color: "#ff9f43" }}>
                {["Teacher", "Housewife", "Entrepreneur", "Coaching Institute"][idx] || "Beneficiary"}
              </h5>
              <p className="audience-description flex-grow-1">
                {typeof trainingAudienceStatic[idx] !== "undefined" ? trainingAudienceStatic[idx].description : ""}
              </p>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </Container>
</section>

      {/* SUPPORT SECTION */}
      <section className="section support-section bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <h2 className="section-title">Ongoing Franchise Support</h2>
              <p className="section-subtitle">We're with you at every step of your journey</p>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col lg={8}>
              <Accordion flush className="support-accordion">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <div className="accordion-header-content">
                      <PeopleFill className="accordion-icon me-3" />
                      <span>Marketing & Promotion Support</span>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    Complete marketing toolkit including templates, social media strategies, 
                    local promotion guides, and admission campaign support.
                  </Accordion.Body>
                </Accordion.Item>
                
                <Accordion.Item eventKey="1">
                  <Accordion.Header>
                    <div className="accordion-header-content">
                      <BookFill className="accordion-icon me-3" />
                      <span>Teacher Training & Workshops</span>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    Regular training workshops, updated teaching methodologies, 
                    and continuous skill development programs for your staff.
                  </Accordion.Body>
                </Accordion.Item>
                
                <Accordion.Item eventKey="2">
                  <Accordion.Header>
                    <div className="accordion-header-content">
                      <AwardFill className="accordion-icon me-3" />
                      <span>Curriculum Updates</span>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    Quarterly updates to course materials, books, worksheets, 
                    and teaching aids to keep your curriculum current and effective.
                  </Accordion.Body>
                </Accordion.Item>
                
                <Accordion.Item eventKey="3">
                  <Accordion.Header>
                    <div className="accordion-header-content">
                      <GearFill className="accordion-icon me-3" />
                      <span>Business Consultations</span>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    Monthly one-on-one business consultations, growth strategy 
                    sessions, and operational guidance for sustainable success.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA SECTION */}
      <section className="section cta-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h2 className="cta-title">Ready to Start Your Franchise Journey?</h2>
              <p className="cta-subtitle">
                Join India's most trusted Abacus & Vedic Maths franchise network
              </p>
              
              <div className="cta-features mb-4 d-flex flex-wrap justify-content-center gap-3">
                <div className="cta-feature">
                  <CheckCircleFill className="me-2" /> Low Investment
                </div>
                <div className="cta-feature">
                  <CheckCircleFill className="me-2" /> Complete Training
                </div>
                <div className="cta-feature">
                  <CheckCircleFill className="me-2" /> Ongoing Support
                </div>
                <div className="cta-feature">
                  <CheckCircleFill className="me-2" /> Proven Success
                </div>
              </div>
              
        
              
              <div className="cta-note">
                Limited franchise opportunities available. Apply today to secure your territory.
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default FTrainingPage;