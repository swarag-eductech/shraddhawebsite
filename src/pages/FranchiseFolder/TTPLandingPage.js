import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { createClient } from '@supabase/supabase-js';
import {
  FaChalkboardTeacher,
  FaCertificate,
  FaUserGraduate,
  FaBookOpen,
  FaHandsHelping,
  FaStar,
  FaCheckCircle,
  FaArrowRight,
  FaCalculator,
  FaBrain,
  FaUsers,
  FaClock,
  FaMedal,
  FaLaptop,
  FaPhoneAlt,
  FaWhatsapp,
  FaPlayCircle,
} from "react-icons/fa";
import "./TTPLandingPage.css";

const supabaseClient = createClient(
  'https://hmoodwzpkwblbymzpmxx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhtb29kd3pwa3dibGJ5bXpwbXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMDYyMTksImV4cCI6MjA4ODY4MjIxOX0.qMY6NY-BeqsrudAK0SwNcQttPBMdLQmv6PGcDUcfOaY'
);

const BOOK_SLIDES = [
  { src: 'https://res.cloudinary.com/dhix1afuq/image/upload/v1773573436/Abacus_Foundation_aa0xej.jpg', alt: 'Abacus Foundation' },
  { src: 'https://res.cloudinary.com/dhix1afuq/image/upload/v1773573435/abacus_level_1_kzocrd.jpg',    alt: 'Abacus Level 1' },
  { src: 'https://res.cloudinary.com/dhix1afuq/image/upload/v1773573436/abacus_level4_xejew0.jpg',     alt: 'Abacus Level 4' },
  { src: 'https://res.cloudinary.com/dhix1afuq/image/upload/v1773573435/abacus_level5_ioflgp.jpg',     alt: 'Abacus Level 5' },
];

const TTPLandingPage = () => {
  const [activeTab, setActiveTab] = useState("abacus");
  const [openFaq, setOpenFaq] = useState(null);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [activeTeacherVideo, setActiveTeacherVideo] = useState(null);
  const [bookCurrent, setBookCurrent] = useState(0);
  const [bookPaused, setBookPaused] = useState(false);
  const safeBookCurrent = bookCurrent % BOOK_SLIDES.length;

  const bookNext = useCallback(() => setBookCurrent(c => (c + 1) % BOOK_SLIDES.length), []);
  const bookPrev = useCallback(() => setBookCurrent(c => (c - 1 + BOOK_SLIDES.length) % BOOK_SLIDES.length), []);

  useEffect(() => {
    if (bookPaused) return;
    const id = setInterval(bookNext, 2800);
    return () => clearInterval(id);
  }, [bookPaused, bookNext]);

  const [formData, setFormData] = useState({ name: '', phone: '', email: '', city: '', program: 'Abacus Teacher Training', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      const { error } = await supabaseClient.from('leads').insert([
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email || null,
          city: formData.city,
          program: formData.program,
          message: formData.message || null,
        },
      ]);
      if (error) {
        console.error('Supabase insert error:', error.message);
        setFormError('Something went wrong. Please try again or call us directly.');
        return;
      }

      // Send WhatsApp notification to admin
      const waText = [
        `🎓 *New TTP Registration*`,
        `👤 Name: ${formData.name}`,
        `📞 Phone: ${formData.phone}`,
        `📧 Email: ${formData.email || 'Not provided'}`,
        `🏙️ City: ${formData.city}`,
        `📚 Program: ${formData.program}`,
        formData.message ? `💬 Message: ${formData.message}` : '',
      ].filter(Boolean).join('\n');
      window.open(`https://wa.me/918446889966?text=${encodeURIComponent(waText)}`, '_blank');

      setFormSubmitted(true);
      setFormData({ name: '', phone: '', email: '', city: '', program: 'Abacus Teacher Training', message: '' });
      setTimeout(() => setFormSubmitted(false), 5000);
    } catch (err) {
      console.error('Unexpected error:', err);
      setFormError('Something went wrong. Please try again or call us directly.');
    } finally {
      setFormLoading(false);
    }
  };

  const teacherVideos = [
    { id: '5X02qZAiKMY', name: 'Mrs. Dipmala Kolekar', location: 'Solapur, Maharashtra' },
    { id: 'ycXsHXewqqE', name: 'Mrs. Aarti Lalbige', location: 'Pune, Maharashtra' },
    { id: 'R1-tV-ItNsc', name: 'Mrs. Savita Mohite', location: 'Pune, Maharashtra' },
    { id: 'kETpHR3XiKA', name: 'Mrs. Ashawini Narayankar', location: 'Pune, Maharashtra' },
    { id: 'SZ2jqSOi_C8', name: 'Mrs. Nita Pawar', location: 'Solapur, Maharashtra' },
    { id: 'TW8PKxkpYus', name: 'Mrs. Rupa Dhepe', location: 'Solapur, Maharashtra' },
    { id: 'E4MiDkQ73ms', name: 'Mrs. Ashwini Kadam', location: 'Pune, Maharashtra' },
    { id: 'eUuG_eKT3CU', name: 'Mrs. Ashwini Kamble', location: 'Pune, Maharashtra' },
  ];
  const allTeacherVideos = [...teacherVideos, ...teacherVideos];

  const trainingModes = [
    {
      icon: '💻',
      title: 'Online Live Training',
      subtitle: 'Pan India — from any city',
      features: [
        'Live interactive sessions with trainer',
        'Learn from anywhere in India',
        'Flexible morning / evening timing',
        'Recorded sessions for revision',
        'Direct doubt clearing every session',
      ],
    },
    {
      icon: '📍',
      title: 'Offline Center-Based Training',
      subtitle: 'In-person practical experience',
      features: [
        'In-person practical training',
        'Hands-on abacus & kit experience',
        'Face-to-face mentorship',
        'Networking with other teachers',
        'Immediate feedback and correction',
      ],
    },
    {
      icon: '📱',
      title: 'Self-Paced App Training',
      subtitle: 'Learn anytime using our training app',
      features: [
        'Complete training through recorded video lessons',
        'Learn anytime at your own speed',
        'Step-by-step Abacus & Vedic Maths modules',
        'Practice assignments and exercises',
        'Support available from mentors when needed',
      ],
    },
  ];

  const bkMaterials = [
    { icon: '📗', title: 'Abacus Teaching Manual', desc: 'Level-by-level instruction guide with diagrams and practice exercises for Levels 1–8.', color: '#667eea' },
    { icon: '📘', title: 'Vedic Math Workbook', desc: 'Comprehensive Vedic Math teaching guide covering all 16 sutras with classroom activities.', color: '#f7971e' },
    { icon: '📦', title: 'Abacus Starter Kit', desc: 'Complete Soroban abacus set for hands-on practice during training and in your classes.', color: '#11998e' },
    { icon: '📋', title: 'Printable Worksheets', desc: 'Hundreds of ready-to-use worksheets for every level — print for your students anytime.', color: '#ff6b35' },
    { icon: '📱', title: 'App Access (Lifetime)', desc: 'Exclusive app with recorded lessons, digital worksheets, and regular content updates.', color: '#764ba2' },
    { icon: '🎓', title: 'Official Certificate', desc: 'Nationally recognized TTP certificate upon successful completion of assessment.', color: '#e84393' },
  ];

  const curriculum = {
    abacus: [
      "Introduction to Abacus & its history",
      "Soroban abacus structure & technique",
      "Addition & Subtraction (Levels 1–5)",
      "Multiplication & Division on Abacus",
      "Mental Math development exercises",
      "Speed & accuracy training methods",
      "Student assessment techniques",
      "Classroom management strategies",
    ],
    vedic: [
      "16 Vedic Math Sutras explained",
      "Fast multiplication methods",
      "Division shortcuts & tricks",
      "Square roots & cube roots",
      "Algebra through Vedic techniques",
      "Engaging teaching methods for children",
      "Designing practice worksheets",
      "Progress tracking & reporting",
    ],
  };

  const benefits = [
    {
      icon: <FaCertificate className="ttp-benefit-icon" />,
      tag: "🏆 Trusted Nationwide",
      title: "Nationally Recognized Certificate",
      desc: "Receive an official Shraddha Institute Teacher Training Program certificate valid across India — instantly elevate your teaching credibility.",
      color: "#ff6600",
    },
    {
      icon: <FaHandsHelping className="ttp-benefit-icon" />,
      tag: "📦 All-in-One Kit",
      title: "Complete Study Materials",
      desc: "Printed manuals, worksheets, digital resources & teaching aids — all included. Walk in empty-handed, walk out fully equipped.",
      color: "#28a745",
    },
    {
      icon: <FaBrain className="ttp-benefit-icon" />,
      tag: "🎯 Classroom-Ready",
      title: "Practical Hands-on Training",
      desc: "Live mock classrooms, practice sessions & supervised teaching — you'll be 100% classroom-ready from the very first day.",
      color: "#007bff",
    },
    {
      icon: <FaUsers className="ttp-benefit-icon" />,
      tag: "💬 Lifetime Access",
      title: "Ongoing Mentor Support",
      desc: "Stay connected with master trainers forever via our exclusive WhatsApp group. Real answers, real support — anytime, anywhere.",
      color: "#6f42c1",
    },
    {
      icon: <FaLaptop className="ttp-benefit-icon" />,
      tag: "💻 Online Portal",
      title: "Digital Teaching Resources",
      desc: "Animated video lessons, digital worksheets & online tutorials — a full digital toolkit to make your classes engaging and effective.",
      color: "#17a2b8",
    },
    {
      icon: <FaMedal className="ttp-benefit-icon" />,
      tag: "🚀 Business Opportunity",
      title: "Start Your Own Center",
      desc: "Certification makes you eligible to open your own branded Abacus & Vedic Math center under the trusted Shraddha name.",
      color: "#fd7e14",
    },
  ];

  const whoShouldJoin = [
    {
      img: 'https://res.cloudinary.com/dhix1afuq/image/upload/v1773573650/school_mjvr0r.png',
      title: "School Teachers",
      desc: "Add high-demand skills to your teaching profile and earn extra income after school hours.",
    },
    {
      img: 'https://res.cloudinary.com/dhix1afuq/image/upload/v1773573650/housewives_earfj1.png',
      title: "Homemakers",
      desc: "Start a home tuition center with full training support. Work flexible hours that suit your family.",
    },
    {
      img: 'https://res.cloudinary.com/dhix1afuq/image/upload/v1773573653/student_i5fmmn.png',
      title: "Fresh Graduates",
      desc: "Launch your teaching career with a certified specialization that sets you apart from the crowd.",
    },
    {
      img: 'https://res.cloudinary.com/dhix1afuq/image/upload/v1773573651/tution_rbu7rl.png',
      title: "Tuition Center Owners",
      desc: "Expand your course offerings with Abacus & Vedic Math and attract more students to your center.",
    },
    {
      img: 'https://res.cloudinary.com/dhix1afuq/image/upload/v1773573650/passionate_ifnwhx.png',
      title: "Passionate Educators",
      desc: "Anyone passionate about children's education and mental development is welcome to join our TTP.",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Register & Counselling",
      desc: "Fill out the enquiry form. Our team will call you within 24 hours for a free counselling session.",
      duration: "Day 1",
    },
    {
      step: "02",
      title: "Fee & Enrollment",
      desc: "Choose your training mode (online / offline / hybrid). Complete enrollment with our simple process.",
      duration: "Day 2",
    },
    {
      step: "03",
      title: "Training Program",
      desc: "Attend intensive training sessions covering Abacus (Levels 1–8) and Vedic Math methodology.",
      duration: "2–3 Weeks",
    },
    {
      step: "04",
      title: "Assessment & Certification",
      desc: "Clear the final assessment and receive your nationally recognized TTP certificate.",
      duration: "Final Day",
    },
  ];

  const stats = [
    { number: "2,500+", label: "Teachers Trained" },
    { number: "600+", label: "Active Centers" },
    { number: "12+", label: "Years of Excellence" },
    { number: "98%", label: "Satisfaction Rate" },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Pune",
      text: "The TTP program completely transformed my teaching approach. Within 2 months of completing training, I had 35 students enrolled at my home center!",
      rating: 5,
      role: "Homemaker turned Educator",
    },
    {
      name: "Kavita Desai",
      location: "Mumbai",
      text: "Excellent training structure. The study materials are comprehensive and the mentor support after certification is what makes Shraddha Institute stand out.",
      rating: 5,
      role: "School Teacher",
    },
    {
      name: "Ritu Agarwal",
      location: "Nagpur",
      text: "I was skeptical at first, but the hands-on practice sessions gave me real confidence. Now I run two batches daily from my home. Best investment ever!",
      rating: 5,
      role: "Tuition Center Owner",
    },
  ];

  const faqs = [
    {
      q: "What is Abacus?",
      a: "Abacus is an ancient calculation tool that uses beads on rods to perform arithmetic operations. In modern education, it is used as a brain development program for children aged 5–14 that enhances concentration, memory, speed, and accuracy in mental math.",
    },
    {
      q: "What is Vedic Mathematics?",
      a: "Vedic Mathematics is a system of mathematical techniques derived from ancient Indian scriptures (Vedas). It consists of 16 sutras (formulas) that allow students to solve complex calculations — multiplication, division, squares, and more — much faster than conventional methods.",
    },
    {
      q: "Do I need prior knowledge of Abacus or Vedic Math to join the training?",
      a: "No prior knowledge is required at all. Our Teacher Training Program is designed to take you from zero to fully certified — we teach everything from scratch in a structured, easy-to-follow format.",
    },
    {
      q: "Do I need a mathematics background?",
      a: "Not at all! You only need basic school-level maths. Our training is simple, practical, and designed for everyone — homemakers, graduates, and professionals alike. If you can add and subtract, you can join.",
    },
    {
      q: "Can I start teaching from home?",
      a: "Absolutely! Many of our certified teachers run successful home-based Abacus & Vedic Math classes. You need minimal space, the provided kit, and the confidence our training gives you — and you can start accepting students from day one.",
    },
    {
      q: "Will I get support after training?",
      a: "Yes — lifetime support! You'll be added to our exclusive WhatsApp mentor group where master trainers are always available to answer your questions, share updates, and guide you through any challenges you face in your teaching journey.",
    },
    {
      q: "Is the certification valid across India?",
      a: "Yes! The Shraddha Institute Teacher Training Program certificate is nationally recognized and valid across all 600+ Shraddha partner centers and affiliated schools throughout India.",
    },
    {
      q: "Are books and kits included?",
      a: "Yes, everything is included in your program fee — printed teaching manuals, student worksheets, an Abacus starter kit, and lifetime access to our digital learning app. There are no hidden costs or extra purchases.",
    },
    {
      q: "How long is the training program?",
      a: "The complete TTP program is 2–3 weeks depending on your chosen batch (weekday or weekend). Weekend batches are also available for working professionals. You'll be fully certified and classroom-ready by the end.",
    },
    {
      q: "What is the investment required to start?",
      a: "The program fee is very affordable and includes all study materials, kit, certification, and app access. Fee details vary by batch and mode (online/offline). Contact us directly for the latest fee structure — EMI options are also available.",
    },
  ];

  const videos = [
    { id: 'ab9tTWL-aEM', label: '🎥 Student in Action' },
    { id: 'MxdRV8Uk4p0', label: '🎥 Abacus Speed Demo' },
    { id: 'uiXpLlSeUvQ', label: '🎥 Mental Math Trick' },
    { id: 'UKhSATJBBjw', label: '🎥 Competition Round' },
  ];
  const allVideos = [...videos, ...videos];

  const certColors = ['#f7971e', '#667eea', '#11998e', '#ff6b35', '#764ba2', '#e84393'];
  const certBenefits = [
    { icon: '🇮🇳', title: 'Nationally Valid', desc: 'Recognized across every Shraddha Institute partner center and school in India.' },
    { icon: '🏆', title: 'Industry Credibility', desc: 'Endorsed by 600+ active franchise centers and institutions.' },
    { icon: '💼', title: 'Franchise Eligibility', desc: 'Unlock special TTP franchise pricing after certification.' },
    { icon: '📋', title: 'National Directory', desc: "Listed in Shraddha Institute's nationwide directory of certified educators." },
    { icon: '🎓', title: 'Lifelong Learning', desc: 'Access alumni workshops, refresher courses, and advanced level training.' },
    { icon: '💰', title: 'Better Earnings', desc: 'Certified teachers earn 40–60% more than uncertified counterparts.' },
  ];

  return (
    <>
      <Helmet>
        <title>Teacher Training Program (TTP) | Shraddha Institute</title>
        <meta
          name="description"
          content="Get certified in Abacus & Vedic Math teaching with Shraddha Institute's Teacher Training Program. 2,500+ trained teachers, nationally recognized certificate, complete support."
        />
      </Helmet>

      <div className="ttp-page">
        {/* ── Announcement Bar ── */}
        <div className="ttp-announcement-bar">
          <span className="ttp-announcement-badge">Limited Seats</span>
          <span className="ttp-announcement-text">
            🎯 Next TTP Batch Starting Soon — Register Now &amp; Get Free Study Kit!
          </span>
        </div>

        {/* ── Hero Section ── */}
        <section className="ttp-hero">
          <div className="ttp-hero-inner">
            <img
              src="https://res.cloudinary.com/dhix1afuq/image/upload/v1773726164/mobile_tbxhpz.jpg"
              alt="Teacher Training Program"
              className="ttp-hero-mobile-img"
            />
            <div className="ttp-hero-text">
              <span className="ttp-hero-pill">
                <FaCertificate className="me-2" /> Teacher Training Program
              </span>
              <h1 className="ttp-hero-title">
                Become a{' '}<span className="ttp-highlight">Certified</span><br />
                Abacus &amp; Vedic Math<br />
                <span className="ttp-hero-title-accent">Teacher</span>
              </h1>
              <p className="ttp-hero-subtitle">
                🎯 Start Your Own Classes <strong>Anywhere in India</strong>
              </p>
              <ul className="ttp-hero-checklist">
                <li><FaCheckCircle className="ttp-hero-check-icon" /> Nationally Recognized Certification</li>
                <li><FaCheckCircle className="ttp-hero-check-icon" /> Start of Education Business</li>
                <li><FaCheckCircle className="ttp-hero-check-icon" /> Franchise Opportunity</li>
              </ul>
              <div className="ttp-hero-cta">
                <Link to="/contact" className="ttp-btn-primary">
                  Enroll Now <FaArrowRight className="ms-2" />
                </Link>
                <a href="https://wa.me/919168756060" target="_blank" rel="noreferrer" className="ttp-btn-whatsapp">
                  <FaWhatsapp className="me-2" /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Teacher Testimonials ── */}
        <section className="testimonials-section">
          <div className="ttp-container">
            <div className="ttp-section-header">
              <span className="tm-section-badge">⭐ Real Teacher Stories</span>
              <h2 className="ttp-section-title">Hear from Our Certified Teachers</h2>
              <p className="ttp-section-sub">
                Watch real testimonials from teachers who completed TTP and transformed their careers.
              </p>
            </div>
          </div>
          <div className="tm-marquee-wrap">
            <div className="tm-track">
              {allTeacherVideos.map((v, i) => (
                <div className="tm-vid-card" key={i} onClick={() => setActiveTeacherVideo(v)}>
                  <div className="tm-vid-frame">
                    <img
                      src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                      alt={v.name}
                      className="tm-thumb"
                      loading="lazy"
                    />
                    <div className="tm-play-btn">▶</div>
                  </div>
                  <div className="tm-caption">
                    <strong>{v.name}</strong>
                    <span>{v.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Who Should Join ── */}
        <section className="ttp-section ttp-who-section">
          <div className="ttp-container">
            <div className="ttp-section-header">
              <h2 className="ttp-section-title">Who Should Join TTP?</h2>
              <p className="ttp-section-sub">
                This program is designed for anyone who wants to build a rewarding career in education.
              </p>
            </div>
            <div className="ttp-who-grid">
              {whoShouldJoin.map((item, i) => (
                <div className="ttp-who-card" key={i}>
                  <div className="ttp-who-img-wrap">
                    <img src={item.img} alt={item.title} className="ttp-who-img" loading="lazy" />
                  </div>
                  <h3 className="ttp-who-title">{item.title}</h3>
                  <p className="ttp-who-desc">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="no-experience-banner">
              <div className="banner-icon">🚀</div>
              <div className="banner-content">
                <h3>No Prior Teaching Experience Required</h3>
                <p>Our comprehensive program prepares complete beginners and experienced educators alike to confidently teach Abacus &amp; Vedic Math.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── What You'll Learn (Curriculum Tabs) ── */}
        <section className="ttp-section ttp-curriculum-section">
          <div className="ttp-container">
            <div className="ttp-section-header">
              <h2 className="ttp-section-title">What You'll Learn</h2>
              <p className="ttp-section-sub">
                A comprehensive curriculum covering both Abacus and Vedic Math teaching methodologies.
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="ttp-tabs">
              <button
                className={`ttp-tab ${activeTab === "abacus" ? "active" : ""}`}
                onClick={() => setActiveTab("abacus")}
              >
                <FaCalculator className="me-2" /> Abacus Teaching
              </button>
              <button
                className={`ttp-tab ${activeTab === "vedic" ? "active" : ""}`}
                onClick={() => setActiveTab("vedic")}
              >
                <FaBrain className="me-2" /> Vedic Math Teaching
              </button>
            </div>

            <div className="ttp-curriculum-grid">
              {curriculum[activeTab].map((item, i) => (
                <div className="ttp-curriculum-item" key={i}>
                  <FaCheckCircle className="ttp-check-icon" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="ttp-curriculum-note">
              <FaPlayCircle className="me-2" />
              <span>
                Training available in <strong>Marathi, Hindi &amp; English</strong> medium
              </span>
            </div>
          </div>
        </section>

        {/* ── Benefits ── */}
        <section className="ttp-section ttp-benefits-section">
          <div className="ttp-container">
            <div className="ttp-section-header">
              <span className="ttp-section-pill">⭐ 6 Reasons to Join</span>
              <h2 className="ttp-section-title">
                Why Choose Shraddha{' '}
                <span className="ttp-title-highlight">Teacher Training Program</span>?
              </h2>
              <p className="ttp-section-sub">
                Everything you need to become a <strong>confident, certified</strong> Abacus &amp; Vedic Math teacher — all under one roof.
              </p>
            </div>
            <div className="ttp-benefits-grid">
              {benefits.map((b, i) => (
                <div
                  className="ttp-benefit-card"
                  key={i}
                  style={{ '--accent-color': b.color, '--accent-bg': `${b.color}18` }}
                >
                  <div className="ttp-benefit-num">{String(i + 1).padStart(2, '0')}</div>
                  <div
                    className="ttp-benefit-icon-wrap"
                    style={{ background: `${b.color}20`, color: b.color }}
                  >
                    {b.icon}
                  </div>
                  <div className="ttp-benefit-tag">{b.tag}</div>
                  <h3 className="ttp-benefit-title">{b.title}</h3>
                  <p className="ttp-benefit-desc">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Training Mode ── */}
        <section className="ttp-section training-mode-section">
          <div className="ttp-container">
            <div className="ttp-section-header">
              <span className="ttp-section-pill">🇮🇳 Available Across India</span>
              <h2 className="ttp-section-title">Training Modes Available</h2>
              <p className="ttp-section-sub">
                Choose the format that suits your convenience — both lead to full certification.
              </p>
            </div>
            <div className="modes-grid">
              {trainingModes.map((mode, i) => (
                <div className="mode-card" key={i}>
                  <div className="mode-icon">{mode.icon}</div>
                  <h3>{mode.title}</h3>
                  {mode.subtitle && <p className="mode-subtitle">{mode.subtitle}</p>}
                  <ul className="mode-features">
                    {mode.features.map((feature, j) => (
                      <li key={j}>
                        <span className="mode-check">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="location-banner">
              <div className="map-icon">🇮🇳</div>
              <div className="location-text">
                <h3>You can join from any city in India!</h3>
                <p>Metro cities, tier-2 towns, or rural areas — we reach everywhere across India.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Certification ── */}
        <section className="ttp-section cert-section" id="certification">
          <div className="ttp-container">
            <div className="cert-header">
              <span className="cert-badge-pill">🏅 Official Recognition</span>
              <h2 className="ttp-section-title">
                Earn Your{' '}
                <span className="cert-grad-text">Certified Teacher Badge</span>
              </h2>
              <p className="ttp-section-sub">
                Join <strong>2,500+ certified educators</strong> who carry the Shraddha Institute TTP
                certificate — India's most trusted Abacus &amp; Vedic Math teaching credential.
              </p>
            </div>

            <div className="cert-layout">
              <div className="cert-mockup-col">
                <div className="cert-ribbon">🎓 Nationally Valid</div>
                <div className="cert-img-wrap">
                  <img
                    src="https://res.cloudinary.com/dhix1afuq/image/upload/v1773643614/certificate_hnskko.jpg"
                    alt="Shraddha Institute TTP Certificate"
                    className="cert-real-img"
                  />
                </div>
                <div className="cert-valid-pill">✅ Valid across 600+ centers</div>
              </div>

              <div className="cert-benefits-col">
                {certBenefits.map((b, i) => (
                  <div
                    className="cb-card"
                    key={i}
                    style={{ '--cc': certColors[i], '--i': i }}
                  >
                    <div className="cb-icon-wrap">
                      <span className="cb-icon">{b.icon}</span>
                    </div>
                    <div className="cb-text">
                      <h3>{b.title}</h3>
                      <p>{b.desc}</p>
                    </div>
                    <div className="cb-badge">{String(i + 1).padStart(2, '0')}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* ── Books & Kits ── */}
        <section className="ttp-section bk-section">
          <div className="ttp-container">
            <div className="ttp-section-header">
              <span className="ttp-section-pill">📦 Included Materials</span>
              <h2 className="ttp-section-title">
                Books, Kits &amp; <span className="bk-grad">Learning Resources</span>
              </h2>
              <p className="ttp-section-sub">
                Everything you need to start teaching is provided — no extra purchases required.
              </p>
            </div>
            <div className="bk-layout">
              <div className="bk-showcase">
                <div
                  className="bk-slider"
                  onMouseEnter={() => setBookPaused(true)}
                  onMouseLeave={() => setBookPaused(false)}
                >
                  <div className="bk-slider-track" style={{ transform: `translateX(-${safeBookCurrent * 100}%)` }}>
                    {BOOK_SLIDES.map((slide, i) => (
                      <img
                        key={i}
                        src={slide.src}
                        alt={slide.alt}
                        className="bk-slide-img"
                        draggable={false}
                      />
                    ))}
                  </div>
                  <button className="bk-slider-btn bk-slider-prev" onClick={bookPrev} aria-label="Previous">&#8249;</button>
                  <button className="bk-slider-btn bk-slider-next" onClick={bookNext} aria-label="Next">&#8250;</button>
                  <div className="bk-slider-dots">
                    {BOOK_SLIDES.map((_, i) => (
                      <button
                        key={i}
                        className={`bk-dot${i === safeBookCurrent ? ' bk-dot-active' : ''}`}
                        onClick={() => setBookCurrent(i)}
                        aria-label={`Slide ${i + 1}`}
                      />
                    ))}
                  </div>
                  <div className="bk-slide-caption">{BOOK_SLIDES[safeBookCurrent].alt}</div>
                </div>
                <div className="bk-promise">
                  <span className="bk-promise-icon">🎖️</span>
                  <div>
                    <strong>Shraddha Promise</strong>
                    <p>All materials are 100% official, standardized and brand-consistent across every center in India.</p>
                  </div>
                </div>
              </div>
              <div className="bk-cards">
                {bkMaterials.map((m, i) => (
                  <div className="bk-card" key={i} style={{ '--mc': m.color, '--i': i }}>
                    <div className="bk-card-icon">{m.icon}</div>
                    <div className="bk-card-body">
                      <h3>{m.title}</h3>
                      <p>{m.desc}</p>
                    </div>
                    <div className="bk-card-num">{String(i + 1).padStart(2, '0')}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* App Access Banner */}
          <div className="ttp-container">
            <div className="bk-app-banner">
              <div className="bk-app-left">
                <span className="bk-app-badge">📱 Exclusive Access</span>
                <h3>Shraddha Institute Learning App</h3>
                <p>
                  Every certified teacher gets <strong>lifetime access</strong> to our mobile app — packed with
                  recorded Abacus &amp; Vedic Math video lessons, worksheets, and teaching resources, available
                  anytime, anywhere.
                </p>
                <ul className="bk-app-perks">
                  <li>🎬 Recorded video lectures — Abacus &amp; Vedic Math</li>
                  <li>📂 Downloadable worksheets &amp; exam papers</li>
                  <li>🔔 New content updates &amp; notifications</li>
                </ul>
                <a
                  href="https://play.google.com/store/apps/details?id=co.groot.nitc&pcampaignid=web_share"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bk-app-btn"
                >
                  📲 Download the App
                </a>
              </div>
              <div className="bk-app-right">
                <div className="bk-app-marquee-wrap">
                  <div className="bk-app-marquee-track">
                    {[
                      'https://res.cloudinary.com/dhix1afuq/image/upload/v1773574904/app1_rnprp0.webp',
                      'https://res.cloudinary.com/dhix1afuq/image/upload/v1773574904/app2_f7wnrv.webp',
                      'https://res.cloudinary.com/dhix1afuq/image/upload/v1773574905/app3_x999se.webp',
                      'https://res.cloudinary.com/dhix1afuq/image/upload/v1773574905/app4_wjkv83.webp',
                      'https://res.cloudinary.com/dhix1afuq/image/upload/v1773574906/app5_tr3mi6.webp',
                      'https://res.cloudinary.com/dhix1afuq/image/upload/v1773574904/app1_rnprp0.webp',
                      'https://res.cloudinary.com/dhix1afuq/image/upload/v1773574904/app2_f7wnrv.webp',
                      'https://res.cloudinary.com/dhix1afuq/image/upload/v1773574905/app3_x999se.webp',
                      'https://res.cloudinary.com/dhix1afuq/image/upload/v1773574905/app4_wjkv83.webp',
                      'https://res.cloudinary.com/dhix1afuq/image/upload/v1773574906/app5_tr3mi6.webp',
                    ].map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`App screenshot ${(i % 5) + 1}`}
                        className="bk-app-screenshot"
                        loading="lazy"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="ttp-section ttp-steps-section">
          <div className="ttp-container">
            <div className="ttp-section-header">
              <h2 className="ttp-section-title">Your Journey Starts Here</h2>
              <p className="ttp-section-sub">4 simple steps to become a certified TTP teacher</p>
            </div>
            <div className="ttp-steps-grid">
              {steps.map((s, i) => (
                <div className="ttp-step-card" key={i}>
                  <div className="ttp-step-number">{s.step}</div>
                  <div className="ttp-step-duration">{s.duration}</div>
                  <h3 className="ttp-step-title">{s.title}</h3>
                  <p className="ttp-step-desc">{s.desc}</p>
                  {i < steps.length - 1 && <div className="ttp-step-arrow"><FaArrowRight /></div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Student Videos ── */}
        <section className="sv-section">
          <div className="sv-header">
            <h2 className="sv-title">⚡ Watch Our Students in Action</h2>
            <p className="sv-sub">See real results from our certified teachers' students</p>
          </div>
          <div className="sv-track-wrap">
            <div className="sv-track">
              {allVideos.map((v, i) => (
                <div className="sv-card" key={i} onClick={() => setActiveVideoId(v.id + '_' + i)}>
                  <div className="sv-thumb-wrap">
                    <img
                      src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                      alt={v.label}
                      className="sv-thumb"
                    />
                    <div className="sv-play-btn">▶</div>
                  </div>
                  <p className="sv-label">{v.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="ttp-section ttp-faq-section">
          <div className="ttp-container">
            <div className="ttp-section-header">
              <span className="ttp-section-pill">❓ Got Questions?</span>
              <h2 className="ttp-section-title">Frequently Asked Questions</h2>
              <p className="ttp-section-sub">Everything you need to know before enrolling.</p>
            </div>
            <div className="faq-grid">
              <div className="faq-col">
                {faqs.filter((_, i) => i % 2 === 0).map((faq, ci) => {
                  const index = ci * 2;
                  return (
                    <div className={`faq-item ${openFaq === index ? 'active' : ''}`} key={index}>
                      <button
                        className="faq-question"
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        aria-expanded={openFaq === index}
                      >
                        <span className="faq-num">{String(index + 1).padStart(2, '0')}</span>
                        <span className="faq-q-text">{faq.q}</span>
                        <span className="faq-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </span>
                      </button>
                      <div className="faq-answer">
                        <div className="faq-answer-inner"><p>{faq.a}</p></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="faq-col">
                {faqs.filter((_, i) => i % 2 === 1).map((faq, ci) => {
                  const index = ci * 2 + 1;
                  return (
                    <div className={`faq-item ${openFaq === index ? 'active' : ''}`} key={index}>
                      <button
                        className="faq-question"
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        aria-expanded={openFaq === index}
                      >
                        <span className="faq-num">{String(index + 1).padStart(2, '0')}</span>
                        <span className="faq-q-text">{faq.q}</span>
                        <span className="faq-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </span>
                      </button>
                      <div className="faq-answer">
                        <div className="faq-answer-inner"><p>{faq.a}</p></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="faq-cta">
              <div className="faq-cta-icon">🤔</div>
              <div className="faq-cta-text">
                <h3>Still have questions?</h3>
                <p>Our team is happy to help you with any query — reach out anytime!</p>
              </div>
              <a href="#ttp-contact" className="ttp-btn-primary faq-cta-btn">Contact Us</a>
            </div>
          </div>
        </section>

        {/* ── Contact & Registration ── */}
        <section className="ttp-contact-section" id="ttp-contact">
          <div className="ttp-container">
            <div className="ttp-section-header">
              <span className="ttp-section-pill">🚀 Start Today</span>
              <h2 className="ttp-section-title">Your Teaching Career Starts Today</h2>
              <p className="ttp-section-sub">Fill the registration form below and take the first step towards your new career</p>
            </div>
            <div className="ttp-contact-limited-badge">
              <span>🎯 Limited Seats Available</span>
              <p>Register now to secure your spot in the next batch — seats fill up fast!</p>
            </div>
            <div className="ttp-contact-grid">
              {/* Left: Contact Info */}
              <div className="ttp-contact-info">
                <div className="ttp-contact-cards">
                  <a href="tel:+918446889966" className="ttp-contact-card">
                    <div className="ttp-contact-card-icon">📞</div>
                    <div className="ttp-contact-card-body">
                      <h4>Call Now</h4>
                      <p>+91 84468 89966</p>
                    </div>
                  </a>
                  <a href="https://wa.me/918446889966" target="_blank" rel="noreferrer" className="ttp-contact-card ttp-contact-card-wa">
                    <div className="ttp-contact-card-icon">📲</div>
                    <div className="ttp-contact-card-body">
                      <h4>WhatsApp Now</h4>
                      <p>+91 84468 89966</p>
                      <span>Send "Hello" for instant info</span>
                    </div>
                  </a>
                  <a href="mailto:info@shraddhainstitute.com" className="ttp-contact-card">
                    <div className="ttp-contact-card-icon">📧</div>
                    <div className="ttp-contact-card-body">
                      <h4>Email Us</h4>
                      <p>info@shraddhainstitute.com</p>
                    </div>
                  </a>
                </div>
                <div className="ttp-wa-quick">
                  <h4>📲 Quick Info via WhatsApp</h4>
                  <p>For information about Abacus &amp; Vedic Math Teacher Training, just send <strong>"Hello"</strong> on WhatsApp number</p>
                  <a href="https://wa.me/918446889966?text=Hello" target="_blank" rel="noreferrer" className="ttp-wa-number">8446889966</a>
                  <p className="ttp-wa-note">You will get all information instantly.</p>
                  <p className="ttp-wa-note">For any difficulty, call: <strong>8446889966</strong></p>
                  <div className="ttp-quick-connect">
                    <span>Quick Connect</span>
                    <div className="ttp-social-links">
                      <a href="https://instagram.com/shraddhainstitute" target="_blank" rel="noreferrer" className="ttp-social-btn ttp-social-ig">Instagram</a>
                      <a href="https://youtube.com/@shraddhainstitute" target="_blank" rel="noreferrer" className="ttp-social-btn ttp-social-yt">YouTube</a>
                    </div>
                  </div>
                </div>
              </div>
              {/* Right: Registration Form */}
              <div className="ttp-reg-form-wrap">
                <h3>📝 Registration Form</h3>
                {formSubmitted ? (
                  <div className="ttp-form-success">
                    ✅ Thank you! We'll contact you within 24 hours.
                  </div>
                ) : (
                  <form className="ttp-reg-form" onSubmit={handleFormSubmit}>
                    <div className="ttp-form-group">
                      <label>Full Name *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleFormChange} placeholder="Enter your name" required />
                    </div>
                    <div className="ttp-form-group">
                      <label>Phone Number *</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} placeholder="Enter phone number" required />
                    </div>
                    <div className="ttp-form-group">
                      <label>Email Address</label>
                      <input type="email" name="email" value={formData.email} onChange={handleFormChange} placeholder="Enter email address" />
                    </div>
                    <div className="ttp-form-group">
                      <label>City *</label>
                      <input type="text" name="city" value={formData.city} onChange={handleFormChange} placeholder="Enter your city" required />
                    </div>
                    <div className="ttp-form-group">
                      <label>Interested Program *</label>
                      <select name="program" value={formData.program} onChange={handleFormChange}>
                        <option value="Abacus Teacher Training">Abacus Teacher Training</option>
                        <option value="Vedic Math Teacher Training">Vedic Math Teacher Training</option>
                        <option value="Both Abacus & Vedic Math">Both Abacus &amp; Vedic Math</option>
                        <option value="Franchise Opportunity">Franchise Opportunity</option>
                      </select>
                    </div>
                    <div className="ttp-form-group">
                      <label>Message (Optional)</label>
                      <textarea name="message" value={formData.message} onChange={handleFormChange} placeholder="Any questions or comments..." rows="3" />
                    </div>
                    <button type="submit" className="ttp-form-submit" disabled={formLoading}>
                      {formLoading ? '⏳ Submitting...' : '📝 Submit Registration'}
                    </button>
                    {formError && (
                      <p className="ttp-form-error">⚠️ {formError}</p>
                    )}
                    <p className="ttp-form-privacy">🔒 Your information is 100% safe. We will contact you within 24 hours.</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Video Modal (Student Videos) ── */}
        {activeVideoId && (
          <div className="sv-modal" onClick={() => setActiveVideoId(null)}>
            <div className="sv-modal-inner" onClick={e => e.stopPropagation()}>
              <button className="sv-modal-close" onClick={() => setActiveVideoId(null)}>✕</button>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoId.split('_')[0]}?autoplay=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Student Video"
              />
            </div>
          </div>
        )}

        {/* ── Video Modal (Teacher Testimonials) ── */}
        {activeTeacherVideo && (
          <div className="tm-modal" onClick={() => setActiveTeacherVideo(null)}>
            <div className="tm-modal-inner" onClick={e => e.stopPropagation()}>
              <button className="tm-modal-close" onClick={() => setActiveTeacherVideo(null)}>✕</button>
              <iframe
                src={`https://www.youtube.com/embed/${activeTeacherVideo.id}?autoplay=1&rel=0`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={activeTeacherVideo.name}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TTPLandingPage;
