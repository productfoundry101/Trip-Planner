## Goal

Replace the current bare auth page with an Awwwards-caliber marketing homepage that pitches Trip Pals and embeds the sign-up/login form on the right of an asymmetric hero. Add a "How it works" section beneath, plus rich micro-interactions throughout.

## Design direction

- **Palette (Terracotta & Sage)** — applied via HSL semantic tokens in `index.css` and `tailwind.config.ts`:
  - Background: warm cream (`#faf6f1`)
  - Primary: terracotta `#c4654a`
  - Secondary/accent: sage `#87a878`, deep moss `#4a6741`
  - Soft peach surfaces `#e8a87c` for highlights
  - Includes new gradient + shadow tokens (`--gradient-warm`, `--shadow-soft`, `--shadow-glow`)
- **Typography** — Sora for headings, Manrope for body, loaded via Google Fonts in `index.html`. Tailwind `fontFamily` tokens added.
- **Layout** — Asymmetric ~60/40 hero: left column larger with copy, right column floating glass-style auth card.

## Page structure (`src/pages/Auth.tsx` rebuild)

1. **Sticky top nav** — Trip Pals wordmark left, subtle "Sign in" anchor right (scrolls to form). Animated underline on hover.
2. **Hero (asymmetric split)**
   - **Left (60%)**:
     - Eyebrow tag: "Travel, curated by friends"
     - Headline (Sora, large): "Ever found yourself drowning in research for places to eat and visit whenever you are visiting a new place?"
     - Sub-copy: "No more. Ask your friends to provide their top place to eat and visit wherever you are visiting. Have a curated collection of best places from your friends, without any effort."
     - Two CTAs: "Get started" (primary, scrolls to form) and "See how it works" (ghost, scrolls to section)
     - Floating decorative blobs (sage + terracotta) with slow drift animation; subtle map-pin/utensil icon flourishes
   - **Right (40%)**: Auth card (existing email/password + Google flow preserved) inside a glassy bordered card with soft shadow, gentle tilt on hover, tab toggle between Sign in / Sign up.
3. **How it works** (3 animated cards, staggered fade-in on scroll via IntersectionObserver):
   - **1. Create a trip** — pin icon, terracotta accent, mini animated "city searched" chip
   - **2. Invite your friends** — share icon, sage accent, animated avatar stack
   - **3. Get a curated map** — map icon, moss accent, animated pin drop
   Cards lift + glow on hover, icon micro-bounce.
4. **Feature strip** — three small value props ("No accounts for friends", "Eat & Visit categories", "Beautiful shareable map") with hover scale.
5. **Footer** — minimal, "Made with care for travelers" + copyright.

## Micro-interactions

- Hero blobs: slow infinite drift (`@keyframes drift`)
- CTA buttons: scale + shadow-glow on hover, ripple on press
- Auth card: subtle lift + border glow on hover/focus-within
- "How it works" cards: stagger-in on viewport entry, hover lift, icon spring
- Nav link: animated underline (`story-link` util)
- Smooth scroll between sections
- Respect `prefers-reduced-motion`

All animations declared in `tailwind.config.ts` keyframes (`drift`, `fade-in-up`, `pulse-glow`, `float`) and reusable utility classes in `index.css`.

## Files touched

- `src/index.css` — new HSL tokens (Terracotta & Sage), gradients, shadows, animation utility classes
- `tailwind.config.ts` — extend colors, fontFamily (sora/manrope), keyframes, animations
- `index.html` — add Google Fonts links + update `<title>`/meta description for SEO
- `src/pages/Auth.tsx` — full rebuild: marketing homepage with embedded auth (preserves existing auth logic: email/password sign in/up, Google OAuth, toast handling, redirect on user)
- `src/components/HowItWorks.tsx` (new) — animated cards section
- `src/components/AuthCard.tsx` (new, optional) — extracted form for cleanliness

## Out of scope

- No backend or auth-flow logic changes; all current Supabase auth calls preserved verbatim.
- No changes to the post-login `/` experience.