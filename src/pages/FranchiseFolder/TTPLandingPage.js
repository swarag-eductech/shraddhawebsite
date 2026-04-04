import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { supabase as supabaseClient } from '../../supabaseClient';
import {
  FaCertificate,
  FaHandsHelping,
  FaCheckCircle,
  FaArrowRight,
  FaCalculator,
  FaBrain,
  FaUsers,
  FaMedal,
  FaLaptop,
  FaWhatsapp,
  FaPlayCircle,
} from "react-icons/fa";
import "./TTPLandingPage.css";
import { ttpTranslations } from "./TTPLandingPageTranslations";



const BOOK_SLIDES = [
  { src: 'https://res.cloudinary.com/dhix1afuq/image/upload/v1773573436/Abacus_Foundation_aa0xej.jpg', alt: 'Abacus Foundation' },
  { src: 'https://res.cloudinary.com/dhix1afuq/image/upload/v1773573435/abacus_level_1_kzocrd.jpg',    alt: 'Abacus Level 1' },
  { src: 'https://res.cloudinary.com/dhix1afuq/image/upload/v1773573436/abacus_level4_xejew0.jpg',     alt: 'Abacus Level 4' },
  { src: 'https://res.cloudinary.com/dhix1afuq/image/upload/v1773573435/abacus_level5_ioflgp.jpg',     alt: 'Abacus Level 5' },
];

const TTPLandingPage = () => {
  const [lang, setLang] = useState("en");
  const t = (section, key) => {
    return ttpTranslations[lang]?.[section]?.[key] || ttpTranslations['en']?.[section]?.[key] || '';
  };

  // Auto-detect language: URL param > localStorage > browser language > English
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get("lang");
    if (langParam && ['en', 'hi', 'mr', 'kn'].includes(langParam)) {
      setLang(langParam);
      localStorage.setItem("ttp_lang", langParam);
      return;
    }
    const savedLang = localStorage.getItem("ttp_lang");
    if (savedLang) {
      setLang(savedLang);
      return;
    }
    const userLang = navigator.language || '';
    if (userLang.startsWith("kn")) setLang("kn");
    else if (userLang.startsWith("mr")) setLang("mr");
    else if (userLang.startsWith("hi")) setLang("hi");
    else setLang("en");
  }, []);

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
      const { error } = await supabaseClient.from('ttp_leads').insert([
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email || null,
          city: formData.city,
          lead_program: 'ttp_teacher_training',
          campaign_name: formData.program,
          source: 'TTP Landing Page',
          status: 'new',
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

  const trainingModes = ttpTranslations[lang]?.trainingModes || ttpTranslations['en'].trainingModes;

  const bkMaterials = [
    { icon: '📗', title: t('bkMaterials', 'bk1Title'), desc: t('bkMaterials', 'bk1Desc'), color: '#667eea' },
    { icon: '📘', title: t('bkMaterials', 'bk2Title'), desc: t('bkMaterials', 'bk2Desc'), color: '#f7971e' },
    { icon: '📦', title: t('bkMaterials', 'bk3Title'), desc: t('bkMaterials', 'bk3Desc'), color: '#11998e' },
    { icon: '📋', title: t('bkMaterials', 'bk4Title'), desc: t('bkMaterials', 'bk4Desc'), color: '#ff6b35' },
    { icon: '📱', title: t('bkMaterials', 'bk5Title'), desc: t('bkMaterials', 'bk5Desc'), color: '#764ba2' },
    { icon: '🎓', title: t('bkMaterials', 'bk6Title'), desc: t('bkMaterials', 'bk6Desc'), color: '#e84393' },
  ];

  const curriculum = {
    abacus: ttpTranslations[lang]?.curriculum?.abacus || ttpTranslations['en'].curriculum.abacus,
    vedic: ttpTranslations[lang]?.curriculum?.vedic || ttpTranslations['en'].curriculum.vedic,
  };

  const benefits = [
    {
      icon: <FaCertificate className="ttp-benefit-icon" />,
      tag: t('benefits', 'b1Tag'),
      title: t('benefits', 'b1Title'),
      desc: t('benefits', 'b1Desc'),
      color: "#ff6600",
    },
    {
      icon: <FaHandsHelping className="ttp-benefit-icon" />,
      tag: t('benefits', 'b2Tag'),
      title: t('benefits', 'b2Title'),
      desc: t('benefits', 'b2Desc'),
      color: "#28a745",
    },
    {
      icon: <FaBrain className="ttp-benefit-icon" />,
      tag: t('benefits', 'b3Tag'),
      title: t('benefits', 'b3Title'),
      desc: t('benefits', 'b3Desc'),
      color: "#007bff",
    },
    {
      icon: <FaUsers className="ttp-benefit-icon" />,
      tag: t('benefits', 'b4Tag'),
      title: t('benefits', 'b4Title'),
      desc: t('benefits', 'b4Desc'),
      color: "#6f42c1",
    },
    {
      icon: <FaLaptop className="ttp-benefit-icon" />,
      tag: t('benefits', 'b5Tag'),
      title: t('benefits', 'b5Title'),
      desc: t('benefits', 'b5Desc'),
      color: "#17a2b8",
    },
    {
      icon: <FaMedal className="ttp-benefit-icon" />,
      tag: t('benefits', 'b6Tag'),
      title: t('benefits', 'b6Title'),
      desc: t('benefits', 'b6Desc'),
      color: "#fd7e14",
    },
  ];

  const whoShouldJoin = [
    {
      img: 'https://res.cloudinary.com/dhix1afuq/image/upload/v1773573650/school_mjvr0r.png',
      title: t('whoShouldJoin', 'card1Title'),
      desc: t('whoShouldJoin', 'card1Desc'),
    },
    {
      img: 'https://res.cloudinary.com/dhix1afuq/image/upload/v1773573650/housewives_earfj1.png',
      title: t('whoShouldJoin', 'card2Title'),
      desc: t('whoShouldJoin', 'card2Desc'),
    },
    {
      img: 'https://res.cloudinary.com/dhix1afuq/image/upload/v1773573653/student_i5fmmn.png',
      title: t('whoShouldJoin', 'card3Title'),
      desc: t('whoShouldJoin', 'card3Desc'),
    },
    {
      img: 'https://res.cloudinary.com/dhix1afuq/image/upload/v1773573651/tution_rbu7rl.png',
      title: t('whoShouldJoin', 'card4Title'),
      desc: t('whoShouldJoin', 'card4Desc'),
    },
    {
      img: 'https://res.cloudinary.com/dhix1afuq/image/upload/v1773573650/passionate_ifnwhx.png',
      title: t('whoShouldJoin', 'card5Title'),
      desc: t('whoShouldJoin', 'card5Desc'),
    },
  ];

  const steps = [
    { step: "01", title: t('steps', 's1Title'), desc: t('steps', 's1Desc'), duration: t('steps', 's1Duration') },
    { step: "02", title: t('steps', 's2Title'), desc: t('steps', 's2Desc'), duration: t('steps', 's2Duration') },
    { step: "03", title: t('steps', 's3Title'), desc: t('steps', 's3Desc'), duration: t('steps', 's3Duration') },
    { step: "04", title: t('steps', 's4Title'), desc: t('steps', 's4Desc'), duration: t('steps', 's4Duration') },
  ];

  const faqs = ttpTranslations[lang]?.faqs?.list || ttpTranslations['en'].faqs.list || [];

  const videos = [
    { id: 'ab9tTWL-aEM', label: '🎥 Student in Action' },
    { id: 'MxdRV8Uk4p0', label: '🎥 Abacus Speed Demo' },
    { id: 'uiXpLlSeUvQ', label: '🎥 Mental Math Trick' },
    { id: 'UKhSATJBBjw', label: '🎥 Competition Round' },
  ];
  const allVideos = [...videos, ...videos];

  const certColors = ['#f7971e', '#667eea', '#11998e', '#ff6b35', '#764ba2', '#e84393'];
  const certBenefits = [
    { icon: '🇮🇳', title: t('certBenefits', 'cb1Title'), desc: t('certBenefits', 'cb1Desc') },
    { icon: '🏆', title: t('certBenefits', 'cb2Title'), desc: t('certBenefits', 'cb2Desc') },
    { icon: '💼', title: t('certBenefits', 'cb3Title'), desc: t('certBenefits', 'cb3Desc') },
    { icon: '📋', title: t('certBenefits', 'cb4Title'), desc: t('certBenefits', 'cb4Desc') },
    { icon: '🎓', title: t('certBenefits', 'cb5Title'), desc: t('certBenefits', 'cb5Desc') },
    { icon: '💰', title: t('certBenefits', 'cb6Title'), desc: t('certBenefits', 'cb6Desc') },
  ];

  return (
    <>
      <Helmet>
        <title>Teacher Training Program (TTP) | Shraddha Institute</title>
        <meta
          name="description"
          content="Get certified in Abacus & Vedic Math teaching with Shraddha Institute's Teacher Training Program. 2,500+ trained teachers, nationally recognized certificate, complete support."
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-KLKWTZ5T0W"></script>
        <script>{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-KLKWTZ5T0W');
        `}</script>
      </Helmet>

      <div className="ttp-page">
        {/* ── Announcement Bar + Language Selector ── */}
        <div className="ttp-announcement-bar">
          <div className="ttp-announcement-center">
            <span className="ttp-announcement-badge">{t('hero', 'announcementBadge')}</span>
            <span className="ttp-announcement-text">{t('hero', 'announcementText')}</span>
          </div>
          <select
            className="ttp-lang-select"
            value={lang}
            onChange={(e) => {
              setLang(e.target.value);
              localStorage.setItem("ttp_lang", e.target.value);
            }}
            aria-label="Select language"
          >
            <option value="en"> English</option>
            <option value="hi"> हिंदी</option>
            <option value="mr">मराठी</option>
            <option value="kn">ಕನ್ನಡ</option>
          </select>
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
                <FaCertificate className="me-2" /> {t('hero', 'pill')}
              </span>
              <h1 className="ttp-hero-title">
                {t('hero', 'titleStart')}{' '}<span className="ttp-highlight">{t('hero', 'titleHighlight')}</span><br />
                {t('hero', 'titleMid')}<br />
                <span className="ttp-hero-title-accent">{t('hero', 'titleAccent')}</span>
              </h1>
              <p className="ttp-hero-subtitle">
                {t('hero', 'subtitle')}
              </p>
              <ul className="ttp-hero-checklist">
                <li><FaCheckCircle className="ttp-hero-check-icon" /> {t('hero', 'check1')}</li>
                <li><FaCheckCircle className="ttp-hero-check-icon" /> {t('hero', 'check2')}</li>
                <li><FaCheckCircle className="ttp-hero-check-icon" /> {t('hero', 'check3')}</li>
              </ul>
              <div className="ttp-hero-cta">
                <Link to="/contact" className="ttp-btn-primary">
                  {t('hero', 'enrollBtn')} <FaArrowRight className="ms-2" />
                </Link>
                <a href="https://wa.me/918446889966" target="_blank" rel="noreferrer" className="ttp-btn-whatsapp">
                  <FaWhatsapp className="me-2" /> {t('hero', 'waBtn')}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Teacher Testimonials ── */}
        <section className="testimonials-section">
          <div className="ttp-container">
            <div className="ttp-section-header">
              <span className="tm-section-badge">{t('testimonials', 'badge')}</span>
              <h2 className="ttp-section-title">{t('testimonials', 'title')}</h2>
              <p className="ttp-section-sub">
                {t('testimonials', 'sub')}
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
              <h2 className="ttp-section-title">{t('whoShouldJoin', 'title')}</h2>
              <p className="ttp-section-sub">
                {t('whoShouldJoin', 'sub')}
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
                <h3>{t('whoShouldJoin', 'bannerTitle')}</h3>
                <p>{t('whoShouldJoin', 'bannerDesc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── What You'll Learn (Curriculum Tabs) ── */}
        <section className="ttp-section ttp-curriculum-section">
          <div className="ttp-container">
            <div className="ttp-section-header">
              <h2 className="ttp-section-title">{t('curriculum', 'title')}</h2>
              <p className="ttp-section-sub">
                {t('curriculum', 'sub')}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="ttp-tabs">
              <button
                className={`ttp-tab ${activeTab === "abacus" ? "active" : ""}`}
                onClick={() => setActiveTab("abacus")}
              >
                <FaCalculator className="me-2" /> {t('curriculum', 'abacusTab')}
              </button>
              <button
                className={`ttp-tab ${activeTab === "vedic" ? "active" : ""}`}
                onClick={() => setActiveTab("vedic")}
              >
                <FaBrain className="me-2" /> {t('curriculum', 'vedicTab')}
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
                {t('curriculum', 'note')}
              </span>
            </div>
          </div>
        </section>

        {/* ── Benefits ── */}
        <section className="ttp-section ttp-benefits-section">
          <div className="ttp-container">
            <div className="ttp-section-header">
              <span className="ttp-section-pill">{t('benefits', 'pill')}</span>
              <h2 className="ttp-section-title">
                {t('benefits', 'title')}{' '}
                <span className="ttp-title-highlight">{t('benefits', 'titleHighlight')}</span>
              </h2>
              <p className="ttp-section-sub">
                {t('benefits', 'sub')}
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
              <span className="ttp-section-pill">{t('modes', 'pill')}</span>
              <h2 className="ttp-section-title">{t('modes', 'title')}</h2>
              <p className="ttp-section-sub">
                {t('modes', 'sub')}
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
                <h3>{t('modes', 'bannerTitle')}</h3>
                <p>{t('modes', 'bannerDesc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Certification ── */}
        <section className="ttp-section cert-section" id="certification">
          <div className="ttp-container">
            <div className="cert-header">
              <span className="cert-badge-pill">{t('cert', 'pill')}</span>
              <h2 className="ttp-section-title">
                {t('cert', 'title')}{' '}
                <span className="cert-grad-text">{t('cert', 'gradText')}</span>
              </h2>
              <p className="ttp-section-sub">
                {t('cert', 'sub')}
              </p>
            </div>

            <div className="cert-layout">
              <div className="cert-mockup-col">
                <div className="cert-ribbon">{t('cert', 'ribbon')}</div>
                <div className="cert-img-wrap">
                  <img
                    src="https://res.cloudinary.com/dhix1afuq/image/upload/v1773643614/certificate_hnskko.jpg"
                    alt="Shraddha Institute TTP Certificate"
                    className="cert-real-img"
                  />
                </div>
                <div className="cert-valid-pill">{t('cert', 'valid')}</div>
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
              <span className="ttp-section-pill">{t('bkSection', 'pill')}</span>
              <h2 className="ttp-section-title">
                {t('bkSection', 'title')}<span className="bk-grad">{t('bkSection', 'titleGrad')}</span>
              </h2>
              <p className="ttp-section-sub">
                {t('bkSection', 'sub')}
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
                    <strong>{t('bkSection', 'promiseTitle')}</strong>
                    <p>{t('bkSection', 'promiseDesc')}</p>
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
                <span className="bk-app-badge">{t('bkSection', 'appBadge')}</span>
                <h3>{t('bkSection', 'appTitle')}</h3>
                <p>{t('bkSection', 'appDesc')}</p>
                <ul className="bk-app-perks">
                  <li>{t('bkSection', 'appPerk1')}</li>
                  <li>{t('bkSection', 'appPerk2')}</li>
                  <li>{t('bkSection', 'appPerk3')}</li>
                </ul>
                <a
                  href="https://play.google.com/store/apps/details?id=co.groot.nitc&pcampaignid=web_share"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bk-app-btn"
                >
                  {t('bkSection', 'appBtn')}
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
              <h2 className="ttp-section-title">{t('steps', 'title')}</h2>
              <p className="ttp-section-sub">{t('steps', 'sub')}</p>
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
            <h2 className="sv-title">{t('students', 'title')}</h2>
            <p className="sv-sub">{t('students', 'sub')}</p>
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
              <span className="ttp-section-pill">{t('faqs', 'pill')}</span>
              <h2 className="ttp-section-title">{t('faqs', 'title')}</h2>
              <p className="ttp-section-sub">{t('faqs', 'sub')}</p>
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
                <h3>{t('faqs', 'ctaTitle')}</h3>
                <p>{t('faqs', 'ctaSub')}</p>
              </div>
              <a href="#ttp-contact" className="ttp-btn-primary faq-cta-btn">{t('faqs', 'ctaBtn')}</a>
            </div>
          </div>
        </section>

        {/* ── Contact & Registration ── */}
        <section className="ttp-contact-section" id="ttp-contact">
          <div className="ttp-container">
            <div className="ttp-section-header">
              <span className="ttp-section-pill">{t('contact', 'pill')}</span>
              <h2 className="ttp-section-title">{t('contact', 'title')}</h2>
              <p className="ttp-section-sub">{t('contact', 'sub')}</p>
            </div>
            <div className="ttp-contact-limited-badge">
              <span>{t('contact', 'badge')}</span>
              <p>{t('contact', 'badgeSub')}</p>
            </div>
            <div className="ttp-contact-grid">
              {/* Left: Contact Info */}
              <div className="ttp-contact-info">
                <div className="ttp-contact-cards">
                  <a href="tel:+918446889966" className="ttp-contact-card">
                    <div className="ttp-contact-card-icon">📞</div>
                    <div className="ttp-contact-card-body">
                      <h4>{t('contact', 'callNow')}</h4>
                      <p>+91 84468 89966</p>
                    </div>
                  </a>
                  <a href="https://wa.me/918446889966" target="_blank" rel="noreferrer" className="ttp-contact-card ttp-contact-card-wa">
                    <div className="ttp-contact-card-icon">📲</div>
                    <div className="ttp-contact-card-body">
                      <h4>{t('contact', 'waNow')}</h4>
                      <p>+91 84468 89966</p>
                      <span>Send "Hello" for instant info</span>
                    </div>
                  </a>
                  <a href="mailto:info@shraddhainstitute.com" className="ttp-contact-card">
                    <div className="ttp-contact-card-icon">📧</div>
                    <div className="ttp-contact-card-body">
                      <h4>{t('contact', 'emailUs')}</h4>
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
                <h3>{t('form', 'title')}</h3>
                {formSubmitted ? (
                  <div className="ttp-form-success">
                    ✅ Thank you! We'll contact you within 24 hours.
                  </div>
                ) : (
                  <form className="ttp-reg-form" onSubmit={handleFormSubmit}>
                    <div className="ttp-form-group">
                      <label>{t('form', 'fullName')}</label>
                      <input type="text" name="name" value={formData.name} onChange={handleFormChange} placeholder="Enter your name" required />
                    </div>
                    <div className="ttp-form-group">
                      <label>{t('form', 'phone')}</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} placeholder="Enter phone number" required />
                    </div>
                    <div className="ttp-form-group">
                      <label>{t('form', 'email')}</label>
                      <input type="email" name="email" value={formData.email} onChange={handleFormChange} placeholder="Enter email address" />
                    </div>
                    <div className="ttp-form-group">
                      <label>{t('form', 'city')}</label>
                      <input type="text" name="city" value={formData.city} onChange={handleFormChange} placeholder="Enter your city" required />
                    </div>
                    <div className="ttp-form-group">
                      <label>{t('form', 'program')}</label>
                      <select name="program" value={formData.program} onChange={handleFormChange}>
                        <option value="Abacus Teacher Training">Abacus Teacher Training</option>
                        <option value="Vedic Math Teacher Training">Vedic Math Teacher Training</option>
                        <option value="Both Abacus & Vedic Math">Both Abacus &amp; Vedic Math</option>
                        <option value="Franchise Opportunity">Franchise Opportunity</option>
                      </select>
                    </div>
                    <div className="ttp-form-group">
                      <label>{t('form', 'message')}</label>
                      <textarea name="message" value={formData.message} onChange={handleFormChange} placeholder="Any questions or comments..." rows="3" />
                    </div>
                    <button type="submit" className="ttp-form-submit" disabled={formLoading}>
                      {formLoading ? t('form', 'submitting') : t('form', 'submit')}
                    </button>
                    {formError && (
                      <p className="ttp-form-error">⚠️ {formError}</p>
                    )}
                    <p className="ttp-form-privacy">{t('form', 'privacy')}</p>
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
