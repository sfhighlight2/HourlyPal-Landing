// js/main.js
import { computeNavState } from './nav.js';

function initNav() {
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  function onScroll() {
    const state = computeNavState(window.scrollY);
    header.classList.toggle('is-condensed', state === 'condensed');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

initNav();
