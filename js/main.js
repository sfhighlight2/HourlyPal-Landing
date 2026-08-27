// js/main.js
import { computeNavState } from './nav.js';
import { countUpValue } from './counter.js';
import { nextAccordionIndex } from './accordion.js';
import { isValidEmail } from './validate.js';

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

function initFaq() {
  const items = Array.from(document.querySelectorAll('.faq-item'));
  let openIndex = null;

  items.forEach((item, index) => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
      openIndex = nextAccordionIndex(openIndex, index);

      items.forEach((otherItem, otherIndex) => {
        const isOpen = otherIndex === openIndex;
        const otherQuestion = otherItem.querySelector('.faq-question');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        otherQuestion.setAttribute('aria-expanded', String(isOpen));
        otherAnswer.style.maxHeight = isOpen ? `${otherAnswer.scrollHeight}px` : '0px';
      });
    });
  });
}

initFaq();

function initPricingToggle() {
  const toggle = document.getElementById('pricingToggle');
  if (!toggle) return;
  const buttons = Array.from(toggle.querySelectorAll('button'));

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const plan = button.dataset.plan;
      buttons.forEach((b) => {
        const active = b === button;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      toggle.classList.toggle('year', plan === 'year');
      document.querySelectorAll('.price-amount').forEach((el) => {
        el.hidden = el.dataset.plan !== plan;
      });
    });
  });
}

initPricingToggle();

function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  const input = document.getElementById('newsletterEmail');
  const message = document.getElementById('newsletterMessage');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!isValidEmail(input.value)) {
      message.textContent = 'Please enter a valid email address.';
      message.className = 'form-message is-error';
      return;
    }
    message.textContent = "You're on the list — thanks for signing up!";
    message.className = 'form-message is-success';
    form.reset();
  });
}

initNewsletter();

function initServiceCarousel() {
  const track = document.getElementById('serviceTrack');
  if (!track) return;
  const prev = document.querySelector('.carousel-prev');
  const next = document.querySelector('.carousel-next');

  const step = () => {
    const card = track.querySelector('.service-card');
    if (!card) return track.clientWidth;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return card.offsetWidth + gap;
  };

  const updateArrows = () => {
    // Snap can settle a few px in (track padding), so use a small tolerance.
    const maxScroll = track.scrollWidth - track.clientWidth;
    prev.disabled = track.scrollLeft <= 8;
    next.disabled = track.scrollLeft >= maxScroll - 8;
  };

  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  track.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows, { passive: true });
  updateArrows();
}

initServiceCarousel();

function initScrollReveals() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = Array.from(document.querySelectorAll('.reveal'));

  // Content is visible by default. Only opt into the animated state when we can
  // both animate (motion allowed) and observe (IntersectionObserver present).
  if (reduceMotion || !('IntersectionObserver' in window)) {
    return;
  }

  // Enables the hidden start-state CSS (.js .reveal { opacity: 0 }).
  document.documentElement.classList.add('js');

  const reveal = (el) => el.classList.add('is-in');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        reveal(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  revealEls.forEach((el) => observer.observe(el));

  // Failsafe: never leave content hidden. If anything stalls (background tab,
  // headless render), reveal everything after a short window.
  window.setTimeout(() => revealEls.forEach(reveal), 2500);
}

initScrollReveals();
