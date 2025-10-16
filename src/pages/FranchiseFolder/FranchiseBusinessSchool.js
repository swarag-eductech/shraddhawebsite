import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Container, Row, Col,  Card, Badge } from 'react-bootstrap';

import { 
  FaChartLine, FaChalkboardTeacher, 
  FaAward, FaUsers, FaGraduationCap, 
   FaStar, 
  FaCheckCircle, 
} from 'react-icons/fa';
import {  IoIosTrendingUp } from 'react-icons/io';

import './FranchiseBusinessSchool.css';

const FranchiseBusinessSchool = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);



  // Enhanced benefits with stronger emotional appeal
  const transformationalBenefits = [
    {
      icon: <FaGraduationCap size={48} className="text-orange" />,
      title: 'Abacus & Vedic Math: Transform Student Performance',
      text: 'Empower your students with world-class calculation skills, improved concentration, and confidence in mathematics.',
      stat: '2x Faster Calculations',
      features: [
        'Boosts mental math',
        'Enhances memory',
        'Loved by parents'
      ]
    },
    {
      icon: <FaStar size={48} className="text-orange" />,
      title: 'Stand Out as a Premium School',
      text: 'Become the preferred choice for parents by offering India’s most trusted Abacus & Vedic Math curriculum.',
      stat: 'Preferred by 200+ Schools',
      features: [
        'Unique program in your area',
        'Builds strong school reputation',
        'Attracts new admissions'
      ]
    },
    {
      icon: <FaAward size={48} className="text-orange" />,
      title: 'Certified Franchise & Teacher Training',
      text: 'Get full certification for your school and teachers, plus ongoing support and curriculum updates.',
      stat: '100% Certified Teachers',
      features: [
        'Free teacher training',
        'Official franchise certificate',
        'Continuous support'
      ]
    },
    {
      icon: <FaChalkboardTeacher size={48} className="text-orange" />,
      title: 'Zero Extra Infrastructure Needed',
      text: 'Run Abacus & Vedic Math classes using your existing classrooms and staff—no additional investment required.',
      stat: 'Zero Setup Cost',
      features: [
        'Utilize current resources',
        'No extra classrooms needed',
        'Quick launch'
      ]
    }
  ];


  // Replace valuePropositions with more targeted messaging
  const valuePropositions = [
    {
      problem: "Want to boost student results in Math?",
      solution: "Introduce Abacus & Vedic Math for faster, smarter calculations",
      icon: <FaGraduationCap size={42} className="text-orange" />
    },
    {
      problem: "Looking for a unique program to attract parents?",
      solution: "Offer India’s most trusted Abacus & Vedic Math curriculum",
      icon: <FaStar size={42} className="text-orange" />
    },
    {
      problem: "Need to improve your school’s reputation?",
      solution: "Become a certified Abacus & Vedic Math center",
      icon: <FaAward size={42} className="text-orange" />
    },
    {
      problem: "Want to empower your teachers with new skills?",
      solution: "Get free teacher training & certification in Abacus & Vedic Math",
      icon: <FaChalkboardTeacher size={42} className="text-orange" />
    }
  ];

  return (
    <>
      {/* Desktop-only spacing for the hero stats row (no effect on mobile) */}
     <style>{`
       @media (min-width: 992px) {
         .franchise-business-hero-stats-row {
           display: flex;
           gap: 4.2rem; /* increase horizontal gap between stat items on desktop */
           justify-content: center;
         }
         .franchise-business-hero-stats-row .franchise-business-stat-item {
           flex: 0 0 auto;
           margin: 0 0.4rem;
         }
       }
     `}</style>
      
      <div className={`franchise-business-page franchise-business-root ${isVisible ? 'page-visible' : ''}`}>
        
        {/* Enhanced Hero Section with Emotional Hook */}
        <section 
          className="franchise-business-hero-section position-relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #ff9f43 0%, #fd7e14 100%)', // Match AbacusPage hero
            color: 'white',
            minHeight: '300px',
            padding: '80px 0',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <div className="franchise-business-hero-overlay" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}></div>
          <Container className="position-relative" style={{ zIndex: 2 }}>
            <Row className="align-items-center justify-content-center text-center">
              <Col lg={10} xl={8} className="franchise-business-hero-content mx-auto">
                {/* Trust Badges */}
                <div className="franchise-business-hero-badges mb-3">
                  <span className="franchise-business-hero-badge me-2">
                    <FaStar className="me-1" />
                    200+ Schools
                  </span>
                  <span className="franchise-business-hero-badge">
                    <IoIosTrendingUp className="me-1" />
                    Since 2013
                  </span>
                </div>

                {/* Short, Attractive Headline */}
                <h1 className="franchise-business-hero-title mb-3 fw-bold" style={{ fontSize: "2.2rem", marginTop:"-2rem" }}>
                  <span style={{ color: "#fff" }}>
                    Boost Admissions. Build Reputation.
                  </span>
                  <br />
                  <span className="text-warning" style={{ fontWeight: 800 }}>
                    Abacus & Vedic Math for Schools
                  </span>
                </h1>
                <p className="franchise-business-hero-lead lead mt-2 mb-3" style={{ fontSize: "1.15rem", color: "#fff", fontWeight: 500 }}>
                  <span style={{ color: "#ffd700", fontWeight: 700 }}>
                    Easy to start. Loved by parents. Proven results.
                  </span>
                </p>

                {/* Value Proposition Highlights */}
                <div className="franchise-business-hero-stats-row">
                  <div className="franchise-business-stat-item text-center">
                    <FaChartLine size={38} className="text-warning mb-1" />
                    <h6 className="text-white mb-0">+40% Revenue</h6>
                  </div>
                  <div className="franchise-business-stat-item text-center">
                    <FaUsers size={38} className="text-warning mb-1" />
                    <h6 className="text-white mb-0">+300% Admissions</h6>
                  </div>
                  <div className="franchise-business-stat-item text-center">
                    <FaAward size={38} className="text-warning mb-1" />
                    <h6 className="text-white mb-0">Zero Risk</h6>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Problem-Solution Section */}
        <section className="franchise-business-problem-solution py-5 bg-light">
          <Container>
            <Row className="text-center mb-5">
              <Col lg={8} className="mx-auto">
                <h1 className="fw-bold mb-3   text-orange">
                  Why Choose Abacus & Vedic Math Franchise for Your School?
                </h1>

              </Col>
            </Row>

            <Row className="g-4">
              {valuePropositions.map((item, index) => (
                <Col lg={6} key={index}>
                  <Card className="h-100 border-0 shadow-sm-hover transition-all">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-start">
                        <div className="flex-shrink-0">
                          {item.icon}
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h5 className="text-orange">{item.problem}</h5>
                          <p className="text-dark  mb-0">{item.solution}</p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Transformational Benefits Section */}
        <section className="franchise-business-benefits-section py-5">
          <Container>
            <div className="text-center mb-5">
              <Badge bg="orange" className="px-3 py-2 mb-3 fs-6">
                The Shraddha Advantage
              </Badge>
              <h1 className="fw-bold mb-3 text-orange">
                How Abacus & Vedic Math Franchise Transforms Your School
              </h1>

            </div>
            
            <Row className="g-5">
              {transformationalBenefits.map((benefit, index) => (
                <Col lg={6} key={index}>
                  <Card className="benefit-card h-100 border-0 shadow-lg-hover">
                    <Card.Body className="p-4">
                      <div className="text-center mb-4">
                        {benefit.icon}
                      </div>
                      <h4 className="fw-bold mb-3 text-center text-orange">{benefit.title}</h4>
                      <p className="text-muted mb-4" style={{ fontSize: "1rem" }}>{benefit.text}</p>
                      
                      <div className="bg-orange-soft rounded p-3 mb-4">
                        <div className="text-center">
                          <strong className="text-orange fs-4">{benefit.stat}</strong>
                        </div>
                      </div>

                      <div className="features-list">
                        {benefit.features.map((feature, idx) => (
                          <div key={idx} className="d-flex align-items-center mb-2">
                            <FaCheckCircle className="text-orange me-2" />
                            <span className="fw-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

       
       

        
      </div>
    </>
  );
};

export default FranchiseBusinessSchool;