# Dither v2 — Canvas Components Integration

These replace the SVG pattern components entirely.
Both use the same organic wave algorithm as the original DitherCanvas.jsx.

---

## Files

- `DitherHero.jsx`  — Hero section with animated wave dither fading into the page
- `DitherBand.jsx`  — Thin static transition band between sections

---

## Step 1: Copy files

```
src/components/DitherHero.jsx
src/components/DitherBand.jsx
```

Delete or keep the old SVG Astro components — they're no longer used.

---

## Step 2: Replace the hero

In `src/pages/index.astro`, replace your existing Hero component:

```astro
---
import DitherHero from '../components/DitherHero.jsx';
---

<!-- animated={true} runs the 60fps wave. Set false for a static frozen frame. -->
<DitherHero client:load animated={true} />
```

The hero text ("infrastructure, film, and the space between.") is hardcoded
inside the component for now. Edit it directly in DitherHero.jsx lines 100–115,
or extract it as props:

```jsx
// Add to the component signature:
export default function DitherHero({ animated = true, headline, meta }) {
// Then replace the hardcoded strings with {headline} and {meta}
```

---

## Step 3: Replace transition bands

Replace every `<DitherBand>` Astro component call with the JSX version.
Each band renders with a different random time offset so they all look
slightly different from each other.

```astro
---
import DitherBand from '../components/DitherBand.jsx';
---

<!-- After hero -->
<DitherBand client:load density="dense" height={40} />

<!-- After About -->
<DitherBand client:load density="mid" height={32} />

<!-- After Gallery -->
<DitherBand client:load density="mid" height={32} />

<!-- After Work -->
<DitherBand client:load density="sparse" height={28} />

<!-- After Writing, before Footer -->
<DitherBand client:load density="sparse" height={24} />
```

---

## Step 4: Fonts

Make sure Lora and IBM Plex Mono are loaded in your Base layout.
In `src/layouts/Base.astro` inside `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400;1,500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

---

## Step 5: CSS variables

In your `src/styles/global.css`:

```css
:root {
  --bg:         #0E0D0B;
  --surface:    #131210;
  --ink:        #E8E4DC;
  --ink-muted:  #7A756C;
  --ink-faint:  #2E2C28;
  --rule:       #252320;
  --accent:     #C8A96E;
}

body {
  background: var(--bg);
  color: var(--ink);
}
```

---

## How the fade works

The hero canvas renders the full wave across the entire 480px height.
A gradient overlay on top fades it:

```
0%  → 50%   fully transparent  (wave fully visible at top)
50% → 65%   starts fading
65% → 90%   fades to solid #0E0D0B
90% → 100%  solid #0E0D0B
```

The hero text sits at `bottom: 2.5rem` — in the clean dark zone below the fade.
This gives the impression the text is emerging from the dither dissolve.

The bands use a similar edge fade but symmetric top and bottom, so they
bleed into both sections above and below rather than hard-cutting.

---

## Tuning

**Wave too fast / slow:** Edit `time += 0.015` in DitherHero.jsx — higher = faster.

**Dots too large / small:** The canvas renders at `innerWidth / 4` resolution.
Change the divisor — `/3` gives smaller dots, `/5` gives larger.

**Hero too tall / short:** Change `const HERO_HEIGHT = 480` in DitherHero.jsx.

**Band density:** The `density` prop shifts wave amplitude.
- `sparse` → fewer lit pixels → lighter texture
- `dense`  → more lit pixels → heavier texture
Fine-tune the values in the `AMPLITUDE` object in DitherBand.jsx.

**Fade start point:** Edit the gradient stops in the `background` property
of the fade overlay div inside DitherHero.jsx.
