# Homepage Redesign Patch
## Layout, Typography & Section Rework

This document patches the existing site. Do not rebuild from scratch.
Apply these changes section by section. The dither background, nav, hero,
and footer are NOT touched.

---

## 1. TYPOGRAPHY SYSTEM — ADD THESE RULES

The site currently has one visual weight everywhere. Fix this by introducing
explicit typographic hierarchy. Add to global.css:

```css
/* Display — used for the big editorial moment in About */
.type-display {
  font-family: 'Lora', serif;
  font-size: clamp(42px, 6vw, 88px);
  font-weight: 400;
  line-height: 1.0;
  letter-spacing: -0.02em;
  font-style: italic;
  color: var(--ink);
}

/* Section opener — the first line of a section, larger than body */
.type-opener {
  font-family: 'Lora', serif;
  font-size: clamp(20px, 2.5vw, 28px);
  font-weight: 400;
  line-height: 1.3;
  color: var(--ink);
}

/* Body — unchanged from current */
.type-body {
  font-family: 'Lora', serif;
  font-size: 15px;
  line-height: 1.85;
  color: var(--ink-muted);
}

/* Caption / metadata — unchanged from current */
.type-meta {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-faint);
}
```

---

## 2. ABOUT SECTION — REWORK

### Current problem
Sparse short lines at one font size. Nothing stops the eye.

### New structure

The about section breaks into two distinct zones:

**Zone A — The display moment (no scroll needed)**
A single large italic serif line at `.type-display` scale sits immediately
below the hero. This is the first text the visitor reads after the headline.
It should be the most personal, specific line on the page.
Example: *"An uneventful life."* — but at 60–80px, italic, left-aligned,
with generous top padding (4rem). This line alone should make someone pause.

**Zone B — The reveal (on scroll or on load, whichever is already built)**
Below the display line, the rest of the about content uses the EXISTING
two-column layout. Left column: section label + metadata. Right column: prose.

In the right column, the FIRST sentence of prose should be `.type-opener`
(larger, ink-colored). Subsequent paragraphs are `.type-body` (muted).
This creates a visual step-down: display → opener → body.

The existing scroll-reveal behaviour on this section stays as-is.

### About section layout (right column prose structure)
```
[.type-opener]  I spend my days keeping cloud infrastructure from
                falling apart — and my nights filling sketchbooks.

[.type-body]    The work is invisible when it goes right. The photos
                and drawings are what happen when I slow down enough
                to notice things.

[.type-body]    This is my corner of the internet.
```

---

## 3. GALLERY SECTION — REWORK

### Current problem
Four equal thumbnails in a row. Generic. Doesn't honour the images.

### New layout — asymmetric editorial grid

Replace the four-equal-columns row with this specific layout:

```
┌─────────────────────────┬──────────────┐
│                         │              │
│   IMAGE 1 (large)       │   IMAGE 2    │
│   ~55% width            │   ~43% width │
│   tall aspect ratio     │   short      │
│                         │              │
├──────────────┬──────────┴──────────────┤
│   IMAGE 3    │                         │
│   ~43% width │   IMAGE 4 (large)       │
│   short      │   ~55% width            │
│              │   tall aspect ratio     │
└──────────────┴─────────────────────────┘
```

Images are separated by a 1px gap in `var(--rule)` color — no padding,
no border-radius, no cards. Just images edge to edge with a hairline gap.

Each image gets a caption below it: title left-aligned in Lora italic 11px,
type tag right-aligned in IBM Plex Mono 9px uppercase. Caption sits flush
below the image with a 0.5px top rule in `var(--rule)`.

Images are loaded from Supabase as they already are. The grid uses
CSS Grid with explicit `grid-template-columns` and `grid-template-rows`
rather than columns/masonry — so the layout is predictable regardless of
image count.

**For the homepage preview specifically:** show exactly 4 images.
Hardcode which 4 to show, or take the 4 most recent from Supabase.
Below the grid, a single right-aligned link: `View Collection →` in
IBM Plex Mono 11px, `var(--ink-muted)`. This links to the full gallery page.

**The full gallery page** keeps the existing masonry/column layout —
the asymmetric editorial grid is homepage-only.

---

## 4. EXPERIENCE SECTION — SIMPLIFY

### Current problem
Three employers with full role descriptions reads as a CV on a personal site.

### New structure

Show ONLY the current role. One employer. No list of previous roles.

```
[ 03 / EXPERIENCE ]

Saints & Masters                    Junior Engineer — Cloud
Kochi, Kerala                       May 2026 — Present
                                    
                                    Managing AWS environments,
                                    infrastructure-as-code automation,
                                    and Linux reliability for MSP clients.

                                    AWS  Terraform  Python  Linux  Docker

                                    Full experience → linkedin.com/in/abhiragh
```

The `Full experience →` link is IBM Plex Mono 10px, `var(--accent)` color,
links to LinkedIn. This is the ONLY external link in this section.

Previous employers (Nubinix, Bridge Global) are removed from the homepage.
If a dedicated /experience page exists, it can keep the full list — but it
should not be linked prominently from the homepage.

---

## 5. PROJECTS SECTION — REWORK

### Current problem
"Coming soon." is an anticlimactic placeholder that feels like a broken section.

### Two options — pick one:

**Option A — Remove entirely from homepage for now.**
No section, no placeholder. When real projects exist, add the section back.
The page flows: Experience → Writing → Footer.
This is cleaner and more honest than a "coming soon" state.

**Option B — Reframe as a teaser with personality.**
Keep the section but change the empty state from "Coming soon." to something
that communicates intent without feeling unfinished:

```
[ 04 / PROJECTS ]

Things built in the gaps between
everything else. More soon.
```

Set in `.type-opener` scale, Lora italic, `var(--ink-muted)`.
No card, no placeholder UI. Just the text.

**Decision: Option B.** Projects section stays — content will be added.
Use the reframed empty state text. No card, no bordered box, no "coming soon."

---

## 6. BLOG / WRITING SECTION — REWORK

### Current problem
Single blog card with a bordered box. Feels like a widget, not editorial content.

### New structure

Remove the card/box treatment entirely. Writing entries are plain text rows,
not containers.

```
[ 05 / WRITING ]                                        View All Writing →

─────────────────────────────────────────────────────────────────────────

A Scattered Mess of Wanting to Write a Blog             Medium · Article
Like most people (I assume), I too was hit with...      Read on Medium →

─────────────────────────────────────────────────────────────────────────
```

Each writing entry:
- Title: Lora, 16px, `var(--ink)`, no decoration
- Excerpt: Lora italic, 13px, `var(--ink-muted)`, 1–2 lines max, truncated
- Right side: source tag (Medium · Article) and read link — IBM Plex Mono
  10px, `var(--ink-faint)` for tag, `var(--accent)` for link
- Separated by a 0.5px full-width rule in `var(--rule)`

On the homepage: show max 2 entries. `View All Writing →` top-right of section
header, IBM Plex Mono 10px, `var(--ink-muted)`.

The bordered box on the current writing card is removed. No background,
no border, no border-radius. The rule lines do all the separation work.

---

## 7. SECTION SPACING — TIGHTEN

Current sections have too much empty vertical padding between them.
The dither background fills all that space and it reads as emptiness, not breathing room.

Reduce section padding:
- Current: likely 4–6rem top/bottom per section
- Target: 2.5rem top, 2rem bottom per section
- Exception: the display text in About gets 3rem top padding to let it land

The page should feel denser and more editorial — like a magazine spread
where content is packed intentionally, not floating in void.

---

## 8. OVERSIZED SECTION NUMBERS — GLOBAL CHANGE

Every section on the page gets a large background number. This replaces the
current `[ 01 / ABOUT ]` label as the primary section marker. The small
monospace label stays but moves to a secondary role.

### Implementation

Each section wrapper gets `position: relative; overflow: hidden`.

Inside each section, as the FIRST child element (behind all content):

```html
<span class="section-bg-number" aria-hidden="true">01</span>
```

```css
.section-bg-number {
  position: absolute;
  top: -0.15em;           /* bleeds slightly above section top */
  left: -0.02em;          /* slightly outside left gutter */
  font-family: 'Lora', serif;
  font-size: clamp(160px, 22vw, 280px);
  font-weight: 400;
  font-style: italic;
  line-height: 1;
  color: var(--ink);
  opacity: 0.035;         /* very faint — texture not distraction */
  pointer-events: none;
  user-select: none;
  z-index: 0;
  white-space: nowrap;
}
```

All section content sits at `position: relative; z-index: 1` above the number.

The small monospace label `[ 01 / ABOUT ]` stays — it now sits to the RIGHT
of or BELOW the large number, functioning as the readable label while the
number is purely spatial/textural. The label moves to the content column
rather than being the first thing in the section.

Numbers per section:
- About: `01`
- Gallery preview: `02`
- Experience: `03`
- Writing: `05`
(Projects removed or `04` if kept)

---

## 9. GALLERY SECTION — EDITORIAL TEXT TREATMENT

### Offset captions and hanging titles

The asymmetric 2×2 grid from Section 3 stays. What changes is how captions
and titles relate to the image frame.

**Hanging titles (IMAGE 1 and IMAGE 4 — the large images):**
The image title does NOT sit below the image. Instead it is positioned so it
starts INSIDE the image frame at the bottom-left, then the text continues
BELOW the image boundary — hanging out underneath. The visual effect is that
the title bleeds from image into canvas.

```css
.gallery-item-large {
  position: relative;
}

.gallery-item-large .hanging-title {
  position: absolute;
  bottom: -1.4em;         /* starts inside image, hangs below */
  left: 0;
  font-family: 'Lora', serif;
  font-style: italic;
  font-size: 13px;
  color: var(--ink);
  line-height: 1;
  z-index: 2;
  mix-blend-mode: normal;
  /* Title sits on the dark canvas below the image, not on the image itself */
}
```

The section wrapping `.gallery-item-large` must have enough bottom padding
to accommodate the hanging title (at minimum 2em padding-bottom).

**Offset captions (IMAGE 2 and IMAGE 3 — the smaller images):**
Caption sits below the image as normal BUT is offset — indented 1.5rem from
the image's left edge. Type tag (FILM PHOTOGRAPHY / SKETCHBOOK DRAFT) floats
right-aligned to the image width. This slight offset breaks the flush
alignment and makes the caption feel placed rather than generated.

```css
.gallery-item-small .offset-caption {
  padding-left: 1.5rem;
  padding-top: 0.5rem;
  font-family: 'Lora', serif;
  font-style: italic;
  font-size: 11px;
  color: var(--ink-muted);
}
```

**The gap between images** — 1px in `var(--rule)`. No padding. No radius.

**The `View Collection →` link** — sits below the entire grid, right-aligned,
with 1.5rem top margin. IBM Plex Mono 11px, `var(--ink-muted)`.

---

## 10. WRITING SECTION — PULL-QUOTE + OVERSIZED NUMBER

The oversized `05` background number from Section 8 applies here as it does
to all sections.

### Additional treatment: pull-quote

For each writing entry, one short line is pulled from the excerpt and set
at display scale ABOVE the entry row. This is the editorial anchor — the line
that makes someone read the entry.

```
[ 05 / WRITING ]                              View All Writing →

  ╔══ pull-quote ══════════════════════════════════════════════╗

    "I too was hit with the urge to paint                       
     some pictures."                                            
                                         — in large italic Lora, ~24–32px
                                           var(--ink), opacity 0.7

  ╚════════════════════════════════════════════════════════════╝

  ─────────────────────────────────────────────────────────────

  A Scattered Mess of Wanting to Write a Blog    Medium · Article
  Like most people (I assume)...                 Read on Medium →

  ─────────────────────────────────────────────────────────────
```

### Pull-quote implementation

The pull-quote is a separate element above the ruled entry list:

```css
.writing-pullquote {
  font-family: 'Lora', serif;
  font-style: italic;
  font-size: clamp(20px, 2.8vw, 32px);
  font-weight: 400;
  line-height: 1.3;
  color: var(--ink);
  opacity: 0.7;
  max-width: 60%;         /* doesn't go full width — asymmetric */
  margin-bottom: 2.5rem;
  padding-left: 2.5rem;   /* offset from left edge — not flush */
}
```

The pull-quote text is a manually chosen excerpt from the article — not
auto-generated from the excerpt field. It is stored as a separate field
`pullquote` in the writing data source (Supabase table or frontmatter).

If `pullquote` is empty/null for an entry, the pull-quote block is omitted
entirely for that entry. Do not fall back to the excerpt text.

Only the FIRST writing entry on the homepage gets a pull-quote.
Subsequent entries (if showing 2) are plain ruled rows only.

### Entry row structure (unchanged from patch spec Section 6)
Title | Excerpt | Source tag | Read link — same as before.
Rule lines above and below each entry.

---

## 12. WHAT NOT TO CHANGE

- Nav: leave as-is
- Hero (dither + headline + coordinates): leave as-is
- Footer: leave as-is
- Dither background canvas: leave as-is
- Collection/Gallery full page: leave as-is
- Section label style `[ 01 / ABOUT ]`: leave as-is
- Tag pill style (bordered monospace): leave as-is
- Color tokens: leave as-is
