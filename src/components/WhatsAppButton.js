import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import './WhatsAppButton.css';

const WhatsAppButton = () => {
  const phoneNumber = '919168756060'; // Use the same number as Footer
  const message = 'Hello Shraddha Institute, I have a question about...'; // Optional pre-filled message

  return (
    <a 
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      className="whatsapp-button"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Shraddha Institute on WhatsApp"
      title="Chat with Shraddha Institute on WhatsApp"
    >
      <FaWhatsapp className="whatsapp-icon" aria-hidden="true" />
      <span className="whatsapp-text"></span>
    </a>
  );
};

export default WhatsAppButton;