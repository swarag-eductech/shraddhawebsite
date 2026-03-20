import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { FaWhatsapp, FaPhone, FaEnvelope, FaArrowRight, FaCheckCircle, FaBookOpen, FaStar, FaShoppingCart } from "react-icons/fa";
import "./BooksKitsLandingPage.css";
import { booksKitsTranslations, abacusBooks, vedicBooks, kitsData } from "./BooksKitsTranslations";

const BooksKitsLandingPage = () => {
  const [lang, setLang] = useState("en");
  const [activeSection, setActiveSection] = useState("abacus");
  const [openFaq, setOpenFaq] = useState(null);

  const t = (section, key) =>
    booksKitsTranslations[lang]?.[section]?.[key] ||
    booksKitsTranslations["en"]?.[section]?.[key] ||
    "";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get("lang");
    if (langParam && ["en", "hi", "mr", "kn"].includes(langParam)) {
      setLang(langParam);
      return;
    }
    const saved = localStorage.getItem("bk_lang");
    if (saved) { setLang(saved); return; }
    const ul = navigator.language || "";
    if (ul.startsWith("kn")) setLang("kn");
    else if (ul.startsWith("mr")) setLang("mr");
    else if (ul.startsWith("hi")) setLang("hi");
    else setLang("en");
  }, []);

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem("bk_lang", l);
  };

  const waOrder = (itemTitle) => {
    const msg = `Hi! I want to order: ${itemTitle}\nPlease share details and pricing.`;
    window.open(`https://wa.me/918446889966?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const faqs = booksKitsTranslations[lang]?.faq?.list || booksKitsTranslations["en"].faq.list;

  return (
    <>
      <Helmet>
        <title>Books & Kits Store | Shraddha Institute — Abacus & Vedic Math</title>
        <meta name="description" content="Buy official Shraddha Institute Abacus books (Level 1–8) and Vedic Math books (6 levels) with complete kits delivered across India." />
      </Helmet>

      <div className="bk-page">
        {/* ── Top Bar ── */}
        <div className="bk-top-bar">
          <div className="bk-top-bar-inner">
            <span className="bk-top-badge">
              <FaStar className="bk-star-icon" /> {t("hero", "badge")}
            </span>
            <span className="bk-top-text">🚚 Pan-India Delivery | 📞 Call 8446889966</span>
          </div>
          <select
            className="bk-lang-select"
            value={lang}
            onChange={(e) => changeLang(e.target.value)}
            aria-label="Select language"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="mr">मराठी</option>
            <option value="kn">ಕನ್ನಡ</option>
          </select>
        </div>

        {/* ── Hero ── */}
        <section className="bk-hero">
          <div className="bk-hero-bg-shapes">
            <div className="bk-shape bk-shape-1" />
            <div className="bk-shape bk-shape-2" />
            <div className="bk-shape bk-shape-3" />
          </div>
          <div className="bk-hero-content">
            <div className="bk-hero-text">
              <span className="bk-hero-pill">📚 Official Store</span>
              <h1 className="bk-hero-title">
                {t("hero", "title")}{" "}
                <span className="bk-hero-gradient">{t("hero", "titleHighlight")}</span>
              </h1>
              <p className="bk-hero-subtitle">{t("hero", "subtitle")}</p>
              <div className="bk-hero-stats">
                <div className="bk-stat"><span className="bk-stat-num">8</span><span className="bk-stat-label">Abacus Levels</span></div>
                <div className="bk-stat-sep" />
                <div className="bk-stat"><span className="bk-stat-num">6</span><span className="bk-stat-label">Vedic Math Levels</span></div>
                <div className="bk-stat-sep" />
                <div className="bk-stat"><span className="bk-stat-num">600+</span><span className="bk-stat-label">Centers</span></div>
              </div>
              <div className="bk-hero-cta">
                <button
                  className="bk-btn-primary"
                  onClick={() => document.getElementById("bk-books").scrollIntoView({ behavior: "smooth" })}
                >
                  {t("hero", "ctaOrder")} <FaArrowRight className="ms-2" />
                </button>
                <a href="https://wa.me/918446889966" target="_blank" rel="noreferrer" className="bk-btn-wa">
                  <FaWhatsapp className="me-2" /> {t("hero", "ctaWhatsapp")}
                </a>
              </div>
            </div>
            <div className="bk-hero-visual">
              <div className="bk-books-stack">
                {[
                  { color: "#ff6b35", label: "Abacus L1", delay: "0s" },
                  { color: "#667eea", label: "Abacus L4", delay: "0.2s" },
                  { color: "#11998e", label: "Vedic L1", delay: "0.4s" },
                  { color: "#e84393", label: "Abacus L8", delay: "0.6s" },
                ].map((b, i) => (
                  <div key={i} className="bk-book-card-visual" style={{ "--bc": b.color, "--bd": b.delay }}>
                    <FaBookOpen className="bk-book-icon-vis" />
                    <span>{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Section Nav ── */}
        <nav className="bk-section-nav" id="bk-books">
          <div className="bk-nav-inner">
            {["abacus", "vedic", "kits"].map((sec) => (
              <button
                key={sec}
                className={`bk-nav-btn ${activeSection === sec ? "active" : ""}`}
                onClick={() => setActiveSection(sec)}
              >
                {sec === "abacus" ? "🔢 " : sec === "vedic" ? "🧮 " : "📦 "}
                {t("nav", sec)}
              </button>
            ))}
          </div>
        </nav>

        {/* ── Abacus Books ── */}
        {activeSection === "abacus" && (
          <section className="bk-books-section">
            <div className="bk-container">
              <div className="bk-section-header">
                <span className="bk-sec-badge">{t("abacusSection", "badge")}</span>
                <h2 className="bk-sec-title">
                  {t("abacusSection", "title")}{" "}
                  <span className="bk-title-grad">{t("abacusSection", "titleHighlight")}</span>
                </h2>
                <p className="bk-sec-sub">{t("abacusSection", "sub")}</p>
              </div>

              <div className="bk-books-grid">
                {abacusBooks.map((book) => (
                  <div key={book.level} className="bk-book-card" style={{ "--accent": book.color }}>
                    <div className="bk-book-header" style={{ background: `linear-gradient(135deg, ${book.color}22 0%, ${book.color}11 100%)` }}>
                      <div className="bk-book-level-badge" style={{ background: book.color }}>
                        {t("", "levelLabel") || "Level"} {book.level}
                      </div>
                      <div className="bk-book-emoji">{book.emoji}</div>
                      <div className="bk-book-age-badge">{book.forAge}</div>
                    </div>
                    <div className="bk-book-body">
                      <h3 className="bk-book-title">{book.titleEn}</h3>
                      <p className="bk-book-desc">{book.descEn}</p>
                      <ul className="bk-book-topics">
                        {book.topics.map((topic, i) => (
                          <li key={i}><FaCheckCircle className="bk-check" style={{ color: book.color }} />{topic}</li>
                        ))}
                      </ul>
                      <div className="bk-book-footer">
                        <div className="bk-book-meta">
                          <span className="bk-book-pages">📄 {book.pages}</span>
                          <span className="bk-book-price" style={{ color: book.color }}>{book.price}</span>
                        </div>
                        <button className="bk-order-btn" style={{ "--bc": book.color }} onClick={() => waOrder(book.titleEn)}>
                          <FaShoppingCart className="me-2" /> {t("", "orderBtn") || "Order This Book"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Vedic Math Books ── */}
        {activeSection === "vedic" && (
          <section className="bk-books-section">
            <div className="bk-container">
              <div className="bk-section-header">
                <span className="bk-sec-badge">{t("vedicSection", "badge")}</span>
                <h2 className="bk-sec-title">
                  {t("vedicSection", "title")}{" "}
                  <span className="bk-title-grad">{t("vedicSection", "titleHighlight")}</span>
                </h2>
                <p className="bk-sec-sub">{t("vedicSection", "sub")}</p>
              </div>

              <div className="bk-books-grid">
                {vedicBooks.map((book) => (
                  <div key={book.level} className="bk-book-card" style={{ "--accent": book.color }}>
                    <div className="bk-book-header" style={{ background: `linear-gradient(135deg, ${book.color}22 0%, ${book.color}11 100%)` }}>
                      <div className="bk-book-level-badge" style={{ background: book.color }}>
                        {t("", "levelLabel") || "Level"} {book.level}
                      </div>
                      <div className="bk-book-emoji">{book.emoji}</div>
                      <div className="bk-book-age-badge">{book.forAge}</div>
                    </div>
                    <div className="bk-book-body">
                      <h3 className="bk-book-title">{book.titleEn}</h3>
                      <p className="bk-book-desc">{book.descEn}</p>
                      <ul className="bk-book-topics">
                        {book.topics.map((topic, i) => (
                          <li key={i}><FaCheckCircle className="bk-check" style={{ color: book.color }} />{topic}</li>
                        ))}
                      </ul>
                      <div className="bk-book-footer">
                        <div className="bk-book-meta">
                          <span className="bk-book-pages">📄 {book.pages}</span>
                          <span className="bk-book-price" style={{ color: book.color }}>{book.price}</span>
                        </div>
                        <button className="bk-order-btn" style={{ "--bc": book.color }} onClick={() => waOrder(book.titleEn)}>
                          <FaShoppingCart className="me-2" /> {t("", "orderBtn") || "Order This Book"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Kits Section ── */}
        {activeSection === "kits" && (
          <section className="bk-books-section">
            <div className="bk-container">
              <div className="bk-section-header">
                <span className="bk-sec-badge">{t("kitsSection", "badge")}</span>
                <h2 className="bk-sec-title">
                  {t("kitsSection", "title")}{" "}
                  <span className="bk-title-grad">{t("kitsSection", "titleHighlight")}</span>
                </h2>
                <p className="bk-sec-sub">{t("kitsSection", "sub")}</p>
              </div>

              <div className="bk-kits-grid">
                {kitsData.map((kit) => (
                  <div key={kit.id} className="bk-kit-card" style={{ "--accent": kit.color }}>
                    {kit.badge && (
                      <div className="bk-kit-badge" style={{ background: kit.color }}>{kit.badge}</div>
                    )}
                    <div className="bk-kit-icon-wrap" style={{ background: `${kit.color}18` }}>
                      <span className="bk-kit-emoji">{kit.emoji}</span>
                    </div>
                    <h3 className="bk-kit-title">{kit.titleEn}</h3>
                    <p className="bk-kit-desc">{kit.descEn}</p>
                    <ul className="bk-kit-includes">
                      {kit.includes.map((item, i) => (
                        <li key={i}><FaCheckCircle style={{ color: kit.color }} className="bk-kit-check" /> {item}</li>
                      ))}
                    </ul>
                    <div className="bk-kit-footer">
                      <span className="bk-kit-price" style={{ color: kit.color }}>{kit.price}</span>
                      <button className="bk-order-btn" style={{ "--bc": kit.color }} onClick={() => waOrder(kit.titleEn)}>
                        <FaShoppingCart className="me-2" /> Order Kit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── How to Order ── */}
        <section className="bk-order-section">
          <div className="bk-container">
            <div className="bk-section-header">
              <span className="bk-sec-badge">{t("orderSection", "badge")}</span>
              <h2 className="bk-sec-title">{t("orderSection", "title")}</h2>
              <p className="bk-sec-sub">{t("orderSection", "sub")}</p>
            </div>
            <div className="bk-order-steps">
              {["s1", "s2", "s3", "s4"].map((key, i) => (
                <div key={key} className="bk-order-step">
                  <div className="bk-step-num">{String(i + 1).padStart(2, "0")}</div>
                  <h3 className="bk-step-title">{t("orderSection", key)}</h3>
                  <p className="bk-step-desc">{t("orderSection", `${key}Desc`)}</p>
                  {i < 3 && <div className="bk-step-arrow"><FaArrowRight /></div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bk-faq-section">
          <div className="bk-container">
            <div className="bk-section-header">
              <span className="bk-sec-badge">{t("faq", "badge")}</span>
              <h2 className="bk-sec-title">{t("faq", "title")}</h2>
              <p className="bk-sec-sub">{t("faq", "sub")}</p>
            </div>
            <div className="bk-faq-list">
              {faqs.map((faq, i) => (
                <div key={i} className={`bk-faq-item ${openFaq === i ? "active" : ""}`}>
                  <button
                    className="bk-faq-q"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="bk-faq-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="bk-faq-q-text">{faq.q}</span>
                    <span className="bk-faq-chevron">{openFaq === i ? "▲" : "▼"}</span>
                  </button>
                  {openFaq === i && (
                    <div className="bk-faq-a"><p>{faq.a}</p></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section className="bk-contact-section" id="bk-contact">
          <div className="bk-container">
            <div className="bk-contact-inner">
              <div className="bk-contact-text">
                <span className="bk-sec-badge">{t("contact", "badge")}</span>
                <h2 className="bk-contact-title">{t("contact", "title")}</h2>
                <p className="bk-contact-sub">{t("contact", "sub")}</p>
              </div>
              <div className="bk-contact-btns">
                <a href="tel:+918446889966" className="bk-contact-btn bk-contact-call">
                  <FaPhone /> {t("contact", "callBtn")}
                </a>
                <a href="https://wa.me/918446889966" target="_blank" rel="noreferrer" className="bk-contact-btn bk-contact-wa">
                  <FaWhatsapp /> {t("contact", "waBtn")}
                </a>
                <a href="mailto:shraddhainstitutemath@gmail.com" className="bk-contact-btn bk-contact-email">
                  <FaEnvelope /> {t("contact", "emailBtn")}
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BooksKitsLandingPage;
