# Build Plan — abhiragh.dev (v2)

Stack assumption: your current site is Next.js on Vercel, so I'll build on that — Next.js (App Router) + Notion API + Spotify API, deployed as-is. Say now if that's wrong.

Nav confirmed: **About · Projects · Gallery · Others** (top-left), wordmark + tagline (mid-left), corner metadata (location bottom-left, socials bottom-right). Homepage cards: **Project, Music, Photograph, Career, Sketch, Reading, Some Screen/Animation** — each a teaser linking to its full page (except Music/Screen-Animation, which have no full page).

---

## Phase 0 — Cleanup & Foundation
Strip the current site down before rebuilding on top of it.

- [ ] Remove existing background styling/texture, set plain flat background color
- [ ] Remove old single-column About/Experience/Projects/Collection layout code
- [ ] Remove placeholder "Test 1–5" project content
- [ ] Audit current `.env` — confirm Notion tokens + database IDs already present; list what's missing (Spotify creds almost certainly needed fresh)
- [ ] Confirm color palette (paper/off-white? warm off-black? pick one background + one ink color to start, expand later)

## Phase 1 — Design System
The hand-drawn vibe has to be a reusable system, not one-off CSS per card.

- [ ] Pick typefaces: one handwritten/marker font for wordmark + tagline + small accent labels (candidates: Caveat, Kalam, Patrick Hand, Gochi Hand), one clean sans/serif for card body text (readability matters more there)
- [ ] Decide hand-drawn border approach — options: **rough.js** (generates authentic wobbly SVG borders/rects, closest to your wireframe), or a CSS `border-radius` + subtle `rotate()` per card + filter-based texture (cheaper, less authentic)
- [ ] Build one reusable `Card` component with the chosen hand-drawn border style, and test it looks right at 2–3 different card sizes before wiring up real content
- [ ] Define grid system: fixed bento layout for desktop (matches your wireframe), and decide the mobile stack order now (suggest: Name/tagline → Career → Sketch → Project → Photograph → Music → Reading → Screen/Animation)
- [ ] Corner elements: location text bottom-left, email/github/linkedin bottom-right — build as fixed/absolute positioned elements, not part of grid flow

## Phase 2 — Static Homepage Shell
Build the whole bento grid with placeholder content first, so layout is proven before data is wired in.

- [ ] Nav row: About / Projects / Gallery / Others (link targets can 404 for now)
- [ ] Wordmark + tagline block
- [ ] Lay out all 7 cards (Project, Music, Photograph, Career, Sketch, Reading, Some Screen/Animation) at their wireframe proportions with dummy text/images
- [ ] Make each card (except Music, Screen/Animation) clickable → routes to its future page (`/about`, `/projects`, `/gallery`, `/others` — note Career links to `/about` per your note that certifications live there too)
- [ ] Responsive pass: confirm the stack order and spacing on mobile

## Phase 3 — Notion Integration (homepage teasers only)
Each of these pulls exactly one row from your Notion DBs, per your spec.

- [ ] Set up Notion client + confirm DB IDs for: Projects, Gallery, Books
- [ ] **Project card**: fetch the one row where "Homepage" checkbox is true → title + cover image, clicking card → external Github link (not internal page, per your note)
- [ ] **Gallery card(s)**: fetch one row where "Homepage" = "Photograph" and one where "Homepage" = "Sketch" (your table shows this as a text/select field, not a checkbox — confirm) → render as the Photograph and Sketch cards
- [ ] **Reading card**: fetch the one Books row with Status = "In Progress" → title + cover only, no blurb
- [ ] Error/empty states: decide what each card shows if no row currently matches (e.g. no book "in progress")

## Phase 4 — Spotify Integration
This needs its own auth decision before building.

- [ ] Decide what "Music" card shows: currently-playing (needs a live refresh-token flow, shows nothing when you're not listening) vs. most-recently-played (more reliably populated) — your call
- [ ] Get Spotify Client ID/Secret + a refresh token, add to `.env`
- [ ] Build the fetch + display: album art, track name, artist
- [ ] Handle "nothing playing" fallback state gracefully

## Phase 5 — "Some Screen/Animation" Card
Confirmed: playful, unrelated, decorative — gifs, a ticker, cyberpunk-ish loop.

- [ ] Source or make 2–4 candidate gifs/loops
- [ ] Decide static image vs. looping gif vs. simple CSS/canvas animation (lighter weight, no asset hunting)
- [ ] Drop into the card, no data wiring needed — purely decorative

## Phase 6 — Polish
- [ ] Scroll/entrance animations — left to your judgment per your note, but keep it minimal (a slight fade/slide-in on load is plenty; avoid per-element hover-lift on everything, that's the AI-site tell)
- [ ] Favicon
- [ ] Final responsive/cross-browser check
- [ ] Deploy

---

## Phase 7 — Full Pages (later stage, not priority now)
Just capturing scope so nothing's lost:

- [ ] `/about` — bio, career path (timeline), certifications section
- [ ] `/projects` — full Notion-driven project list, each linking out to Github
- [ ] `/gallery` — full Notion-driven photograph + sketch grid
- [ ] `/others` — full books list + any other Spotify/music history you want to show

---

## Open questions before Phase 3/4 can actually start
1. In your **Gallery** Notion table, is "Homepage" a checkbox (like Projects) or a text field naming which card it fills ("Photograph" / "Sketch")? Your screenshot shows text values, worth confirming the exact field type so the query logic is right.
2. Spotify: currently-playing or recently-played — pick one, it changes the auth approach.
3. Palette: give me a rough steer (paper/cream, warm off-black, something else) so Phase 1 isn't a guess.

Want me to save this as a doc you can check off as we go, or just work through it here phase by phase? Either way — where do you want to start, Phase 0 or Phase 1?
