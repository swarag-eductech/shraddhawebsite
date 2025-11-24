import React, { useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import './WhatsAppButton.css';

const WhatsAppButton = () => {
  const phoneNumber = '919168756060';
  const message = 'Hi';

  useEffect(() => {
    // Suppress cross-origin script errors (optional)
    const handleWindowError = (event) => {
      if (event && event.message === 'Script error.') {
        event.preventDefault();
        // ignore noisy cross-origin script errors
      }
    };
    window.addEventListener('error', handleWindowError);

    const loadInterakt = () => {
      if (document.getElementById('interakt-sdk')) return;

      const script = document.createElement('script');
      script.id = 'interakt-sdk';
      script.src = `https://app.interakt.ai/kiwi-sdk/kiwi-sdk-17-prod-min.js?v=${Date.now()}`;
      script.async = true;

      script.onload = () => {
        try {
          const win = window;
          if (win.kiwi && typeof win.kiwi.init === 'function') {
            // Prevent Interakt from automatically showing its widget or
            // overriding your WhatsApp message/link by disabling widget display.
            win.kiwi.init('', 'eJQ3YyKDLju261zI8MqCmSt17oTUsRQO', { displayWidget: false });
            console.log('✅ Interakt loaded and initialized (widget display disabled)');
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

  const waLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      
    >
      <FaWhatsapp className="whatsapp-icon" />
    </a>
  );
};

export default WhatsAppButton;
