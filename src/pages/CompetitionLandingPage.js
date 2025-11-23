import React, { useState, useEffect, useRef, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { getDownloadURL, ref as storageRef } from 'firebase/storage';
import { db, storage } from '../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faClock,
  faUsers,
  faTrophy,
  faAward,
  faCreditCard,
  faHome,
  faBox,
  faTruck,
  faSearch,
  faMoneyBillWave,
  
  faClipboardList
} from '@fortawesome/free-solid-svg-icons';
import ContactForm from '../components/ContactForm';
import './UpcomingEventsPage.css';

// Constants used across pages — defined here to avoid ESLint no-undef errors
const SCHOOL_HELP_PHONE = '+91-9168736060';
const SCHOOL_HELP_PHONE_2 = '+91-8446689966';
const ZOHO_FORM_URL = 'https://creatorapp.zohopublic.com/shraddha_institute/si-competition/form-embed/SL_Other_Comp_Stud_Reg/YrjyPNhX0TNMCupPkeAVBmXYXq7n9rnbN8xg36gFFd0w75zfNKz8mvxz4P5VuYssgmUmhU5dwJreDkDWB7zugsxEA74aUVdKdZK9';

// PDF Download URLs
const SYLLABUS_PDF_ABACUS = 'https://drive.google.com/uc?export=download&id=1Ern6ck5wvnPZ2kT-dOCEGlZcub-cA70y';
const SYLLABUS_PDF_VEDIC = 'https://drive.google.com/uc?export=download&id=11yaQ-19vcQlela7rhJ0m3PDav-vZqLI_';
const ANNOUNCEMENT_PDF_URL = 'https://drive.google.com/uc?export=download&id=1azAIe1U3PFC7wQW3SE4O_Dq4cNLqbWaA';

const CompetitionLandingPage = () => {
  console.log('CompetitionLandingPage ContactForm:', ContactForm);
  
  // Hero video state
  // On mobile browsers autoplay may be blocked — default to not loading iframe on small screens
  const [loadHeroIframe, setLoadHeroIframe] = useState(() => {
    try {
      return typeof window !== 'undefined' && window.innerWidth > 900;
    } catch (e) {
      return true;
    }
  });
  const heroYoutubeId = 'Bwm1QL5Pbg8';
  const heroThumb = `https://i.ytimg.com/vi/${heroYoutubeId}/hqdefault.jpg`;
  
  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Selected city/event state for the hero (pune | solapur)
  const [selectedCity, setSelectedCity] = useState('pune');

  const eventsData = useMemo(() => ({
    pune: {
      id: 'pune-2026',
      title: 'Open National Level Abacus & Vedic Math Competition - 2026',
      description: "Join the nation's brightest minds and showcase your mathematical prowess.",
      date: new Date('2026-01-18T09:00:00'),
      registrationDeadline: new Date('2025-12-25'),
      location: 'Pune (Venue details will be disclosed 15 days before the competition.)'
    },
    solapur: {
      id: 'solapur-2026',
      title: 'Open National Level Abacus & Vedic Math Competition - 2026',
      description: "Join the nation's brightest minds and showcase your mathematical prowess.",
      date: new Date('2026-02-01T09:00:00'),
      registrationDeadline: new Date('2026-01-01'),
      location: 'Solapur (Venue details will be disclosed 15 days before the competition.)'
    }
  }), []);

  const selectedEvent = useMemo(() => eventsData[selectedCity], [selectedCity, eventsData]);

  // When user selects a city badge, update selected city and open modal for that event
  const handleCityClick = (city) => {
    setSelectedCity(city);
    const ev = eventsData[city];
    if (ev) openModal(ev);
  };
  
  // Hardcoded competition events (can also fetch from Firestore)
  const competitionEvents = [];

  const [upcomingEvents] = useState(competitionEvents);
  const prizeTrackRef = useRef(null);

  // Prize items fetched from Firestore
  const [prizes, setPrizes] = useState([]);
  const [prizesLoading, setPrizesLoading] = useState(true);
  
  // Prize preview/zoom modal state
  const [prizePreviewOpen, setPrizePreviewOpen] = useState(false);
  const [prizePreviewSrc, setPrizePreviewSrc] = useState(null);
  
  const [loading] = useState(false);
  // level assets fetched from Firestore (collection: 'levelassets')
  const [levelAssets, setLevelAssets] = useState({});
  const [syllabusImageUrl, setSyllabusImageUrl] = useState(null);
  const [syllabusImageError, setSyllabusImageError] = useState(false);
  const [syllabusImageLoading, setSyllabusImageLoading] = useState(false);
  
  // Registration Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState('contact');
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [modalEvent, setModalEvent] = useState(null);

  // --- NEW: store contact details submitted from the "Tell us about yourself" form ---
  const [contactInfo, setContactInfo] = useState(null);

  // track whether the Zoho iframe form was submitted (we only use the setter)
  const [, setZohoSubmitted] = useState(false);

  // syllabus preview modal state
  const [syllabusPreviewOpen, setSyllabusPreviewOpen] = useState(false);
  const [syllabusPreviewSrc, setSyllabusPreviewSrc] = useState(null);
  const [syllabusZoomed, setSyllabusZoomed] = useState(false);

  // Story viewer state
  const [stories, setStories] = useState([]);
  const [storiesLoading, setStoriesLoading] = useState(true);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);
  const [storyPlaying, setStoryPlaying] = useState(false);
  const storyVideoRef = useRef(null);
  const storyYoutubeRef = useRef(null);

  const openSyllabusPreview = (src) => {
    setSyllabusPreviewSrc(src);
    setSyllabusPreviewOpen(true);
    setSyllabusZoomed(false);
  };
  const closeSyllabusPreview = () => {
    setSyllabusPreviewOpen(false);
    setSyllabusPreviewSrc(null);
    setSyllabusZoomed(false);
  };

  // Story viewer functions
  const openStory = (index) => {
    setStoryIndex(index);
    setIsStoryOpen(true);
    setStoryPlaying(false);
  };

  const closeStory = () => {
    setIsStoryOpen(false);
    setStoryPlaying(false);
    if (storyVideoRef.current) {
      storyVideoRef.current.pause();
    }
  };

  const nextStory = () => {
    if (storyIndex < stories.length - 1) {
      setStoryIndex(storyIndex + 1);
      setStoryPlaying(false);
    } else {
      closeStory();
    }
  };

  const prevStory = () => {
    if (storyIndex > 0) {
      setStoryIndex(storyIndex - 1);
      setStoryPlaying(false);
    }
  };

  const extractYouTubeId = (url) => {
    if (!url) return '';
    const match = url.match(/(?:youtube\.com\/(?:.*v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : '';
  };

  const deriveThumb = (story) => {
    if (story.thumbnail) return story.thumbnail;
    if (story.type === 'youtube' && story.videoId) {
      return `https://img.youtube.com/vi/${story.videoId}/hqdefault.jpg`;
    }
    if (story.src) {
      return story.src.replace(/\.mp4$/i, '.jpg');
    }
    return '';
  };

  // Fetch stories from Firestore
  useEffect(() => {
    let mounted = true;
    const fetchStories = async () => {
      try {
        console.log('Fetching stories from Firestore...');
        const colRef = collection(db, 'stories');
        const snap = await getDocs(colRef);
        if (!mounted) return;

        console.log(`Found ${snap.docs.length} stories in Firestore`);

        const items = snap.docs.map(d => {
          const data = d.data();
          const urlStr = (data.url || data.src || '').toString() || '';
          
          // Always check URL first to properly detect YouTube (prioritize over stored type)
          const isYouTube = /youtube\.com\/watch|youtube\.com\/shorts|youtu\.be\/|youtube\.com\/embed\//i.test(urlStr);
          const isMp4 = urlStr.toLowerCase().endsWith('.mp4');
          
          let resolvedType = 'image';
          if (isYouTube) {
            // YouTube URLs always override stored type
            resolvedType = 'youtube';
          } else if (isMp4) {
            resolvedType = 'video';
          } else if (data.type) {
            resolvedType = data.type;
          }

          // Extract YouTube video ID
          let videoId = data.videoId || null;
          if (resolvedType === 'youtube' && !videoId && urlStr) {
            const m = urlStr.match(/(?:youtube\.com\/(?:.*[?&]v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
            if (m && m[1]) videoId = m[1];
          }

          console.log('Story loaded:', {
            id: d.id,
            author: data.author,
            type: resolvedType,
            videoId: videoId,
            url: urlStr
          });

          return {
            id: d.id,
            type: resolvedType,
            src: urlStr || null,
            videoId: videoId || null,
            author: data.author || data.title || '',
            thumbnail: data.thumbnail || null,
          };
        });
        console.log('Processed stories:', items);
        setStories(items);
      } catch (err) {
        console.error('Error fetching stories from Firestore', err);
        setStories([]);
      } finally {
        if (mounted) setStoriesLoading(false);
      }
    };
    fetchStories();
    return () => { mounted = false; };
  }, []);

  // Fetch prizes from Firestore
  useEffect(() => {
    let mounted = true;
    const fetchPrizes = async () => {
      try {
        console.log('Fetching prizes from Firestore...');
        const colRef = collection(db, 'prizes');
        const snap = await getDocs(colRef);
        if (!mounted) return;

        console.log('Prizes snapshot size:', snap.size);
        const items = snap.docs.map(d => {
          const data = d.data();
          console.log('Prize doc:', d.id, data);
          return {
            id: d.id,
            name: data.name || '',
            alt: data.alt || data.name || '',
            url: data.url || null,
            order: data.order || 0,
          };
        });
        
        // Sort by order field
        items.sort((a, b) => (a.order || 0) - (b.order || 0));
        console.log('Fetched prizes:', items);
        setPrizes(items);
      } catch (err) {
        console.error('Error fetching prizes from Firestore', err);
        setPrizes([]);
      } finally {
        if (mounted) setPrizesLoading(false);
      }
    };
    fetchPrizes();
    return () => { mounted = false; };
  }, []);

  // Countdown timer effect (updates whenever selectedEvent changes)
  useEffect(() => {
    let mounted = true;
    const MS_DAY = 24 * 60 * 60 * 1000;
    const deadline = selectedEvent?.date || new Date();

    const update = () => {
      const now = Date.now();
      const nowDateOnly = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime();
      const targetDateOnly = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate()).getTime();

      let days = Math.max(0, Math.floor((targetDateOnly - nowDateOnly) / MS_DAY));
      let diff = deadline.getTime() - now;

      if (diff <= 0) {
        if (mounted) setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor((diff % MS_DAY) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (mounted) setTimeLeft({ days, hours, minutes, seconds });
    };

    update();
    const iv = window.setInterval(update, 1000);
    return () => {
      mounted = false;
      window.clearInterval(iv);
    };
  }, [selectedEvent]);

  const formatEventDate = (date) => {
    if (!date || !(date instanceof Date)) return 'Date TBA';
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  

  // Render location with optional parenthetical note on a separate small line
  const renderLocation = (location) => {
    if (!location) return null;
    const m = location.match(/^(.*?)\s*\((.*)\)\s*$/);
    const main = m ? m[1].trim() : location;
    const note = m ? m[2].trim() : null;
    return (
      <>
        <div className="detail-value">{main}</div>
        {note && <div className="detail-note">{note}</div>}
      </>
    );
  };

  const competitionData = [
    {
      id: 'abacus',
      title: 'Abacus',
      description: 'Master the ancient art of mental calculation.',
      icon: '🧠',
      levels: [
        {
          id: 'ukg',
          title: 'UKG',
          description: 'Foundation level for young learners',
          ageRange: '3-5 years',
          categories: 'Category 1 to 3',
          timeLimit: '8 minutes',
          syllabus: [
            'Draw the Beads',
            'Count Beads',
            '1 Digit Addition & Subtraction Sums',
            '2R - 1D 180 Sums',
            'Count the Beads 40 Sums',
            'Draw the Beads 40 Sums',
          ],
        },
        {
          id: 'k1',
          title: 'Kid - K1',
          description: 'Building fundamental abacus skills',
          ageRange: '5-8 years',
          categories: 'Category 1 to 4',
          timeLimit: '8 minutes',
          syllabus: [
            '1 Digit Addition & Subtraction Sums',
            '3R - 1D 270 Sums',
            '2R - 1D 30 Sums',
          ],
        },
        {
          id: 'k2',
          title: 'Kid - K2',
          description: 'Advancing calculation techniques',
          ageRange: '5-9 years',
          categories: 'Category 1 to 5',
          timeLimit: '8 minutes',
          syllabus: [
            'Addition & Subtraction Sums',
            'Direct Method Only, Without Formula',
            '2R - 1D 30 Sums',
            '3R - 1D 120 Sums',
            '3R - 2D 120 Sums',
          ],
        },
        {
          id: 'k3',
          title: 'Kid - K3',
          description: 'Enhanced mental math abilities',
          ageRange: '5-16 years',
          categories: 'Category 1 to 12',
          timeLimit: '8 minutes',
          syllabus: [
            'Big Friend Addition & Subtraction Sums',
            '3R - 1D 60 Sums',
            '5R - 1D 30 Sums',
            '4R - 1D 180 Sums',
          ],
        },
        {
          id: 'level1',
          title: 'Abacus Level 1',
          description: 'Comprehensive abacus proficiency',
          ageRange: '5-16 years',
          categories: 'Category 1 to 12',
          timeLimit: '8 minutes',
          syllabus: [
            'Big Friend Addition & Subtraction Sums',
            'Small Friend Addition & Subtraction Sums',
            'Family Friend Addition & Subtraction Sums',
            "All Formulas",
            '3R - 1D 60 Sums',
            '4R - 1D 120 Sums',
            '5R - 1D 90 Sums',
          ],
        },
        {
          id: 'level2',
          title: 'Abacus Level 2',
          description: 'Advanced calculation mastery',
          ageRange: '5-16 years',
          categories: 'Category 1 to 12',
          timeLimit: '8 minutes',
          syllabus: [
            'Big Friend Addition & Subtraction Sums',
            'Small Friend Addition & Subtraction Sums',
            'Family Friend Addition & Subtraction Sums',
            "All Formulas",
            '5R - 1D 120 Sums',
            '3R - 2D 120 Sums',
            '4R - 2D 30 Sums',
          ],
        },
        {
          id: 'level3',
          title: 'Abacus Level 3',
          description: 'Expert level operations',
          ageRange: '6-16 years',
          categories: 'Category 1 to 11',
          timeLimit: '8 minutes',
          syllabus: [
            'Big Friend Addition & Subtraction Sums',
            'Small Friend Addition & Subtraction Sums',
            'Family Friend Addition & Subtraction Sums',
            'All Formulas',
            'Multiplication',
            '7R - 1D 90 Sums',
            '5R - 2D 60 Sums',
            '2 Into 1 Multiplication 120 Sums',
          ],
        },
        {
          id: 'level4',
          title: 'Abacus Level 4',
          description: 'Superior mental arithmetic',
          ageRange: '6-16 years',
          categories: 'Category 1 to 11',
          timeLimit: '10 minutes',
          syllabus: [
            'Big Friend Addition & Subtraction Sums',
            'Small Friend Addition & Subtraction Sums',
            'Family Friend Addition & Subtraction Sums',
            'All Formulas',
            'Multiplication',
            '3 by 1 Division Without Decimal',
            '7R - 1D 90 Sums',
            '5R - 2D 60 Sums',
            '3 Into 1 Multiplication 60 Sums',
            '3 By 1 Division 60 Sums',
          ],
        },
        {
          id: 'level5',
          title: 'Abacus Level 5',
          description: 'Master level proficiency',
          ageRange: '7-16 years',
          categories: 'Category 1 to 10',
          timeLimit: '10 minutes',
          syllabus: [
            '3 into 1 Multiplication',
            '3 by 1 Division With Decimal',
            '1 Digit Addition & Subtraction Sums',
            '3 Digit Addition & Subtraction Sums',
            '10R - 1D 90 Sums',
            '3R - 3D 50 Sums',
            '3 Into 1 Multiplication 60 Sums',
            '3 By 1 Division 60 Sums',
          ],
        },
        {
          id: 'level6',
          title: 'Abacus Level 6',
          description: 'Elite calculation skills',
          ageRange: '7-16 years',
          categories: 'Category 1 to 10',
          timeLimit: '10 minutes',
          syllabus: [
            "All Formulas",
            '3 into 1 Multiplication',
            '2 by 1 Division With Decimal',
            '2 Digit Decimal Addition & Subtraction Sums',
            '3 Digit Addition & Subtraction Sums',
            '5R - 2D 90 Sums',
            '3R - 3D 75 Sums',
            '3 Into 1 Multiplication 60 Sums',
            '3 By 1 Division 60 Sums',
          ],
        },
        {
          id: 'level7',
          title: 'Abacus Level 7',
          description: 'Championship preparation',
          ageRange: '7-16 years',
          categories: 'Category 1 to 10',
          timeLimit: '10 minutes',
          syllabus: [
            'Big Friend Addition & Subtraction Sums',
            'Small Friend Addition & Subtraction Sums',
            'Family Friend Addition & Subtraction Sums',
            'Multiplication, Division (With Decimal)',
            '7R - 1D 30 Sums',
            '7R - 2D 30 Sums',
            '6R - 2D 60 Sums',
            '5R - 2D 30 Sums',
            '3 By 1 Division 30 Sums',
            '3 Into 1 Multiplication 30 Sums',
          ],
        },
        {
          id: 'level8',
          title: 'Abacus Level 8',
          description: 'Expert mastery level',
          ageRange: '8-16 years',
          categories: 'Category 1 to 9',
          timeLimit: '10 minutes',
          syllabus: [
            'Big Friend Addition & Subtraction Sums',
            'Small Friend Addition & Subtraction Sums',
            'Family Friend Addition & Subtraction Sums',
            'Multiplication, Division (With Decimal)',
            '10 R - 1D 30 Sums',
            '5 R - 3D 40 Sums',
            '6R - 2D 30 Sums',
            '7 R - 2D 30 Sums',
            '3 By 1 Division 30 Sums',
            '4 into 1 Multiplication 30 Sums',
          ],
        },
        {
          id: 'level9',
          title: 'Abacus Level 9',
          description: 'Grandmaster level',
          ageRange: '8-16 years',
          categories: 'Category 1 to 9',
          timeLimit: '10 minutes',
          syllabus: [
            'Big Friend Addition & Subtraction Sums',
            'Small Friend Addition & Subtraction Sums',
            'Family Friend Addition & Subtraction Sums',
            'Multiplication, Division (With Decimal)',
            '7R - 2/3 D 60 Sums',
            '3/1 Division 45 Sums',
            '3Into 1 Multiplication 45 Sums',
            '4 by 1 Division 60 Sums',
            '3 Into 2 Multiplication 60 Sums',
          ],
        },
      ],
    },
    {
      id: 'vedic',
      title: 'Vedic Math',
      description: 'Unlock high-speed calculation with Vedic sutras.',
      icon: '🏆',
      levels: [
        {
          id: 'vm-jr-1',
          title: 'VM Junior Level 1',
          description: 'VM junior introductory level',
          ageRange: '8-18 years',
          categories: 'Category 1 to 10',
          timeLimit: '15 minutes',
          syllabus: [
            'Subtract -10 Sums',
            'Below the base -12 Sums',
            'Above the base -12 Sums',
            'Vertically Crosswise -96 Sums',
            'Multiplication - 32 Sums',
          ],
        },
        {
          id: 'vm-jr-2',
          title: 'VM Junior Level 2',
          description: 'VM junior intermediate level',
          ageRange: '8-18 years',
          categories: 'Category 1 to 10',
          timeLimit: '15 minutes',
          syllabus: [
            'Multiplication Square - 20 Sums',
            'First Digit Adding 10 & Last Number Same - 20 Sums',
            'Multiplication - Vertically Crosswise - 50 Sums',
            'Division - 30 Sums',
          ],
        },
        {
          id: 'vm-jr-3',
          title: 'VM Junior Level 3',
          description: 'VM junior advanced level',
          ageRange: '8-18 years',
          categories: 'Category 1 to 10',
          timeLimit: '15 minutes',
          syllabus: [
            'Multiplication Square - 20 Sums',
            'Multiplication by Vertically Crosswise - 40 Sums',
            'Division by Factors - 20 Sums',
            'Division by General Method - 5 Sums',
          ],
        },
        {
          id: 'vm-jr-4',
          title: 'VM Junior Level 4',
          description: 'VM junior mastery level',
          ageRange: '8-18 years',
          categories: 'Category 1 to 10',
          timeLimit: '15 minutes',
          syllabus: [
            'Square Root - 16 Sums',
            'Cube Root - 16 Sums',
            'Find the HCM - 40 Sums',
            'Find LCM - 40 Sums',
          ],
        },
        {
          id: 'vm-sr-1',
          title: 'VM Senior Level 1',
          description: 'VM senior foundational level',
          ageRange: '8-18 years',
          categories: 'Category 1 to 10',
          timeLimit: '15 minutes',
          syllabus: [
            'Multiplication Square -10 Sums',
            'Below the Base - 12 Sums',
            'Above the Base - 12 Sums',
            'Vertically Crosswise - 96 Sums',
            'Find the HCM - 10 Sums',
            'Find the LCM - 10 Sums',
          ],
        },
        {
          id: 'vm-sr-2',
          title: 'VM Senior Level 2',
          description: 'VM senior advanced level',
          ageRange: '8-18 years',
          categories: 'Category 1 to 10',
          timeLimit: '15 minutes',
          syllabus: [
            'Square Root - 16 Sums',
            'Cube Root - 16 Sums',
            'Division - 80 Sums',
          ],
        },
        {
          id: 'vm-sr-3',
          title: 'VM Senior Level 3',
          description: 'VM senior mastery level',
          ageRange: '8-18 years',
          categories: 'Category 1 to 10',
          timeLimit: '15 minutes',
          syllabus: [
            'Vertically Crosswise - 50 Sums',
            'Above & Below the Base - 40 Sums',
            'Ascending & Descending order of Fraction - 10 Sums',
            'Base Multiplication - 12 Sums',
          ],
        },
      ],
    },
  ];

  const userTypes = [
    { id: 'parent', title: 'Parent', icon: '👨‍👩‍👧‍👦', description: 'Register your child' },
    { id: 'teacher', title: 'Teacher', icon: '👩‍🏫', description: 'Register your students' },
    { id: 'school', title: 'School', icon: '🏫', description: 'Bulk registration' },
    { id: 'franchise', title: 'Franchise', icon: '🤝', description: 'Partner registration' },
    { id: 'coordinator', title: 'Coordinator', icon: '👔', description: 'Coordinate registrations' },
  ];

  const openModal = (event) => {
    setModalEvent(event);
    setIsModalOpen(true);
    setModalStep('eventConfirm'); // Start with event confirmation
    setSelectedUserType(null);
    setSelectedCategory(null);
    setSelectedLevel(null);
    setTermsAccepted(false);
  };

  // Open the registration modal and jump straight to the Zoho form
  const openFormDirect = (event) => {
    setModalEvent(event);
    setIsModalOpen(true);
    // start the registration flow with our ContactForm first
    setModalStep('contact');
    setSelectedUserType(null);
    setSelectedCategory(null);
    setSelectedLevel(null);
    setTermsAccepted(false);
    setZohoSubmitted(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalEvent(null);
  };

  const handleSelectUserType = (userType) => {
    setSelectedUserType(userType);
    // For school, franchise, coordinator, and teacher show the special contact/onboarding step
    // Only parents should proceed to competition selection
    if (userType === 'school' || userType === 'franchise' || userType === 'coordinator' || userType === 'teacher') {
      setModalStep('schoolContact');
    } else {
      setModalStep('selectCategory');
    }
  };

  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    // If the user type requires school contact, show that; otherwise proceed to levels
    if (selectedUserType === 'school' || selectedUserType === 'franchise' || selectedUserType === 'coordinator' || selectedUserType === 'teacher') {
      setModalStep('schoolContact');
    } else {
      setModalStep('selectLevel');
    }
  };

  const handleSelectLevel = (level) => {
    // prefer image from Firestore collection `level_assets`, fallback to level.syllabusImage
    const findAsset = (lvl) => {
      if (!lvl) return null;

      // Recreate the same normalizer used when building `levelAssets` so lookups match.
      const normalize = (s) =>
        (s || '')
          .toString()
          .trim()
          .toLowerCase()
          .replace(/level/g, 'lv')
          .replace(/junior/g, 'jr')
          .replace(/senior/g, 'sr')
          .replace(/[^a-z0-9]+/g, '_')
          .replace(/_+/g, '_');

      const rawCandidates = [
        lvl.id,
        lvl.title,
        lvl.name,
        lvl.levelId,
        (lvl.title || '').replace(/\s+/g, ''),
      ].filter(Boolean);

      const tried = new Set();
      for (const r of rawCandidates) {
        const n = normalize(r);
        if (!tried.has(n)) {
          tried.add(n);
          if (levelAssets[n]) return levelAssets[n];
        }

        // also try a few common rewrites (these mirror the keys generated at ingest)
        const rewrites = [
          n.replace(/_k_/g, '_kid_k'),
          n.replace(/kid__/g, 'kid_'),
          n.replace(/vm_jr/g, 'vm_junior'),
          n.replace(/vm_sr/g, 'vm_senior'),
        ];
        for (const w of rewrites) {
          if (w && !tried.has(w)) {
            tried.add(w);
            if (levelAssets[w]) return levelAssets[w];
          }
        }
      }

      // final attempts: try raw id/title without normalization
      const fallbacks = [lvl.id, lvl.title].filter(Boolean);
      for (const f of fallbacks) {
        if (levelAssets[f]) return levelAssets[f];
      }

      return null;
    };

    const assetUrl = findAsset(level) || level.syllabusImage || null;
    console.debug('Selected level:', level.id, 'resolved syllabus image:', assetUrl);
    setSyllabusImageError(false);
    setSyllabusImageUrl(assetUrl);
    setSelectedLevel({ ...level, syllabusImage: assetUrl });
    setModalStep('info');
  };

  // preload syllabus image and show a small thumbnail while it loads
  useEffect(() => {
    if (!syllabusImageUrl) {
      setSyllabusImageLoading(false);
      setSyllabusImageError(false);
      return;
    }

    setSyllabusImageLoading(true);
    setSyllabusImageError(false);
    const img = new Image();
    img.src = syllabusImageUrl;
    img.onload = () => setSyllabusImageLoading(false);
    img.onerror = () => {
      setSyllabusImageLoading(false);
      setSyllabusImageError(true);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [syllabusImageUrl]);

  const handleBack = () => {
    if (modalStep === 'eventConfirm') {
      closeModal();
    } else if (modalStep === 'contact') {
      setModalStep('eventConfirm');
    } else if (modalStep === 'schoolContact') {
      setModalStep('selectUserType');
    } else if (modalStep === 'form') {
      setModalStep('info');
    } else if (modalStep === 'info') {
      setModalStep('selectLevel');
      setTermsAccepted(false);
    } else if (modalStep === 'selectLevel') {
      setModalStep('selectCategory');
      setSelectedLevel(null);
    } else if (modalStep === 'selectCategory') {
      setModalStep('selectUserType');
      setSelectedCategory(null);
    }
  };
  const proceedToForm = () => {
    if (termsAccepted) {
      setModalStep('form');
      setZohoSubmitted(false);
    }
  };

  const handleZohoFormCompleted = () => {
    setZohoSubmitted(true);
    setModalStep('thankyou');
  };

  // Fetch level assets from Firestore collection `level_assets`.
  useEffect(() => {
    let mounted = true;

    const fetchAssets = async () => {
      try {
        const snap = await getDocs(collection(db, 'level_assets'));
        const assets = {};

        // universal normalizer (same for docs + frontend keys)
        const normalize = (s) =>
          (s || '')
            .toString()
            .trim()
            .toLowerCase()
            .replace(/level/g, 'lv')        // converts "level 3" → "lv 3"
            .replace(/junior/g, 'jr')       // junior → jr
            .replace(/senior/g, 'sr')       // senior → sr
            .replace(/[^a-z0-9]+/g, '_')    // keep only letters+numbers
            .replace(/_+/g, '_');           // remove double underscores

        for (const doc of snap.docs) {
          const data = doc.data();

          let url =
            data.url ||
            data.imageUrl ||
            data.syllabusImage ||
            data.downloadUrl ||
            null;

          // fallback: try storage path
          if (!url && data.storagePath) {
            try {
              url = await getDownloadURL(storageRef(storage, data.storagePath));
            } catch (e) {
              console.warn('Storage URL missing:', data.storagePath);
            }
          }

          // fallback: auto attempt `level_assets/<docId>.png`
          if (!url) {
            try {
              url = await getDownloadURL(
                storageRef(storage, `level_assets/${doc.id}.png`)
              );
            } catch (e) {}
          }

          // create all possible normalized keys
          const rawKeys = [
            doc.id,
            data.title,
            data.alt,
            data.levelId,
            data.name,
          ].filter(Boolean);

          const uniqueKeys = new Set();

          for (const k of rawKeys) {
            const base = normalize(k);
            uniqueKeys.add(base);

            // extra rewriting for common patterns
            uniqueKeys.add(base.replace(/_k_/g, '_kid_k')); // k2 → kid_k2
            uniqueKeys.add(base.replace(/kid__/g, 'kid_'));
            uniqueKeys.add(base.replace(/vm_jr/g, 'vm_junior'));
            uniqueKeys.add(base.replace(/vm_sr/g, 'vm_senior'));
          }

          // store asset under every usable key
          uniqueKeys.forEach((key) => {
            if (key && url) assets[key] = url;
          });
        }

        if (mounted) setLevelAssets(assets);
      } catch (err) {
        console.error('Error fetching level assets:', err);
      }
    };

    fetchAssets();
    return () => (mounted = false);
  }, []);


  if (loading) {
    return (
      <div className="upcoming-events-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading upcoming events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="upcoming-events-page">
      {/* Hero Section with YouTube Background */}
      <div className="hero-video-section">
        <div className="hero-video-background" style={{ overflow: 'hidden', borderRadius: 12 }}>
            {loadHeroIframe ? (
              <iframe
                src={`https://www.youtube.com/embed/${heroYoutubeId}?autoplay=1&mute=1&loop=1&playlist=${heroYoutubeId}&controls=0&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&enablejsapi=1`}
                title="Competition Hero Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                className="hero-iframe"
                frameBorder="0"
                allowFullScreen
                style={{ background: 'transparent', border: 0, display: 'block', width: '100%', height: '100%' }}
              />
            ) : (
              <div className="hero-poster" style={{ backgroundImage: `url(${heroThumb})`, borderRadius: 12, overflow: 'hidden' }}>
                <button className="hero-play-btn" onClick={() => setLoadHeroIframe(true)} aria-label="Play video">
                  <span className="visually-hidden">Play video</span>
                </button>
              </div>
            )}
            <div className="hero-overlay" />
          </div>
        
        <div className="hero-content">
          <div className="hero-badges">
            <button
              className={`hero-badge ${selectedCity === 'pune' ? 'active' : ''}`}
              onClick={() => handleCityClick('pune')}
              aria-pressed={selectedCity === 'pune'}
            >
              Pune
            </button>
            <button
              className={`hero-badge ${selectedCity === 'solapur' ? 'active' : ''}`}
              onClick={() => handleCityClick('solapur')}
              aria-pressed={selectedCity === 'solapur'}
            >
              Solapur
            </button>
          </div>
          
          <h1 className="hero-title">
            {(() => {
              const titleStr = selectedEvent?.title || 'Open National Level Abacus & Vedic Math Competition 2026';
              // try to extract a 4-digit year at the end (e.g., 2026)
              const yearMatch = titleStr.match(/(20\d{2})\s*$/);
              if (yearMatch) {
                const year = yearMatch[1];
                // remove the year (and any trailing hyphen or spaces) from main
                let main = titleStr.replace(/(?:\s*-\s*)?20\d{2}\s*$/, '').trim();
                // If the main already ends with 'Competition', remove it to avoid duplication
                main = main.replace(/\bCompetition\b\s*$/i, '').trim();
                return (
                  <>
                    <span className="hero-title-main">{main}</span>
                    <span className="hero-title-suffix">Competition - {year}</span>
                  </>
                );
              }
              // fallback: split by last ' - ' as before
              const parts = titleStr.split(' - ');
              if (parts.length > 1) {
                const main = parts.slice(0, parts.length - 1).join(' - ');
                const suffix = parts[parts.length - 1];
                return (
                  <>
                    <span className="hero-title-main">{main}</span>
                    <span className="hero-title-suffix">{suffix}</span>
                  </>
                );
              }
              return <span className="hero-title-main">{titleStr}</span>;
            })()}
          </h1>
          <p className="hero-description">{selectedEvent ? selectedEvent.description || 'Join the nation\'s brightest minds and showcase your mathematical prowess.' : ''}</p>
          <div className={`hero-subtle ${selectedCity === 'pune' ? 'hero-location-pune' : ''} ${selectedCity === 'solapur' ? 'hero-location-solapur' : ''}`}>{selectedEvent?.location}</div>

          {/* Competition/registration dates removed from hero per request */}

          <button
            className="hero-register-btn"
            onClick={() => openFormDirect(selectedEvent)}
            style={{ marginTop: '18px' }}
          >
            Register Now for {selectedEvent?.location?.split(' ')[0]}
          </button>
          
          {/* Countdown Timer */}
          <div className="countdown-timer">
            <div className="countdown-item">
              <div className="countdown-value">{timeLeft.days}</div>
              <div className="countdown-label">DAYS</div>
            </div>
            <div className="countdown-item">
              <div className="countdown-value">{timeLeft.hours}</div>
              <div className="countdown-label">HOURS</div>
            </div>
            <div className="countdown-item">
              <div className="countdown-value">{timeLeft.minutes}</div>
              <div className="countdown-label">MINUTES</div>
            </div>
            <div className="countdown-item">
              <div className="countdown-value">{timeLeft.seconds}</div>
              <div className="countdown-label">SECONDS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Story Viewer - Highlights strip */}
      <div className="story-marquee-container">
        <div className="stories-header" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.6rem', color: '#ff6b35' }}>Highlights</h3>
          <div style={{ fontSize: '0.95rem', color: '#6b7280', marginTop: '0.25rem' }}>Moments from our events</div>
        </div>
        {storiesLoading ? (
          <div className="story-loading">Loading stories...</div>
        ) : stories.length === 0 ? (
          <div className="story-empty">No stories available</div>
        ) : (
          <div className="story-marquee">
            <div className="story-marquee-track">
              {[...stories, ...stories].map((story, idx) => (
                <button
                  key={`${story.id}-${idx}`}
                  onClick={() => openStory(idx % stories.length)}
                  className="story-avatar"
                  title={story.author}
                  aria-label={`Open story from ${story.author}`}>
                  <img
                    src={deriveThumb(story)}
                    alt={story.author ? `${story.author} thumbnail` : 'story thumbnail'}
                    className="story-avatar-img"
                    loading="lazy"
                  />
                  {story.author && <span className="story-author-name">{story.author}</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="container">
        {/* About the Competition block removed as requested */}

        {/* Competition Events Grid */}
        <div className="events-grid">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="event-card competition-card">
              <div className="event-card-header">
                <div className="event-badge">National Competition</div>
                {event.registrationOpen && (
                  <div className="reg-status" aria-hidden="false">Registration Open</div>
                )}
                <h2 className="event-title">{event.title}</h2>
              </div>

              <div className="event-details">
                <div className="event-detail-item">
                  <FontAwesomeIcon icon={faCalendarAlt} className="detail-icon" />
                  <div>
                    <div className="detail-label">Competition Date</div>
                    <div className="detail-value">{formatEventDate(event.date)}</div>
                  </div>
                </div>

                <div className="event-detail-item">
                  <FontAwesomeIcon icon={faClock} className="detail-icon" />
                  <div>
                    <div className="detail-label">Time</div>
                    <div className="detail-value">{event.time}</div>
                  </div>
                </div>

                <div className="event-detail-item">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="detail-icon" />
                  <div>
                    <div className="detail-label">Location</div>
                    {renderLocation(event.location)}
                  </div>
                </div>

                <div className="event-detail-item">
                  <FontAwesomeIcon icon={faCalendarAlt} className="detail-icon" />
                  <div>
                    <div className="detail-label">Registration Deadline</div>
                    <div className="detail-value">{formatEventDate(event.registrationDeadline)}</div>
                  </div>
                </div>
              </div>

              <div className="event-description">
                <p>{event.description}</p>
              </div>

              {/* Fee card removed per user request (Regular Fee / Late Fee) */}

              <div className="event-card-footer">
                <button 
                  onClick={() => openFormDirect(event)}
                  className="register-button"
                >
                  Register Now for {event.location.split(' ')[0]}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Why Join Our Competition Section */}
        <section className="why-join-section" style={{ padding: '60px 0' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', color: '#ff6b35', marginBottom: '20px' }}>
              Why Join Our Competition?
            </h2>
            <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#666', marginBottom: '50px' }}>
              prizes • Trophies • Certificates for all
            </p>

            <div className="why-join-grid">
              <div className="why-join-video">
                <div className="video-wrapper">
                  <iframe
                    title="Competition video"
                    src={`https://www.youtube.com/embed/${heroYoutubeId}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    playsInline
                    allowFullScreen
                  />
                </div>
              </div>

              <div className="why-join-cards">
                <div className="info-card">
                  <div className="info-icon"><FontAwesomeIcon icon={faTrophy} /></div>
                  <h3>Competitive Excellence</h3>
                  <p>Timed challenges designed to test speed and accuracy in mental calculations</p>
                </div>

                <div className="info-card">
                  <div className="info-icon"><FontAwesomeIcon icon={faUsers} /></div>
                  <h3>Fair Competition</h3>
                  <p>8 skill-based levels ensuring every participant competes with peers of similar ability</p>
                </div>

                <div className="info-card">
                  <div className="info-icon"><FontAwesomeIcon icon={faAward} /></div>
                  <h3>Recognition & Rewards</h3>
                  <p>Certificates for all, trophies for top performers, and exciting prizes</p>
                </div>

                <div style={{ textAlign: 'center', marginTop: '22px' }}>
                  <button
                    onClick={() => openFormDirect(upcomingEvents[0])}
                    className="hero-register-btn"
                    style={{ padding: '12px 36px' }}
                  >
                    Register Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Prizes & Rank System Section */}
        <section className="prizes-section" style={{ padding: '80px 0'}}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', color: '#ff6b35', marginBottom: '20px' }}>
              Prizes & Rank System
            </h2>
            <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#666', marginBottom: '50px' }}>
              Below are the prizes and rank awards that will be presented at the competition:
            </p>

            {/* Continuous marquee of prizes */}
            <div className="prize-marquee-fullwidth" style={{ padding: '1rem 0', overflow: 'hidden', position: 'relative', marginBottom: '30px', width: '100vw', marginLeft: 'calc(50% - 50vw)' }}
              onMouseEnter={() => { const t = prizeTrackRef.current; if (t) t.classList.add('pause'); }}
              onMouseLeave={() => { const t = prizeTrackRef.current; if (t) t.classList.remove('pause'); }}
            >
              {prizesLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading prizes...</div>
              ) : prizes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No prizes available</div>
              ) : (
                <div
                  ref={prizeTrackRef}
                  className="prize-marquee-fullwidth__track animate"
                  style={{ animationDuration: `${Math.max(40, prizes.length * 8)}s`, display: 'flex', gap: '1.25rem', alignItems: 'center', width: 'max-content' }}
                >
                  {[...prizes, ...prizes].map((item, idx) => (
                    <div 
                          key={`${item.id}-${idx}`} 
                          className="prize-card" 
                          style={{ flex: '0 0 auto', width: '18rem', minHeight: '14rem', cursor: 'pointer' }}
                      onClick={() => {
                        if (item.url) {
                          setPrizePreviewSrc(item.url);
                          setPrizePreviewOpen(true);
                        }
                      }}
                    >
                      <div style={{ borderRadius: '12px', background: 'white', padding: '1rem', boxShadow: '0 6px 18px rgba(15,23,42,0.06)', border: '1px solid #fdeedf', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', transition: 'all 0.3s ease' }}
                        onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(15,23,42,0.12)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(15,23,42,0.06)'; }}
                      >
                          {item.url ? (
                          <div style={{ width: '100%', height: '150px', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img 
                              src={item.url} 
                              alt={item.alt || item.name} 
                              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                              }}
                            />
                            <div style={{ display: 'none', width: '64px', height: '64px', borderRadius: '10px', background: '#fff7f0', alignItems: 'center', justifyContent: 'center', fontSize: '28px', color: '#fb923c' }}>
                              🎁
                            </div>
                          </div>
                        ) : (
                          <div style={{ width: '64px', height: '64px', borderRadius: '10px', background: '#fff7f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', fontSize: '28px', color: '#fb923c' }}>
                            🎁
                          </div>
                        )}
                        <p style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#333' }}>{item.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ background: '#f0f7ff', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid #d0e7ff' }}>
              <p style={{ fontSize: '0.95rem', color: '#1a5490', fontWeight: '500', margin: 0 }}>
                <strong>Certificates for All Participants:</strong> Every student will receive a Participation Certificate from Shraddha Institute. Top-ranking students will receive Merit Certificates along with their trophies or medals.
              </p>
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <button
                onClick={() => openFormDirect(upcomingEvents[0])}
                style={{
                  padding: '15px 50px',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: 'white',
                  background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                  border: 'none',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(255,107,53,0.4)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 12px 35px rgba(255,107,53,0.5)'; }}
                onMouseOut={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 8px 25px rgba(255,107,53,0.4)'; }}
              >
                Register Now
              </button>
            </div>
          </div>
        </section>

        {/* Registration Details Section */}
        <section className="registration-details-section" style={{ padding: '60px 0' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 className="registration-title" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff6b35', margin: 0, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="registration-icon-inline" style={{ width: '44px', height: '44px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', background: 'linear-gradient(135deg,#ff8a3d 0%, #ff6b35 100%)' }}>
                  <FontAwesomeIcon icon={faClipboardList} style={{ color: 'white', fontSize: '22px' }} />
                </span>
                Registration Details
              </h2>
              <p className="registration-intro" style={{ color: '#666', fontSize: '0.95rem' }}>
                Upon registering for the competition, you will receive 80 practice papers (numbered 1 to 80) to help you prepare thoroughly.
              </p>
            </div>

            <div className="registration-box">
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', marginBottom: '16px', marginTop: '8px' }}>Practice Paper Dispatch Process</h3>
              
              <div className="reg-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div className="reg-step">
                  <div className="reg-step-icon" style={{ background: '#fff9f5' }}><FontAwesomeIcon icon={faCreditCard} style={{ color: '#d97706' }} /></div>
                  <div>
                    <div className="reg-step-title">Payment Confirmation</div>
                    <div className="reg-step-desc">Your payment will first be verified and confirmed.</div>
                  </div>
                </div>

                <div className="reg-step">
                  <div className="reg-step-icon" style={{ background: '#fff0f0' }}><FontAwesomeIcon icon={faHome} style={{ color: '#dc2626' }} /></div>
                  <div>
                    <div className="reg-step-title">Address Verification</div>
                    <div className="reg-step-desc">After payment confirmation, your address will be checked and verified.</div>
                  </div>
                </div>

                <div className="reg-step">
                  <div className="reg-step-icon" style={{ background: '#f5f3f0' }}><FontAwesomeIcon icon={faBox} style={{ color: '#92400e' }} /></div>
                  <div>
                    <div className="reg-step-title">Dispatch</div>
                    <div className="reg-step-desc">Once verification is complete, the practice papers will be dispatched to your registered address.</div>
                  </div>
                </div>

                <div className="reg-step">
                  <div className="reg-step-icon" style={{ background: '#fff0f5' }}><FontAwesomeIcon icon={faTruck} style={{ color: '#db2777' }} /></div>
                  <div>
                    <div className="reg-step-title">Delivery Timeline</div>
                    <div className="reg-step-desc">After dispatch, you will receive the practice papers within 8 days.</div>
                  </div>
                </div>

                <div className="reg-step">
                  <div className="reg-step-icon" style={{ background: '#f0f0ff' }}><FontAwesomeIcon icon={faSearch} style={{ color: '#4338ca' }} /></div>
                  <div>
                    <div className="reg-step-title">Tracking Information</div>
                    <div className="reg-step-desc">A courier docket number will be provided so you can track your delivery.</div>
                  </div>
                </div>

                <div className="reg-step">
                  <div className="reg-step-icon" style={{ background: '#fffbf0' }}><FontAwesomeIcon icon={faMoneyBillWave} style={{ color: '#f59e0b' }} /></div>
                  <div>
                    <div className="reg-step-title">Courier Charges</div>
                    <div className="reg-step-desc">Courier charges are included and will be applied at actuals (based on the courier service rate).</div>
                  </div>
                </div>
              </div>

              <div style={{ background: '#fafafa', padding: '14px 18px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e8e8e8' }}>
                <p style={{ color: '#666', margin: 0, fontSize: '0.95rem' }}>You will receive 80 practice papers (numbered 1 to 80) as part of the registration package.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{ background: '#ffffff', padding: '16px', borderRadius: '10px', border: '1px solid #e8e8e8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <strong style={{ color: '#333', fontSize: '0.95rem' }}>Batch Details Provided</strong>
                  <div style={{ color: '#666', marginTop: '8px', fontSize: '0.9rem', lineHeight: '1.5' }}>You will receive the batch details 15 days before the competition.</div>
                </div>

                <div style={{ background: '#ffffff', padding: '16px', borderRadius: '10px', border: '1px solid #e8e8e8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <strong style={{ color: '#333', fontSize: '0.95rem' }}>ID Card Dispatch</strong>
                  <div style={{ color: '#666', marginTop: '8px', fontSize: '0.9rem', lineHeight: '1.5' }}>After the ID cards arrive, they will be distributed at the competition venue. Please carry a valid photo ID for collection.</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', paddingTop: '8px', borderTop: '1px solid #f0f0f0' }}>
                <div style={{ color: '#666', fontSize: '0.95rem' }}>Keep your contact information up to date to receive the venue and important updates.</div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button onClick={() => openFormDirect(upcomingEvents[0])} className="hero-register-btn" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>Register Now</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section" style={{ padding: '60px 0' }}>
          <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', color: '#ff6b35', marginBottom: '50px' }}>
              Frequently Asked Questions
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <details style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '2px solid #f0f0f0', cursor: 'pointer' }}>
                <summary style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333', cursor: 'pointer' }}>
                  What age groups can participate?
                </summary>
                <p style={{ marginTop: '15px', color: '#666', lineHeight: '1.8', paddingLeft: '10px' }}>
                  Students from age 4 to 16 years can participate. We have different levels tailored for various age groups and skill levels, from UKG to advanced levels.
                </p>
              </details>

              
              <details style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '2px solid #f0f0f0', cursor: 'pointer' }}>
                <summary style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333', cursor: 'pointer' }}>
                  How are winners determined?
                </summary>
                <p style={{ marginTop: '15px', color: '#666', lineHeight: '1.8', paddingLeft: '10px' }}>
                  Winners are determined based on accuracy and speed. Students compete within their respective levels, and rankings are given based on the number of correct answers and time taken.
                </p>
              </details>

              <details style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '2px solid #f0f0f0', cursor: 'pointer' }}>
                <summary style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333', cursor: 'pointer' }}>
                  When will results be announced?
                </summary>
                <p style={{ marginTop: '15px', color: '#666', lineHeight: '1.8', paddingLeft: '10px' }}>
                  Results will be declared on the same day after all competitions are completed. Prize distribution will follow immediately after the results announcement.
                </p>
              </details>

              <details style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '2px solid #f0f0f0', cursor: 'pointer' }}>
                <summary style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333', cursor: 'pointer' }}>
                  Is the registration fee refundable?
                </summary>
                <p style={{ marginTop: '15px', color: '#666', lineHeight: '1.8', paddingLeft: '10px' }}>
                  No, the registration fee is non-refundable. Please ensure you can attend on the competition date before registering.
                </p>
              </details>

              <details style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '2px solid #f0f0f0', cursor: 'pointer' }}>
                <summary style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333', cursor: 'pointer' }}>
                  Can parents attend the competition?
                </summary>
                <p style={{ marginTop: '15px', color: '#666', lineHeight: '1.8', paddingLeft: '10px' }}>
                  Yes, parents are welcome to attend and support their children. However, during the actual competition, only participants will be allowed in the competition area.
                </p>
              </details>

              <details style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '2px solid #f0f0f0', cursor: 'pointer' }}>
                <summary style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333', cursor: 'pointer' }}>
                  What should students bring on competition day?
                </summary>
                <p style={{ marginTop: '15px', color: '#666', lineHeight: '1.8', paddingLeft: '10px' }}>
                  Students should bring their own pencils and erasers. Answer sheets will be provided by the organizers. Don't forget to bring your registration confirmation!
                </p>
              </details>
            </div>
          </div>
        </section>
      </div>

      {/* Registration Modal - FIXED z-index and styling */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal} style={{ zIndex: 9998 }} />
          
          <div 
            className="modal-dialog" 
            role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col max-h-[90vh]">
              <div 
                className="flex items-center justify-between p-5 border-b border-slate-200 flex-shrink-0 bg-gradient-to-r from-orange-50 to-amber-50"
              >
                <div className="flex items-center gap-3">
                  {modalStep !== 'eventConfirm' && (
                    <button onClick={handleBack} className="p-2 rounded-full hover:bg-white/80 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    </button>
                  )}
                  <h3 className="text-xl font-bold text-slate-800">
                    {modalStep === 'eventConfirm' && `Confirm location: ${modalEvent?.location?.split(' ')[0] || 'Event'}`}
                    {modalStep === 'contact' && 'Tell us about yourself'}
                    {modalStep === 'selectUserType' && 'I am a...'}
                    {modalStep === 'selectCategory' && 'Choose Competition'}
                    {modalStep === 'selectLevel' && 'Select Level'}
                    {modalStep === 'info' && 'Review & Confirm'}
                    {modalStep === 'form' && 'Registration Form'}
                    {modalStep === 'thankyou' && 'Registration Complete'}
                    {modalStep === 'schoolContact' && 'Next Steps'}
                  </h3>
                </div>
                <button onClick={closeModal} className="p-2 rounded-full hover:bg-white/80 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              <div className="p-4 md:p-8 overflow-y-auto bg-slate-50">
                {/* Event Confirmation Step */}
                {modalStep === 'eventConfirm' && (
                  <div className="event-confirm-card max-w-lg mx-auto">
                    <div className="modal-visual-info bg-white rounded-2xl p-6 shadow-xl border border-orange-100">
                      <div className="modal-header text-center mb-4">
                        <h2 className="text-2xl font-extrabold text-orange-600">Competition Details</h2>
                      </div>

                      <div className="modal-fields space-y-3 text-sm text-slate-800">
                        <div className="field-row">
                          <div className="field-label">Competition Date</div>
                          <div className="field-value">Sunday, 1st February 2026</div>
                        </div>

                        <div className="field-row">
                          <div className="field-label">Last Date for Registration</div>
                          <div className="field-value">1st January 2026</div>
                        </div>

                        <div className="field-row">
                          <div className="field-label">Eligibility</div>
                          <div className="field-value">Open to All Students</div>
                        </div>

                        <div className="field-row">
                          <div className="field-label">Prize Distribution</div>
                          <div className="field-value">Prizes will be distributed at the event as per rank categories.</div>
                        </div>

                        <div className="field-row">
                          <div className="field-label">Venue</div>
                          <div className="field-value">Solapur (Details will be shared by your Branch Educator)</div>
                        </div>

                        <div className="field-row">
                          <div className="field-label">Date</div>
                          <div className="field-value">Sunday, 15th February 2026</div>
                        </div>

                        <div className="field-row">
                          <div className="field-label">Time</div>
                          <div className="field-value">Will be updated by your Branch Educator</div>
                        </div>
                      </div>

                      <div className="modal-actions mt-5 flex gap-3 justify-end">
                        <button onClick={closeModal} className="px-4 py-2 bg-white border rounded-md">Ok,continue</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* REPLACED: use our SimpleContactForm as first step */}
                {modalStep === 'contact' && (
                  <div className="p-2">
                    {typeof ContactForm === 'function' ? (
                      <ContactForm
                        onClose={closeModal}
                        onNext={(data) => {
                          // save contact info and prefill the user type, then go to the "Who I am" step
                          setContactInfo(data);
                          setSelectedUserType(data.type || data.userType || null);
                          setModalStep('selectUserType');
                        }}
                      />
                    ) : (
                      <div className="p-4 text-sm text-red-600">Contact form unavailable — check console for diagnostics.</div>
                    )}
                  </div>
                )}

                {modalStep === 'contactSubmitted' && contactInfo && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      Thank you for registering your interest! We have received your details and will get back to you soon.
                    </p>
                  </div>
                )}

                {modalStep === 'selectUserType' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {userTypes.map((type) => (
                      <button 
                        key={type.id} 
                        onClick={() => handleSelectUserType(type.id)} 
                        className={`text-left p-8 bg-white border-2 border-slate-200 rounded-2xl hover:border-orange-500 hover:shadow-lg transition-all group ${selectedUserType === type.id ? 'ring-2 ring-orange-300' : ''}`}
                        aria-pressed={selectedUserType === type.id}
                      >
                        <div className="text-5xl mb-4">{type.icon}</div>
                        <h4 className="font-bold text-2xl text-slate-800 group-hover:text-orange-500 transition-colors">{type.title}</h4>
                        <p className="mt-2 text-slate-600">{type.description}</p>
                      </button>
                    ))}
                  </div>
                )}

                {modalStep === 'selectCategory' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {competitionData.map((cat) => (
                      <button 
                        key={cat.id} 
                        onClick={() => handleSelectCategory(cat.id)} 
                        className="text-left p-8 bg-white border-2 border-slate-200 rounded-2xl hover:border-orange-500 hover:shadow-lg transition-all group"
                      >
                        <div className="mb-3">
                          <h4 className="text-xl font-bold text-slate-800">{cat.title}</h4>
                          <p className="text-slate-600 mt-2">{cat.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {modalStep === 'selectLevel' && selectedCategory && (
                  <>
                    {/* Level Selection Grid */}
                    <div className="levels-grid grid gap-4 mb-6">
                      {competitionData.find(c => c.id === selectedCategory).levels.map((level) => (
                        <button 
                          key={level.id}
                          onClick={() => handleSelectLevel(level)}
                          className="level-card p-4 bg-white border-2 border-slate-200 rounded-xl text-center hover:border-orange-500 hover:shadow-lg transition-all group"
                        >
                          <h4 className="font-bold text-lg text-slate-800 group-hover:text-orange-500 transition-colors">{level.title}</h4>
                          <p className="text-xs text-slate-500 mt-2">{level.ageRange}</p>
                        </button>
                      ))}
                    </div>

                    {/* PDF Downloads and Contact Info Section */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-sm">
                      <h4 className="text-lg font-bold text-slate-800 mb-4">📚 Download Resources</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <a
                          href={selectedCategory === 'abacus' ? SYLLABUS_PDF_ABACUS : SYLLABUS_PDF_VEDIC}
                          download
                          className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-lg transition-all border-2 border-slate-200 hover:border-orange-500"
                        >
                          <FontAwesomeIcon icon={faClipboardList} className="text-orange-500 text-2xl" />
                          <div className="text-left">
                            <div className="font-bold text-slate-800">Syllabus PDF</div>
                            <div className="text-xs text-slate-500">Download {selectedCategory === 'abacus' ? 'Abacus' : 'Vedic Math'} Syllabus</div>
                          </div>
                        </a>
                        <a
                          href={ANNOUNCEMENT_PDF_URL}
                          download
                          className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-lg transition-all border-2 border-slate-200 hover:border-orange-500"
                        >
                          <FontAwesomeIcon icon={faClipboardList} className="text-blue-500 text-2xl" />
                          <div className="text-left">
                            <div className="font-bold text-slate-800">Announcement PDF</div>
                            <div className="text-xs text-slate-500">Download Competition Details</div>
                          </div>
                        </a>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="text-center text-slate-600 mb-3">
                          <span className="font-semibold">📞 For Help & Support:</span>
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center">
                          <a href="tel:+91-9168736060" className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all shadow-sm">
                            <FontAwesomeIcon icon={faClock} />
                            <span className="font-semibold"  style={{ color: 'orange' }}>+91-9168736060</span>

                          </a>
                          <a href="tel:+91-9168736060" className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all shadow-sm">
                            <FontAwesomeIcon icon={faClock} />
                            <span className="font-semibold"  style={{ color: 'orange' }}>+91-8446889966</span>

                          </a>
                          
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {modalStep === 'info' && selectedLevel && (
                  <div className="review-panel max-w-3xl mx-auto space-y-6">
                   

                    {modalEvent && (
                      <div className="event-summary bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800">Selected Event: {modalEvent.location.split(' ')[0]}</h3>
                        <p className="mt-2 text-sm text-slate-600">Date: {formatEventDate(modalEvent.date)}</p>
                       
                      </div>
                    )}

                    <div className="level-summary bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-sm">
                      <div className="level-summary-grid">
                        <div className="level-summary-main">
                          {/* Compact selected-level block: show level name and key details below it */}
                          <div className="selected-level-block">
                            <div className="selected-level-title">Selected Level: {selectedLevel.title}</div>
                            <div className="selected-level-badges">
                              <div className="selected-badge"><span className="badge-label">Registration Type</span><span className="badge-value">{(contactInfo && (contactInfo.type || contactInfo.userType)) || selectedUserType || 'Parent'}</span></div>
                              <div className="selected-badge"><span className="badge-label">Age Range</span><span className="badge-value">{selectedLevel.ageRange}</span></div>
                              <div className="selected-badge"><span className="badge-label">Categories</span><span className="badge-value">{selectedLevel.categories}</span></div>
                              <div className="selected-badge"><span className="badge-label">Time Limit</span><span className="badge-value">{selectedLevel.timeLimit}</span></div>
                            </div>
                          </div>
                          
                          {/* Details (Age Range / Categories / Time Limit) shown above in the review-top-card; removed here to avoid duplication */}

                          {selectedLevel.syllabus && selectedLevel.syllabus.length > 0 && (
                            <>
                              {/* Inline syllabus image above the syllabus highlights */}
                              {syllabusImageLoading ? (
                                <div className="syllabus-inline-top">
                                  <div className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
                                </div>
                              ) : syllabusImageUrl && !syllabusImageError ? (
                                <div className="syllabus-inline-top">
                                  <img
                                    src={syllabusImageUrl}
                                    alt={`${selectedLevel.title} Syllabus`}
                                    className="syllabus-inline-img cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => openSyllabusPreview(syllabusImageUrl)}
                                    title="Click to zoom"
                                  />
                                </div>
                              ) : null}

                              <div className="mt-4 syllabus-box">
                                <h4 className="text-sm font-bold text-slate-700 mb-2">Syllabus Highlights:</h4>
                                <ul className="list-disc list-inside space-y-1">
                                  {selectedLevel.syllabus.map((item, idx) => (
                                    <li key={idx} className="text-sm text-slate-600">{item}</li>
                                  ))}
                                </ul>
                              </div>

                              {/* bottom inline image removed: keep only the top inline image above highlights */}
                            </>
                          )}
                        </div>

                        {/* Right-side thumbnail removed to avoid duplicate images — inline images above/below are used instead */}
                      </div>
                    </div>

                    {/* Syllabus preview overlay */}
                    {syllabusPreviewOpen && (
                      <div
                        className="syllabus-preview-overlay"
                        onClick={closeSyllabusPreview}
                        style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: 'rgba(0,0,0,0.64)', zIndex: 20000 }}
                      >
                        <div className={`bg-white rounded-lg overflow-hidden shadow-lg max-w-4xl w-full`} onClick={(e)=>e.stopPropagation()}>
                          <div className="flex items-center justify-between p-3 border-b">
                            <div className="font-bold">Syllabus Preview</div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => setSyllabusZoomed(z => !z)} className="px-3 py-1 bg-slate-100 rounded">{syllabusZoomed ? 'Fit' : 'Zoom'}</button>
                              <button onClick={closeSyllabusPreview} className="px-3 py-1 bg-slate-100 rounded">Close</button>
                            </div>
                          </div>
                          <div className="p-4 bg-slate-50 flex justify-center" style={{ position: 'relative' }}>
                            <div className={`syllabus-preview-inner ${syllabusZoomed ? 'zoomed' : ''}`}>
                              <img
                                src={syllabusPreviewSrc}
                                alt="Syllabus"
                                className={syllabusZoomed ? 'max-w-none' : 'max-w-full'}
                                style={{ maxHeight: syllabusZoomed ? 'none' : '80vh', display: 'block' }}
                              />
                            </div>
                            <div className="preview-instructions">Pinch to zoom · Drag to pan · Tap Zoom</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Competition Rules */}
                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border-2 border-amber-200 shadow-sm">
                      <h4 className="text-md font-bold text-slate-800 mb-3">📋 Competition Rules & Guidelines</h4>
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold">✓</span>
                          <span>Students must arrive 30 minutes before the competition start time</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold">✓</span>
                          <span>Calculators, mobile phones, or any electronic devices are strictly prohibited</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold">✓</span>
                          <span>Students must bring their own stationery (pencils, erasers)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold">✓</span>
                          <span>Answer sheets will be provided by the organizers</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold">✓</span>
                          <span>Results will be declared on the same day after completion</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold">✓</span>
                          <span>Prize distribution will follow immediately after results</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold">✓</span>
                          <span>Registration fee is non-refundable</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold">✓</span>
                          <span>Organizers' decisions will be final and binding</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold">✓</span>
                          <span>Photo/video may be taken at the event for promotional purposes</span>
                        </li>
                      </ul>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border-2 border-slate-300">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={termsAccepted} 
                          onChange={(e) => setTermsAccepted(e.target.checked)} 
                          className="mt-1 h-5 w-5 rounded border-slate-400 text-orange-500 focus:ring-orange-500 focus:ring-offset-2" 
                        />
                        <div>
                          <span className="text-slate-800 leading-relaxed font-medium block mb-2">
                            I have thoroughly read and understood the syllabus, competition rules, and guidelines above. I agree to abide by all terms and conditions and understand that the organizers' decisions are final and binding.
                          </span>
                         
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {modalStep === 'schoolContact' && (
                  <div className="max-w-3xl mx-auto space-y-6 text-center">
                    <h4 className="text-xl font-bold text-slate-800">Next steps for Teachers, Schools, Franchises & coordinators</h4>
                    <p className="text-slate-600">Please contact us for bulk registration and special arrangements.</p>
                    
                    <div className="w-full rounded-lg overflow-hidden shadow-md bg-white p-6 border border-slate-200 help-support-card">
                      <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center border-2 border-orange-100 icon-circle">
                            <span className="text-2xl">📞</span>
                          </div>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm text-slate-600 help-title">Help / Support</div>
                          <div className="mt-2 space-y-2 help-sub help-phone">
                            <a href={`tel:${SCHOOL_HELP_PHONE}`} className="text-lg font-bold text-slate-800 hover:text-orange-600 block">{SCHOOL_HELP_PHONE}</a>
                            <a href={`tel:${SCHOOL_HELP_PHONE_2}`} className="text-lg font-bold text-slate-800 hover:text-orange-600 block">{SCHOOL_HELP_PHONE_2}</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {modalStep === 'form' && (
                  <div className="w-full">
                    {/* Zoho form iframe - proper sizing and visibility */}
                    <div className="zc-form-wrap">
                      <iframe
                        title="SI Competition Registration"
                        src={ZOHO_FORM_URL}
                        scrolling="yes"
                        allowFullScreen
                        className="w-full border-0"
                        style={{ display: 'block', minHeight: '600px', height: 'calc(100vh - 240px)', maxHeight: '900px' }}
                      />
                    </div>
                    <div className="mt-6 p-5 bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-300 rounded-xl shadow-sm">
                      <p className="text-base text-slate-800 mb-4 font-semibold">
                        ✅ After completing and submitting the form above, click below to confirm:
                      </p>
                      <button 
                        onClick={handleZohoFormCompleted}
                        className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-lg rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300"
                      >
                        ✓ I've Submitted the Form
                      </button>
                    </div>
                  </div>
                )}

                {modalStep === 'thankyou' && (
                  <div className="w-full text-center py-10 px-6 thankyou-compact">
                    <div className="max-w-xl mx-auto">
                      <div className="thankyou-compact__icon mb-4">
                        <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-1">Registration Complete</h3>
                      <p className="text-sm text-slate-600 mb-6">We've received your registration — thank you!</p>

                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => { closeModal(); }}
                          className="px-6 py-2 bg-white text-slate-700 font-semibold rounded-md shadow-sm border border-slate-200 hover:bg-slate-50 transition-all duration-200"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {modalStep === 'info' && (
                <div className="info-footer flex justify-end p-5 border-t border-slate-200 bg-white flex-shrink-0">
                  <button 
                    onClick={proceedToForm} 
                    disabled={!termsAccepted} 
                    className="continue-btn px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                  >
                    Continue to Registration
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Story Viewer Modal - Full Screen */}
      {isStoryOpen && stories[storyIndex] && (
        <div className="story-viewer-overlay" onClick={closeStory}>
          <div className="story-viewer-modal" onClick={(e) => e.stopPropagation()}>
            {/* Progress bars */}
            <div className="story-progress-bars">
              {stories.map((s, i) => (
                <div key={s.id} className="story-progress-bar">
                  <div
                    className="story-progress-fill"
                    style={{
                      width: i === storyIndex ? (storyPlaying ? '100%' : '0%') : (i < storyIndex ? '100%' : '0%')
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Close button */}
            <button onClick={closeStory} className="story-close-btn" aria-label="Close story">
              ✕
            </button>

            {/* Author info */}
            <div className="story-author-info">
              <img
                src={deriveThumb(stories[storyIndex])}
                alt={stories[storyIndex].author}
                className="story-author-avatar"
              />
              <span className="story-author-text">{stories[storyIndex].author || 'Story'}</span>
            </div>

            {/* Story content */}
            <div className="story-content">
              {!storyPlaying ? (
                <div className="story-preview">
                  <img
                    src={deriveThumb(stories[storyIndex])}
                    alt="Story preview"
                    className="story-preview-img"
                  />
                  <button
                    onClick={() => setStoryPlaying(true)}
                    className="story-play-btn"
                    aria-label="Play story"
                  >
                    ▶
                  </button>
                </div>
              ) : (
                <div className="story-media">
                  {stories[storyIndex].type === 'video' ? (
                    <video
                      ref={storyVideoRef}
                      src={stories[storyIndex].src}
                      autoPlay
                      playsInline
                      controls
                      onEnded={nextStory}
                      className="story-video"
                    />
                  ) : stories[storyIndex].type === 'youtube' ? (
                    <iframe
                      ref={storyYoutubeRef}
                      src={`https://www.youtube.com/embed/${stories[storyIndex].videoId || extractYouTubeId(stories[storyIndex].src)}?autoplay=1&mute=0&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`}
                      title={stories[storyIndex].author || 'YouTube story'}
                      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                      allowFullScreen
                      className="story-iframe"
                    />
                  ) : (
                    <img
                      src={stories[storyIndex].src}
                      alt="Story"
                      className="story-image"
                    />
                  )}
                </div>
              )}

              {/* Navigation zones */}
              <button
                onClick={prevStory}
                className="story-nav-left"
                aria-label="Previous story"
              />
              <button
                onClick={nextStory}
                className="story-nav-right"
                aria-label="Next story"
              />
            </div>
          </div>
        </div>
      )}

      {/* Prize Preview Modal */}
      {prizePreviewOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            cursor: 'zoom-out'
          }}
          onClick={() => setPrizePreviewOpen(false)}
        >
          <button
            onClick={() => setPrizePreviewOpen(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100000
            }}
            aria-label="Close preview"
          >
            ×
          </button>
          <img
            src={prizePreviewSrc}
            alt="Prize preview"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default CompetitionLandingPage;
