/* Shared Google tag (gtag.js). Include this file once in each page's <head>. */
(() => {
  if (window.kurashiGa4Initialized) return;
  window.kurashiGa4Initialized = true;

  const measurementId = 'G-28D2LPB1XC';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId);

  const googleTag = document.createElement('script');
  googleTag.async = true;
  googleTag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  document.head.appendChild(googleTag);
})();
