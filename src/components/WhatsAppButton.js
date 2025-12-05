import { useEffect } from 'react';
import './WhatsAppButton.css';

const WhatsAppButton = () => {
  // Interakt handles the widget and message; no local anchor is rendered.

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
            // Initialize Interakt and show its widget (we'll rely on Interakt for
            // the floating WhatsApp UI). The component no longer renders a
            // custom floating anchor/button to avoid duplicates.
            win.kiwi.init('', 'eJQ3YyKDLju261zI8MqCmSt17oTUsRQO', { displayWidget: true });
            console.log('✅ Interakt loaded and initialized (widget display enabled)');
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

  // This component's job is just to inject/initialize the Interakt SDK.
  // We don't render any anchor/button here to avoid overlapping UI with
  // the Interakt widget (the widget itself will be shown by the SDK).
  return null;
};

export default WhatsAppButton;
