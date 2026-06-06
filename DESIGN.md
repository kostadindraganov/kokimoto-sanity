# DESIGN.md — Kostadin Draganov Portfolio

A single-page portfolio for a senior software developer / AI-native engineer,
themed as a **terminal + AI coding console**. The entire interface borrows the
visual language of a Claude-Code-style CLI: prompt lines, tool-use blocks,
streamed output, a command palette, a token meter, and an interactive Q&A REPL.

---

## 1. Concept & voice

- **Metaphor:** the portfolio *is* a coding session. The visitor "boots" the
  site, content "streams" in like a model response, projects are framed as
  git commits / deployments, and an "Ask me something" console lets visitors
  query the owner like an agent.
- **Tone:** confident, dry, engineering-literate. Copy reads like commit
  messages and shell output (`feat:`, `perf:`, `chore:`, `--flag`, `~/path`).
- **Restraint:** dense but calm. Minimal color, monospace-first, rare accent.
  No emoji, no gradients-as-decoration (the one gradient — the token meter — is
  intentional and diegetic).

---

## 2. Color system

Defined as CSS custom properties in `styles.css` `:root`. Dark, warm graphite —
**never pure black/white**; everything is tinted warm.

### Surfaces (warm near-black graphite)
| Token | Hex | Use |
|---|---|---|
| `--bg` | `#0b0a08` | page background |
| `--bg-1` | `#100e0b` | panel |
| `--bg-2` | `#16130f` | elevated panel |
| `--bg-3` | `#1d1813` | hover / inset |
| `--bg-glow` | `#221b13` | warm glow |

### Borders
| Token | Hex |
|---|---|
| `--line` | `#292420` |
| `--line-soft` | `#201c18` |
| `--line-strong` | `#3a342c` |

### Ink (warm ivory ramp — text)
| Token | Hex | Use |
|---|---|---|
| `--ink` | `#ece6d7` | primary text |
| `--ink-2` | `#b9b1a0` | secondary |
| `--ink-3` | `#877f70` | muted |
| `--ink-4` | `#5d564c` | faint / labels |
| `--ink-5` | `#3b362f` | dividers / ghost |

### Accents (restrained, shared warmth)
| Token | Hex | Use |
|---|---|---|
| `--accent` | `#db8c4e` | muted orange — primary accent, cursors, active state |
| `--accent-2` | `#e7c277` | amber — headings highlight, warnings |
| `--green` | `#8fb573` | success, "available" dot, prompt user |
| `--red` | `#cd7a68` | error, diff-removed |
| `--blue` | `#7f9ec2` | info, links, prompt path |

**Accent is user-tweakable** (`--accent`) — options: `#db8c4e`, `#e7c277`,
`#8fb573`, `#7f9ec2`. The rule: accents share chroma/lightness, vary only hue.

Translucent washes: `--accent-wash` (12% orange fill), `--accent-line` (34%
orange border), `--green-wash`.

---

## 3. Typography

Two Google Fonts only:

- **`--mono` — JetBrains Mono** (200–700): the default body, all UI chrome,
  prompts, output, metadata. The site is monospace-first.
- **`--display` — Space Grotesk** (400–700): headings, names, project/post
  titles, metric numbers. Tight tracking (`letter-spacing: -0.01 to -0.02em`).

Base: `15px / 1.55`, antialiased, `optimizeLegibility`.

Key type patterns:
- `.h-display` — display headings, weight 600, negative tracking.
- `.eyebrow` — 11.5px uppercase, `0.16em` tracking, with a leading rule.
- `.hero-name` — `clamp(34px, 6.4vw, 68px)`.
- `.sec-head h2` — 22px section headers with index + trailing rule.

---

## 4. Spacing, radius, motion

- **Radius:** `--r: 4px` (base, tactile/near-square), `--r-lg: 7px` (panels).
  Pills/chips use `999px`.
- **Layout width:** `--shell-w: 1200px`, gutters `0 24px`.
- **Bars:** `--bar-h: 52px` (topbar), `--status-h: 30px` (statusbar).
- **Easing:** `--ease: cubic-bezier(0.22,0.61,0.36,1)` (slightly overdamped),
  `--ease-out: cubic-bezier(0.16,1,0.3,1)`.
- **Atmosphere:** fixed `.fx-grain` (SVG fractal noise, 5% overlay) +
  `.fx-vignette` (radial darkening). Both toggle off via `.no-grain`
  (Tweaks → "Film grain + vignette").
- **`prefers-reduced-motion`** is respected throughout; an `.anim-settled`
  safety class force-reveals any opacity-based entrance if animations stall
  (e.g. backgrounded tab) so nothing is left stuck invisible.

---

## 5. Layout & shell

```
.shell                       full-height flex column
 ├─ .topbar      (sticky top)   brand · nav · Ctrl+K · availability · burger
 ├─ .main / .shell-inner        active page (max 1200px, centered)
 └─ .statusbar   (sticky bottom) branch · ready · ~/route · token meter · location
```

- **TopBar** (`shell.jsx`): `kostadin@portfolio` brand mark, nav items rendered
  as `/home /portfolio …` with an active blinking block cursor, a `run Ctrl K`
  command-palette button, and a breathing green "available" dot.
- **StatusBar** (`shell.jsx`): faux git/CLI status. The **token meter** maps
  scroll depth to a token count (23k at top → 140k at bottom) with an animated
  ultracolor gradient text — purely decorative/diegetic.

---

## 6. Component vocabulary

Reusable primitives (see `styles.css` + `ui.jsx`):

- **`.panel`** — bordered surface with `.panel-head` (traffic lights + title +
  meta) and `.panel-body`. The base container for most content.
- **`.prompt`** — shell prompt line: `.who` (green user) · `.path` (blue) ·
  `.cmd` · `.flag` (amber). Paired with `.cursor` (blinking accent block).
- **`.think`** — Claude-Code-style "thinking" pill with a pulsing glyph.
- **`.stream-meter`** — token + elapsed counter that runs `live` then `settled`.
- **`.tool` / `.tool-head` / `.tool-line`** — collapsible tool-use block with
  run/done states (amber spinner → green check).
- **`.out`** — log/output lines with semantic colors: `.ok .warn .err .acc
  .muted .faint`.
- **Buttons `.btn`** — variants `.ghost`, `.primary`; caret `.car` in accent.
- **Badges:** `.chip` (pills), `.flag` (filter flags, `.on` = active),
  `.pill` (status: `.shipped .live .active .archived`).
- **`.metric`** — big Space-Grotesk number + label tile.
- **`.proj`** — project "deployment" card: commit head, fields, diff lines,
  footer with repo/live links.
- **`.statline` / `.kv`** — dotted-leader key/value rows.
- **`.trace`** — vertical timeline (about page) with lit nodes.

---

## 7. Signature interactions

These are the personality of the site — preserve them when editing:

1. **Bootloader** (`bootloader.jsx`) — a fake boot/compile sequence on first
   load. Skipped under reduced-motion. "New session" (palette / mobile / tweaks)
   replays it via `clearAllBoots()` + nonce bump.
2. **Streaming pages** (`streaming.jsx`) — page content types/streams in like a
   model response; `markBoot(pageId)` records "already seen" so re-visits don't
   re-animate.
3. **ASCII reveal** (`ascii-reveal.jsx`, `.ascii-reveal`) — images decode from
   scrambling ASCII glyphs into the photo (portrait, project art).
4. **Hero ASCII canvas** (`hero-ascii.jsx`, `.ascii-hero`) — interactive
   ASCII-shimmer hero banner.
5. **Ask console** (`ask-console.jsx`) — an interactive REPL mounted on home &
   about. Visitor types a question → echo → tool-use block → streamed answer,
   sourced from `data/qa.json`. Includes an animated scrambling "Ask me
   something" placeholder.
6. **Command palette** (`shell.jsx`, `Ctrl/Cmd+K`) — navigate, copy email, open
   github/linkedin, new session. Arrow-key + Enter driven.
7. **Bento portfolio grid** (`portfolio.jsx`, `.bento-grid`) — dense
   auto-flow grid with xl/wide/tall/s/m spans, cascading per-card reveal
   (title types in char-by-char, tags slide in, accent-fill CTA on hover),
   scan-line sweep, and an infinite-scroll sentinel.
8. **Blog post preview** (`blog.jsx`) — cursor-following floating image preview
   with a spring "pop" + idle breathing on hover.
9. **Mobile console drawer** (`shell.jsx`, `.mcon`) — full-screen nav sheet that
   slides down; nav items animate an accent edge-bar + arrow on press.

---

## 8. Tweaks (in-design controls)

Wired in `app.jsx` via `tweaks-panel.jsx`. Defaults in `TWEAK_DEFAULTS`:

| Tweak | Control | Options / default |
|---|---|---|
| `heroLayout` | radio | `boot` (default) / `split` |
| `accent` | color swatches | `#db8c4e` / `#e7c277` / `#8fb573` / `#7f9ec2` |
| `grain` | toggle | film grain + vignette on/off (default on) |
| — | button | "Replay streaming session" (new boot) |

---

## 9. Architecture

- **Single page**, hash-routed (`#home`, `#portfolio`, `#portfolio/<id>`,
  `#blog`, `#blog/<id>`, `#about`, `#contact`). Router in `app.jsx` `parseHash`.
- **React 18 + Babel standalone**, loaded as pinned `<script>` islands in
  `index.html` (deps before consumers). Hooks exposed as globals so each Babel
  island can use them. No build step.
- **Cross-island sharing:** each `.jsx` does `Object.assign(window, { … })` at
  the end to publish its components/data globally.
- **Content model** lives in `js/data.jsx` (`SITE`, `NAV`, `METRICS`,
  `PROJECTS`, `FLAGS`, `POSTS`, `CATEGORIES`, `VALUES`, `TIMELINE`) — edit
  copy/projects/posts here. Q&A answers live in `data/qa.json`.
- **Imagery:** project art in `project-images/*.svg` (striped placeholders) +
  `portrait.jpg`. SEO/no-JS fallback text is in the `<noscript>` block.

### File map
| File | Responsibility |
|---|---|
| `index.html` | shell, font/script loading, island order, no-JS fallback |
| `styles.css` | entire design system + all component/page styles |
| `js/data.jsx` | content model (site, projects, posts, timeline, metrics) |
| `js/app.jsx` | router, tweaks, shell composition, mount |
| `js/shell.jsx` | TopBar, StatusBar, CommandPalette, MobileConsole |
| `js/ui.jsx` | shared primitives (cursor, prompts, helpers) |
| `js/home.jsx` `portfolio.jsx` `about.jsx` `blog.jsx` `contact.jsx` | pages |
| `js/article.jsx` `project.jsx` | detail views (post / project) |
| `js/bootloader.jsx` `streaming.jsx` | boot sequence + stream animation |
| `js/ascii-reveal.jsx` `hero-ascii.jsx` | ASCII image/canvas effects |
| `js/ask-console.jsx` `qa.jsx` | interactive Q&A REPL + data |
| `js/tweaks-panel.jsx` | tweaks host protocol + controls |

---

## 10. Editing conventions

- **Stay monospace-first.** New UI chrome uses `--mono`; reserve `--display`
  for headings/titles/numbers.
- **Use the token palette**, never raw hex. If you need a new color, derive it
  with `oklch(from var(--accent) …)` so it stays in the warm family.
- **One accent at a time.** Don't introduce a second saturated hue; semantic
  green/red/blue are for state only.
- **Keep the CLI metaphor.** Label things as commits/flags/paths/output; new
  sections should read like terminal artifacts, not marketing copy.
- **Respect reduced-motion** and keep the `.anim-settled` safety net intact for
  any new opacity/entrance animation.
- **Content edits go in `data.jsx` / `qa.json`**, not in page components.
