# CV-MAKER

**Your career is bigger than a resume.**

CV-MAKER is a career platform for building structured resumes, sharing them as live links, and keeping one professional identity across every role you apply for. The repository contains the full marketing website plus a clickable workspace prototype.

**Made by [sakshamfit](https://github.com/sakshamfit).**

Site name: **CV-MAKER**  
Repository: [github.com/sakshamfit/CV-MAKER](https://github.com/sakshamfit/CV-MAKER)

---

## What it is

A static HTML, CSS and JavaScript product: a public website and an in-browser workspace. Nothing is uploaded or sent to a server. Forms open the visitor’s email app, and workspace results (parsing, AI writing, job matches, roadmaps, interview prep) are simulated with sample data.

The idea is simple:

1. **Build** a resume (from scratch or by uploading a PDF/Word file).
2. **Share** it as a PDF *or* as a live link (a **CVID**) that always shows the latest saved version.
3. **Connect** every resume under one **Global ID (GID)** — your persistent professional hub.
4. **Use career tools** on top of each resume: job discovery, tailoring, roadmap and interview prep.
5. **For colleges:** a placement workspace to import a roster, collect student consent, review readiness and share time-limited recruiter shortlists.

---

## Two products in one repo

| Surface | Where | Who it is for |
| --- | --- | --- |
| Marketing site | `dist/*.html` | Visitors, students, professionals, placement cells |
| Workspace MVP | `dist/app/` | Click-through prototype of the product (sample data only) |

Everything published lives in `dist/`. The HTML is **generated** from templates in `tools/site/` — edit those, then rebuild.

---

## Quick start

Serve the static site from `dist/`:

```bash
python3 -m http.server 8137 --directory dist
```

Then open [http://localhost:8137](http://localhost:8137).

Any static server works (`npx serve dist`, Caddy, nginx, GitHub Pages). There is no backend and no build step required just to view the site.

---

## Rebuild the HTML

After you change templates:

```bash
node tools/build-site.mjs
```

This writes every page into `dist/` (website pages at the root, workspace pages under `dist/app/`).

| Source | What it generates |
| --- | --- |
| `tools/site/shared.mjs` | Icons, `<head>`, header, footer, plan cards, **CV-MAKER** wordmark |
| `tools/site/home.mjs` | Home page |
| `tools/site/pages.mjs` | Features, Pricing, About, Contact, For Institutions |
| `tools/site/app.mjs` | All workspace screens |
| `tools/build-site.mjs` | The build script itself |

CSS and JavaScript in `dist/css/` and `dist/js/` are authored directly (not generated).

---

## Website pages

All paths below are relative to `dist/`.

### Home — `index.html`

A long-scroll landing page:

1. **Logo intro** — two PDF cards fly into the CV mark, the **CV-MAKER** wordmark appears, then the lockup lands in the header. Skippable (click, key, scroll or touch). Honours `prefers-reduced-motion`.
2. **Hero** on a sky background — “Your career is bigger than a resume,” with a still comparison: a static PDF next to a live profile on a laptop.
3. **Launch film** — 30-second silent video that grows to full width on scroll.
4. **The problem** — copies go out of date, your story is scattered, little visibility after you send a file.
5. **How it works** — five-step stepper (create/upload → refine → preview → PDF or live link → manage identity and tools).
6. **Global ID and CVIDs** — one identity, many resumes, each with its own link and job matches.
7. **Core benefits** — structured resume, PDF, live link, QR card, analytics, career tools.
8. **Career-tools ring** — eight features on a slowly turning ring.
9. **Workspace preview** — live iframes of Dashboard, Builder and Live CV (`?embed=1`).
10. **Pricing preview** — three plan cards (names, prices and allowances are placeholders).
11. **FAQ** — draft answers; policy-dependent ones are tagged pending.
12. **Closing card** — grows on scroll, with a create-resume CTA.

### Other marketing pages

| Page | Contents |
| --- | --- |
| `features.html` | Filterable grid: Build, Share, Career tools, Institutions |
| `pricing.html` | Plan cards, full comparison table, billing FAQs (placeholders until approved) |
| `about.html` | Why CV-MAKER exists (people + placement cells), three principles, future direction |
| `contact.html` | Support / business / colleges routes; form opens the visitor’s mail app |
| `for-institutions.html` | Placement workspace pitch, 5-step flow, consent model, demo request, FAQs |

---

## Workspace prototype (`dist/app/`)

A clickable MVP with **sample data only**. Sign-in is simulated. The working resume and a few choices persist in `localStorage` under the `cvmaker.` prefix.

Add `?embed=1` to any workspace page to render it inside the home-page preview (noindex, `base target=_top`).

| Page | What you can try |
| --- | --- |
| `index.html` | Sign in (demo) or continue into the sample workspace |
| `dashboard.html` | Returning vs new-user states; GID, resumes, analytics, career tools |
| `gid.html` | Edit hub details, copy/share the public GID link, see CVIDs on the tree |
| `resumes.html` | Filter live/draft; empty-state demo toggle |
| `builder.html` | Fresher or experienced path; scratch or upload (simulated parse); editor with live preview and writing assistant |
| `preview.html` | Download PDF (simulated) or **Make it live** (CVID + QR card) |
| `analytics.html` | 7 / 30 / 90 day ranges; account totals vs per-CVID; country and device only — never who viewed |
| `jobs.html` | Job matches for one CVID at a time; match / none / error demo states |
| `tailoring.html` | Paste a job description → tailored resume + cover letter (simulated) |
| `roadmap.html` | Path from current field to an optional target field |
| `interview.html` | Study guide, practice Q&A and a quick reference for a role |
| `settings.html` | Profile, privacy placeholders, link to consent |
| `subscription.html` | Plan and usage placeholders; membership states (available, limit, upgrade, payment pending) |
| `consent.html` | Student view of a college access request (Allow / Not now / withdraw) |
| `institution.html` | Placement workspace: roster, filters, student drawer, XLSX export, time-limited shortlists, roster import with validation, officers |

Query helpers used by the marketing preview:

- `builder.html?embed=1&step=editor`
- `preview.html?embed=1&live=1`
- `builder.html?start=upload`

---

## Core ideas

### Global ID (GID)

One per person. It is the account-level identity and public hub: headline, current role, and a chosen primary resume. Example in the demo: `cv-maker.app/id/GID-12345-67890`.

### CVID

A **permanent shareable link for one specific resume**. Edit and save that resume, and the same link shows the latest version. Each CVID has its own QR card, analytics and job matches. Example: `cv-maker.app/cv/design-a1b2`.

GID : CVID is **one identity, many tailored resumes** — not one file you keep rewriting.

---

## Features (website + workspace)

**Build**

- Resume Builder with **fresher** and **experienced** paths
- Upload PDF or Word (simulated parsing into the editor — always review extracted text)
- Writing assistant: Improve, Shorten, Elaborate, Professional, Add metrics
- Live preview that follows every edit
- PDF export for applications that still want a file

**Share**

- Live CV / CVID with QR share card
- Global ID public hub
- Resume analytics (views, unique devices, country, device — never a person’s name)

**Career tools**

- Job Discovery (matches per CVID, with strength and “why”)
- Job Tailoring (job description → tailored resume + cover letter)
- Career Roadmap (current field → optional target)
- Interview Prep (study guide, Q&A, quick reference)

**Institutions**

- Institution-scoped placement workspace
- CSV / XLSX roster import with validation
- Student invitations and **consent first** (Allow / Not now; withdraw anytime)
- Readiness dashboard (completeness + an *advisory* quality score — never used to gate drives)
- Filters, XLSX export, expiring recruiter shortlists that re-check consent on open
- Students keep their GID and live links for free after graduation

Planned (shown as roadmap chips, not built): campus drives, resume review/sign-off, placement outcomes, application tracker.

---

## Design system

- **Type:** Geist (UI) and Geist Mono (IDs, links, labels) — `dist/assets/fonts/`
- **Brand blue:** `#0663FC`, cyan `#16B9ED`
- **Logo:** inline SVG CV mark + **CV-MAKER** wordmark (see `brandLockup` in `tools/site/shared.mjs`)
- **Favicon:** `dist/assets/favicon.svg`
- Shared tokens and components: `dist/css/base.css`
- Website layouts: `dist/css/site.css` + `dist/js/site.js`
- Intro animation: `dist/css/intro.css` + `dist/js/intro.js`
- Workspace: `dist/css/app.css` + `dist/js/app.js`
- Shared JS helpers (toasts, dialogs, reveals, QR): `dist/js/core.js`
- Vendored: Lenis (smooth scroll), qrcode-generator

Visuals are HTML, CSS and SVG. The only raster images shipped with the site are the launch-film poster (a frame of the film) and the original brand JPEG kept under `brand/` for the Remotion project.

---

## Launch film

`dist/assets/livecv-launch.mp4` (poster: `livecv-launch-poster.jpg`) is a silent 30s, 1920×1080 film rendered from the Remotion project in `video/`.

```bash
cd video
npm install
npm run render   # out/livecv-launch.mp4
npm run poster   # out/livecv-launch-poster.jpg
```

Copy both files into `dist/assets/`. See `video/README.md` for the scene list.

---

## Content rules

- Prices, allowances and unapproved policies render as blue dashed placeholders such as `[Price]`, or a **To confirm** / **Pending approval** tag.
- Analytics never identify viewers (country and device only).
- Sample people and companies are fictional (Alex Morgan, Acme Corporation, and the college roster).
- Nothing is uploaded or sent: contact and demo forms open a `mailto:` draft.
- Workspace AI and parsing flows are **simulated** so the prototype can be clicked without an API.

---

## Repository layout

```
CV-MAKER/
├── README.md                 ← you are here
├── .github/workflows/pages.yml
├── brand/                    original logo JPEG
├── dist/                     published static site
│   ├── index.html            home
│   ├── features.html
│   ├── pricing.html
│   ├── about.html
│   ├── contact.html
│   ├── for-institutions.html
│   ├── app/                  workspace MVP
│   ├── assets/               fonts, favicon, launch film
│   ├── css/
│   └── js/
├── tools/
│   ├── build-site.mjs
│   └── site/                 HTML templates
└── video/                    Remotion launch film
```

---

## Deploy

`.github/workflows/pages.yml` publishes `dist/` to **GitHub Pages** on every push to `main` (and on manual dispatch).

The site is static, so it also deploys cleanly to any CDN or host that can serve a folder (Vercel, Netlify, S3, nginx). Point the host at `dist/`.

---

## Made by

**sakshamfit** — [github.com/sakshamfit](https://github.com/sakshamfit)

CV-MAKER, 2026.
