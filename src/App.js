import React, { useState, useEffect, lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import 'aos/dist/aos.css';
import { loadCSS } from './utils/loadCSS';

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import WelcomeScreen from "./components/WelcomeScreen";
import Hero from "./components/Hero";
import About from "./components/About";
import Programs from "./components/Programs";
import Franchise from "./components/Franchise";
import Training from "./components/Training";
import Gallery from "./components/Gallery";
import DemoAndContact from "./components/DemoAndContact";
import GetInTouch from "./components/GetInTouch";

// Program Subpages
import AbacusPage from "./pages/programs/AbacusPage";
import VedicMathPage from "./pages/programs/VedicMathPage";
import TeacherTrainingPage from "./pages/programs/TeacherTrainingPage";
import FTrainingPage from "./pages/programs/FTrainingPage";
import WorkshopsPage from "./pages/programs/WorkshopsPage";
import FranchiseTeacherTrainingPage from "./pages/programs/FranchiseTeacherTrainingPage";

// Admin
import AdminDashboard from './admin/AdminDashboard';
import './admin/AdminDashboard.css';

// Lazy load ALL components
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const BookDemoPage = lazy(() => import("./pages/BookDemoPage"));
const AboutFranchisePage = lazy(() => import("./pages/Aboutusprograms/AboutFranchisePage"));
const FranchiseTeacherParent = lazy(() => import("./pages/FranchiseFolder/FranchiseTeacherParent"));
const FranchiseBusinessSchool = lazy(() => import("./pages/FranchiseFolder/FranchiseBusinessSchool"));
const TeacherTraining = lazy(() => import("./pages/TrainingFolder/TeacherTraining"));
const SchoolTraining = lazy(() => import("./pages/TrainingFolder/SchoolTraining"));

// Gallery pages - lazy load all of them
const StateLevelCompetition2022 = lazy(() => import('./pages/gallery/StateLevelCompetition2022'));
const NationalLevelCompetition2022 = lazy(() => import('./pages/gallery/NationalLevelCompetition2022'));
const NationalLevelCompetition2023 = lazy(() => import('./pages/gallery/NationalLevelCompetition2023'));
const StateLevelCompetition2023 = lazy(() => import('./pages/gallery/StateLevelCompetition2023'));
const AnnualMeet2023 = lazy(() => import('./pages/gallery/AnnualMeet2023'));
const AnnualMeet2024 = lazy(() => import('./pages/gallery/AnnualMeet2024'));
const StateLevelCompetition2024 = lazy(() => import('./pages/gallery/StateLevelCompetition2024'));
const NationalLevelCompetition2024 = lazy(() => import('./pages/gallery/NationalLevelCompetition2024'));
const AnnualMeet2025 = lazy(() => import('./pages/gallery/AnnualMeet2025'));
const StateLevelCompetition2025 = lazy(() => import('./pages/gallery/StateLevelCompetition2025'));
const NationalLevelCompetition2025 = lazy(() => import('./pages/gallery/NationalLevelCompetition2025'));
const TeachersAchievementImages = lazy(() => import("./pages/gallery/TeachersAchievementImages"));

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Load non-critical CSS after component mounts
    loadCSS('/static/css/animations.css');
    loadCSS('/static/css/responsive.css');
  }, []);

  if (showWelcome) return <WelcomeScreen onSkip={() => setShowWelcome(false)} />;

  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Header />
        <Routes>
          {/* Home Page */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <About />
                <Programs />
                <Franchise />
                <Training />
                <Gallery />
                <GetInTouch />
                <Footer />
                <WhatsAppButton />
              </>
            }
          />

          {/* About Pages */}
          <Route path="/about" element={
            <Suspense fallback={<div className="loading-spinner-container"><div className="loading-spinner"></div></div>}>
              <AboutFranchisePage />
              <Footer />
              <WhatsAppButton />
            </Suspense>
          } />

          {/* Program Pages */}
          <Route path="/programs/abacus" element={<><AbacusPage /><Footer /><WhatsAppButton /></>} />
          <Route path="/programs/vedic-math" element={<><VedicMathPage /><Footer /><WhatsAppButton /></>} />
          <Route path="/programs/teacher-training" element={<><TeacherTrainingPage /><Footer /><WhatsAppButton /></>} />
          <Route path="/programs/franchise-training" element={<><FTrainingPage /><Footer /><WhatsAppButton /></>} />
          <Route path="/programs/workshops" element={<><WorkshopsPage /><Footer /><WhatsAppButton /></>} />
          <Route path="/programs/franchise-teacher-training" element={<><FranchiseTeacherTrainingPage /><Footer /><WhatsAppButton /></>} />

          {/* Franchise Pages */}
          <Route path="/franchise/teacher-parent" element={
            <Suspense fallback={<div className="loading-spinner-container"><div className="loading-spinner"></div></div>}>
              <FranchiseTeacherParent />
              <Footer />
              <WhatsAppButton />
            </Suspense>
          } />
          <Route path="/franchise/business-school" element={
            <Suspense fallback={<div className="loading-spinner-container"><div className="loading-spinner"></div></div>}>
              <FranchiseBusinessSchool />
              <Footer />
              <WhatsAppButton />
            </Suspense>
          } />

          {/* Training Pages */}
          <Route path="/training/teacher-training" element={
            <Suspense fallback={<div className="loading-spinner-container"><div className="loading-spinner"></div></div>}>
              <TeacherTraining />
              <Footer />
              <WhatsAppButton />
            </Suspense>
          } />
          <Route path="/training/school-training" element={
            <Suspense fallback={<div className="loading-spinner-container"><div className="loading-spinner"></div></div>}>
              <SchoolTraining />
              <Footer />
              <WhatsAppButton />
            </Suspense>
          } />

          {/* Gallery & Contact */}
          <Route path="/gallery" element={
            <Suspense fallback={<div className="loading-spinner-container"><div className="loading-spinner"></div></div>}>
              <GalleryPage />
              <Footer />
              <WhatsAppButton />
            </Suspense>
          } />
          <Route path="/contact" element={
            <Suspense fallback={<div className="loading-spinner-container"><div className="loading-spinner"></div></div>}>
              <DemoAndContact />
              <Footer />
              <WhatsAppButton />
            </Suspense>
          } />

          {/* Book Demo Page Route */}
          <Route path="/book-demo" element={
            <Suspense fallback={<div className="loading-spinner-container"><div className="loading-spinner"></div></div>}>
              <BookDemoPage />
              <Footer />
              <WhatsAppButton />
            </Suspense>
          } />

          {/* Admin Dashboard Route */}
          <Route path="/admin" element={<><AdminDashboard /><Footer /><WhatsAppButton /></>} />

          {/* New Gallery 2022 Pages */}
          <Route path="/gallery/2022/state-level-competition" element={
            <Suspense fallback={<div className="loading-spinner-container"><div className="loading-spinner"></div></div>}>
              <StateLevelCompetition2022 />
              <Footer />
              <WhatsAppButton />
            </Suspense>
          } />
          <Route path="/gallery/2022/national-level-competition" element={
            <Suspense fallback={<div className="loading-spinner-container"><div className="loading-spinner"></div></div>}>
              <NationalLevelCompetition2022 />
              <Footer />
              <WhatsAppButton />
            </Suspense>
          } />

          {/* New Gallery 2023 Pages */}
          <Route path="/gallery/2023/state-level-competition" element={
            <Suspense fallback={<div className="loading-spinner-container"><div className="loading-spinner"></div></div>}>
              <StateLevelCompetition2023 />
              <Footer />
              <WhatsAppButton />
            </Suspense>
          } />
          <Route path="/gallery/2023/national-level-competition" element={
            <Suspense fallback={<div className="loading-spinner-container"><div className="loading-spinner"></div></div>}>
              <NationalLevelCompetition2023 />
              <Footer />
              <WhatsAppButton />
            </Suspense>
          } />
          <Route path="/gallery/2023/annual-meet" element={
            <Suspense fallback={<div className="loading-spinner-container"><div className="loading-spinner"></div></div>}>
              <AnnualMeet2023 />
              <Footer />
              <WhatsAppButton />
            </Suspense>
          } />

          {/* Gallery 2024 Pages */}
          <Route path="/gallery/2024/state-level-competition" element={
            <Suspense fallback={<div className="loading-spinner-container"><div className="loading-spinner"></div></div>}>
              <StateLevelCompetition2024 />
              <Footer />
              <WhatsAppButton />
            </Suspense>
          } />
          <Route path="/gallery/2024/national-level-competition" element={
            <Suspense fallback={<div className="loading-spinner-container"><div className="loading-spinner"></div></div>}>
              <NationalLevelCompetition2024 />
              <Footer />
              <WhatsAppButton />
            </Suspense>
          } />
          <Route path="/gallery/2024/annual-meet" element={
            <Suspense fallback={<div className="loading-spinner-container"><div className="loading-spinner"></div></div>}>
              <AnnualMeet2024 />
              <Footer />
              <WhatsAppButton />
            </Suspense>
          } />

          {/* Gallery 2025 Pages */}
          <Route path="/gallery/2025/state-level-competition" element={
            <Suspense fallback={<div className="loading-spinner-container"><div className="loading-spinner"></div></div>}>
              <StateLevelCompetition2025 />
              <Footer />
              <WhatsAppButton />
            </Suspense>
          } />
          <Route path="/gallery/2025/national-level-competition" element={
            <Suspense fallback={<div className="loading-spinner-container"><div className="loading-spinner"></div></div>}>
              <NationalLevelCompetition2025 />
              <Footer />
              <WhatsAppButton />
            </Suspense>
          } />
          <Route path="/gallery/2025/annual-meet" element={
            <Suspense fallback={<div className="loading-spinner-container"><div className="loading-spinner"></div></div>}>
              <AnnualMeet2025 />
              <Footer />
              <WhatsAppButton />
            </Suspense>
          } />
          <Route path="/gallery/StateLevelCompetition2025" element={
            <Suspense fallback={<div className="loading-spinner-container"><div className="loading-spinner"></div></div>}>
              <StateLevelCompetition2025 />
              <Footer />
              <WhatsAppButton />
            </Suspense>
          } />

          {/* Teachers Achievement Images Gallery */}
          <Route path="/gallery/Our Teachers/teachers-achievement-images" element={
            <Suspense fallback={<div className="loading-spinner-container"><div className="loading-spinner"></div></div>}>
              <TeachersAchievementImages />
              <Footer />
              <WhatsAppButton />
            </Suspense>
          } />

          {/* footer link */}
          <Route path="/courses" element={<><FranchiseTeacherTrainingPage /><Footer /><WhatsAppButton /></>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;



// No explicit font declarations in App.js itself
// Font settings are spread across component CSS files and inline styles


