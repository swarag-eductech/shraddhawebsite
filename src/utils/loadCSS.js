export const loadCSS = (path) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = path;
  link.crossOrigin = 'anonymous';
  link.setAttribute('data-cache-control', 'public, max-age=31536000'); // 1 year

  // Add CSS file based on document readiness
  if (document.readyState === 'complete') {
    document.head.appendChild(link);
  } else {
    window.addEventListener('load', () => {
      document.head.appendChild(link);
    });
  }
};

