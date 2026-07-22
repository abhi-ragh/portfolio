# Portfolio Build Specification
## Abhiragh A R — Personal Site Redesign

---

## OVERVIEW

A dark, editorial personal site. Magazine layout structure with one-bit dither integrated as a live, structural design element — not a decoration or a gif. The dither is present throughout: as grain on section backgrounds, as a texture that bleeds between layout elements, and as a visual language that ties the whole site together. The grid is asymmetric and editorial — sections break the column differently from each other. Nothing is a stack of centered boxes.

The site is a personal public space. It is not a recruiter portfolio. Identity emerges through the work and writing — the name is present but not the headline.

Tech stack: **Astro** (static site generator, near-zero JS by default), **React** islands for interactive components (gallery lightbox, any animations), **Supabase Storage** for gallery images, **Tailwind CSS** for layout utilities, **CSS custom properties** for the design token system.

---

## DESIGN SYSTEM

### Color Tokens

```
--bg:         #0E0D0B   /* near-black, warm undertone — base canvas */
--surface:    #161512   /* slightly lifted surface for cards/sections */
--ink:        #E8E4DC   /* primary text — warm off-white, not pure white */
--ink-muted:  #7A756C   /* secondary text, captions, labels */
--ink-faint:  #3A3730   /* borders, rules, subtle dividers */
--accent:     #C8A96E   /* warm gold — used sparingly, never as background */
--dither-fg:  #E8E4DC   /* dither pattern foreground color */
--dither-bg:  #0E0D0B   /* dither pattern background color */
```

### Typography

- **Serif (headings + body):** `Lora` — Google Fonts. Used for all editorial text: section headings, bio prose, blog excerpts, gallery captions. The main voice of the site.
- **Monospace (metadata + labels):** `IBM Plex Mono` — Google Fonts. Used only for: section index labels (`[ 01 / ABOUT ]`), technical tags, coordinates, dates, status indicators. Never for body copy.
- **No third typeface.** Two is enough.

### Type Scale

```
--text-xs:    11px   /* mono labels, tags, coordinates */
--text-sm:    13px   /* mono metadata, captions */
--text-base:  15px   /* serif body copy */
--text-lg:    18px   /* serif intro/lead text */
--text-xl:    24px   /* serif section headings */
--text-2xl:   36px   /* serif hero statement */
--text-3xl:   52px   /* serif oversized editorial accent — used once or twice */
```

### One-Bit Dither — Implementation

The dither is NOT a gif, NOT an image overlay, NOT a CSS filter slapped on top. It is a structural element implemented two ways:

**1. SVG Pattern (primary method)**
Define a repeating SVG pattern using a Bayer matrix or ordered dithering grid. This is a `<pattern>` element inside a `<defs>` block, applied as a `fill` on SVG `<rect>` elements. The pattern renders as actual 1-bit pixel dots, scales crisply at any resolution, and is fully themeable via CSS variables.

Example pattern structure (4×4 Bayer):
```svg
<defs>
  <pattern id="dither-4x4" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
    <!-- Only cells that exceed threshold get filled -->
    <rect x="0" y="0" width="1" height="1" fill="var(--dither-fg)" opacity="0.6"/>
    <rect x="2" y="1" width="1" height="1" fill="var(--dither-fg)" opacity="0.6"/>
    <rect x="1" y="2" width="1" height="1" fill="var(--dither-fg)" opacity="0.6"/>
    <rect x="3" y="3" width="1" height="1" fill="var(--dither-fg)" opacity="0.6"/>
    <!-- background of pattern is transparent -->
  </pattern>
</defs>
```

Use multiple density variants: `dither-dense`, `dither-mid`, `dither-sparse` — varying how many cells are filled. Dense at edges or transitions, sparse in open areas.

**2. Canvas-based dither for gallery images (optional, progressive enhancement)**
A React component that reads a loaded `<img>` element onto a `<canvas>`, applies Floyd-Steinberg or Bayer dithering pixel-by-pixel, and renders the result. Used optionally on hover state of gallery thumbnails to create a dithered preview effect. The original image shows on hover-out. This is a progressive enhancement — images must work without it.

**Where dither appears structurally:**
- Hero section: a tall SVG rect with the dither pattern fills roughly 60% of the viewport height, fading via an SVG `linearGradient` that goes from `--dither-fg` dots (opaque) at the top to transparent at the bottom, revealing the text below
- Section transitions: a thin horizontal band (24–32px tall) of dither pattern between major sections — acts as a visual rule with texture instead of a plain line
- About section sidebar: a vertical dither strip on the left edge of the aside column
- Footer top edge: dither band above the footer
- The pattern density decreases as the page descends — hero is dense, footer transition is sparse — giving a sense of the texture breathing out

---

## PAGE STRUCTURE

### 1. Navigation

Fixed top bar. Full width. Dark background matches `--bg`. No border — the dither hero below provides visual separation.

Left: `abhiragh a r` — set in `IBM Plex Mono`, `--text-xs`, `--ink-muted`. Lowercase always.

Right: navigation links — `about`, `gallery`, `work`, `writing` — set in `IBM Plex Mono`, `--text-xs`, uppercase, letter-spacing `0.1em`, `--ink-muted`. On hover, color shifts to `--ink`. No underline, no background, no border. Smooth color transition only.

Height: 56px. Z-index above everything.

---

### 2. Hero Section

Full viewport width. Height: 70vh minimum.

The dither SVG pattern fills the upper portion of this section as described above. The pattern fades to transparent via a vertical gradient, revealing the dark canvas below. The transition happens roughly 55–65% down the section height.

Below the fade, left-aligned (not centered), set in serif:

```
[ line 1 ]  — a short two-line editorial statement. Not a tagline. Something like:
              "infrastructure, film,
               and the space between."
              Font: Lora, --text-2xl or --text-3xl, --ink, font-weight 400.

[ line 2 ]  — one line of mono metadata below the statement, after a gap:
              "KOCHI, KERALA — 9.9312° N, 76.2673° E"
              Font: IBM Plex Mono, --text-xs, --ink-muted, letter-spacing 0.1em.
```

Left margin: same as the page content gutter (2.5rem or 40px).

No scroll indicator. No CTA button. No animated typing effect.

---

### 3. Dither Transition Band

A 28px tall SVG rect with `dither-sparse` pattern. Full width. Sits between hero and about section. Acts as a textural horizontal rule.

---

### 4. About Section

**Layout: asymmetric two-column grid.**

Left column: 35% width. Contains:
- Section index label: `[ 01 / ABOUT ]` — IBM Plex Mono, --text-xs, --ink-faint, bordered with a thin rect or bracket characters
- A vertical dither strip (8px wide SVG rect with dither-mid pattern) running the full height of the column on the right edge of the left column
- Below the label: a small block of static metadata in mono:
  ```
  location     kochi, kerala
  role         devops / cloud
  employer     saints & masters
  currently    shooting 35mm
  ```
  Each row: label in `--ink-faint`, value in `--ink-muted`, `--text-xs`, mono, tabular alignment.

Right column: 65% width. Contains:
- Bio prose. 2–3 short paragraphs. Written in first person, editorial voice. Lora serif, `--text-base`, `--ink`, line-height 1.85.
- Example prose (placeholder, replace with real copy):
  > "I spend my days keeping cloud infrastructure from falling apart — AWS, mostly, for clients who can't afford downtime. The kind of work that's invisible when it goes right and very loud when it doesn't."
  >
  > "Outside that, I shoot film and fill sketchbooks. Both are about noticing things slowly, which is the opposite of what I do at work. The tension is the point."
  >
  > "This is my corner of the internet. No personal brand, no funnel. Just the work and the things I find interesting."

No skill bars. No icon grids. No lists of tools.

---

### 5. Dither Transition Band

Same as above. `dither-mid` density.

---

### 6. Gallery Section

**This is the most structurally complex section. Read carefully.**

Section label: `[ 02 / GALLERY ]` — same mono label style as above. Below it, one line of serif descriptor text: *"A mixed collection of 35mm film photography and pencil contour sketches. Given space to breathe."* — Lora italic, `--text-sm`, `--ink-muted`.

**Gallery grid — asymmetric masonry, not a uniform grid.**

The grid is implemented in CSS using `columns` (CSS multi-column layout) rather than CSS Grid or Flexbox. This gives natural masonry reflow as images are added. Use 2 columns on desktop (consider 3 for very wide screens via media query), 1 column on mobile.

Each image card:
- No border, no border-radius, no shadow
- Image renders full width of its column with `width: 100%`, `display: block`
- Below each image, a caption row in two parts — left: image title (Lora italic, `--text-xs`, `--ink-muted`), right: type tag (`FILM PHOTOGRAPHY` or `SKETCHBOOK DRAFT`) in IBM Plex Mono, `--text-xs`, `--ink-faint`, uppercase, right-aligned
- Between image and caption: a 0.5px rule in `--ink-faint`
- `break-inside: avoid` on each card so images don't split across columns

**Data source:** Supabase Storage. Images are fetched client-side via a React island component. The component:
1. Calls `supabase.storage.from('gallery').list()` on mount to get the file list
2. Calls `supabase.storage.from('gallery').getPublicUrl(file.name)` for each file to get the URL
3. Renders the masonry grid. New images added to the bucket appear automatically on next load — no code changes needed.
4. Each image object in Supabase should carry metadata for title and type. Store this as a JSON sidecar file per image OR use Supabase database table with columns: `filename`, `title`, `type` (`film` | `sketch`), `created_at`. The database approach is cleaner and allows ordering.
5. Show a minimal loading state: the column structure renders immediately with a subtle shimmer placeholder (CSS animation, no spinner) until images resolve.

**Lightbox:** On image click, a full-screen overlay opens showing the image at maximum size, with title and type in the bottom-left corner. Click anywhere or press Escape to close. No carousel arrows — each image stands alone. Implemented as a React portal.

---

### 7. Dither Transition Band

`dither-mid` density.

---

### 8. Work Section

**Layout: two-column, same asymmetric split as about (35/65).**

Left column:
- Section label: `[ 03 / WORK ]`
- Role and date in mono below:
  ```
  saints & masters
  2024 — present
  ```

Right column:
- One paragraph of prose. Lora, `--text-base`, `--ink-muted`. Light, not exhaustive.
- Below the prose, a row of tech tags. Each tag: IBM Plex Mono, `--text-xs`, `--ink-faint`, wrapped in a thin `0.5px solid --ink-faint` border, `4px 10px` padding. No background fill. Tags: `AWS`, `Terraform`, `Python`, `Linux`, `Docker`, `GitLab CI/CD`.

No project cards. No deep-dives. No metrics.

---

### 9. Dither Transition Band

`dither-sparse` density.

---

### 10. Writing / Blog Section

**Layout: single column, centered at 60% width (max 640px), left-aligned text.**

Section label: `[ 04 / WRITING ]`

**Empty state (current):** A single line of Lora italic text, `--ink-faint`:
> *"nothing here yet — but things are accumulating."*

Do not use a placeholder card grid or dummy posts. The empty state should feel intentional, not broken.

**When posts exist:** Each post renders as a row:
- Left: post title in Lora, `--text-base`, `--ink`, links to the post
- Right: date in IBM Plex Mono, `--text-xs`, `--ink-faint`
- Below: one-line excerpt in Lora italic, `--text-sm`, `--ink-muted`
- Separated from next post by a 0.5px rule in `--ink-faint`

Astro content collections handle the blog. Each post is a `.md` or `.mdx` file in `src/content/blog/`. Frontmatter: `title`, `date`, `excerpt`, `published: true/false`. Unpublished posts don't render.

---

### 11. Dither Transition Band

`dither-sparse` density.

---

### 12. Footer

Single row. Full width. 56px height. Vertically centered content.

Left: `kochi, kerala — 2026` — IBM Plex Mono, `--text-xs`, `--ink-faint`.

Right: `github`, `linkedin`, `email` — IBM Plex Mono, `--text-xs`, `--ink-muted`. Hover: `--ink`. Plain text links, no icons.

No copyright line. No "built with" attribution unless personally wanted.

---

## RESPONSIVE BEHAVIOUR

- **Desktop (>1024px):** Full two-column layout as described. Page content gutter: 40px each side.
- **Tablet (768–1024px):** Two-column sections collapse to single column. Gallery stays 2 columns. Gutter: 28px.
- **Mobile (<768px):** Everything single column. Gallery: 1 column. Gutter: 20px. Nav collapses to hamburger or a simple column of links. Font sizes step down one level.

---

## WHAT NOT TO BUILD

- No animations on scroll (no fade-in, no slide-up, no parallax)
- No hover effects that move cards or elements spatially (no translateY, no scale)
- No loading spinners — shimmer placeholders only
- No dark/light mode toggle
- No cookie banners or analytics pop-ups
- No social share buttons
- No "back to top" button
- No skill bars or percentage indicators
- No particle effects, gradient meshes, or animated backgrounds
- No typewriter / typing animation effects
- The dither is STATIC. It does not animate, pulse, or shift.

---

## FILE STRUCTURE (ASTRO)

```
/
├── public/
│   └── fonts/          # if self-hosting fonts
├── src/
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Hero.astro
│   │   ├── DitherBand.astro        # reusable transition band component, accepts density prop
│   │   ├── About.astro
│   │   ├── Gallery.tsx             # React island — client:load
│   │   ├── Lightbox.tsx            # React island — client:load
│   │   ├── Work.astro
│   │   ├── Writing.astro
│   │   └── Footer.astro
│   ├── content/
│   │   └── blog/                   # .md files for blog posts
│   ├── layouts/
│   │   └── Base.astro              # HTML shell, font imports, global CSS vars
│   ├── pages/
│   │   └── index.astro             # composes all sections
│   └── styles/
│       └── global.css              # CSS custom properties, reset, base styles
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

---

## SUPABASE SETUP

Two tables / storage buckets needed:

**Storage bucket:** `gallery` — public bucket. Images uploaded directly here.

**Database table:** `gallery_items`
```sql
create table gallery_items (
  id uuid default gen_random_uuid() primary key,
  filename text not null,          -- matches exact filename in storage bucket
  title text not null,             -- display title e.g. "Kochi Port & Monsoon Waves"
  type text check (type in ('film', 'sketch')) not null,
  created_at timestamptz default now()
);
```

The Gallery React component queries this table (ordered by `created_at desc`) to get the ordered, titled list, then constructs public URLs via the storage API. Adding a new photo = upload file to bucket + insert a row in the table.

---

## DITHER SVG PATTERN REFERENCE

Three density variants to use across the site. Define all three in a shared SVG `<defs>` block in `Base.astro` and reference by ID throughout.

**Sparse (4×4 Bayer, ~25% fill):**
Threshold: fill only the darkest 4 of 16 cells.
Use for: footer transition, writing section transition.

**Mid (4×4 Bayer, ~50% fill):**
Threshold: fill 8 of 16 cells in a balanced Bayer pattern.
Use for: about → gallery transition, gallery → work transition.

**Dense (4×4 Bayer, ~75% fill):**
Threshold: fill 12 of 16 cells.
Use for: hero section (top portion), fading to transparent via gradient.

For the hero fade specifically: wrap the dense dither rect in an SVG `<mask>` that uses a `<linearGradient>` going from white (opaque) at y=0% to black (transparent) at y=100%. The mask makes the dither pattern fade naturally into the dark canvas below.

---

## ACCENT COLOR USAGE RULES

`--accent: #C8A96E` (warm gold) is used in exactly these places:
- The section index bracket labels on hover: `[ 01 / ABOUT ]` bracket characters shift to accent on hover
- The active nav link (current section highlighted during scroll)
- Inline emphasis in prose if needed — italic serif in accent color for one or two words maximum

Nowhere else. No accent backgrounds, no accent borders, no accent buttons.

---

## DONE WHEN

- [ ] Site loads under 2 seconds on a standard connection with gallery images cached
- [ ] Dither appears as structural SVG pattern, not an image or gif
- [ ] Gallery fetches from Supabase and reflows correctly at 5, 10, and 20 images
- [ ] Lightbox opens and closes without layout shift
- [ ] All sections readable and correctly laid out at 375px mobile width
- [ ] Blog empty state renders intentionally, not as a broken section
- [ ] No console errors in production build
- [ ] Astro build completes with `astro build` without warnings
