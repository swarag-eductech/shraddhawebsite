import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { supabase } from "../supabaseClient";
import "./DemoAndContact.css";

const DemoAndContact = () => {
  const [studentImg, setStudentImg] = useState(null);

  // 🔹 Fetch student image from Firestore
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const docRef = doc(db, "demoAssets", "studentImage");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStudentImg(docSnap.data().url);
        }
      } catch (error) {
        console.error("Error fetching student image:", error);
      }
    };
    fetchImage();
  }, []);

  // 🔹 Form State and Logic (Same as TTPLandingPage)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    program: 'Abacus Course',
    message: ''
  });
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
      const { error } = await supabase.from('ttp_leads').insert([
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email || null,
          city: formData.city,
          lead_program: formData.program,
          status: 'new',
          source: 'Website Contact Form',
        },
      ]);
      if (error) {
        console.error('Supabase insert error details:', error);
        setFormError('Supabase error: ' + error.message);
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
      setFormData({ name: '', phone: '', email: '', city: '', program: 'Abacus Course', message: '' });
      setTimeout(() => setFormSubmitted(false), 5000);
    } catch (err) {
      console.error('Unexpected error details:', err);
      setFormError('Unexpected error: ' + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <section className="demo-contact-section" id="contact-demo">
      {/* Contact Form (Left) */}
      <div className="contact-section">
        <div className="contact-header">
          <h2>
            <span className="highlight">Get in Touch</span>
          </h2>
          <p className="subtitle">
            Have questions? We're here to help guide your learning journey
          </p>
        </div>

        <div className="ttp-reg-form-wrap">

          {formSubmitted ? (
            <div className="ttp-form-success">
              ✅ Thank you! We'll contact you within 24 hours.
            </div>
          ) : (
            <form className="ttp-reg-form" onSubmit={handleFormSubmit}>
              <div className="ttp-form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="ttp-form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div className="ttp-form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="Enter email address"
                />
              </div>
              <div className="ttp-form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleFormChange}
                  placeholder="Enter your city"
                  required
                />
              </div>
              <div className="ttp-form-group">
                <label>Interested Program *</label>
                <select name="program" value={formData.program} onChange={handleFormChange}>
                  <option value="Abacus Course">Abacus Course</option>
                  <option value="Vedic Math Course">Vedic Math Course</option>
                  <option value="Both Abacus & Vedic Math Course">Both Abacus &amp; Vedic Math Course</option>
                  <option value="Free Demo Class">Free Demo Class</option>
                </select>
              </div>
              <div className="ttp-form-group">
                <label>Message (Optional)</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  placeholder="Any questions or comments..."
                  rows="3"
                />
              </div>
              <button type="submit" className="ttp-form-submit" disabled={formLoading}>
                {formLoading ? "⏳ Submitting..." : "📝 Submit Registration"}
              </button>
              {formError && (
                <p className="ttp-form-error">⚠️ {formError}</p>
              )}
              <p className="ttp-form-privacy">🔒 Your information is 100% safe.</p>
            </form>
          )}
        </div>
      </div>

      {/* Free Demo (Right) */}
      <div className="demo-section">
        <div className="demo-card">
          <div className="demo-content">
            <div className="demo-badge"></div>
            <h2>
              <span className="emoji">🎓</span>
              <span className="orange-text">Free Demo Class</span>
            </h2>
            <p className="demo-text">
              Experience our unique teaching methodology first-hand. Book a
              no-obligation demo session today!
            </p>
            <Link to="/contact" className="btn btn-primary">
              Book Your Free Session
            </Link>
          </div>
          <div className="demo-image">
            {studentImg ? (
              <picture>
                <source
                  srcSet={studentImg.replace(/\.png$/, '.webp')}
                  type="image/webp"
                />
                <img
                  src={studentImg}
                  alt="Happy students learning"
                  width={180}
                  height={180}
                  loading="lazy"
                  style={{
                    width: "220px",
                    height: "220px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.12)",
                    display: "block",
                    margin: "0 auto"
                  }}
                />
              </picture>
            ) : (
              <p>Loading image...</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoAndContact;

