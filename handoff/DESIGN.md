# zacbe.dev — Design brief

Personal site for Zacbé, a senior backend engineer. The site gives him a reason to write down
what he learns (**TIL**) and his **weekend projects**. Everything else supports those two.

Direction: **"Clean engineer"**. Light, minimal and very readable, with small terminal touches:
the `> ZBē` prompt logo, mono labels and `> ls ./til` style kickers.

Reference pages live in `handoff/design/`. Open them in a browser. They are static mockups with
inline styles. Match them visually, but build them with proper components and CSS, not by copying
the inline styles.

| Reference file | Route | Purpose |
|---|---|---|
| `home.html` | `/` | Intro, Now, latest 5 TILs, 3 featured projects, contact |
| `til.html` | `/til` | Full TIL archive: search, tag filter, grouped by month |
| `til-entry.html` | `/til/[slug]` | One TIL entry |
| `projects.html` | `/projects` | Featured project + grid, status filter, "next up" idea card |
| `project-entry.html` | `/projects/[slug]` | Project write-up |
| `uses.html` | `/uses` | Tools and setup |
| `resume.html` | `/resume` | Short web resume + PDF download |
| `logo-terminal-prompt.html` | — | Main logo `> ZBē` with block cursor (used in the header) |
| `logo-code-tag.html` | — | Alternate mark `<ZBē/>` (avatar / social use) |

Everything in `[square brackets]` in the mockups is a **placeholder**. Never replace one with
invented content. Real values come from the content files described below.

---

## 1. Tokens

### Color

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FAFAF9` | Page background |
| `--surface` | `#FFFFFF` | Cards, Now box, sidebar boxes |
| `--ink` | `#121417` | Primary text, dark buttons, dark bands |
| `--text-2` | `#3A3F47` | Lead paragraphs |
| `--text-3` | `#4A4F57` | Secondary body text |
| `--muted` | `#5A5F67` | Dates, meta, mono labels (passes 4.5:1 on `--bg`) |
| `--border` | `#E3E4E1` | Card borders |
| `--divider` | `#D9DAD6` | List and section rules |
| `--chip` | `#EEEFEC` | Tag chips, image placeholders |
| `--input-border` | `#C9CCC8` | Inputs, unselected filter buttons |
| `--accent` | `#0B7A5C` | Primary buttons, `>` prompt, mono labels |
| `--accent-ink` | `#0B6B52` | Accent text and links, link hover |
| `--accent-soft` | `#E7F3EF` | Status pill, "from [project]" chip, cross-link card |
| `--callout-bg` / `--callout-border` | `#EEF7F3` / `#CFE6DE` | "gotcha" box in TILs |
| `--dark-border` | `#2A2E33` | Rules inside dark bands |
| `--dark-muted` | `#9AA09B` | Muted text on dark |
| `--dark-link` | `#C9CCC8` | Footer links |
| `--mint` | `#5FD3B8` | Accent on dark backgrounds (contact band buttons, code highlights) |
| `--terminal` | `#0F2A31` | Terminal snippet background on /uses |

Code blocks use `--ink` for the background, `#E6E9E6` for text and `#8A918C` for comments.

### Typography

- **Sans:** `Space Grotesk` at weights 400, 500 and 700. Self-host it with `@fontsource/space-grotesk`.
- **Mono:** `Menlo, 'Fira Mono', ui-monospace, monospace`. Self-host Fira Mono 400 as the
  fallback. The logo and terminal kickers deliberately use Menlo first.

| Role | Size | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|
| Page H1 | `clamp(40px, 6vw, 72px)` | 700 | -0.04em | 1 |
| Section H2 (home) | `clamp(30px, 4vw, 44px)` | 700 | -0.03em | 1.1 |
| Article H1 (TIL) | `clamp(34px, 5vw, 52px)` | 700 | -0.03em | 1.1 |
| Article H2 | 24–28px | 700 | -0.01 / -0.02em | 1.3 |
| Lead | 19–22px | 400 | — | 1.6 |
| Body | 17px (pages), 18px (articles) | 400 | — | 1.6 / 1.7 |
| List titles | 20px | 500 | — | 1.4 |
| Mono meta | 13–15px | 400 | — | — |

### Layout and shape

- Container: `max-width: 1120px`, side padding `24px`. Article column: `max-width: 760px`.
- Section rhythm: 56–96px vertical padding. Header padding is 28px.
- Radii: pills `999px` (buttons, chips, filters), cards `16px`, featured card and hero `20px`,
  code blocks and callouts `12px`, avatar tile `10px`.
- Borders are 1px; outline buttons use `1.5px`.
- Responsive: everything uses `flex-wrap` and `grid-template-columns: repeat(auto-fit, minmax(...))`.
  There are no fixed breakpoints in the mockups, but check every page at 375px, 768px and 1280px.
  The nav wraps under the logo on phones.

---

## 2. Components

- **Header:** logo `> ZBē` (the `>` in accent, mono 22px) on the left. On the right: TIL · Projects ·
  Uses · a **Resume** pill (outline). The current page is underlined in accent (2px, offset 6px);
  on `/resume` the pill is filled ink instead. Use `aria-current="page"`.
- **Footer:** an ink band with `© [year] Zacbé` and links to TIL · Projects · Uses · Resume.
- **Contact band** (home): an ink band with a mono `> contact --open` kicker, a big headline, and
  mint primary / outline secondary pill buttons.
- **Buttons:** primary = accent fill with white text; secondary = 1.5px ink outline; on dark =
  mint fill or `#5A5F67` outline. Padding is 12–14px × 22–24px. Minimum touch target is 44px.
- **Tag chip:** mono 13px, `--chip` background, pill. The project chip uses `--accent-soft` with
  `--accent-ink` text.
- **Status pill:** `● in progress` (accent-soft), `shipped` (ink fill, white text), `archived`
  (outline, muted).
- **TIL row:** date (mono, muted) · title (20px/500) · optional summary · tags. The whole row is
  one link, with a divider between rows.
- **Project card:** an image/diagram area, name, one-liner, stack in mono, then a footer row
  ("Read write-up →" plus `[N] TILs · upd. [MMM YYYY]`).
- **Now box:** a white card with an `updated [Month YYYY]` label and a `dl` of building, learning and
  reading, with mono accent terms.
- **Code block:** dark, with a caption bar showing the filename and language. Use Shiki with a
  theme close to the mockup colors.
- **Gotcha callout:** `--callout-bg` with a 1px `--callout-border` all around (no left-border
  stripe), and a mono "gotcha" label.
- **Filter buttons:** real `<button aria-pressed>`, 44px tall pills. The selected one is ink-filled.
- **Prompt kicker:** `> ls ./til`, `> cat ./uses.md` and so on, in mono 15px muted with the `>` in
  accent. One per index page.

---

## 3. Content model (Markdown / MDX)

### TIL: `src/content/til/<slug>.md(x)`

```yaml
title: "One-line statement of what I learned"
date: 2026-10-27
tags: [postgres, performance]
summary: "One sentence shown in the archive."
project: my-project-slug      # optional: links to a project
sources:
  - { title: "Docs page", url: "https://…" }
draft: false
```

Body structure (keep entries to roughly 100–300 words):

1. An opening paragraph with the context: what I was doing and what surprised me.
2. `## What I learned`: a short explanation plus a code block.
3. `## Why it matters`
4. A `<Gotcha>…</Gotcha>` MDX component (optional).

Sources are rendered from frontmatter, not from the body.

### Project: `src/content/projects/<slug>.md(x)`

```yaml
title: "Project name"
summary: "What it is and why I built it, two lines max."
status: in-progress            # in-progress | shipped | archived
featured: true
stack: [go, postgres, redis]
started: 2026-08
updated: 2026-10
timeSpent: "4 weekends"
links: { code: "https://github.com/…", demo: "https://…" }
cover: ./cover.png             # optional
```

Body sections: `## Why I built it`, `## How it works` (with an optional diagram image),
`## What was hard` (numbered), `## What I'd do differently`.

### Site data: `src/data/site.ts`

Holds the name, role, location, `openToWork` (boolean, which drives the status pill text), email,
GitHub, LinkedIn, `now: { building, learning, reading, updated }`, and `nextUp` ideas for the
projects page.

### Uses: `src/data/uses.ts`

Groups: Editor & terminal, Dev tools & CLI, Homelab & hosting, Hardware, Everyday apps. Each item
is `{ name, why }`. It also holds `lastUpdated`, `dotfilesUrl`, and an optional favourite command
snippet.

### Resume: `src/data/resume.ts` + `public/zacbe-resume.pdf`

Holds the summary, the 3 most recent roles (role, company, period, team line, 2–3 result bullets,
stack), skills groups, education, languages, PDF page count and `updated`. Every "Download PDF"
link points to `/zacbe-resume.pdf` with the `download` attribute. The PDF is a static file in the
repo, not a Google Drive link.

---

## 4. Behaviour

- **Home:** shows the latest 5 non-draft TILs and up to 3 `featured` projects.
- **/til:** groups entries by month, newest first. Tag filter buttons and a search box work
  client-side, either as a small vanilla JS island or with Pagefind for search. The page must
  still list every entry with JavaScript disabled. Also generate `/til/tags/[tag]` pages.
- **TIL entry:** shows reading time, links to the previous and next entries, and a
  "learned while building [Project]" card when `project` is set.
- **/projects:** shows the featured project on top, then the rest sorted by `updated`. The status
  filter works client-side. Each card's TIL count is computed from TILs whose `project` matches.
- **Project write-up:** lists the TILs that came from the project, with links to the previous and
  next projects.
- **Status pill:** driven by `site.openToWork`.
- **SEO:** a title and description per page, Open Graph tags, and a sitemap. **No RSS feed**
  (Zacbé decided against one).
- **Accessibility:** semantic landmarks, real links and buttons, visible focus styles, 4.5:1
  contrast, and `aria-hidden` on decorative SVGs.
- **Motion:** only the logo's blinking cursor. Respect `prefers-reduced-motion`.
