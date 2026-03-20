import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Header.css';
import { getFirestore, doc, getDoc, collection, getDocs } from "firebase/firestore";
import firebaseApp from "../firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalculator, 
  faSquareRootAlt, 
  faTimes,
  faChalkboardTeacher,
  faStore,
  faUsers,
  faChevronDown,
  faCalendarAlt,
  faTrophy,
  faAngleDown,
  faAngleRight,
  faChevronRight,
  faMapMarkerAlt,
  faImage,
  faBookOpen
} from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [expandedYears, setExpandedYears] = useState([]);
  const [expandedEventTypes, setExpandedEventTypes] = useState({});
  // Add openDropdown state
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll);

    const fetchLogo = async () => {
      try {
        const db = getFirestore(firebaseApp);
        const docRef = doc(db, "websiteAssets", "header");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const logo = docSnap.data().logo;
          setLogoUrl(logo);

          // ✅ Preload logo with high fetch priority
          const link = document.createElement("link");
          link.rel = "preload";
          link.as = "image";
          link.href = `${logo}?w=360&f=webp&q=auto`;
          link.fetchPriority = "high";
          document.head.appendChild(link);
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };
    const fetchUpcomingEvents = async () => {
      try {
        const db = getFirestore(firebaseApp);
        const eventsCollection = collection(db, "upcomingEvents");
        const querySnapshot = await getDocs(eventsCollection);

        // --- Robust Normalizer for Firestore data shapes ---
        const unwrapValue = (val) => {
          if (val == null) return null;
          if (typeof val !== 'object') return val;
          if ('stringValue' in val) return val.stringValue;
          if ('integerValue' in val) return Number(val.integerValue);
          if ('doubleValue' in val) return Number(val.doubleValue);
          if ('booleanValue' in val) return val.booleanValue;
          if ('timestampValue' in val) return new Date(val.timestampValue);
          if (val.seconds !== undefined && val.nanoseconds !== undefined) return new Date(Number(val.seconds) * 1000);
          if (val.mapValue && val.mapValue.fields) return parseFields(val.mapValue.fields);
          return val;
        };
        const parseFields = (fieldsObj) => {
          const out = {};
          Object.keys(fieldsObj || {}).forEach((k) => {
            out[k] = unwrapValue(fieldsObj[k]);
          });
          return out;
        };

        const events = querySnapshot.docs.map((d) => {
          const raw = d.data();
          let eventData;

          // Handle various nested structures from Firestore exports/backups
          if (raw && raw.Fields) {
            eventData = unwrapValue(raw.Fields);
          } else if (raw && raw.fields) {
            eventData = parseFields(raw.fields);
          } else {
            eventData = parseFields(raw); // Attempt to parse top-level fields
          }
          
          // Ensure date is a JS Date object
          if (eventData.date && typeof eventData.date.toDate === 'function') {
            eventData.date = eventData.date.toDate();
          } else if (eventData.date && typeof eventData.date === 'string') {
            const parsedDate = new Date(eventData.date);
            if (!isNaN(parsedDate)) {
              eventData.date = parsedDate;
            }
          }

          return { id: d.id, ...eventData };
        });

        // Filter for future events
        const now = new Date();
        const futureEvents = events.filter(event => event && event.date && event.date instanceof Date && event.date >= now);

        // Sort events by date
        futureEvents.sort((a, b) => a.date - b.date);

        setUpcomingEvents(futureEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchLogo();
    fetchUpcomingEvents();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

   

  const formatEventDate = (date) => {
    if (!date) return 'Date TBA';
    try {
      let eventDate = null;
      // Handle Firestore Timestamp object (which has seconds and nanoseconds properties)
      if (date && typeof date.toDate === 'function') {
        eventDate = date.toDate();
      } 
      else if (date && typeof date.seconds === 'number') {
        eventDate = new Date(date.seconds * 1000);
      } 
      // Handle if it's already a JS Date object
      else if (date instanceof Date) {
        eventDate = date;
      } 
      // Fallback for string or other formats
      else {
        eventDate = new Date(date);
      }

      if (!eventDate || isNaN(eventDate.getTime())) return 'Date TBA';
      
      return eventDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Date TBA';
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setOpenDropdown(null);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setHoveredDropdown(null);
    setOpenDropdown(null);
  };

  const handleDropdownClick = (dropdownName) => {
    if (window.innerWidth <= 991) {
      setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
    }
  };

  // Update the toggleYear function
  const toggleYear = (year) => {
    setExpandedYears(prev => {
      const isCurrentlyExpanded = prev.includes(year);
      // Close other years when opening a new one
      const newExpanded = isCurrentlyExpanded ? 
        prev.filter(y => y !== year) : 
        [year];
      return newExpanded;
    });
    
    // Reset event types when closing a year
    if (expandedYears.includes(year)) {
      setExpandedEventTypes({});
    }
  };

  // Update toggleEventType function to have event parameter optional
  const toggleEventType = (year, eventType, e) => {
    if (e) {
      e.stopPropagation();
    }
    const key = `${year}-${eventType}`;
    setExpandedEventTypes(prev => {
      const newState = { ...prev };
      // Close other event types in the same year
      Object.keys(newState).forEach(k => {
        if (k.startsWith(`${year}-`)) {
          delete newState[k];
        }
      });
      newState[key] = !prev[key];
      return newState;
    });
  };

  const eventYears = [
    { 
      year: 2025, 
      events: [
        { 
          type: "competition", 
          name: "Competitions", 
          icon: faTrophy,
          subEvents: [
            // Update these links to point to the correct gallery pages
            { name: "State Level Competition", slug: "state-level-competition" },
            { name: "National Level Competition", slug: "national-level-competition" }
          ]
        },
       
      ] 
    },
    { 
      year: 2024, 
      events: [
        { 
          type: "competition", 
          name: "Competitions", 
          icon: faTrophy,
          subEvents: [
            { name: "State Level Competition", slug: "state-level-competition" },
            { name: "National Level Competition", slug: "national-level-competition" }
          ]
        },
        { 
          type: "event", 
          name: "Events", 
          icon: faUsers,
          subEvents: [
            { name: "Annual Meet", slug: "annual-meet" }
          ]
        }
      ] 
    },
    { 
      year: 2023, 
      events: [
        { 
          type: "competition", 
          name: "Competitions", 
          icon: faTrophy,
          subEvents: [
            { name: "State Level Competition", slug: "state-level-competition" },
            { name: "National Level Competition", slug: "national-level-competition" }
          ]
        },
        { 
          type: "event", 
          name: "Events", 
          icon: faUsers,
          subEvents: [
            { name: "Annual Meet", slug: "annual-meet" }
          ]
        }
      ] 
    },
    // Add Our Teachers as a separate year section
    {
      year: "Our Teachers",
      events: [
        {
          type: "teachers",
          name: "Our Teachers",
          icon: faChalkboardTeacher,
          subEvents: [
            { name: "Teachers Achievement Images", slug: "teachers-achievement-images" }
          ]
        }
      ]
    }
  ];

  const isEventTypeExpanded = (year, eventType) => {
    return expandedEventTypes[`${year}-${eventType}`];
  };

  return (
    <header className={`main-header ${scrolled ? 'scrolled' : ''}`}>
      <style>
        {`
          @keyframes register-glow {
            0%, 100% {
              text-shadow: 0 0 4px red;
              opacity: 0.8;
            }
            50% {
              text-shadow: 0 0 12px red;
              opacity: 1;
            }
          }
          .register-now-blink {
            animation: register-glow 2s ease-in-out infinite;
            color: #dc3545; /* Bootstrap danger color */
            font-weight: bold;
            text-decoration: none;
          }
          .register-now-blink:hover {
            color: #a71d2a;
            text-decoration: none;
            animation: none; /* Stop blinking on hover */
            opacity: 1;
            text-shadow: none;
          }
        `}
      </style>
      {/* Enhanced Announcement Bar */}
      <div className="announcement-bar">
        <div className="container" style={{ position: 'relative' }}>
          {/* centered announcement text */}
          <div
            className="announcement-content d-flex justify-content-center align-items-center w-100 animate__animated animate__fadeInLeft"
            style={{ transform: 'translateX(-23.5rem)', boxSizing: 'border-box' }}
          >
             <span className="sparkle-wrapper" aria-hidden="true" >
               <span className="sparkle">✨</span>
             </span>
             <span className="announcement-text shine-text" style={{ color: '#ff5700' }}>
               Transform Your Teaching Career with <strong>Maker Abacus and Vedic Math</strong>
             </span>
             <span className="sparkle-wrapper" aria-hidden="true">
               <span className="sparkle">✨</span>
             </span>
           </div>

          {/* social icons visually centered vertically at right */}
          <div
            className="social-icons no-circle animate__animated animate__fadeInRight"
            style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center', marginTop: '0.2rem'}}
            aria-hidden="false"
          >
            <a href="https://www.facebook.com/share/1FXuy9uHEW/" className="social-hover-effect" target="_blank" rel="noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="https://www.instagram.com/shraddhainstitute?igsh=a2sxY2M3bTRqNWx5" target="_blank" rel="noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="https://www.youtube.com/@ShraddhaInstitute" target="_blank" rel="noreferrer" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
            <a href="https://wa.me/919168756060" target="_blank" rel="noreferrer" aria-label="WhatsApp"><i className="fab fa-whatsapp"></i></a>
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isOpen && (
        <div className="mobile-menu-overlay" onClick={closeMenu} />
      )}

      {/* Main Navigation with Enhanced Styling */}
      <nav className={`navbar navbar-expand-lg ${scrolled ? 'navbar-scrolled shadow-sm' : 'navbar-light bg-white'}`}>
        <div className="container">
          <Link to="/" className="navbar-brand animate__animated animate__fadeIn" onClick={closeMenu}>
            <div className="logo-container">
              <img 
                src={logoUrl || "https://via.placeholder.com/150"} 
                alt="Shraddha Institute Logo" 
                className="main-logo pulse-effect"
                width="180"
                height="50"
                fetchPriority="high"
                loading="eager"
                decoding="sync"
                style={{ objectFit: "contain" }}
              />
            </div>
          </Link>

          <button
            className={`navbar-toggler${isOpen ? ' d-none' : ''}`}
            type="button"
            onClick={toggleMenu}
            aria-expanded={isOpen}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {isOpen && (
            <button className="mobile-menu-close d-lg-none" onClick={closeMenu}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}

          <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
            <ul className="navbar-nav ms-auto align-items-lg-center">
              <li className="nav-item">
                <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
              </li>

              <li className="nav-item">
                <Link to="/about" className="nav-link" onClick={closeMenu}>About Us</Link>
              </li>

              {/* Programs Mega Menu */}
              <li 
                className="nav-item dropdown mega-menu"
                onMouseEnter={() => setHoveredDropdown('programs')}
                onMouseLeave={() => setHoveredDropdown(null)}
                onClick={() => handleDropdownClick('programs')}
              >
                <a
                  className="nav-link dropdown-toggle"
                  href="/programs/abacus"
                  id="programsDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded={hoveredDropdown === 'programs' || openDropdown === 'programs'}
                >
                  Courses <FontAwesomeIcon icon={faChevronDown} className="ms-1" />
                </a>
                <div 
                  className={`dropdown-menu mega-dropdown courses-dropdown p-4 ${(hoveredDropdown === 'programs' || openDropdown === 'programs') ? 'show' : ''}`}
                  aria-labelledby="programsDropdown"
                >
                  <div className="row">
                    <div className="col-md-6 border-end">
                      <div className="program-category">
                        <h5 className="category-title d-flex align-items-center">
                          <span className="category-icon me-2">👨‍🎓</span>
                          Student Programs
                        </h5>
                        <div className="program-list">
                          <Link to="/programs/abacus" className="dropdown-item program-item" onClick={closeMenu}>
                            <FontAwesomeIcon icon={faCalculator} className="me-2 icon-primary" />
                            <div>
                              <div className="program-title">Abacus</div>
                              <div className="program-desc">Ages 5-15 • Mental Math Mastery</div>
                            </div>
                          </Link>
                          <Link to="/programs/vedic-math" className="dropdown-item program-item" onClick={closeMenu}>
                            <FontAwesomeIcon icon={faSquareRootAlt} className="me-2 icon-secondary" />
                            <div>
                              <div className="program-title">Vedic Math</div>
                              <div className="program-desc">Ancient Techniques • Faster Calculations</div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="program-category">
                        <h5 className="category-title d-flex align-items-center">
                          <span className="category-icon me-2">👨‍🏫</span>
                          Teacher Programs
                        </h5>
                        <div className="program-list">
                          <Link to="/programs/franchise-teacher-training" className="dropdown-item program-item featured" onClick={closeMenu}>
                            <FontAwesomeIcon icon={faChalkboardTeacher} className="me-2 icon-success" />
                            <div>
                              <div className="program-title">Teacher Training Program</div>
                              <div className="program-desc">Specialized Teacher Franchise Program</div>
                            </div>
                           
                          </Link>
                        </div>
                      </div>
                      
                      <div className="program-category mt-4">
                        <h5 className="category-title d-flex align-items-center">
                          <span className="category-icon me-2">🎯</span>
                          Special Programs
                        </h5>
                        <div className="program-list">
                          <Link to="/programs/workshops" className="dropdown-item program-item" onClick={closeMenu}>
                            <FontAwesomeIcon icon={faUsers} className="me-2 icon-info" />
                            <div>
                              <div className="program-title">Workshops</div>
                              <div className="program-desc">Short-term • Intensive</div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              {/* Franchise Dropdown */}
              <li 
                className="nav-item dropdown"
                onMouseEnter={() => setHoveredDropdown('franchise')}
                onMouseLeave={() => setHoveredDropdown(null)}
                onClick={() => handleDropdownClick('franchise')}
              >
                <a
                  className="nav-link dropdown-toggle"
                  href="/programs/franchise-training"
                  id="franchiseDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded={hoveredDropdown === 'franchise' || openDropdown === 'franchise'}
                >
                  Franchise <FontAwesomeIcon icon={faChevronDown} className="ms-1" />
                </a>
                <ul 
                  className={`dropdown-menu ${(hoveredDropdown === 'franchise' || openDropdown === 'franchise') ? 'show' : ''}`}
                  aria-labelledby="franchiseDropdown"
                >
                  <li>
                    <Link to="/franchise/teacher-parent" className="dropdown-item" onClick={closeMenu}>
                      <FontAwesomeIcon icon={faChalkboardTeacher} className="me-2 text-orange" />
                      <span>Teacher/Parent Franchise</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/franchise/business-school" className="dropdown-item" onClick={closeMenu}>
                      <FontAwesomeIcon icon={faStore} className="me-2 text-blue" />
                      <span>School/Business Franchise</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/programs/franchise-training" className="dropdown-item" onClick={closeMenu}>
                      <FontAwesomeIcon icon={faStore} className="me-2 text-red" />
                      <span>Franchise Training</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/franchise/books-kits" className="dropdown-item" onClick={closeMenu}>
                      <FontAwesomeIcon icon={faBookOpen} className="me-2" style={{ color: '#2d9cdb' }} />
                      <span>Books & Kits</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/franchise/ttp" className="dropdown-item" onClick={closeMenu}>
                      <FontAwesomeIcon icon={faChalkboardTeacher} className="me-2" style={{ color: '#ff6600' }} />
                      <span>Teacher Training Program</span>
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Events & Gallery Mega Dropdown */}
              <li 
                className="nav-item dropdown mega-menu"
                onMouseEnter={() => setHoveredDropdown('events-gallery')}
                onMouseLeave={() => setHoveredDropdown(null)}
                onClick={() => handleDropdownClick('events-gallery')}
              >
                <a
                  className="nav-link dropdown-toggle"
                  href="/gallery"
                  id="eventsGalleryDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded={hoveredDropdown === 'events-gallery' || openDropdown === 'events-gallery'}
                >
                  <span style={{ color: 'black' }}>Events</span>
                  <FontAwesomeIcon icon={faChevronDown} className="ms-1" />
                  
                </a>
                <div 
                  className={`dropdown-menu mega-dropdown events-gallery-dropdown p-4 ${(hoveredDropdown === 'events-gallery' || openDropdown === 'events-gallery') ? 'show' : ''}`}
                  aria-labelledby="eventsGalleryDropdown"
                  style={{ color: 'black', backgroundColor: '' }}
                >
                  <div className="row">
                    {/* Add Upcoming Events link at the top */}
                   

                
                    <div className="col-12 mb-4">
                      <div className="events-gallery-section">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6 className="upcoming-events-title">
                            <span className="icon-wrapper">
                            </span>
                            Upcoming Event
                          </h6>
                          <Link to="/CompetitionLandingPage" className="view-all-link" style={{ color: '#ff7a00' }}>
                            View Events <FontAwesomeIcon icon={faChevronRight} className="ms-1" />
                          </Link>
                        </div>

                        {/* Create a separate marquee for each upcoming event */}
                       {/* Upcoming Events Marquee */}
<div className="upcoming-event-announcement mb-3">
  {upcomingEvents.length > 0 ? (
    <div className="upcoming-event-marquee">
      <div className="upcoming-event-marquee-content">
        {upcomingEvents.map((event) => (
          <div key={event.id} className="upcoming-event-item">
            {/* Blinking "Register Now" text at the start */}
            {event.registrationLink && (
              <a
                href={event.registrationLink}
                target="_blank"
                rel="noreferrer"
                className="me-3 register-now-blink"
                aria-label={`Register for ${event.title}`}
              >
                Register Now
              </a>
            )}
            <span className="event-date-pill">
              <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
              {formatEventDate(event.date)}
            </span>
            <span className="event-title-text fw-bold">
              {event.title}
            </span>
            <span className="new-blink">NEW</span>
            <span className="event-location">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1" />
              {event.location}
            </span>
          </div>
        ))}

        {/* Duplicate for seamless scrolling */}
        {upcomingEvents.map((event) => (
          <div key={event.id + "-duplicate"} className="upcoming-event-item">
            {/* Duplicate blinking "Register Now" text at the start */}
            {event.registrationLink && (
              <a
                href={event.registrationLink}
                target="_blank"
                rel="noreferrer"
                className="me-3 register-now-blink"
                aria-label={`Register for ${event.title}`}
              >
                Register Now
              </a>
            )}
            <span className="event-date-pill">
              <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
              {formatEventDate(event.date)}
            </span>
            <span className="event-title-text fw-bold">
              {event.title}
            </span>
            <span className="new-blink">NEW</span>
            <span className="event-location">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1" />
              {event.location}
            </span>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="text-center text-muted">No upcoming events at this time.</div>
  )}
</div>

                      </div>
                    </div>

                    {/* Past Events & Gallery Section */}
                    <div className="col-12">
                      <div className="past-events-section">
                        <h6 className="past-events-title">
                          Events & Gallery Archive
                        </h6>
                        <div className="events-archive">
                          {eventYears.map((yearData) => (
                            <div key={yearData.year} className="archive-year">
                              <button 
                                className="year-header"
                                onClick={() => toggleYear(yearData.year)}
                              >
                                <span className="d-flex align-items-center">
                                  <FontAwesomeIcon 
                                    icon={expandedYears.includes(yearData.year) ? faAngleDown : faAngleRight} 
                                    className="me-2" 
                                  />
                                  {yearData.year}
                                </span>
                                <span className="event-count">
                                  ({yearData.events.reduce((acc, event) => acc + event.subEvents.length, 0)})
                                </span>
                              </button>
                              
                              <div className={`year-dropdown-content ${expandedYears.includes(yearData.year) ? 'expanded' : ''}`}>
                                {yearData.events.map((eventType) => (
                                  <div key={`${yearData.year}-${eventType.type}`} className="event-type">
                                    <button 
                                      className="event-type-header"
                                      onClick={(e) => toggleEventType(yearData.year, eventType.type, e)}
                                    >
                                      <FontAwesomeIcon 
                                        icon={isEventTypeExpanded(yearData.year, eventType.type) ? faAngleDown : faAngleRight} 
                                        className="me-2" 
                                      />
                                      <FontAwesomeIcon icon={eventType.icon} className="me-2" />
                                      {eventType.name}
                                      <span className="event-count">({eventType.subEvents.length})</span>
                                    </button>
                                    
                                    <div className={`event-type-content ${isEventTypeExpanded(yearData.year, eventType.type) ? 'expanded' : ''}`}>
                                      {eventType.subEvents.map((subEvent) => (
                                        <Link
                                          key={`${yearData.year}-${eventType.type}-${subEvent.slug}`}
                                          to={
                                            yearData.year === 2025
                                              ? `/gallery/2025/${subEvent.slug}`
                                              : yearData.year === 2024
                                                ? `/gallery/2024/${subEvent.slug}`
                                                : yearData.year === 2023
                                                  ? `/gallery/2023/${subEvent.slug}`
                                                  : `/gallery/${yearData.year}/${subEvent.slug}`
                                          }
                                          className="event-link"
                                          onClick={closeMenu}
                                        >
                                          <FontAwesomeIcon icon={faImage} className="me-2" />
                                          {subEvent.name}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li className="nav-item">
                <Link to="/contact" className="nav-link" onClick={closeMenu}>Contact</Link>
              </li>
            </ul>

            {/* Enhanced Join Now Button */}
            <div className="d-none d-lg-flex ms-lg-3">
              <Link to="/contact" className="btn btn-primary btn-join-now glow-effect">
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Define your routes here or in your main App.js */}
    
    </header>
  );
};

export default Header;