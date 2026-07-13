// js/main.js
import { computeNavState } from './nav.js';
import { countUpValue } from './counter.js';

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

function initCounters() {
  const els = document.querySelectorAll('.stat-number');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  els.forEach((el) => {
    const target = Number(el.dataset.countTo);
    const decimals = Number(el.dataset.decimals || 0);
    const divisor = Math.pow(10, decimals);

    const render = (value) => {
      el.textContent = (value / divisor).toFixed(decimals);
    };

    if (reduceMotion) {
      render(target);
      return;
    }

    let started = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          started = true;
          const duration = 1200;
          const startTime = performance.now();
          function frame(now) {
            const elapsed = now - startTime;
            render(countUpValue(elapsed, duration, 0, target));
            if (elapsed < duration) requestAnimationFrame(frame);
          }
          requestAnimationFrame(frame);
          observer.disconnect();
        }
      });
    }, { threshold: 0.4 });
    observer.observe(el);
  });
}

initCounters();
