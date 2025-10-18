import React, { useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  const phoneNumber = '919168756060';
  const message = 'Hello Shraddha Institute, I have a question about...';

  useEffect(() => {
    // Suppress cross-origin script errors (like Interakt SDK)
    const handleWindowError = (event) => {
      if (event.message === 'Script error.') {
        event.preventDefault();
        console.log('⚠️ Ignored cross-origin script error (Interakt SDK)');
      }
    };
    window.addEventListener('error', handleWindowError);

    // Load Interakt script safely
    const loadInterakt = () => {
      if (document.getElementById('interakt-sdk')) return;

      const script = document.createElement('script');
      script.id = 'interakt-sdk';
      script.src = `https://app.interakt.ai/kiwi-sdk/kiwi-sdk-17-prod-min.js?v=${Date.now()}`;
      script.async = true;

      script.onload = () => {
        try {
          if (window.kiwi && typeof window.kiwi.init === 'function') {
            window.kiwi.init('', 'eJQ3YyKDLju261zI8MqCmSt17oTUsRQO', {});
            console.log('✅ Interakt loaded and initialized');
          }
        } catch (err) {
          console.warn('⚠️ Interakt init failed:', err);
        }
      };

      script.onerror = () => {
        console.warn('⚠️ Interakt script failed to load.');
      };

      document.body.appendChild(script);
    };

    if (document.readyState === 'complete') {
      loadInterakt();
    } else {
      window.addEventListener('load', loadInterakt);
    }

    return () => {
      window.removeEventListener('error', handleWindowError);
      window.removeEventListener('load', loadInterakt);
    };
  }, []);

  return (
    <>
      
      <a
        href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
        className="whatsapp-button"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Shraddha Institute on WhatsApp"
        title="Chat with Shraddha Institute on WhatsApp"
      >
        <FaWhatsapp className="whatsapp-icon" aria-hidden="true" />
      </a>
    </>
  );
};

export default WhatsAppButton;
