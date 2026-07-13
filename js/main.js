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
    const answer = item.querySelector('.faq-answer');

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

function initScrollReveals() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');

  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  revealEls.forEach((el) => {
    const siblingIndex = Array.from(el.parentElement.children).indexOf(el);
    gsap.set(el, { opacity: 0, y: 24 });
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      delay: (siblingIndex % 4) * 0.08,
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    img.addEventListener('load', () => ScrollTrigger.refresh());
  });
}

initScrollReveals();
