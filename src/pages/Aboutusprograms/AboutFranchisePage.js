import React from 'react';
import './AboutFranchisePage.css';
import { useState, useEffect } from 'react';

import { getFirestore, doc, getDoc } from "firebase/firestore";
import firebaseApp from "../../firebase"; // your firebase.js config


const AboutFranchisePage = () => {
  const [founderImgUrl, setFounderImgUrl] = useState(null);
useEffect(() => {
    const fetchImage = async () => {
      try {
        const db = getFirestore(firebaseApp);
        const docRef = doc(db, "founder", "IHLJeSe1a6CEHfHKGZ4u"); // 👈 docId
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          setFounderImgUrl(snapshot.data().url); // 👈 this is your field
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching founder image:", error);
      }
    };

    fetchImage();
  }, []);

  return (
    <div className="founder-page">
      {/* Summary / Why partner (now the top section) */}
      <section className="summary-section">
        <div className="container">
          <div className="summary-left">
            <p>
              Shraddha Institute, established in 2013, has been a pioneer in teacher training — empowering 600+ educators and transforming learning experiences in schools across India. With 12+ years of excellence, we deliver structured, innovative programs that help students build strong academic foundations and essential cognitive skills.
            </p>
            <p>
              Our expertise includes Abacus, Vedic Math, Phonics and Handwriting. With a strong presence in 50+ schools across Maharashtra and North Karnataka, Shraddha Institute provides customized educational solutions that enhance student engagement, boost confidence, and improve overall learning outcomes.
            </p>
          </div>

          {/* removed the aside.summary-features block as requested */}
        </div>
      </section>

      {/* Founder Profile */}
      <section className="founder-profile">
        <div className="container">
          <div className="profile-card">
            <div className="profile-image">
              <div style={{position: 'relative', width: '100%', height: '100%'}}>
                <img src={founderImgUrl || ''} alt="Mrs. Swati Shah, Founder" style={{width: '100%', height: 'auto', display: 'block'}} />
                <div className="quote" style={{position: 'absolute', left: '50%', bottom: '10px', transform: 'translateX(-50%)'}}>
                  "Math should be joyful, not fearful"
                </div>
              </div>
            </div>
            <div className="profile-content">
              <h3>Message From Our Founder</h3>
              <p>
                As a educator and the founder of shraddha institute, deeply understand the challenges schools face in fostering student sucess and shaping a future-ready generation.
              </p>
              <p>
                At Shraddha Institute, our specialized programs, including Abacus, Vedic Math, Phonics and Handwriting are designed to strengthen foundational skills, enhance learning outcomes and foster critical thinking.
              </p>
              <p>
                I saw students struggling with math anxiety. Vedic techniques helped us
                bring joy back into learning. Today, with over 600 teachers and 50,000+ students,
                our mission continues.
              </p>
              <div className="signature">- Mrs. Swati Shah</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutFranchisePage;
