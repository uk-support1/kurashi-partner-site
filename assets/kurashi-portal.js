(() => {
  'use strict';
  const button = document.querySelector('.menu-button');
  const nav = document.querySelector('.main-navigation');
  if (button && nav) {
    document.documentElement.classList.add('menu-ready');
    const closeMenu = (returnFocus = false) => {
      const wasOpen = button.getAttribute('aria-expanded') === 'true';
      nav.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
      if (returnFocus && wasOpen) button.focus();
    };
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', event => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu(true);
    });
    document.addEventListener('click', event => {
      if (!event.target.closest('.site-header')) closeMenu();
    });
    document.addEventListener('focusin', event => {
      if (!event.target.closest('.site-header')) closeMenu();
    });
    matchMedia('(min-width: 901px)').addEventListener('change', () => closeMenu());
  }
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(item => observer.observe(item));
    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) observer.disconnect();
    });
  }
})();
