import React, { useState } from 'react';
import './ContactForm.css';

// Replace with your deployed Google Apps Script Web App URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwSCMgAAofCoNF8lGOBjPxSdH8Q1Q4gCGxGutTardGwI70K5_COrzBnIvJEV8VsEeMP/exec';

function ContactForm({ onNext, onClose = () => console.log('No onClose handler provided') }) {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Please enter your name';
    if (!number.trim()) errs.number = 'Please enter a phone number';
    if (!city.trim()) errs.city = 'Please enter your city';
    if (!type) errs.type = 'Please select a type';
    setFieldErrors(errs);
    if (Object.keys(errs).length) return 'Please fill required fields';
    return null;
  };

  const handleSubmit = async (e) => {
    console.log('ContactForm handleSubmit called', { e, name, number, email, city, type });
    if (e && e.preventDefault) e.preventDefault();
    setError(null);
    const v = validate();
    console.log('ContactForm validation result:', v);
    if (v) { setError(v); return; }
    setLoading(true);

    const payload = {
      name: name.trim(),
      phone: number.trim(),
      email: email.trim(),
      city: city.trim(),
      type,
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    console.log('ContactForm submitting payload:', payload);

    try {
      const form = new URLSearchParams();
      Object.entries(payload).forEach(([k, v]) => form.append(k, String(v ?? '')));

      // Use no-cors for Apps Script endpoints that don't return CORS headers
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString(),
      });

      console.log('ContactForm submission successful');
      setSuccess(true);
      setLoading(false);

      // Give a short delay so user sees the success state, then proceed
      setTimeout(() => {
        console.log('ContactForm calling onNext with:', { name: payload.name, phone: payload.phone, email: payload.email, city: payload.city, type: payload.type });
        if (onNext) onNext({ name: payload.name, phone: payload.phone, email: payload.email, city: payload.city, type: payload.type });
      }, 600);
    } catch (err) {
      console.error('ContactForm submit error', err);
      setLoading(false);
      setError('Unable to submit form. Please try again later.');
    }
  };

  if (success) {
    return (
      <div className="contact-form-container">
        <div className="success-message">
          <div className="success-card">
            <h3>Thank you!</h3>
            <p>Your details have been received. Proceeding…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-form-container">
      <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
        <div className="form-group">
          <label htmlFor="contact-name">Name *</label>
          <input 
            id="contact-name"
            type="text"
            placeholder="Enter your name"
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
          />
          {fieldErrors.name && <div className="field-error">{fieldErrors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="contact-phone">Phone *</label>
          <input 
            id="contact-phone"
            type="tel"
            placeholder="Enter your phone number"
            value={number} 
            onChange={e => setNumber(e.target.value)} 
            required 
            inputMode="tel" 
          />
          {fieldErrors.number && <div className="field-error">{fieldErrors.number}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="contact-email">Email (optional)</label>
          <input 
            id="contact-email"
            type="email" 
            placeholder="Enter your email"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact-city">City *</label>
          <input 
            id="contact-city"
            type="text"
            placeholder="Enter your city"
            value={city} 
            onChange={e => setCity(e.target.value)} 
            required 
          />
          {fieldErrors.city && <div className="field-error">{fieldErrors.city}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="contact-type">Type *</label>
          <select 
            id="contact-type"
            value={type} 
            onChange={e => setType(e.target.value)} 
            required
          >
            <option value="">-- Select Type --</option>
            <option value="parent">Parent</option>
            <option value="teacher">Teacher</option>
            <option value="school">School</option>
            <option value="franchise">Franchise</option>
            <option value="coordinator">Coordinator</option>
          </select>
          {fieldErrors.type && <div className="field-error">{fieldErrors.type}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="contact-message">Message / Notes</label>
          <textarea 
            id="contact-message"
            placeholder="Enter any additional information"
            value={content} 
            onChange={e => setContent(e.target.value)} 
            rows={3} 
          />
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions">
          <button 
            type="button" 
            onClick={(e) => {
              console.log('Cancel button clicked');
              e.preventDefault();
              e.stopPropagation();
              if (onClose) onClose();
            }} 
            className="btn btn-cancel"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading || !name.trim() || !number.trim() || !city.trim() || !type} 
            className="btn btn-submit"
            onClick={(e) => {
              console.log('Submit button clicked', { loading, name, number, city, type });
            }}
          >
            {loading ? 'Submitting…' : 'Submit & Continue'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ContactForm;
 
