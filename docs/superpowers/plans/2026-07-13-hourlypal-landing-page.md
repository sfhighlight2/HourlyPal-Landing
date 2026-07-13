# HourlyPal Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full, animated, single-page marketing site for HourlyPal (`index.html` + `css/style.css` + `js/*.js`) using the real HourlyPal brand (navy/teal, Inter, logo, and actual app screenshots), matching the spec at `docs/superpowers/specs/2026-07-13-hourlypal-landing-page-design.md`.

**Architecture:** Plain static HTML/CSS/JS, no build step. One `index.html` with all sections, one `css/style.css`, and small ES modules under `js/` — most are pure, framework-free DOM wiring, but four small logic units (nav scroll state, count-up easing, accordion toggle, email validation) are genuinely testable and get real unit tests via Node's built-in test runner (`node --test`). GSAP + ScrollTrigger are loaded from a CDN as global scripts; `js/main.js` (an ES module) consumes the `gsap`/`ScrollTrigger` globals and wires scroll-reveals, the sticky nav, count-up stats, and the FAQ accordion.

**Tech Stack:** HTML5, CSS3 (custom properties, Grid/Flexbox), vanilla JS (ES modules), GSAP 3 + ScrollTrigger (CDN), Google Fonts (Inter), Node.js built-in test runner for the pure-logic modules.

**Testing note:** This is a static marketing page — most tasks are markup/CSS with no business logic, so "test" for those tasks means a concrete grep/structural check plus a manual browser check (described in each step), not a unit test. The four modules that contain actual branching logic (`js/nav.js`, `js/counter.js`, `js/accordion.js`, `js/validate.js`) get real TDD: a failing test first, then the implementation.

---

## File Structure

```
index.html                  All page sections (single file)
css/style.css                All styles: variables, reset, components, sections, responsive
js/nav.js                    Pure: computeNavState(scrollY, threshold)
js/nav.test.mjs              Unit tests for nav.js
js/counter.js                Pure: countUpValue(elapsed, duration, start, end)
js/counter.test.mjs          Unit tests for counter.js
js/accordion.js              Pure: nextAccordionIndex(currentOpen, clickedIndex)
js/accordion.test.mjs        Unit tests for accordion.js
js/validate.js                Pure: isValidEmail(value)
js/validate.test.mjs          Unit tests for validate.js
js/main.js                    DOM wiring: imports the four modules above, drives GSAP, nav, accordion, counters, mobile menu, reduced-motion
assets/logo.png                (already committed)
assets/screens/*.png           (already committed — 8 real app screenshots)
```

Run all unit tests at any time with:
```bash
node --test js/*.test.mjs
```

---

### Task 1: Project scaffold — HTML skeleton, fonts, CSS variables & reset

**Files:**
- Create: `index.html`
- Create: `css/style.css`

- [ ] **Step 1: Write `index.html` skeleton**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HourlyPal — Trusted local help, by the hour.</title>
  <meta name="description" content="HourlyPal connects you with background-checked local Pals for errands, training, tutoring, gardening, tours, and more. Book by the hour, message privately, pay simply.">
  <link rel="icon" href="assets/logo.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body id="top">
  <!-- sections are added in later tasks -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write `css/style.css` variables, reset, and base typography**

```css
:root {
  --teal: #00B8A9;
  --teal-dark: #008B7F;
  --navy: #0A2540;
  --white: #FFFFFF;
  --surface: #F4F6F8;
  --border: #E5E7EB;
  --text-secondary: #6B7280;
  --text-muted: #9CA3AF;
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
  --radius-sm: 12px;
  --radius-lg: 20px;
  --radius-pill: 999px;
  --shadow-card: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06);
  --shadow-teal: 0 4px 20px rgba(0,184,169,0.25);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.12);
  --container: 1160px;
  --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--font);
  color: var(--navy);
  background: var(--white);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}
img { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }
ul { list-style: none; }
button { font-family: inherit; cursor: pointer; background: none; border: none; }

.container { max-width: var(--container); margin: 0 auto; padding: 0 24px; }
section { padding: 96px 0; }
@media (max-width: 768px) { section { padding: 64px 0; } }

h1, h2, h3 { font-weight: 800; letter-spacing: -0.02em; color: var(--navy); }
h1 { font-size: clamp(2.2rem, 5vw, 3.6rem); line-height: 1.05; }
h2 { font-size: clamp(1.8rem, 3.6vw, 2.6rem); line-height: 1.15; }
h3 { font-size: 1.15rem; }
p { color: var(--text-secondary); }

.eyebrow {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--teal-dark);
  background: rgba(0,184,169,0.1);
  border: 1px solid rgba(0,184,169,0.25);
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  margin-bottom: 16px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: var(--radius-pill);
  font-weight: 700;
  font-size: 0.95rem;
  transition: transform .15s ease, box-shadow .15s ease, opacity .15s ease, background .15s ease, color .15s ease;
}
.btn-primary { background: linear-gradient(135deg, var(--teal), var(--teal-dark)); color: #fff; box-shadow: var(--shadow-teal); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,184,169,0.35); }
.btn-secondary { background: #fff; color: var(--navy); border: 1.5px solid var(--navy); }
.btn-secondary:hover { background: var(--navy); color: #fff; }
.btn-ghost-light { background: rgba(255,255,255,0.08); color: #fff; border: 1.5px solid rgba(255,255,255,0.3); }
.btn-ghost-light:hover { background: rgba(255,255,255,0.16); }

.phone-frame {
  position: relative;
  width: 280px;
  margin: 0 auto;
  border-radius: 36px;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  border: 8px solid var(--navy);
  background: var(--navy);
}
.phone-frame img { width: 100%; height: auto; }

.reveal { }
.reveal-visible { }
```

- [ ] **Step 3: Verify structurally**

Run: `grep -c '<link rel="stylesheet" href="css/style.css">' index.html`
Expected: `1`

Run: `grep -c ':root' css/style.css`
Expected: `1`

Open `index.html` directly in a browser (double-click, or `open index.html` on macOS) and confirm: blank page loads with no console errors, tab title reads "HourlyPal — Trusted local help, by the hour."

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "Add base HTML skeleton and CSS design tokens"
```

---

### Task 2: Sticky nav + announcement bar + mobile menu (with TDD for scroll-state logic)

**Files:**
- Create: `js/nav.js`
- Create: `js/nav.test.mjs`
- Modify: `index.html` (add `<header>`)
- Modify: `css/style.css` (append nav styles)
- Modify: `js/main.js` (create if not present)

- [ ] **Step 1: Write the failing test**

```js
// js/nav.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeNavState } from './nav.js';

test('returns "default" at the top of the page', () => {
  assert.equal(computeNavState(0), 'default');
});

test('returns "default" right at the threshold', () => {
  assert.equal(computeNavState(40, 40), 'default');
});

test('returns "condensed" once scrolled past the threshold', () => {
  assert.equal(computeNavState(41, 40), 'condensed');
});

test('uses a default threshold of 40 when not provided', () => {
  assert.equal(computeNavState(100), 'condensed');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test js/nav.test.mjs`
Expected: FAIL — `Cannot find module './nav.js'`

- [ ] **Step 3: Write minimal implementation**

```js
// js/nav.js
export function computeNavState(scrollY, threshold = 40) {
  return scrollY > threshold ? 'condensed' : 'default';
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test js/nav.test.mjs`
Expected: PASS (4 tests)

- [ ] **Step 5: Add the header markup to `index.html`**

Insert immediately after `<body id="top">`:

```html
<header class="site-header" id="siteHeader">
  <div class="announcement-bar">
    🎉 New: Get 2 months free when you join HourlyPal today.
  </div>
  <nav class="nav container">
    <a href="#top" class="nav-logo">
      <img src="assets/logo.png" alt="HourlyPal" width="36" height="36">
      <span>HourlyPal</span>
    </a>
    <button class="nav-toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="navLinks">
      <span></span><span></span><span></span>
    </button>
    <ul class="nav-links" id="navLinks">
      <li><a href="#how-it-works">How it Works</a></li>
      <li><a href="#be-a-pal">Be a Pal</a></li>
      <li><a href="#hire-a-pal">Hire a Pal</a></li>
      <li><a href="#pricing">Pricing</a></li>
      <li><a href="#faq">FAQ</a></li>
    </ul>
    <a href="#download" class="btn btn-primary nav-cta">Download App</a>
  </nav>
</header>
```

- [ ] **Step 6: Add nav styles to `css/style.css`**

```css
.site-header { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); transition: box-shadow .2s ease, padding .2s ease; }
.site-header.is-condensed { box-shadow: 0 2px 16px rgba(0,0,0,0.08); }

.announcement-bar {
  background: var(--navy);
  color: #fff;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 8px 16px;
}

.nav { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; gap: 24px; }
.nav-logo { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 1.1rem; }
.nav-logo img { border-radius: 8px; }

.nav-links { display: flex; align-items: center; gap: 28px; font-size: 0.9rem; font-weight: 600; }
.nav-links a:hover { color: var(--teal-dark); }

.nav-toggle { display: none; flex-direction: column; gap: 4px; width: 28px; }
.nav-toggle span { height: 2px; background: var(--navy); border-radius: 2px; }

@media (max-width: 860px) {
  .nav-toggle { display: flex; }
  .nav-links {
    position: absolute;
    top: 100%; left: 0; right: 0;
    background: #fff;
    flex-direction: column;
    align-items: flex-start;
    padding: 16px 24px;
    gap: 16px;
    box-shadow: var(--shadow-card);
    display: none;
  }
  .nav-links.is-open { display: flex; }
  .nav-cta { display: none; }
}
```

- [ ] **Step 7: Wire it up in `js/main.js`**

```js
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
```

- [ ] **Step 8: Verify in browser**

Run: `open index.html` (or refresh if already open)
Expected: Sticky header with navy announcement bar on top; scrolling down adds a shadow under the nav; on a narrow window (<860px) the links collapse behind a hamburger button that toggles open/closed.

- [ ] **Step 9: Commit**

```bash
git add js/nav.js js/nav.test.mjs index.html css/style.css js/main.js
git commit -m "Add sticky nav, announcement bar, and mobile menu"
```

---

### Task 3: Hero section

**Files:**
- Modify: `index.html` (add `<section id="hero">` after `</header>`)
- Modify: `css/style.css` (append hero styles)

- [ ] **Step 1: Add hero markup**

```html
<section class="hero" id="hero">
  <div class="container hero-grid">
    <div class="hero-copy">
      <span class="eyebrow">Now booking in your area</span>
      <h1>Trusted local help,<br>by the hour.</h1>
      <p class="hero-sub">HourlyPal connects you with background-checked local Pals for errands, training, tutoring, gardening, tours, and more. Book by the hour, message privately, and pay simply.</p>
      <div class="hero-ctas">
        <a href="#download" class="btn btn-primary">Download the App</a>
        <a href="#how-it-works" class="btn btn-secondary">See How it Works</a>
      </div>
      <div class="hero-badges">
        <span>✓ Background-checked Pals</span>
        <span>✓ Private, alias-based messaging</span>
        <span>✓ Book by the hour</span>
      </div>
    </div>
    <div class="hero-visual reveal">
      <div class="hero-blob" aria-hidden="true"></div>
      <div class="phone-frame">
        <img src="assets/screens/11-client-home.png" alt="HourlyPal app showing nearby Pals to hire" loading="eager">
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add hero styles**

```css
.hero { padding-top: 72px; position: relative; overflow: hidden; }
.hero-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 48px; align-items: center; }
.hero-sub { font-size: 1.05rem; margin: 20px 0 28px; max-width: 480px; }
.hero-ctas { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 28px; }
.hero-badges { display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); }

.hero-visual { position: relative; display: flex; justify-content: center; }
.hero-blob {
  position: absolute;
  width: 420px; height: 420px;
  background: radial-gradient(circle at 30% 30%, rgba(0,184,169,0.25), transparent 70%);
  filter: blur(10px);
  z-index: 0;
}
.hero-visual .phone-frame { position: relative; z-index: 1; animation: float 5s ease-in-out infinite; }
.hero-blob { animation: pulse 6s ease-in-out infinite; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
}
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.08); opacity: 0.85; }
}
@media (prefers-reduced-motion: reduce) {
  .hero-visual .phone-frame, .hero-blob { animation: none; }
}

@media (max-width: 900px) {
  .hero-grid { grid-template-columns: 1fr; text-align: center; }
  .hero-ctas, .hero-badges { align-items: center; }
  .hero-sub { margin-left: auto; margin-right: auto; }
  .hero-visual { margin-top: 24px; }
}
```

- [ ] **Step 3: Verify structurally**

Run: `grep -c 'id="hero"' index.html`
Expected: `1`

Open in browser: two-column hero on desktop (copy left, phone screenshot right with a soft pulsing teal glow behind it, and the phone gently floating up and down); single column, centered, on a narrow window. With OS "reduce motion" enabled, the float/pulse animations stop.

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "Add hero section"
```

---

### Task 4: Stats strip with animated count-up (TDD for the easing function)

**Files:**
- Create: `js/counter.js`
- Create: `js/counter.test.mjs`
- Modify: `index.html`
- Modify: `css/style.css`
- Modify: `js/main.js`

- [ ] **Step 1: Write the failing test**

```js
// js/counter.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countUpValue } from './counter.js';

test('returns the start value at elapsed = 0', () => {
  assert.equal(countUpValue(0, 1000, 0, 500), 0);
});

test('returns the end value once elapsed reaches the duration', () => {
  assert.equal(countUpValue(1000, 1000, 0, 500), 500);
});

test('clamps to the end value if elapsed exceeds the duration', () => {
  assert.equal(countUpValue(5000, 1000, 0, 500), 500);
});

test('eases out (progress is ahead of linear at the midpoint)', () => {
  const value = countUpValue(500, 1000, 0, 500);
  assert.equal(value, 438); // ease-out cubic at t=0.5 -> 0.875 -> round(437.5)
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test js/counter.test.mjs`
Expected: FAIL — `Cannot find module './counter.js'`

- [ ] **Step 3: Write minimal implementation**

```js
// js/counter.js
export function countUpValue(elapsed, duration, start, end) {
  const t = Math.min(Math.max(elapsed / duration, 0), 1);
  const eased = 1 - Math.pow(1 - t, 3);
  return Math.round(start + (end - start) * eased);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test js/counter.test.mjs`
Expected: PASS (4 tests)

- [ ] **Step 5: Add stats markup to `index.html`** (after the hero section)

```html
<section class="stats">
  <div class="container stats-grid">
    <div class="stat reveal">
      <span class="stat-number" data-count-to="500">0</span>+
      <p>Verified Pals</p>
    </div>
    <div class="stat reveal">
      <span class="stat-number" data-count-to="12">0</span>
      <p>Cities & growing</p>
    </div>
    <div class="stat reveal">
      <span class="stat-number" data-count-to="48" data-decimals="1">0</span>
      <p>Average rating</p>
    </div>
  </div>
  <p class="stats-note">Placeholder figures — replace with real numbers before launch.</p>
</section>
```

Note: the rating stat counts to `48` with `data-decimals="1"` so the display divides by 10 (i.e. renders "4.8").

- [ ] **Step 6: Add stats styles**

```css
.stats { background: var(--surface); text-align: center; padding: 64px 0; }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
.stat-number { font-size: 2.6rem; font-weight: 800; color: var(--navy); font-variant-numeric: tabular-nums; }
.stat p { margin-top: 4px; font-weight: 600; color: var(--text-secondary); }
.stats-note { text-align: center; margin-top: 24px; font-size: 0.75rem; color: var(--text-muted); }
@media (max-width: 700px) { .stats-grid { grid-template-columns: 1fr; gap: 24px; } }
```

- [ ] **Step 7: Wire the count-up animation in `js/main.js`**

Add `import { countUpValue } from './counter.js';` to the top of `js/main.js`, next to the existing `import { computeNavState } from './nav.js';` line. Then append the following function and call to the end of the file (after `initNav();`):

```js
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
```

- [ ] **Step 8: Verify in browser**

Run: `open index.html`, scroll to the stats strip.
Expected: Numbers animate up from 0 to 500 / 12 / 4.8 once the section scrolls into view; with "reduce motion" enabled in OS accessibility settings, numbers appear instantly at their final value.

- [ ] **Step 9: Commit**

```bash
git add js/counter.js js/counter.test.mjs index.html css/style.css js/main.js
git commit -m "Add animated stats strip with count-up"
```

---

### Task 5: Feature showcase section

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`

- [ ] **Step 1: Add markup**

```html
<section class="features" id="features">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">Why HourlyPal</span>
      <h2>Everything you need to hire — or become — a Pal</h2>
    </div>
    <div class="features-grid">
      <div class="feature-list">
        <div class="feature-item reveal">
          <h3>✓ Verified profiles</h3>
          <p>Every Pal is background-checked before their profile goes live, with a visible verified badge.</p>
        </div>
        <div class="feature-item reveal">
          <h3>💬 Private messaging</h3>
          <p>Chat by alias, not real name — messaging unlocks only after a booking is accepted.</p>
        </div>
        <div class="feature-item reveal">
          <h3>⭐ Ratings & reviews</h3>
          <p>Every completed booking can be rated, so trust builds with every job.</p>
        </div>
        <div class="feature-item reveal">
          <h3>🗓️ Flexible scheduling</h3>
          <p>Pals set their own hours and rate; Clients book morning, afternoon, or evening slots.</p>
        </div>
      </div>
      <div class="features-visual reveal">
        <div class="phone-frame phone-frame-back">
          <img src="assets/screens/17-messages-list.png" alt="Private in-app messaging between a Client and a Pal" loading="lazy">
        </div>
        <div class="phone-frame phone-frame-front">
          <img src="assets/screens/14-pal-detail.png" alt="A verified Pal profile with rating and reviews" loading="lazy">
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add styles**

```css
.section-head { max-width: 640px; margin-bottom: 48px; }
.features-grid { display: grid; grid-template-columns: 1fr 0.8fr; gap: 48px; align-items: center; }
.feature-item { padding: 20px 0; border-bottom: 1px solid var(--border); }
.feature-item:last-child { border-bottom: none; }
.feature-item h3 { margin-bottom: 6px; }
.features-visual { position: relative; min-height: 380px; }
.features-visual .phone-frame { width: 220px; position: absolute; }
.phone-frame-back { top: 0; left: 0; opacity: 0.85; }
.phone-frame-front { top: 60px; left: 90px; }
@media (max-width: 900px) {
  .features-grid { grid-template-columns: 1fr; }
  .features-visual { order: -1; min-height: 300px; margin: 0 auto 24px; }
}
```

- [ ] **Step 3: Verify structurally**

Run: `grep -c 'id="features"' index.html`
Expected: `1`

Open in browser: four feature rows next to two overlapping phone screenshots (messages list behind, verified Pal profile in front); stacks to a single column with the phones on top on mobile widths.

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "Add feature showcase section"
```

---

### Task 6: "Be a Pal" section (dark navy band)

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`

- [ ] **Step 1: Add markup**

```html
<section class="be-a-pal" id="be-a-pal">
  <div class="container split-grid">
    <div class="split-visual reveal">
      <div class="phone-frame">
        <img src="assets/screens/12-pal-home.png" alt="Pal requests inbox showing pending bookings" loading="lazy">
      </div>
    </div>
    <div class="split-copy reveal">
      <span class="eyebrow eyebrow-light">For Pals</span>
      <h2>Turn your time into income</h2>
      <ul class="check-list">
        <li>Keep 100% of your hourly rate — HourlyPal earns through subscriptions, not a cut of your pay</li>
        <li>Set your own rate, services, and availability</li>
        <li>Get verified and build trust with a badge on your profile</li>
        <li>Manage every request — accept, decline, message — in one place</li>
      </ul>
      <a href="#download" class="btn btn-ghost-light">Become a Pal</a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add styles**

```css
.be-a-pal { background: var(--navy); color: #fff; }
.be-a-pal h2, .be-a-pal p { color: #fff; }
.split-grid { display: grid; grid-template-columns: 0.8fr 1fr; gap: 48px; align-items: center; }
.eyebrow-light { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.25); color: #7FE3D6; }
.check-list { margin: 24px 0 32px; display: flex; flex-direction: column; gap: 14px; }
.check-list li { position: relative; padding-left: 28px; color: rgba(255,255,255,0.85); }
.check-list li::before { content: '✓'; position: absolute; left: 0; color: var(--teal); font-weight: 800; }
@media (max-width: 900px) { .split-grid { grid-template-columns: 1fr; } .split-visual { order: -1; } }
```

- [ ] **Step 3: Verify structurally**

Run: `grep -c 'id="be-a-pal"' index.html`
Expected: `1`

Open in browser: full-width navy section, phone screenshot of the Pal requests inbox on one side, benefits checklist + "Become a Pal" button on the other.

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "Add Be a Pal section"
```

---

### Task 7: "Hire a Pal" section (light band)

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`

- [ ] **Step 1: Add markup**

```html
<section class="hire-a-pal" id="hire-a-pal">
  <div class="container split-grid split-grid-reverse">
    <div class="split-copy reveal">
      <span class="eyebrow">For Clients</span>
      <h2>Help, on your schedule</h2>
      <ul class="check-list check-list-dark">
        <li>Search by service, location, and availability</li>
        <li>Message privately using an alias — your identity stays yours until you choose to share it</li>
        <li>Book by the hour with no long-term commitment</li>
        <li>Rate and review every completed booking</li>
      </ul>
      <a href="#download" class="btn btn-primary">Hire a Pal</a>
    </div>
    <div class="split-visual reveal">
      <div class="phone-frame">
        <img src="assets/screens/20-search-results.png" alt="Search results showing nearby Pals" loading="lazy">
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add styles**

```css
.hire-a-pal { background: var(--white); }
@media (min-width: 901px) {
  .split-grid-reverse { grid-template-columns: 1fr 0.8fr; }
}
.check-list-dark li { color: var(--text-secondary); }
```

Note: `.split-grid` (from Task 6) sets `grid-template-columns: 0.8fr 1fr` — a narrow first track for the phone visual, wide second track for copy. In this section the DOM order is reversed (copy first, then visual), so without an override the copy would land in the narrow track and the visual in the wide track — backwards. `.split-grid-reverse` flips the column-width assignment (`1fr 0.8fr`) to match the swapped DOM order, so copy still gets the wide track and the visual still gets the narrow track regardless of which side of the DOM they're on. This override is wrapped in `@media (min-width: 901px)` so it only applies above the mobile breakpoint — otherwise, since `.split-grid-reverse` and `.split-grid` have equal CSS specificity and `.split-grid-reverse` would be defined later in the stylesheet, it would incorrectly win over Task 6's `@media (max-width: 900px) { .split-grid { grid-template-columns: 1fr; } }` mobile collapse rule and break single-column stacking on mobile. No `order` property is needed for stacking — Task 6's existing mobile rule `@media (max-width: 900px) { .split-visual { order: -1; } }` is not scoped to `.split-grid` specifically, so it already applies to this section's `.split-visual` too and stacks it on top on mobile, consistent with the Be a Pal section.

- [ ] **Step 3: Verify structurally**

Run: `grep -c 'id="hire-a-pal"' index.html`
Expected: `1`

Open in browser: light section with the copy/checklist on the left and the search-results phone screenshot on the right on desktop; stacks with the phone on top on mobile.

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "Add Hire a Pal section"
```

---

### Task 8: Service categories grid

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`

- [ ] **Step 1: Add markup**

```html
<section class="categories" id="categories">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">Available today</span>
      <h2>Services you can book right now</h2>
    </div>
    <div class="category-grid">
      <div class="category-card reveal">
        <div class="category-icon">🛒</div>
        <h3>Personal Assistant</h3>
        <p>Everyday errands: grocery shopping, pet walking, dry cleaning, chores.</p>
      </div>
      <div class="category-card reveal">
        <div class="category-icon">💪</div>
        <h3>Personal Trainer</h3>
        <p>Physical fitness on your schedule.</p>
      </div>
      <div class="category-card reveal">
        <div class="category-icon">📚</div>
        <h3>Tutor de Jour</h3>
        <p>Your favorite teacher is a click away.</p>
      </div>
      <div class="category-card reveal">
        <div class="category-icon">🌱</div>
        <h3>Green Thumb</h3>
        <p>A helping hand and expert advice with gardening.</p>
      </div>
      <div class="category-card reveal">
        <div class="category-icon">🗺️</div>
        <h3>Tour Guide</h3>
        <p>Show visitors around your favorite places.</p>
      </div>
    </div>
    <p class="categories-note">More services are on the way as HourlyPal expands to new cities.</p>
  </div>
</section>
```

- [ ] **Step 2: Add styles**

```css
.category-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
.category-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px 22px;
  transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
}
.category-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-card); border-color: rgba(0,184,169,0.3); }
.category-icon { font-size: 2rem; margin-bottom: 12px; }
.category-card h3 { margin-bottom: 6px; }
.categories-note { text-align: center; margin-top: 32px; color: var(--text-muted); font-size: 0.9rem; }
```

- [ ] **Step 3: Verify structurally**

Run: `grep -c 'category-card' index.html`
Expected: `5` (one per category)

Open in browser: 5-card responsive grid, each card lifting slightly on hover.

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "Add service categories grid"
```

---

### Task 9: How It Works section

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`

- [ ] **Step 1: Add markup**

```html
<section class="how-it-works" id="how-it-works">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">How it works</span>
      <h2>Simple for Clients. Simple for Pals.</h2>
    </div>
    <div class="how-grid">
      <div class="how-column reveal">
        <h3>As a Client</h3>
        <ol class="step-list">
          <li><strong>Search & filter</strong> — find Pals by service, location, and availability.</li>
          <li><strong>Send a request</strong> — pick a date, a time slot, and add an optional note.</li>
          <li><strong>Message & meet</strong> — chat privately once your Pal accepts.</li>
          <li><strong>Rate & review</strong> — share how it went after the booking is complete.</li>
        </ol>
      </div>
      <div class="how-visual reveal">
        <div class="phone-frame">
          <img src="assets/screens/15-booking-new.png" alt="Sending a new booking request in the HourlyPal app" loading="lazy">
        </div>
      </div>
      <div class="how-column reveal">
        <h3>As a Pal</h3>
        <ol class="step-list">
          <li><strong>Apply & get verified</strong> — complete a profile and background check.</li>
          <li><strong>Set your rate & schedule</strong> — you're always in control.</li>
          <li><strong>Accept requests</strong> — review and accept bookings that fit your availability.</li>
          <li><strong>Get paid</strong> — keep 100% of your hourly rate.</li>
        </ol>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add styles**

```css
.how-it-works { background: var(--surface); }
.how-grid { display: grid; grid-template-columns: 1fr 0.7fr 1fr; gap: 32px; align-items: center; }
.how-column { background: #fff; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 32px; box-shadow: var(--shadow-card); height: 100%; }
.how-column h3 { margin-bottom: 20px; }
.how-visual .phone-frame { width: 220px; }
.step-list { display: flex; flex-direction: column; gap: 16px; counter-reset: step; }
.step-list li { list-style: none; padding-left: 36px; position: relative; }
.step-list li::before {
  counter-increment: step;
  content: counter(step);
  position: absolute; left: 0; top: -2px;
  width: 24px; height: 24px;
  background: var(--teal); color: #fff;
  border-radius: 50%;
  font-size: 0.75rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
@media (max-width: 1000px) {
  .how-grid { grid-template-columns: 1fr 1fr; }
  .how-visual { grid-row: 1; grid-column: 1 / -1; margin: 0 auto 8px; }
}
@media (max-width: 700px) {
  .how-grid { grid-template-columns: 1fr; }
  .how-visual { grid-row: auto; }
}
```

- [ ] **Step 3: Verify structurally**

Run: `grep -c 'class="step-list"' index.html`
Expected: `2`

Open in browser: two step cards (Client / Pal) flanking a phone screenshot of the booking request flow in the middle on desktop; the phone moves above both columns on tablet widths and the whole row stacks to one column on mobile.

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "Add How It Works section"
```

---

### Task 10: Trust & Safety section

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`

- [ ] **Step 1: Add markup**

```html
<section class="trust" id="trust">
  <div class="container trust-grid">
    <div class="reveal">
      <span class="eyebrow eyebrow-light">Safety first</span>
      <h2>Trust comes standard</h2>
      <p class="trust-sub">Every part of HourlyPal is built around a simple idea: you should feel safe hiring — or becoming — a Pal.</p>
    </div>
    <div class="trust-cards">
      <div class="trust-card reveal">
        <h3>✅ Background checks</h3>
        <p>Every Pal is verified before their profile goes live, and a visible badge shows their status.</p>
      </div>
      <div class="trust-card reveal">
        <h3>🔒 In-app messaging</h3>
        <p>Conversations only unlock after a booking is accepted — no phone numbers shared upfront.</p>
      </div>
      <div class="trust-card reveal">
        <h3>🕶️ Alias privacy</h3>
        <p>Your real name stays private; you're known on HourlyPal by the alias you choose.</p>
      </div>
      <div class="trust-card reveal">
        <h3>🚫 Block & report</h3>
        <p>Block or report any user in one tap, right from a conversation.</p>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add styles**

```css
.trust { background: var(--navy); color: #fff; }
.trust h2, .trust h3 { color: #fff; }
.trust-sub { color: rgba(255,255,255,0.75); margin-top: 12px; max-width: 380px; }
.trust-grid { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 40px; align-items: start; }
.trust-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.trust-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: var(--radius-lg); padding: 24px; }
.trust-card p { color: rgba(255,255,255,0.7); margin-top: 8px; }
@media (max-width: 900px) { .trust-grid { grid-template-columns: 1fr; } }
@media (max-width: 600px) { .trust-cards { grid-template-columns: 1fr; } }
```

- [ ] **Step 3: Verify structurally**

Run: `grep -c 'trust-card' index.html`
Expected: `5` (4 `.trust-card` divs plus the `.trust-cards` container)

Open in browser: dark navy section with intro copy on the left and a 2x2 grid of translucent safety cards on the right; single column on narrow screens.

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "Add Trust & Safety section"
```

---

### Task 11: Testimonials section

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`

- [ ] **Step 1: Add markup**

```html
<section class="testimonials" id="testimonials">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">What people are saying</span>
      <h2>Loved by Clients and Pals</h2>
      <p class="placeholder-note">Placeholder quotes — replace with real customer testimonials before launch.</p>
    </div>
    <div class="testimonial-grid">
      <div class="testimonial-card reveal">
        <div class="stars">★★★★★</div>
        <p>"Booking a tutor for my son took five minutes, and the messaging felt safe the whole time."</p>
        <span class="testimonial-name">— Client, New York</span>
      </div>
      <div class="testimonial-card reveal">
        <div class="stars">★★★★★</div>
        <p>"I set my own rate and schedule as a personal trainer, and I keep every dollar I earn."</p>
        <span class="testimonial-name">— Pal, Austin</span>
      </div>
      <div class="testimonial-card reveal">
        <div class="stars">★★★★★</div>
        <p>"The verification badge made me comfortable letting someone into my garden while I was at work."</p>
        <span class="testimonial-name">— Client, Denver</span>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add styles**

```css
.placeholder-note { font-size: 0.8rem; color: var(--text-muted); margin-top: 8px; }
.testimonial-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.testimonial-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 28px; }
.stars { color: var(--warning); letter-spacing: 2px; margin-bottom: 12px; }
.testimonial-card p { color: var(--navy); margin-bottom: 16px; }
.testimonial-name { font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); }
@media (max-width: 900px) { .testimonial-grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 3: Verify structurally**

Run: `grep -c 'class="testimonial-card reveal"' index.html`
Expected: `3`

Open in browser: three quote cards in a row with star ratings; stacked on mobile.

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "Add testimonials section"
```

---

### Task 12: Pricing section

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`

- [ ] **Step 1: Add markup**

```html
<section class="pricing" id="pricing">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">Pricing</span>
      <h2>Simple pricing for Clients and Pals</h2>
      <p>The same plans apply whether you're hiring a Pal or becoming one. Billed through the App Store or Google Play — cancel anytime from your account settings.</p>
    </div>
    <div class="pricing-grid">
      <div class="price-card reveal">
        <h3>Monthly</h3>
        <p class="price">$39<span>/month</span></p>
        <p class="price-trial">Start with 2 months free</p>
        <ul class="check-list check-list-dark">
          <li>Discover or offer help in your area</li>
          <li>Message privately using an alias</li>
          <li>Request or accept bookings by the hour</li>
          <li>Manage everything in one place</li>
        </ul>
        <a href="#download" class="btn btn-secondary">Get Started</a>
      </div>
      <div class="price-card price-card-featured reveal">
        <span class="price-badge">Save more</span>
        <h3>Yearly</h3>
        <p class="price">$399<span>/year</span></p>
        <p class="price-trial">Start with 2 months free</p>
        <ul class="check-list check-list-dark">
          <li>Discover or offer help in your area</li>
          <li>Message privately using an alias</li>
          <li>Request or accept bookings by the hour</li>
          <li>Manage everything in one place</li>
        </ul>
        <a href="#download" class="btn btn-primary">Get Started</a>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add styles**

```css
.pricing-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 340px)); gap: 24px; justify-content: center; }
.price-card { background: #fff; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 32px; box-shadow: var(--shadow-card); position: relative; }
.price-card-featured { border-color: var(--teal); box-shadow: 0 8px 32px rgba(0,184,169,0.18); }
.price-badge { position: absolute; top: -12px; right: 24px; background: var(--teal); color: #fff; font-size: 0.7rem; font-weight: 700; padding: 4px 12px; border-radius: var(--radius-pill); }
.price { font-size: 2.4rem; font-weight: 800; margin: 12px 0 4px; }
.price span { font-size: 1rem; font-weight: 600; color: var(--text-secondary); }
.price-trial { color: var(--teal-dark); font-weight: 700; font-size: 0.85rem; margin-bottom: 20px; }
.price-card .check-list { margin: 0 0 28px; }
@media (max-width: 760px) { .pricing-grid { grid-template-columns: 1fr; max-width: 340px; margin: 0 auto; } }
```

- [ ] **Step 3: Verify structurally**

Run: `grep -c 'class="price-card' index.html`
Expected: `2`

Open in browser: two plan cards (Monthly / Yearly), the Yearly card visually highlighted with a "Save more" badge and teal border.

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "Add pricing section"
```

---

### Task 13: FAQ accordion (TDD for the toggle logic)

**Files:**
- Create: `js/accordion.js`
- Create: `js/accordion.test.mjs`
- Modify: `index.html`
- Modify: `css/style.css`
- Modify: `js/main.js`

- [ ] **Step 1: Write the failing test**

```js
// js/accordion.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextAccordionIndex } from './accordion.js';

test('opens a closed item', () => {
  assert.equal(nextAccordionIndex(null, 2), 2);
});

test('closes the currently open item when clicked again', () => {
  assert.equal(nextAccordionIndex(2, 2), null);
});

test('switches to a different item when another is clicked', () => {
  assert.equal(nextAccordionIndex(2, 0), 0);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test js/accordion.test.mjs`
Expected: FAIL — `Cannot find module './accordion.js'`

- [ ] **Step 3: Write minimal implementation**

```js
// js/accordion.js
export function nextAccordionIndex(currentOpen, clickedIndex) {
  return currentOpen === clickedIndex ? null : clickedIndex;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test js/accordion.test.mjs`
Expected: PASS (3 tests)

- [ ] **Step 5: Add FAQ markup**

```html
<section class="faq" id="faq">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">FAQ</span>
      <h2>Frequently asked questions</h2>
    </div>
    <div class="faq-list" id="faqList">
      <div class="faq-item">
        <button class="faq-question" aria-expanded="false">
          How does Pal verification work?
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-answer"><p>Every Pal completes a profile and a background check before their account goes live. Verified Pals show a badge on their profile.</p></div>
      </div>
      <div class="faq-item">
        <button class="faq-question" aria-expanded="false">
          How much does HourlyPal cost?
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-answer"><p>$39/month or $399/year, with 2 months free to start. The same plan applies to Clients and Pals, billed through the App Store or Google Play.</p></div>
      </div>
      <div class="faq-item">
        <button class="faq-question" aria-expanded="false">
          Is my identity private?
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-answer"><p>Yes. You're shown to others by the alias you choose, and messaging only unlocks after a booking is accepted.</p></div>
      </div>
      <div class="faq-item">
        <button class="faq-question" aria-expanded="false">
          What services are available today?
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-answer"><p>Personal Assistant, Personal Trainer, Tutor de Jour, Green Thumb, and Tour Guide, with more services coming as HourlyPal expands to new cities.</p></div>
      </div>
      <div class="faq-item">
        <button class="faq-question" aria-expanded="false">
          How do I cancel my subscription?
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-answer"><p>Cancel anytime from your Apple App Store or Google Play account settings — HourlyPal doesn't handle billing directly.</p></div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 6: Add FAQ styles**

```css
.faq-list { max-width: 720px; margin: 0 auto; border-top: 1px solid var(--border); }
.faq-item { border-bottom: 1px solid var(--border); }
.faq-question {
  width: 100%;
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 4px;
  font-size: 1rem; font-weight: 700; color: var(--navy);
  text-align: left;
}
.faq-icon { font-size: 1.2rem; color: var(--teal-dark); transition: transform .2s ease; }
.faq-question[aria-expanded="true"] .faq-icon { transform: rotate(45deg); }
.faq-answer { max-height: 0; overflow: hidden; transition: max-height .25s ease; }
.faq-answer p { padding: 0 4px 20px; }
```

- [ ] **Step 7: Wire the accordion in `js/main.js`**

Add `import { nextAccordionIndex } from './accordion.js';` to the top of `js/main.js`, alongside the existing imports. Then append the following function and call to the end of the file (after `initCounters();`):

```js
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
```

- [ ] **Step 8: Verify in browser**

Run: `open index.html`, click through the FAQ questions.
Expected: Clicking a question expands its answer and rotates the "+" to "x"; clicking an open question closes it; clicking a different question closes the previous one and opens the new one.

- [ ] **Step 9: Commit**

```bash
git add js/accordion.js js/accordion.test.mjs index.html css/style.css js/main.js
git commit -m "Add FAQ accordion"
```

---

### Task 14: Final CTA, footer, and newsletter signup (TDD for email validation)

**Files:**
- Create: `js/validate.js`
- Create: `js/validate.test.mjs`
- Modify: `index.html`
- Modify: `css/style.css`
- Modify: `js/main.js`

- [ ] **Step 1: Write the failing test**

```js
// js/validate.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isValidEmail } from './validate.js';

test('accepts a normal email address', () => {
  assert.equal(isValidEmail('pal@example.com'), true);
});

test('trims surrounding whitespace before validating', () => {
  assert.equal(isValidEmail('  pal@example.com  '), true);
});

test('rejects a string with no @', () => {
  assert.equal(isValidEmail('palexample.com'), false);
});

test('rejects a string with no domain suffix', () => {
  assert.equal(isValidEmail('pal@example'), false);
});

test('rejects an empty string', () => {
  assert.equal(isValidEmail(''), false);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test js/validate.test.mjs`
Expected: FAIL — `Cannot find module './validate.js'`

- [ ] **Step 3: Write minimal implementation**

```js
// js/validate.js
export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test js/validate.test.mjs`
Expected: PASS (5 tests)

- [ ] **Step 5: Add final CTA + footer markup**

```html
<section class="final-cta" id="download">
  <div class="container final-cta-inner reveal">
    <h2>Ready to find your Pal?</h2>
    <p>Download HourlyPal and start booking trusted local help today.</p>
    <div class="hero-ctas final-cta-ctas">
      <a href="#" class="btn btn-ghost-light">Download on the App Store</a>
      <a href="#" class="btn btn-ghost-light">Get it on Google Play</a>
    </div>
  </div>
</section>

<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      <a href="#top" class="nav-logo footer-logo">
        <img src="assets/logo.png" alt="HourlyPal" width="32" height="32">
        <span>HourlyPal</span>
      </a>
      <p>Trusted local help, by the hour.</p>
    </div>
    <div class="footer-col">
      <h4>Product</h4>
      <a href="#how-it-works">How it Works</a>
      <a href="#pricing">Pricing</a>
      <a href="#faq">FAQ</a>
    </div>
    <div class="footer-col">
      <h4>Company</h4>
      <a href="#">About</a>
      <a href="#">Careers</a>
      <a href="#">Contact</a>
    </div>
    <div class="footer-col">
      <h4>Legal</h4>
      <a href="#">Privacy Policy</a>
      <a href="#">Terms of Use</a>
    </div>
    <div class="footer-newsletter">
      <h4>Stay in the loop</h4>
      <form id="newsletterForm" novalidate>
        <input type="email" id="newsletterEmail" placeholder="you@example.com" aria-label="Email address">
        <button type="submit" class="btn btn-primary">Sign Up</button>
      </form>
      <p class="form-message" id="newsletterMessage" role="status"></p>
    </div>
  </div>
  <div class="container footer-bottom">
    <p>&copy; 2026 HourlyPal. All rights reserved.</p>
  </div>
</footer>
```

- [ ] **Step 6: Add styles**

```css
.final-cta { background: linear-gradient(135deg, var(--navy), #123a63); color: #fff; text-align: center; }
.final-cta h2, .final-cta p { color: #fff; }
.final-cta-inner { max-width: 560px; margin: 0 auto; }
.final-cta-ctas { justify-content: center; margin-top: 24px; }

.site-footer { background: var(--surface); padding: 64px 0 24px; }
.footer-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr 1.4fr; gap: 32px; }
.footer-logo { margin-bottom: 8px; }
.footer-brand p { font-size: 0.85rem; }
.footer-col h4 { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 14px; color: var(--text-muted); }
.footer-col a { display: block; font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 10px; }
.footer-col a:hover { color: var(--teal-dark); }
.footer-newsletter h4 { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 14px; color: var(--text-muted); }
.footer-newsletter form { display: flex; gap: 8px; }
.footer-newsletter input {
  flex: 1; padding: 10px 14px; border-radius: var(--radius-pill);
  border: 1px solid var(--border); font-family: inherit; font-size: 0.85rem;
}
.form-message { font-size: 0.8rem; margin-top: 8px; min-height: 1em; }
.form-message.is-error { color: var(--error); }
.form-message.is-success { color: var(--success); }

.footer-bottom { border-top: 1px solid var(--border); margin-top: 48px; padding-top: 20px; font-size: 0.8rem; color: var(--text-muted); }

@media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 560px) { .footer-grid { grid-template-columns: 1fr; } .footer-newsletter form { flex-direction: column; } }
```

- [ ] **Step 7: Wire the newsletter form in `js/main.js`**

Add `import { isValidEmail } from './validate.js';` to the top of `js/main.js`, alongside the existing imports. Then append the following function and call to the end of the file (after `initFaq();`):

```js
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
```

- [ ] **Step 8: Verify in browser**

Run: `open index.html`, scroll to the footer, submit the newsletter form with an invalid value (e.g. `abc`) then a valid one.
Expected: Invalid input shows a red inline error and does not clear the field; a valid email shows a green success message and clears the field.

- [ ] **Step 9: Commit**

```bash
git add js/validate.js js/validate.test.mjs index.html css/style.css js/main.js
git commit -m "Add final CTA, footer, and newsletter signup"
```

---

### Task 15: Global scroll-reveal wiring (GSAP) + reduced-motion guard

**Files:**
- Modify: `js/main.js`

- [ ] **Step 1: Add the GSAP reveal wiring**

Append to `js/main.js` (after the other `init*()` calls):

```js
function initScrollReveals() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');

  if (reduceMotion || typeof gsap === 'undefined') {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  revealEls.forEach((el, index) => {
    gsap.set(el, { opacity: 0, y: 24 });
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      delay: (index % 4) * 0.08,
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });
}

initScrollReveals();
```

- [ ] **Step 2: Verify in browser**

Run: `open index.html`, scroll from top to bottom slowly.
Expected: Each section's cards/copy fade up into place as they enter the viewport, staggered slightly for grids (categories, testimonials, trust cards). With OS "reduce motion" enabled, everything is visible immediately with no animation.

- [ ] **Step 3: Commit**

```bash
git add js/main.js
git commit -m "Wire up GSAP scroll-reveal animations with reduced-motion support"
```

---

### Task 16: Responsive & accessibility pass

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: Add a focus-visible style and skip link support**

Append to `css/style.css`:

```css
a:focus-visible, button:focus-visible, input:focus-visible {
  outline: 2px solid var(--teal);
  outline-offset: 2px;
}

.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  background: var(--teal);
  color: #fff;
  padding: 10px 16px;
  border-radius: 0 0 8px 0;
  z-index: 1000;
}
.skip-link:focus { left: 0; }
```

- [ ] **Step 2: Add the skip link markup**

Modify `index.html` — insert immediately after `<body id="top">` (before the header):

```html
<a href="#main" class="skip-link">Skip to main content</a>
```

Then wrap all sections between the header and footer in `<main id="main">...</main>` (move the existing `<section>` elements — hero through final-cta — inside this new `<main>` tag; `<header>` and `<footer>` stay outside it).

- [ ] **Step 3: Verify structurally**

Run: `grep -c '<main id="main">' index.html`
Expected: `1`

Run: `grep -c 'class="skip-link"' index.html`
Expected: `1`

Open in browser, press Tab from the top of the page: the first focus stop is a visible "Skip to main content" pill; pressing Enter jumps focus to `#main`. Tab through the nav, buttons, and form — every interactive element shows a visible teal focus ring.

- [ ] **Step 4: Resize the browser window (or use devtools device toolbar) through 375px, 768px, 1024px, and 1440px widths**

Expected: no horizontal scrollbar at any width; nav collapses to a hamburger below 860px; all grids (features, categories, trust cards, testimonials, pricing, footer) drop to fewer columns per their existing media queries; phone mockups stay centered and legible.

- [ ] **Step 5: Commit**

```bash
git add index.html css/style.css
git commit -m "Add accessibility focus styles, skip link, and responsive verification pass"
```

---

### Task 17: Final verification and push

**Files:** none (verification only)

- [ ] **Step 1: Run the full unit test suite**

Run: `node --test js/*.test.mjs`
Expected: All suites pass (nav, counter, accordion, validate — 16 tests total).

- [ ] **Step 2: Full manual walkthrough in a browser**

Run: `open index.html`
Walk the whole page top to bottom: announcement bar → nav (incl. mobile menu at a narrow width) → hero → stats count-up → features → Be a Pal → Hire a Pal → categories → how it works → trust & safety → testimonials → pricing → FAQ (open/close a few) → final CTA → footer newsletter (valid + invalid submit). Confirm no broken images (all `assets/screens/*.png` and `assets/logo.png` load) and no console errors.

- [ ] **Step 3: Review what will be pushed**

```bash
git status
git log --oneline
```

Confirm the log shows one commit per task above and `git status` is clean.

- [ ] **Step 4: Push to the remote — only after explicit user confirmation**

This pushes to a shared GitHub remote (`git@github.com:sfhighlight2/HourlyPal-Landing.git`), which is a one-way visible action. Ask the user to confirm before running:

```bash
git push -u origin main
```
