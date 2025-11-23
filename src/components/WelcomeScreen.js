// src/components/WelcomeScreen.js
import React, { useEffect, useState } from 'react';
import './WelcomeScreen.css';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import firebaseApp from "../firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const WelcomeScreen = ({ onSkip }) => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
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

        const now = new Date();
        const futureEvents = events.filter(event => event && event.date && event.date instanceof Date && event.date >= now);

        futureEvents.sort((a, b) => a.date - b.date);

        setUpcomingEvents(futureEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchUpcomingEvents();
  }, []);

  const formatEventDate = (date) => {
    if (!date) return 'Date TBA';
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="welcome-container">
        <style>
            {`
                .welcome-container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    padding: 2rem 1rem;
                    text-align: center;
                    background-color: #f8f9fa;
                }
                .welcome-content-wrapper {
                    max-width: 700px;
                    width: 100%;
                }
                .emoji-bounce {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                    animation: float 3s ease-in-out infinite;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                .welcome-title {
                    font-size: clamp(1.8rem, 5vw, 2.5rem);
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                    color: orange;
                }
                .welcome-subtitle {
                    font-size: clamp(1rem, 3vw, 1.1rem);
                    color: #6c757d;
                    margin-bottom: 2rem;
                }
                .upcoming-events {
                    margin-top: 1.5rem;
                    width: 100%;
                }
                .upcoming-events h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: red;
                    margin-bottom: 1rem;
                    text-align: center;
                }
                .upcoming-events ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .upcoming-event-item {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem 1.5rem;
                    padding: 1rem 0;
                    border-bottom: 1px solid #e9ecef;
                }
                .upcoming-event-item:last-child {
                    border-bottom: none;
                }
                .event-title {
                    font-weight: 600;
                    color: #212529;
                    font-size: 1.1rem;
                }
                .event-date, .event-location {
                    color: #495057;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                }
                @keyframes register-glow {
                    0%, 100% { text-shadow: 0 0 3px rgba(220, 53, 69, 0.3); }
                    50% { text-shadow: 0 0 8px rgba(220, 53, 69, 0.6); }
                }
                .register-now-blink {
                    animation: register-glow 2.5s ease-in-out infinite;
                    color: #dc3545;
                    font-weight: bold;
                    text-decoration: none;
                    transition: color 0.3s;
                }
                .register-now-blink:hover {
                    animation: none;
                    color: #a71d2a;
                }
                .start-button {
                    margin-top: 2.5rem;
                    padding: 0.8rem 2rem;
                    font-size: 1.1rem;
                    font-weight: 600;
                    border-radius: 50px;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .start-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                }
                /* Responsive adjustments for mobile */
                @media (max-width: 576px) {
                    .upcoming-event-item {
                        flex-direction: column;
                        gap: 0.5rem;
                        padding: 1rem;
                        border-radius: 12px;
                       
                        margin-bottom: 1rem;
                    }
                    .upcoming-event-item:last-child {
                        margin-bottom: 0;
                    }
                }
            `}
        </style>
        <div className="welcome-content-wrapper">
            <div className="emoji-bounce">🎓🚀📚🧠✨</div>
            <h1 className="welcome-title">Welcome to Shraddha Institute!</h1>
            <p className="welcome-subtitle">Get ready to boost your brain power 💡</p>

            {upcomingEvents.length > 0 ? (
                <div className="upcoming-events">
                    <h3>Upcoming Events</h3>
                    <ul>
                        {upcomingEvents.map(event => (
                        <li key={event.id} className="upcoming-event-item">
                            {event.registrationLink && (
                            <a
                                href={event.registrationLink}
                                target="_blank"
                                rel="noreferrer"
                                className="register-now-blink"
                            >
                                Register Now
                            </a>
                            )}
                            <span className="event-date">
                                <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                                {formatEventDate(event.date)}
                            </span>
                            <span className="event-title">{event.title}</span>
                            {event.location && (
                            <span className="event-location">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1" />
                                {event.location}
                            </span>
                            )}
                        </li>
                        ))}
                    </ul>
                </div>
            ) : (
                 <p className="text-muted mt-4">No upcoming events at this time. Check back soon!</p>
            )}

            <button className="start-button" onClick={onSkip}>Start Learning 🎉</button>
        </div>
    </div>
  );
};

export default WelcomeScreen;
