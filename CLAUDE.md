# CLAUDE.md — zacbe.github.io

Personal website for Zacbé (senior backend engineer), served at **https://zacbe.dev**.

## Stack (decided; don't revisit)

- **Next.js** App Router, TypeScript strict, `output: 'export'` with `trailingSlash: true` and no
  `basePath` (zacbe.dev is a custom domain; `public/CNAME` ships in the build).
- **Contentful** is the CMS. Bodies are **Markdown** (Long text), not Rich Text. The content
  model is code in `contentful/migrations/`; never change it by hand in the Contentful UI.
- **GitHub Pages** via `.github/workflows/deploy.yml`. A Contentful webhook triggers rebuilds
  through `repository_dispatch` (`contentful-publish`).
- The old Gatsby site and its `blogPost` / `person` content types are being retired. Their
  content is not migrated.

Read `README.md` for commands, environment, content types and deployment.

## Design

- `handoff/DESIGN.md`: tokens, components and behaviour. Source of truth for the UI. Its §3 is
  written as Markdown frontmatter; the equivalent Contentful types are in
  `contentful/migrations/001-create-content-model.cjs` (`gotcha` is a separate field instead of
  an MDX component; site and uses data are Contentful entries instead of `src/data/*.ts`).
- The **resume is one pasted Markdown document** plus a PDF in Contentful (`resumePage`). Zacbé
  wants to only copy and paste it: don't add structured resume fields. `src/lib/resume.ts`
  parses the Markdown's conventions; test it against `docs/Resume.md`.
- `handoff/design/*.html`: static reference mockups, one per page.
- All pages are built from the mockups. Check changes against them at 375, 768 and 1280px.

## Rules

- `.env.*` files hold Contentful tokens. **Never print, commit or copy them.** Next loads them
  itself; scripts must not echo their values.
- Only `src/lib/content.ts` imports the Contentful SDK. Pages use the plain types in
  `src/lib/types.ts`.
- Match the reference designs closely: spacing, type scale, colours and radii from DESIGN.md.
  Tokens live in `src/app/globals.css`; component styles in CSS modules.
- **Don't invent content.** Placeholders in the mockups come from Contentful. If a value is
  missing, leave a clearly marked TODO.
- Keep JavaScript minimal. Every page must render fully without JS; filters and search are
  progressive enhancement over server-rendered lists.
- Accessible by default: semantic HTML, `aria-current`, `aria-pressed`, focus styles, 4.5:1
  contrast, and `prefers-reduced-motion`.
- No RSS feed and no analytics unless asked.
- Every page must work at 375px width with no horizontal scrolling (code blocks scroll inside
  their box).
- Work on a branch; don't push to `main` without asking.

## Commands

Use npm. `npm run dev`, `npm run build`, `npm run preview`, `npm run typecheck`,
`npm run migrate -- <file>`. Run `npm run build` before saying something is done.
