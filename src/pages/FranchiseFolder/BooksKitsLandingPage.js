import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import { FaWhatsapp, FaPhone, FaEnvelope, FaArrowRight, FaCheckCircle, FaBookOpen, FaStar, FaShoppingCart, FaFileAlt } from "react-icons/fa";
import "./BooksKitsLandingPage.css";
import {
  booksKitsTranslations,
  abacusBooks, vedicBooks,
  abacusPractice, vedicPractice,
} from "./BooksKitsTranslations";

const BooksKitsLandingPage = () => {
  const [lang, setLang] = useState("en");
  const [activeSection, setActiveSection] = useState("abacus");
  const [openFaq, setOpenFaq] = useState(null);
  const [vedicFilter, setVedicFilter] = useState("junior"); // 'junior' | 'senior'
  const [cart, setCart] = useState({});

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

  const updateQty = (id, delta, title) => {
    setCart(prev => {
      const current = prev[id]?.qty || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: { qty: next, title } };
    });
  };

  const totalItems = Object.values(cart).reduce((acc, item) => acc + item.qty, 0);

  const checkoutWA = () => {
    if (totalItems === 0) return;
    let msg = `Hi Shraddha Institute! I want to order the following:\n\n`;
    Object.values(cart).forEach(item => {
      msg += `• ${item.title} (Qty: ${item.qty})\n`;
    });
    msg += `\nPlease share total pricing and payment details.`;
    window.open(`https://wa.me/918446889966?text=${encodeURIComponent(msg)}`, "_blank");
  };



  const getBookImageUrl = (book) => {
    const abacusBase = "https://fetvqggubxedatdryesz.supabase.co/storage/v1/object/public/BooksCover/certificate/";
    const vedicBase = "https://fetvqggubxedatdryesz.supabase.co/storage/v1/object/public/BooksCover/vedic%20math/";
    const toAbacusUrl = (filename) => `${abacusBase}${encodeURIComponent(filename)}`;
    const toVedicUrl = (filename) => `${vedicBase}${encodeURIComponent(filename)}`;
    if (!book?.id) return null;

    const abacusMap = {
      ukg: "UKG.jpeg",
      fnd: "Foundation.jpeg",
      j1: "Abacus junior level 1.jpeg",
      j2: "Abacus junior level 2.jpeg",
      j3: "Abacus junior level 3.jpeg",
      j4: "Abacus junior level 4.jpeg",
      s1: "abacus senior level 1.jpeg",
      s2: "abacus senior level 2.jpeg",
      s3: "abacus senior level 3.jpeg",
      s4: "abacus senior level 4.jpeg",
      s5: "abacus senior level 5.jpeg",
      s6: "abacus  senior level 6.jpeg", // intentional exact key
      s7: "abacus senior level 7.jpeg",
    };

    const vedicMap = {
      vj1: "vedic math junior level 1.jpeg",
      vj2: "vedic math junior level 2.jpeg",
      vj3: "vedic math junior level 3.jpeg",
      vj4: "vedic math junior level 4.jpeg",
      vj5: "vedic math.jpeg", // common cover for Junior 5-8
      vj6: "vedic math.jpeg",
      vj7: "vedic math.jpeg",
      vj8: "vedic math.jpeg",
      vs1: "vedic math senior level 1.jpeg",
      vs2: "vedic math senior level 2.jpeg",
      vs3: "vedic senior level 3.jpeg",
      vs4: "vedic math senior  level 4.jpeg", // double-space exact overlap as requested
      vs5: "vedic math.jpeg", // common cover for Senior 5-7
      vs6: "vedic math.jpeg",
      vs7: "vedic math.jpeg",
      vs8: "vedic math.jpeg",
    };

    if (abacusMap[book.id]) {
      return toAbacusUrl(abacusMap[book.id]);
    }

    if (vedicMap[book.id]) {
      return toVedicUrl(vedicMap[book.id]);
    }

    return null;
  };

  const getBookImageUrlCandidates = (book) => {
    const primary = getBookImageUrl(book);
    if (!primary) return [];

    const candidates = [primary];

    if (primary.match(/abacus%20junior%20level%20(\d+)\.jpeg$/i)) {
      candidates.push(primary.replace(/abacus%20junior%20level%20(\d+)\.jpeg$/i, "Abacus%20junior%20level%20$1.jpeg"));
      candidates.push(primary.replace(/Abacus%20junior%20level%20(\d+)\.jpeg$/i, "abacus%20junior%20level%20$1.jpeg"));
    }

    if (primary.includes("abacus%20senior%20level%20")) {
      candidates.push(primary.replace(/abacus%20senior%20level%20(\d+)\.jpeg$/i, "abacus%20senior%20%20level%20$1.jpeg"));
    }
    if (primary.includes("abacus%20senior%20%20level%20")) {
      candidates.push(primary.replace(/abacus%20senior%20%20level%20(\d+)\.jpeg$/i, "abacus%20senior%20level%20$1.jpeg"));
    }

    if (primary.includes("vedic%20math%20senior%20level%20")) {
      candidates.push(primary.replace(/vedic%20math%20senior%20level%20(\d+)\.jpeg$/i, "vedic%20math%20senior%20%20level%20$1.jpeg"));
    }
    if (primary.includes("vedic%20math%20senior%20%20level%20")) {
      candidates.push(primary.replace(/vedic%20math%20senior%20%20level%20(\d+)\.jpeg$/i, "vedic%20math%20senior%20level%20$1.jpeg"));
    }

    return [...new Set(candidates)];
  };

  const faqs = booksKitsTranslations[lang]?.faq?.list || booksKitsTranslations["en"].faq.list;
  const juniorBooks = vedicBooks.filter(b => b.label.startsWith("Junior"));
  const seniorBooks = vedicBooks.filter(b => b.label.startsWith("Senior"));
  const displayedVedic = vedicFilter === "junior" ? juniorBooks : seniorBooks;

  // Shared book card renderer
  const BookCard = ({ book }) => {
    const candidates = useMemo(() => getBookImageUrlCandidates(book), [book]);
    const [imgUrl, setImgUrl] = useState(candidates[0] || "");

    useEffect(() => setImgUrl(candidates[0] || ""), [candidates]);

    return (
      <div className="bk-book-card" style={{ "--accent": book.color }}>
        <div className="bk-book-header" style={{ background: `linear-gradient(135deg, ${book.color}22 0%, ${book.color}0d 100%)` }}>
          <div className="bk-book-level-badge" style={{ background: book.color }}>{book.label}</div>
          <div className="bk-book-emoji">{book.emoji}</div>
          <div className="bk-book-age-badge">{book.forAge}</div>
        </div>
        <div className="bk-book-body">
          {imgUrl && (
            <img
              src={imgUrl}
              alt={book.titleEn}
              style={{ width: "100%", height: "180px", objectFit: "contain", marginBottom: "10px", borderRadius: "8px", border: "1px solid #e5e7eb" }}
              loading="lazy"
              onError={() => {
                const currentIndex = candidates.indexOf(imgUrl);
                if (currentIndex >= 0 && currentIndex < candidates.length - 1) {
                  setImgUrl(candidates[currentIndex + 1]);
                }
              }}
            />
          )}
          <h3 className="bk-book-title">{book.titleEn}</h3>
        <p className="bk-book-desc">{book.descEn}</p>
        <ul className="bk-book-topics">
          {book.topics.map((tp, i) => (
            <li key={i}><FaCheckCircle className="bk-check" style={{ color: book.color }} />{tp}</li>
          ))}
        </ul>
        <div className="bk-book-footer">
          <div className="bk-qty-selector">
            <button className="bk-qty-btn" onClick={() => updateQty(book.id, -1, book.titleEn)}>−</button>
            <span className="bk-qty-num">{cart[book.id]?.qty || 0}</span>
            <button className="bk-qty-btn" onClick={() => updateQty(book.id, 1, book.titleEn)}>+</button>
          </div>
          {!(cart[book.id]?.qty > 0) ? (
            <button className="bk-order-btn" style={{ background: book.color }} onClick={() => updateQty(book.id, 1, book.titleEn)}>
              <FaShoppingCart className="me-2" /> {t("","orderBtn") || "Add"}
            </button>
          ) : (
            <div className="bk-added-badge" style={{ color: book.color, fontWeight: "bold", fontSize: "0.85rem" }}>
              <FaCheckCircle className="me-1" /> Added
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

  // Practice paper card renderer
  const PaperCard = ({ paper }) => (
    <div className="bk-paper-card" style={{ "--accent": paper.color }}>
      <div className="bk-paper-badge" style={{ background: paper.color }}>{paper.label}</div>
      <FaFileAlt className="bk-paper-icon" style={{ color: paper.color }} />
      <div className="bk-paper-footer" style={{ marginTop: "15px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
        <div className="bk-qty-selector">
          <button className="bk-qty-btn" onClick={() => updateQty(paper.id, -1, `Paper: ${paper.label}`)}>−</button>
          <span className="bk-qty-num">{cart[paper.id]?.qty || 0}</span>
          <button className="bk-qty-btn" onClick={() => updateQty(paper.id, 1, `Paper: ${paper.label}`)}>+</button>
        </div>
        {!(cart[paper.id]?.qty > 0) && (
          <button className="bk-paper-btn" style={{ "--bc": paper.color, padding: "8px 15px", fontSize: "0.8rem" }} onClick={() => updateQty(paper.id, 1, `Paper: ${paper.label}`)}>
            {t("","orderPaperBtn") || "Add"}
          </button>
        )}
      </div>
    </div>
  );

  const navItems = [
    { key: "abacus",   icon: "🔢" },
    { key: "vedic",    icon: "🧮" },
    { key: "practice", icon: "📝" },
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
          <span className="bk-top-text">🚚 Pan-India Delivery &nbsp;|&nbsp; 📞 8446889966 &nbsp;|&nbsp; ✅ Official Materials</span>
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
          {/* Animated background shapes */}
          <div className="bk-hero-bg-shapes">
            <div className="bk-shape bk-shape-1" />
            <div className="bk-shape bk-shape-2" />
            <div className="bk-shape bk-shape-3" />
            <div className="bk-shape bk-shape-4" />
          </div>

          {/* Floating delivery/trust strip (single attractive badge) */}
          <div className="bk-hero-trust-strip">
            <div className="bk-trust-item">
              <span className="bk-trust-dot bk-dot-blue" />
              ✅ Official Materials · 🚚 Pan-India Delivery · 📞 8446889966
            </div>
          </div>

          <div className="bk-hero-content">
            {/* ─── LEFT: Text ─── */}
            <div className="bk-hero-text">
              <span className="bk-hero-pill">📚 Official Store</span>

              <h1 className="bk-hero-title">
                {t("hero","title")}<br />
                <span className="bk-hero-gradient">{t("hero","titleHighlight")}</span>
              </h1>
              <p className="bk-hero-subtitle">{t("hero","subtitle")}</p>

              {/* Stat cards */}
              <div className="bk-hero-stats-grid">
                <div className="bk-stat-card">
                  <div className="bk-stat-icon" style={{ background: "linear-gradient(135deg,#ff6b35,#f97316)" }}>🔢</div>
                  <div>
                    <span className="bk-stat-num">13</span>
                    <span className="bk-stat-label">Abacus Books</span>
                  </div>
                </div>
                <div className="bk-stat-card">
                  <div className="bk-stat-icon" style={{ background: "linear-gradient(135deg,#c026d3,#7c3aed)" }}>🧮</div>
                  <div>
                    <span className="bk-stat-num">16</span>
                    <span className="bk-stat-label">Vedic Math Books</span>
                  </div>
                </div>
                <div className="bk-stat-card">
                  <div className="bk-stat-icon" style={{ background: "linear-gradient(135deg,#2563eb,#0ea5e9)" }}>📝</div>
                  <div>
                    <span className="bk-stat-num">18</span>
                    <span className="bk-stat-label">Practice Papers</span>
                  </div>
                </div>
                <div className="bk-stat-card">
                  <div className="bk-stat-icon" style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)" }}>🏫</div>
                  <div>
                    <span className="bk-stat-num">600+</span>
                    <span className="bk-stat-label">Centers</span>
                  </div>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="bk-hero-cta">
                <button className="bk-btn-primary" onClick={() => document.getElementById("bk-books").scrollIntoView({ behavior:"smooth" })}>
                  {t("hero","ctaOrder")} <FaArrowRight className="ms-2" />
                </button>
                <a href="https://wa.me/918446889966" target="_blank" rel="noreferrer" className="bk-btn-wa">
                  <FaWhatsapp className="me-2" /> {t("hero","ctaWhatsapp")}
                </a>
              </div>
            </div>

            {/* ─── RIGHT: Visual ─── */}
            <div className="bk-hero-visual">
              <div className="bk-visual-center-ring" />
              <div className="bk-books-stack">
                {[
                  { color:"#ff6b35", bg:"linear-gradient(135deg,#fff5f0,#ffe8d6)", label:"Abacus Junior",  sub:"UKG · Foundation · Jr 1–4", icon:"🔢", delay:"0s"   },
                  { color:"#22c55e", bg:"linear-gradient(135deg,#f0fdf4,#dcfce7)", label:"Abacus Senior",  sub:"Senior 1–7 levels",         icon:"🏆", delay:"0.15s" },
                  { color:"#c026d3", bg:"linear-gradient(135deg,#fdf4ff,#f5d0fe)", label:"Vedic Junior",   sub:"Junior 1–8 levels",          icon:"🧮", delay:"0.3s"  },
                  { color:"#2563eb", bg:"linear-gradient(135deg,#eff6ff,#dbeafe)", label:"Vedic Senior",   sub:"Senior 1–8 levels",          icon:"📐", delay:"0.45s" },
                ].map((b,i) => (
                  <div key={i} className="bk-book-card-visual" style={{ "--bc": b.color, "--bd": b.delay, background: b.bg }}>
                    <div className="bk-vis-icon-wrap" style={{ background: b.color }}>
                      <span className="bk-vis-emoji">{b.icon}</span>
                    </div>
                    <div className="bk-vis-text">
                      <span className="bk-vis-label" style={{ color: b.color }}>{b.label}</span>
                      <span className="bk-vis-sub">{b.sub}</span>
                    </div>
                    <FaBookOpen className="bk-vis-decor" style={{ color: b.color }} />
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

        {/* ── Cart Bar ── */}
        {totalItems > 0 && (
          <div className="bk-cart-bar">
            <div className="bk-cart-info">
              <span className="bk-cart-count">{totalItems} {totalItems === 1 ? "Item" : "Items"}</span>
              <span className="bk-cart-label">{t("","selectedItems") || "Selected for Order"}</span>
            </div>
            <button className="bk-cart-order-btn" onClick={checkoutWA}>
              <FaWhatsapp style={{ fontSize: "1.2rem" }} /> {t("","checkoutBtn") || "Order via WhatsApp"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default BooksKitsLandingPage;
