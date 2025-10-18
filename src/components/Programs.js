import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { BookOpen, Award, Users, Check } from 'lucide-react';
import './Programs.css';

const Programs = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const programs = [
    {
      name: "Abacus Program",
      description: "Mental math mastery using colorful beads – perfect for kids aged 5–15.",
      features: [
        "8 Fun Learning Levels",
        "Online & Offline Classes",
        "Competitions & Games",
        "Boosts Focus & Concentration"
      ],
      icon: <BookOpen color="white" size={32} />,
      category: "EducationalOccupationalProgram",
      timeRequired: "PT6M"
    },
    {
      name: "Vedic Math",
      description: "Fast tricks from ancient India – ideal for exams & quick calculations.",
      features: [
        "8 Learning Levels", 
        "Solve Math in Seconds",
        "Great for competitive Exams",
        "For Ages 10+"
      ],
      icon: <Award color="white" size={32} />,
      category: "Course",
      timeRequired: "PT8M"
    },
    {
      name: "Teacher Training",
      description: "Fun, interactive program to train educators in Abacus & Vedic Math.",
      features: [
        "Certified in 3 months",
        "Teaching Kits Included",
        "Practice Sheets Provided",
        "Lifetime Support"
      ],
      icon: <Users color="white" size={32} />,
      category: "EducationalOccupationalProgram",
      timeRequired: "PT40H"
    }
  ];

  return (
    <section 
      id="programs" 
      className="programs-section" 
      itemScope 
      itemType="https://schema.org/ItemList"
    >
      <style>
        {`
          .program-card {
            background: linear-gradient(135deg, #fff7ed 0%, #fff 100%);
            border-radius: 22px;
            box-shadow: 0 4px 24px rgba(255,159,67,0.10), 0 1.5px 6px rgba(0,0,0,0.06);
            padding: 2.2rem 1.5rem 1.5rem 1.5rem;
            transition: transform 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.25s;
            position: relative;
            overflow: hidden;
            opacity: 0;
            transform: translateY(40px) scale(0.97);
            animation: card-fadein 0.8s forwards;
          }
          .program-card:hover {
            transform: translateY(-10px) scale(1.04) rotate(-1deg);
            box-shadow: 0 12px 36px rgba(255,159,67,0.18), 0 4px 16px rgba(0,0,0,0.10);
          }
          @keyframes card-fadein {
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          .icon-circle {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ff9f43 0%, #fd7e14 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.2rem auto;
            box-shadow: 0 2px 12px rgba(255,159,67,0.12);
            animation: pulse-icon 2.2s infinite;
          }
          @keyframes pulse-icon {
            0%, 100% { box-shadow: 0 2px 12px rgba(255,159,67,0.12); }
            50% { box-shadow: 0 0 24px 6px rgba(255,159,67,0.18); }
          }
          .program-card h3 {
            font-size: 1.35rem;
            font-weight: 700;
            color: #ff9f43;
            margin-bottom: 0.5rem;
            letter-spacing: 0.01em;
          }
          .program-card p {
            color: #444;
            font-size: 1.05rem;
            margin-bottom: 1.1rem;
            min-height: 48px;
          }
          .program-features {
            margin-top: 1.2rem;
            padding-left: 0;
          }
          .program-features li {
            display: flex;
            align-items: center;
            gap: 0.7rem;
            font-size: 1rem;
            color: #444;
            margin-bottom: 0.5rem;
            opacity: 0;
            transform: translateX(-24px) scale(0.98);
            animation: feature-slidein 0.7s forwards;
            background: none;
            border-radius: 8px;
          }
          .program-features li .icon-check {
            color: #ff9f43;
            background: rgba(255,159,67,0.13);
            border-radius: 50%;
            padding: 3px;
            font-size: 1.1em;
            min-width: 22px;
            min-height: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 1px 4px rgba(255,159,67,0.10);
            transition: background 0.2s;
          }
          .program-features li:hover .icon-check {
            background: #ff9f43;
            color: #fff;
          }
          .program-features li span {
            transition: color 0.2s;
          }
          .program-features li:hover span {
            color: #fd7e14;
          }
          @keyframes feature-slidein {
            to {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }
          /* Staggered animation for features */
          .program-features li {
            animation-timing-function: cubic-bezier(.4,2,.6,1);
          }
          /* Responsive */
          @media (max-width: 991px) {
            .program-card { margin-bottom: 2rem; }
          }
        `}
      </style>
      <div className="container">
        {/* Section Header */}
        <header className="text-center mb-5">
          <h2 className="section-title1" itemProp="name">
            <span className="programs-title-mobile">Programs</span>
            <span className="programs-title-desktop">🎓 Our Programs</span>
          </h2>
          <p className="section-subtitle" itemProp="description">
            Explore learning paths designed to spark joy and confidence in math!
          </p>
        </header>

        {/* Program Cards */}
        <div className="row g-4">
          {programs.map((program, index) => (
            <div 
              className="col-lg-4" 
              data-aos="fade-up" 
              data-aos-delay={`${index * 100}`}
              key={index}
              itemScope
              itemType={`https://schema.org/${program.category}`}
            >
              <article 
                className="program-card" 
                itemProp="itemListElement" 
                itemScope 
                itemType="https://schema.org/ListItem"
                style={{
                  animationDelay: `${0.1 + index * 0.15}s`
                }}
              >
                <meta itemProp="position" content={index + 1} />
                
                <div className="icon-circle" aria-hidden="true">
                  {program.icon}
                </div>
                
                <h3 itemProp="name">{program.name}</h3>
                <p itemProp="description">{program.description}</p>
                
                <ul className="program-features">
                  {program.features.map((feature, i) => (
                    <li
                      key={i}
                      style={{
                        animationDelay: `${0.25 + i * 0.13 + index * 0.08}s`
                      }}
                    >
                      <Check size={18} className="icon-check" aria-hidden="true" />
                      <span itemProp="knowsAbout">{feature}</span>
                    </li>
                  ))}
                </ul>

                <meta itemProp="timeRequired" content={program.timeRequired} />
                <meta itemProp="educationalLevel" content="Beginner to Advanced" />
              </article>
            </div>
          ))}
        </div>
      </div>

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "itemListElement": programs.map((program, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": program.category,
              "name": program.name,
              "description": program.description,
              "timeRequired": program.timeRequired,
              "educationalLevel": "Beginner to Advanced"
            }
          }))
        })}
      </script>
    </section>
  );
};

export default Programs;