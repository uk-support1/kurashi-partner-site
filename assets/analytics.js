/* Shared GA4 bootstrap. Load synchronously once in the head, before other tags. */
(() => {
  'use strict';
  if (window.kurashiGa4Initialized) return;
  window.kurashiGa4Initialized = true;

  const measurementId = 'G-28D2LPB1XC';
  const disableKey = 'ga-disable-' + measurementId;
  // Host-only + Path=/; intentionally NOT shared with cat.kurashi-partner-ku.com.
  const cookieName = '__Host-kurashi-analytics-preference';
  const signalKey = 'kurashi:analytics-preference';
  const maxAge = 365 * 24 * 60 * 60;
  const externallyDisabled = window[disableKey] === true;
  let failClosed = false;
  let googleTagStarted = false;
  let notice = '';

  function readPreference() {
    try {
      const entry = document.cookie.split(';').map(part => part.trim())
        .find(part => part.startsWith(cookieName + '='));
      return entry ? entry.slice(cookieName.length + 1) : '';
    } catch (_) {
      failClosed = true;
      return '';
    }
  }

  function savePreference(value) {
    try {
      const expires = new Date(Date.now() + maxAge * 1000).toUTCString();
      document.cookie = cookieName + '=' + value + '; Path=/; Max-Age=' + maxAge
        + '; Expires=' + expires + '; SameSite=Lax; Secure';
      return readPreference() === value;
    } catch (_) {
      return false;
    }
  }

  // Preserve the original encoding, duplicate keys and hash of OTHER parameters.
  function cleanOperationUrl(url) {
    const parts = url.search.slice(1).split('&').filter(part => {
      try {
        return decodeURIComponent(part.split('=')[0].replace(/\+/g, ' ')) !== 'analytics';
      } catch (_) {
        return true;
      }
    });
    const search = parts.length && parts.join('&') ? '?' + parts.join('&') : '';
    try {
      history.replaceState(history.state, '', url.pathname + search + url.hash);
    } catch (_) {
      notice += ' URLを更新できませんでした。アドレスからanalyticsパラメータを取り除いてください。';
    }
  }

  const url = new URL(window.location.href);
  const operations = url.searchParams.getAll('analytics');
  // When contradictory parameters are supplied, privacy takes priority.
  const operation = operations.includes('off') ? 'off' : operations.includes('on') ? 'on' : '';
  if (operation) {
    // Fail closed even when persistence fails: no GA4 requests on this access.
    const saved = savePreference(operation === 'off' ? 'off' : 'on');
    failClosed = !saved;
    if (saved) {
      notice = operation === 'off'
        ? 'このブラウザはアクセス解析から除外されました'
        : 'アクセス解析の除外設定を解除しました';
    } else {
      notice = '除外設定を保存できませんでした。このページの計測は停止しています。ブラウザのCookie設定をご確認のうえ、再設定してください。';
    }
    cleanOperationUrl(url);
  }

  function updateDisableFlag() {
    const preference = readPreference();
    window[disableKey] = externallyDisabled || failClosed || preference === 'off';
  }
  // This executes BEFORE creating/loading gtag.js or queuing any GA4 config.
  updateDisableFlag();

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    if (!window[disableKey]) window.dataLayer.push(arguments);
  };

  function startAnalytics() {
    if (window[disableKey] || googleTagStarted) return;
    googleTagStarted = true;
    window.gtag('js', new Date());
    window.gtag('config', measurementId);
    const googleTag = document.createElement('script');
    googleTag.async = true;
    googleTag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.appendChild(googleTag);
  }

  function synchronizeTabs() {
    updateDisableFlag();
    startAnalytics();
  }
  // Notify other open pages on the SAME origin without widening cookie scope.
  window.addEventListener('storage', event => {
    if (event.key === signalKey) synchronizeTabs();
  });
  window.addEventListener('focus', synchronizeTabs);
  window.addEventListener('pageshow', synchronizeTabs);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') synchronizeTabs();
  });
  if (operation && !failClosed) {
    try {
      window.localStorage.setItem(signalKey, operation + ':' + Date.now());
    } catch (_) {
      // Cookie remains authoritative. Focus/pageshow also refresh other tabs.
    }
  }

  if (notice) {
    const showNotice = () => {
      const message = document.createElement('div');
      message.id = 'kurashi-analytics-notice';
      message.setAttribute('role', 'status');
      message.setAttribute('aria-live', 'polite');
      message.setAttribute('aria-atomic', 'true');
      message.style.cssText = 'position:fixed;z-index:10000;left:16px;right:16px;bottom:20px;'
        + 'max-width:480px;margin:0 auto;padding:14px 18px;border-radius:8px;'
        + 'background:#073e4a;color:#fff;box-shadow:0 4px 20px #0002;'
        + 'font:14px/1.7 system-ui,sans-serif;pointer-events:none;';
      message.textContent = notice;
      document.body.appendChild(message);
      window.setTimeout(() => message.remove(), failClosed ? 9000 : 6000);
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showNotice, { once: true });
    } else {
      showNotice();
    }
  }
  startAnalytics();
})();
