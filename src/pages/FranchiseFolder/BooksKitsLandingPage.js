import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { FaWhatsapp, FaPhone, FaEnvelope, FaArrowRight, FaCheckCircle, FaBookOpen, FaStar, FaShoppingCart, FaFileAlt } from "react-icons/fa";
import "./BooksKitsLandingPage.css";
import {
  booksKitsTranslations,
  abacusBooks, vedicBooks,
  abacusPractice, vedicPractice,
  kitsData,
} from "./BooksKitsTranslations";

const BooksKitsLandingPage = () => {
  const [lang, setLang] = useState("en");
  const [activeSection, setActiveSection] = useState("abacus");
  const [openFaq, setOpenFaq] = useState(null);
  const [vedicFilter, setVedicFilter] = useState("junior"); // 'junior' | 'senior'

  const t = (section, key) =>
    booksKitsTranslations[lang]?.[section]?.[key] ||
    booksKitsTranslations["en"]?.[section]?.[key] || "";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lp = params.get("lang");
    if (lp && ["en","hi","mr","kn"].includes(lp)) { setLang(lp); return; }
    const sv = localStorage.getItem("bk_lang");
    if (sv) { setLang(sv); return; }
    const ul = navigator.language || "";
    if (ul.startsWith("kn")) setLang("kn");
    else if (ul.startsWith("mr")) setLang("mr");
    else if (ul.startsWith("hi")) setLang("hi");
    else setLang("en");
  }, []);

  const changeLang = (l) => { setLang(l); localStorage.setItem("bk_lang", l); };
  const waOrder = (title) => {
    const msg = `Hi! I want to order: ${title}\nPlease share details and pricing.`;
    window.open(`https://wa.me/918446889966?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const faqs = booksKitsTranslations[lang]?.faq?.list || booksKitsTranslations["en"].faq.list;
  const juniorBooks = vedicBooks.filter(b => b.label.startsWith("Junior"));
  const seniorBooks = vedicBooks.filter(b => b.label.startsWith("Senior"));
  const displayedVedic = vedicFilter === "junior" ? juniorBooks : seniorBooks;

  // Shared book card renderer
  const BookCard = ({ book }) => (
    <div className="bk-book-card" style={{ "--accent": book.color }}>
      <div className="bk-book-header" style={{ background: `linear-gradient(135deg, ${book.color}22 0%, ${book.color}0d 100%)` }}>
        <div className="bk-book-level-badge" style={{ background: book.color }}>{book.label}</div>
        <div className="bk-book-emoji">{book.emoji}</div>
        <div className="bk-book-age-badge">{book.forAge}</div>
      </div>
      <div className="bk-book-body">
        <h3 className="bk-book-title">{book.titleEn}</h3>
        <p className="bk-book-desc">{book.descEn}</p>
        <ul className="bk-book-topics">
          {book.topics.map((tp, i) => (
            <li key={i}><FaCheckCircle className="bk-check" style={{ color: book.color }} />{tp}</li>
          ))}
        </ul>
        <div className="bk-book-footer">
          <span className="bk-book-price" style={{ color: book.color }}>
            {book.price === "Contact for Price" ? t("", "contactForPrice") || "Contact for Price" : book.price}
          </span>
          <button className="bk-order-btn" onClick={() => waOrder(book.titleEn)}>
            <FaShoppingCart className="me-2" /> {t("","orderBtn") || "Order Now"}
          </button>
        </div>
      </div>
    </div>
  );

  // Practice paper card renderer
  const PaperCard = ({ paper }) => (
    <div className="bk-paper-card" style={{ "--accent": paper.color }}>
      <div className="bk-paper-badge" style={{ background: paper.color }}>{paper.label}</div>
      <FaFileAlt className="bk-paper-icon" style={{ color: paper.color }} />
      <p className="bk-paper-desc">{paper.descEn}</p>
      <button className="bk-paper-btn" style={{ "--bc": paper.color }} onClick={() => waOrder(`Practice Paper — ${paper.label}`)}>
        {t("","orderPaperBtn") || "Order Paper"}
      </button>
    </div>
  );

  const navItems = [
    { key: "abacus",   icon: "🔢" },
    { key: "vedic",    icon: "🧮" },
    { key: "practice", icon: "📝" },
    { key: "kits",     icon: "📦" },
  ];

  return (
    <>
      <Helmet>
        <title>Books & Kits Store | Shraddha Institute — Abacus & Vedic Math</title>
        <meta name="description" content="Buy official Shraddha Institute Abacus books (UKG, Foundation, Junior 1–4, Senior 1–7), Vedic Math books (Junior 1–8, Senior 1–8) and practice papers. Pan-India delivery." />
      </Helmet>

      <div className="bk-page">
        {/* ── Top Bar ── */}
        <div className="bk-top-bar">
          <div className="bk-top-bar-inner">
            <span className="bk-top-badge"><FaStar className="bk-star-icon" /> {t("hero","badge")}</span>
            <span className="bk-top-text">🚚 Pan-India Delivery &nbsp;|&nbsp; 📞 8446889966</span>
          </div>
          <select className="bk-lang-select" value={lang} onChange={e => changeLang(e.target.value)} aria-label="Select language">
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="mr">मराठी</option>
            <option value="kn">ಕನ್ನಡ</option>
          </select>
        </div>

        {/* ── Hero ── */}
        <section className="bk-hero">
          <div className="bk-hero-bg-shapes">
            <div className="bk-shape bk-shape-1" /><div className="bk-shape bk-shape-2" /><div className="bk-shape bk-shape-3" />
          </div>
          <div className="bk-hero-content">
            <div className="bk-hero-text">
              <span className="bk-hero-pill">📚 Official Store</span>
              <h1 className="bk-hero-title">
                {t("hero","title")} <span className="bk-hero-gradient">{t("hero","titleHighlight")}</span>
              </h1>
              <p className="bk-hero-subtitle">{t("hero","subtitle")}</p>
              <div className="bk-hero-stats">
                <div className="bk-stat"><span className="bk-stat-num">13</span><span className="bk-stat-label">Abacus Books</span></div>
                <div className="bk-stat-sep" />
                <div className="bk-stat"><span className="bk-stat-num">16</span><span className="bk-stat-label">Vedic Math Books</span></div>
                <div className="bk-stat-sep" />
                <div className="bk-stat"><span className="bk-stat-num">18</span><span className="bk-stat-label">Practice Papers</span></div>
                <div className="bk-stat-sep" />
                <div className="bk-stat"><span className="bk-stat-num">600+</span><span className="bk-stat-label">Centers</span></div>
              </div>
              <div className="bk-hero-cta">
                <button className="bk-btn-primary" onClick={() => document.getElementById("bk-books").scrollIntoView({ behavior:"smooth" })}>
                  {t("hero","ctaOrder")} <FaArrowRight className="ms-2" />
                </button>
                <a href="https://wa.me/918446889966" target="_blank" rel="noreferrer" className="bk-btn-wa">
                  <FaWhatsapp className="me-2" /> {t("hero","ctaWhatsapp")}
                </a>
              </div>
            </div>
            <div className="bk-hero-visual">
              <div className="bk-books-stack">
                {[
                  { color:"#ff6b35", label:"Abacus Junior",  delay:"0s"   },
                  { color:"#22c55e", label:"Abacus Senior",  delay:"0.2s" },
                  { color:"#c026d3", label:"Vedic Junior",   delay:"0.4s" },
                  { color:"#2563eb", label:"Vedic Senior",   delay:"0.6s" },
                ].map((b,i) => (
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
            {navItems.map(({ key, icon }) => (
              <button key={key} className={`bk-nav-btn ${activeSection === key ? "active" : ""}`} onClick={() => setActiveSection(key)}>
                {icon} {t("nav", key)}
              </button>
            ))}
          </div>
        </nav>

        {/* ══ ABACUS BOOKS ══ */}
        {activeSection === "abacus" && (
          <section className="bk-books-section">
            <div className="bk-container">
              <div className="bk-section-header">
                <span className="bk-sec-badge">{t("abacusSection","badge")}</span>
                <h2 className="bk-sec-title">{t("abacusSection","title")} <span className="bk-title-grad">{t("abacusSection","titleHighlight")}</span></h2>
                <p className="bk-sec-sub">{t("abacusSection","sub")}</p>
              </div>

              {/* Level type chips */}
              <div className="bk-level-chips">
                {["UKG","Foundation","Junior 1","Junior 2","Junior 3","Junior 4","Senior 1","Senior 2","Senior 3","Senior 4","Senior 5","Senior 6","Senior 7"].map((lbl,i) => (
                  <a key={i} href={`#ab-${lbl.replace(" ","")}`} className="bk-chip">{lbl}</a>
                ))}
              </div>

              <div className="bk-books-grid">
                {abacusBooks.map(book => <BookCard key={book.id} book={book} />)}
              </div>
            </div>
          </section>
        )}

        {/* ══ VEDIC MATH BOOKS ══ */}
        {activeSection === "vedic" && (
          <section className="bk-books-section">
            <div className="bk-container">
              <div className="bk-section-header">
                <span className="bk-sec-badge">{t("vedicSection","badge")}</span>
                <h2 className="bk-sec-title">{t("vedicSection","title")} <span className="bk-title-grad">{t("vedicSection","titleHighlight")}</span></h2>
                <p className="bk-sec-sub">{t("vedicSection","sub")}</p>
              </div>

              {/* Junior / Senior filter */}
              <div className="bk-vedic-filter">
                <button className={`bk-filter-btn ${vedicFilter==="junior"?"active":""}`} onClick={()=>setVedicFilter("junior")}>📗 Junior (1–8)</button>
                <button className={`bk-filter-btn ${vedicFilter==="senior"?"active":""}`} onClick={()=>setVedicFilter("senior")}>📘 Senior (1–8)</button>
              </div>

              <div className="bk-books-grid">
                {displayedVedic.map(book => <BookCard key={book.id} book={book} />)}
              </div>
            </div>
          </section>
        )}

        {/* ══ PRACTICE PAPERS ══ */}
        {activeSection === "practice" && (
          <section className="bk-books-section">
            <div className="bk-container">
              <div className="bk-section-header">
                <span className="bk-sec-badge">{t("practiceSection","badge")}</span>
                <h2 className="bk-sec-title">{t("practiceSection","title")} <span className="bk-title-grad">{t("practiceSection","titleHighlight")}</span></h2>
                <p className="bk-sec-sub">{t("practiceSection","sub")}</p>
              </div>

              {/* Abacus Practice Papers */}
              <h3 className="bk-subsection-title">🔢 {t("practiceSection","abacusHead") || "Abacus Practice Papers"}</h3>
              <div className="bk-papers-grid">
                {abacusPractice.map(p => <PaperCard key={p.id} paper={p} />)}
              </div>

              {/* Vedic Practice Papers */}
              <h3 className="bk-subsection-title bk-subsection-title--vedic">🧮 {t("practiceSection","vedicHead") || "Vedic Math Practice Papers"}</h3>
              <div className="bk-papers-grid">
                {vedicPractice.map(p => <PaperCard key={p.id} paper={p} />)}
              </div>
            </div>
          </section>
        )}

        {/* ══ KITS ══ */}
        {activeSection === "kits" && (
          <section className="bk-books-section">
            <div className="bk-container">
              <div className="bk-section-header">
                <span className="bk-sec-badge">{t("kitsSection","badge")}</span>
                <h2 className="bk-sec-title">{t("kitsSection","title")} <span className="bk-title-grad">{t("kitsSection","titleHighlight")}</span></h2>
                <p className="bk-sec-sub">{t("kitsSection","sub")}</p>
              </div>
              <div className="bk-kits-grid">
                {kitsData.map(kit => (
                  <div key={kit.id} className="bk-kit-card" style={{ "--accent": kit.color }}>
                    {kit.badge && <div className="bk-kit-badge" style={{ background: kit.color }}>{kit.badge}</div>}
                    <div className="bk-kit-icon-wrap" style={{ background: `${kit.color}18` }}>
                      <span className="bk-kit-emoji">{kit.emoji}</span>
                    </div>
                    <h3 className="bk-kit-title">{kit.titleEn}</h3>
                    <p className="bk-kit-desc">{kit.descEn}</p>
                    <ul className="bk-kit-includes">
                      {kit.includes.map((item,i) => <li key={i}><FaCheckCircle style={{ color:kit.color }} className="bk-kit-check" /> {item}</li>)}
                    </ul>
                    <div className="bk-kit-footer">
                      <span className="bk-kit-price" style={{ color:kit.color }}>
                        {kit.price === "Contact for Price" ? t("","contactForPrice") || "Contact for Price" : kit.price}
                      </span>
                      <button className="bk-order-btn" onClick={() => waOrder(kit.titleEn)}>
                        <FaShoppingCart className="me-2" /> {t("","orderBtn") || "Order Now"}
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
              <span className="bk-sec-badge">{t("orderSection","badge")}</span>
              <h2 className="bk-sec-title">{t("orderSection","title")}</h2>
              <p className="bk-sec-sub">{t("orderSection","sub")}</p>
            </div>
            <div className="bk-order-steps">
              {["s1","s2","s3","s4"].map((k,i) => (
                <div key={k} className="bk-order-step">
                  <div className="bk-step-num">{String(i+1).padStart(2,"0")}</div>
                  <h3 className="bk-step-title">{t("orderSection",k)}</h3>
                  <p className="bk-step-desc">{t("orderSection",`${k}Desc`)}</p>
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
              <span className="bk-sec-badge">{t("faq","badge")}</span>
              <h2 className="bk-sec-title">{t("faq","title")}</h2>
              <p className="bk-sec-sub">{t("faq","sub")}</p>
            </div>
            <div className="bk-faq-list">
              {faqs.map((faq,i) => (
                <div key={i} className={`bk-faq-item ${openFaq===i?"active":""}`}>
                  <button className="bk-faq-q" onClick={() => setOpenFaq(openFaq===i?null:i)}>
                    <span className="bk-faq-num">{String(i+1).padStart(2,"0")}</span>
                    <span className="bk-faq-q-text">{faq.q}</span>
                    <span className="bk-faq-chevron">{openFaq===i?"▲":"▼"}</span>
                  </button>
                  {openFaq===i && <div className="bk-faq-a"><p>{faq.a}</p></div>}
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
                <span className="bk-sec-badge">{t("contact","badge")}</span>
                <h2 className="bk-contact-title">{t("contact","title")}</h2>
                <p className="bk-contact-sub">{t("contact","sub")}</p>
              </div>
              <div className="bk-contact-btns">
                <a href="tel:+918446889966" className="bk-contact-btn bk-contact-call"><FaPhone /> {t("contact","callBtn")}</a>
                <a href="https://wa.me/918446889966" target="_blank" rel="noreferrer" className="bk-contact-btn bk-contact-wa"><FaWhatsapp /> {t("contact","waBtn")}</a>
                <a href="mailto:shraddhainstitutemath@gmail.com" className="bk-contact-btn bk-contact-email"><FaEnvelope /> {t("contact","emailBtn")}</a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BooksKitsLandingPage;
