# HourlyPal Landing Page — Design Spec

Date: 2026-07-13

## Purpose

Build a full marketing website for HourlyPal, a two-sided local-services marketplace ("Trusted local help, by the hour."). Visual style is modeled on a reference template (soft-rounded cards, pill buttons, scroll-driven motion) but uses HourlyPal's actual brand: navy/teal palette, Inter font, and real app screenshots pulled from the existing product build (`HourlyPal-Design` sibling project).

## Product grounding (from existing build spec & app)

Source of truth: `HourlyPal-Design/attached_assets/Pasted--HourlyPal-Mobile-App-Build-Spec...txt` and `HourlyPal-Design/artifacts/hourlypal/constants/colors.ts`.

- **Tagline:** "Trusted local help, by the hour."
- **Model:** Two-sided marketplace. Users are either **Clients** (hire a Pal) or **Pals** (offer services). Role chosen at signup.
- **Monetization:** Subscription-based, not commission. Both Clients and Pals pay $39/mo or $399/yr (2 months free trial via App Store/Play Store billing). Pals keep 100% of their hourly earnings.
- **MVP-safe service categories** (launch scope — use these as the featured categories, not the full future list): Personal Assistant (errands), Personal Trainer, Tutor de Jour, Green Thumb (gardening), Tour Guide. Companionship/Plus One/Personal Escort/driving categories are explicitly deferred pending legal review — the landing page should not lead with these; a soft "and more services on the way" mention is fine but not a featured category.
- **Trust & safety:** Manual Pal vetting (background check via Checkr, `is_verified` flag), alias-based identity (real name never shown), in-app-only messaging unlocked after booking acceptance, block/report flows, star ratings + written reviews after completed bookings.
- **Real screenshots available**, copied into `assets/screens/`: role-select, client-home (discovery feed), pal-home (requests inbox), pal-detail (profile w/ verified badge, reviews, rate), booking-new, messages-list, message-thread, search-results.

## Visual system

- **Logo:** `assets/logo.png` (navy square mark, two-figure "hi" glyph + wordmark) — provided, used as-is (not recreated).
- **Colors** (from the real design system, not the reference template's beige/purple):
  - Primary teal: `#00B8A9` (buttons, links, active states)
  - Primary teal dark: `#008B7F` (hover/gradient pair)
  - Navy: `#0A2540` (headings, dark sections, nav/footer backgrounds)
  - White: `#FFFFFF` (main background)
  - Surface: `#F4F6F8` (alternating section backgrounds, cards)
  - Border: `#E5E7EB`
  - Text secondary: `#6B7280`, text muted: `#9CA3AF`
  - Success `#10B981`, warning `#F59E0B`, error `#EF4444` (used sparingly, e.g. verified badge)
- **Typography:** Inter (Google Fonts), matching both the app and existing dashboard. Bold/tight tracking for headlines, regular for body.
- **Shape language:** 12px radius on cards/inputs, 24px pill radius on buttons, circular avatars — same tokens as the existing dashboard's CSS custom properties, reused here for consistency across HourlyPal's properties.

## Page structure (single page, audiences woven together)

1. **Announcement bar** — small top strip, dismissible (e.g. "Now live in [City] — join the waitlist for your area")
2. **Nav** — logo, links (How it Works / Be a Pal / Hire a Pal / FAQ), "Download App" pill button, sticky with condense-on-scroll
3. **Hero** — headline built around the tagline, subhead, App Store + Google Play badges, phone mockup using `11-client-home.png`, floating stat chips, soft gradient-blob background in teal/navy
4. **Stats strip** — animated counters (e.g. "Verified Pals", "Cities", "Avg. rating") — placeholder numbers, clearly marked for the user to supply real figures later
5. **Feature showcase** — tabbed/list layout (reference-style) paired with `14-pal-detail.png` and `17-messages-list.png`: verified profiles, in-app messaging, ratings & reviews, set-your-own-schedule
6. **"Be a Pal" section** — dark navy band, pitch to providers (keep 100% of pay, set your rate & schedule, background-checked & verified badge builds trust), mockup: `12-pal-home.png` / `08-pal-pricing` equivalent copy
7. **"Hire a Pal" section** — light band, pitch to clients (search by service/location/availability, message privately via alias, book by the hour), mockup: `20-search-results.png` / `03-role-select.png`
8. **Service categories** — the 5 MVP-safe categories as icon cards (Personal Assistant, Personal Trainer, Tutor, Green Thumb, Tour Guide), each with the one-line description from the build spec, plus a subtle "more services coming soon" note
9. **How It Works** — step sequence per audience (Client: search → book → message → review; Pal: apply → get verified → set rate/availability → get booked), using `15-booking-new.png` as a supporting visual
10. **Trust & Safety** — dark section: verification/background checks, alias privacy, in-app-only messaging, block/report, echoing the "Trusted" in the tagline
11. **Testimonials** — quote cards with star ratings (placeholder copy, clearly marked)
12. **Pricing** — Monthly ($39) vs Yearly ($399, "2 months free") cards, one shared structure noted as applying to both Clients and Pals; note that billing runs through Apple/Google, not a card form on this page
13. **FAQ** — accordion: how verification works, how payment/subscription works, how messaging privacy works, cancellation policy, what happens if I need to cancel a booking
14. **Final CTA** — "Ready to find your Pal?" band with App Store + Google Play badges
15. **Footer** — nav columns, newsletter signup, social icons, legal links (Privacy Policy, Terms of Use — referencing the App Store cancellation note from the build spec)

## Motion & interactions (GSAP + ScrollTrigger via CDN)

- Scroll-triggered fade/slide-up reveals per section, staggered for card grids
- Hero: floating/parallax drift on the phone mockup, animated soft gradient blob
- Animated count-up for the stats strip on scroll into view
- Hover micro-interactions: button scale/shadow lift (teal glow, matching the dashboard's `--shadow-teal`), card lift on hover
- Accordion open/close eased height transition for FAQ
- Sticky nav that condenses/gains a shadow on scroll
- Respect `prefers-reduced-motion`: disable non-essential motion when set

## Architecture

Plain static site, no build step:
```
index.html
css/style.css
js/main.js
assets/
  logo.png
  screens/ (8 real app screenshots, phone-cropped via CSS mockup frame)
```
GSAP + ScrollTrigger loaded via CDN script tags.

## Responsive & accessibility

- Mobile-first breakpoints; stacked layout with hamburger nav on small screens
- `prefers-reduced-motion` respected
- Semantic HTML, alt text on all images/screenshots, sufficient color contrast (navy-on-white and white-on-navy both pass AA), keyboard-navigable nav/accordion

## Content tone & safety framing

All copy uses platonic, professional marketplace language centered on the MVP-safe categories (errands, training, tutoring, gardening, local tours) and trust/safety mechanics. No sexualized framing; no mention of escort/companionship categories as featured offerings, consistent with their "pending legal review" status in the build spec.

## Version control

Repo initialized locally; remote set to `git@github.com:sfhighlight2/HourlyPal-Landing.git`. This spec is committed first, then implementation commits follow. Push happens after the user confirms (pushing to a shared remote is a one-way, visible action).

## Out of scope (not building now)

- Backend/auth/booking functionality (this is a static marketing site only)
- Dashboard or mobile app changes
- Real photography beyond the provided logo and existing app screenshots
- Final copy numbers (stats, testimonials) — placeholders clearly left for the user to swap with real figures
