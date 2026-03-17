import React, { useState } from "react";
import { Check, Star, Award, Shield, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import "./Franchise.css";

const Franchise = () => {
  const [showPackage, setShowPackage] = useState(false);

  const partnerPoints = [
    {
      icon: <TrendingUp className="icon" aria-hidden="true" />,
      title: "Low Investment, High Returns",
      desc: "Start your own education business with minimal investment and earn great profits.",
    },
    {
      icon: <Shield className="icon" aria-hidden="true" />,
      title: "Trusted Brand",
      desc: "Work with Shraddha Institute, trusted by 600+ teachers nationwide.",
    },
    {
      icon: <Award className="icon" aria-hidden="true" />,
      title: "Training & Support",
      desc: "Get complete training, materials, and continuous support to grow.",
    },
    {
      icon: <Star className="icon" aria-hidden="true" />,
      title: "Recognition & Awards",
      desc: "Earn rewards, recognition, and awards for your performance.",
    },
  ];

  return (
    <section 
      className="franchise" 
      id="franchise" 
      itemScope 
      itemType="https://schema.org/Offer"
    >
      <div className="container">
        {/* Section Heading */}
        <header className="text-center mb-5">
          <h2 className="heading" itemProp="name">
            <span className="franchise-title-mobile">Franchise Journey</span>
            <span className="franchise-title-desktop">🚀 Start Your Franchise Journey</span>
          </h2>
          <p className="subheading" itemProp="description">
            Join Shraddha Institute and become a successful entrepreneur in the field of Abacus & Vedic Maths.
          </p>
        </header>

        {/* Benefits Grid */}
        <div className="grid">
          {partnerPoints.map((point, index) => (
            <article 
              className="card" 
              key={index} 
              itemScope 
              itemType="https://schema.org/Service"
            >
              <div className="card-icon">{point.icon}</div>
              <h3 itemProp="name">{point.title}</h3>
              <p itemProp="description">{point.desc}</p>
            </article>
          ))}
        </div>

        {/* TTP Promo Card */}
        <div className="franchise-ttp-promo">
          <div className="franchise-ttp-promo-inner">
            <div className="franchise-ttp-promo-badge">🆕 New</div>
            <div className="franchise-ttp-promo-text">
              <h3>Teacher Training Program (TTP)</h3>
              <p>Become a <strong>certified Abacus &amp; Vedic Math teacher</strong>. Get nationally recognized certification, complete study materials, and start your own center.</p>
            </div>
            <Link to="/franchise/ttp" className="franchise-ttp-promo-btn">
              Explore TTP →
            </Link>
          </div>
        </div>

        {/* CTA Button */}
        <div className="cta">
          <button 
            className="btn" 
            onClick={() => setShowPackage(!showPackage)}
            aria-expanded={showPackage}
          >
            {showPackage ? "Hide Package" : "View Franchise Package"}
          </button>
        </div>

        {/* Franchise Package Reveal */}
        {showPackage && (
          <div 
            className="package animate-slide-in" 
            itemScope 
            itemType="https://schema.org/Product"
          >
            <h3 className="package-title" itemProp="name">Franchise Package</h3>
            <ul>
              <li>
                <Check className="check-icon" aria-hidden="true" /> <span itemProp="offers">Complete Teacher Training</span>
              </li>
              <li>
                <Check className="check-icon" aria-hidden="true" /> <span itemProp="offers">Marketing Support</span>
              </li>
              <li>
                <Check className="check-icon" aria-hidden="true" /> <span itemProp="offers">Books & Materials</span>
              </li>
              <li>
                <Check className="check-icon" aria-hidden="true" /> <span itemProp="offers">Recognition & Awards</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Offer",
          "name": "Shraddha Institute Franchise",
          "description": "Start your own Abacus & Vedic Maths business with Shraddha Institute. Low investment, high returns, training & support included.",
          "seller": {
            "@type": "EducationalOrganization",
            "name": "Shraddha Institute",
            "url": "https://shraddhainstitute.netlify.app/"
          },
          "offers": {
            "@type": "AggregateOffer",
            "itemOffered": [
              "Teacher Training",
              "Marketing Support",
              "Books & Materials",
              "Recognition & Awards"
            ]
          }
        })}
      </script>
    </section>
  );
};

export default Franchise;
