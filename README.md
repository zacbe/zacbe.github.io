# zacbe.dev

Zacbé's personal site: TILs and weekend projects. Built with **Next.js** (static export) and
**Contentful**, hosted on **GitHub Pages** at https://zacbe.dev.

## Commands

```sh
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to ./out
npm run preview    # serve ./out locally
npm run typecheck
```

Node 22 (see `.nvmrc`).

## Environment

Copy `.env.example` to `.env.local` and fill in the Contentful values. `CONTENTFUL_SPACE_ID` and
`CONTENTFUL_ACCESS_TOKEN` (Delivery API) are required to build. Set `CONTENTFUL_PREVIEW_TOKEN`
to see unpublished drafts in `npm run dev`. Never commit `.env*` files.

## Contentful

The content model is defined in code, in `contentful/migrations/`. To apply a migration, put
`CONTENTFUL_SPACE_ID` and `CONTENTFUL_MANAGEMENT_TOKEN` in `.env.local` (gitignored) and run:

```sh
npm run migrate -- contentful/migrations/001-create-content-model.cjs   # add --yes to skip the prompt
```

Each migration runs once per environment. To change the model, add a new numbered file; don't
edit one that has already run.

| Content type | Used for |
|---|---|
| `til` | `/til`, `/til/[slug]`, `/til/tags/[tag]`, latest TILs on the home page |
| `project` | `/projects`, `/projects/[slug]`, featured projects on the home page |
| `link` | TIL sources |
| `siteSettings` (one entry) | name, role, contact links, `openToWork` status pill, Now box, `nextUp` ideas |
| `idea` | “next up” cards on `/projects` |
| `usesPage` (one entry) → `usesGroup` → `usesItem` | `/uses` |
| `resumePage` (one entry): pasted Markdown + PDF | `/resume` and `/zacbe-resume.pdf` |

TIL and project bodies are **Markdown**. Fenced code blocks are highlighted with Shiki at build
time. Raw HTML in Markdown is dropped.

## Common tasks

- **Add a TIL:** in Contentful, create a *TIL* entry (title, slug, date, tags, summary, body,
  optional gotcha, project and sources) and publish it.
- **Add a project:** create a *Project* entry, optionally with a cover image, and publish it.
- **Update Now, status or links:** edit the *Site settings* entry.
- **Update the resume:** in the *Resume* entry, paste the whole resume Markdown into the body,
  replace the PDF, and publish. The page count and "updated" date are worked out automatically.
  `src/lib/resume.ts` maps the Markdown onto the layout (`# Company, Location`,
  `**Role | Start - End**`, bullets, `**Stack:** a • b`, an Education/Languages table and a
  `Keywords:` line); anything else is still shown, as plain text.

Publishing or unpublishing in Contentful triggers a rebuild (see Deployment), and the site
updates in about two minutes.

## Deployment

`.github/workflows/deploy.yml` builds `./out` and deploys it to GitHub Pages on every push to
`main`, on manual runs, and on a `repository_dispatch` event of type `contentful-publish`.

One-time setup:

1. **Repo → Settings → Pages:** Source = GitHub Actions, custom domain `zacbe.dev`
   (`public/CNAME` is included in the build).
2. **Repo → Settings → Secrets and variables → Actions → Secrets:** add `CONTENTFUL_SPACE_ID`
   and `CONTENTFUL_ACCESS_TOKEN`.
3. **Contentful → Settings → Webhooks:** add a webhook that fires on Entry/Asset publish and
   unpublish:
   - URL: `POST https://api.github.com/repos/zacbe/zacbe.github.io/dispatches`
   - Headers: `Accept: application/vnd.github+json`, and a secret header
     `Authorization: Bearer <fine-grained GitHub token with Contents: read & write on this repo>`
   - Content type `application/json`, custom payload: `{ "event_type": "contentful-publish" }`

## Project layout

```
contentful/migrations/   content model, as code
scripts/migrate.mjs      runs a migration
src/app/                 routes (App Router)
src/components/          UI components (CSS modules)
src/lib/content.ts       the only module that talks to Contentful
src/lib/markdown.ts      Markdown → HTML (Shiki)
src/lib/resume.ts        resume Markdown → layout
src/app/globals.css      design tokens and base styles
handoff/                 design brief and reference mockups
```
