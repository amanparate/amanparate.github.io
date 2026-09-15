# amanparate.github.io

Personal developer portfolio for **Aman Parate** — Senior Salesforce Developer.

Live site: `https://amanparate.github.io/`

The site is styled like a streaming-service "Original Series" page: a **"Who's watching?"
profile picker** that reorders the sections for recruiters, hiring managers or developers,
a cinematic hero with the show title, an **episode-thumbnail row** for the case studies,
a **3D rotating skills carousel**, "seasons" for the career timeline, a feature-film style
Apex Doctor showcase, and Trailhead-style hexagon badges. Plain HTML/CSS/JS — no framework,
no build step.

> Not affiliated with any streaming service, or with Salesforce. No third-party logos are used.

## Structure

```
.
├── index.html           # all page content/markup (sections are "episodes")
├── css/style.css        # theme tokens, profile picker, carousel, rows, seasons, responsive
├── js/script.js         # profiles, carousel, tabs, lightbox, GitHub live stats, Trailhead card
├── assets/
│   ├── aman.jpg                 # YOUR PHOTO — square, ≥ 400×400px (initials show until it exists)
│   ├── ApexDoctorLogo.jpg       # Apex Doctor logo (jpg/png/svg/webp all work — exact name, case-sensitive)
│   ├── favicon.svg
│   ├── og-image.png             # 1200×630 preview card for LinkedIn / WhatsApp / Twitter
│   ├── Aman_Parate_Resume.pdf   # replace with an updated copy any time (keep the filename)
│   └── apex-doctor/*.webp       # real screenshots from the Apex Doctor repo
└── README.md
```

## Publishing changes

The repo lives locally at `~/Projects/amanparate.github.io`. After editing any file:

```bash
cd ~/Projects/amanparate.github.io
git add .
git commit -m "Describe what changed"
git push
```

GitHub Pages redeploys automatically within a minute. Hard-refresh the browser
(`Cmd+Shift+R`) if you still see the old version.

## Editing guide

| What to change | Where |
|---|---|
| Your photo | drop a square JPG at `assets/aman.jpg` — nothing else to change |
| Apex Doctor logo | drop it at `assets/ApexDoctorLogo.jpg` (or .png/.svg/.webp) — the showcase picks it up automatically |
| Profiles (names, "match %", row title, hero button, section order per profile) | `js/script.js` → `const PROFILES = {...}` — `order` lists the `data-ep` names of the sections |
| Profile picker text / avatars | `index.html` → `<div class="profiles">` |
| Show title, subtitle, genre tags, description, hero footer line | `index.html` → `<section class="hero">` |
| Episode thumbnails row ("Top Picks") | `index.html` → `<section id="streaming">` — each `<a class="ep-card">`; `data-tab="tab-billing"` etc. opens that case study |
| My Story text + "Currently" / Quick facts | `index.html` → `<section id="story">` |
| Skills carousel cards | `index.html` → `<div class="carousel-stage">` — each `<article class="car-card">`; add/remove cards freely, the carousel re-spaces itself |
| How I Work principles / lead value | `index.html` → `<section id="how">` |
| Case studies (text, diagrams, outcomes) | `index.html` → `<section id="cases">` — each `.cs` panel is one study; diagrams are inline SVG |
| Career "seasons" (roles and bullets) | `index.html` → `<section id="seasons">` — each `<article class="season">`; `is-airing` marks the current role |
| Apex Doctor showcase (screenshots, features, stats) | `assets/apex-doctor/` + `<section id="feature">` — `.thumb` buttons swap the framed screenshot; `.feature-grid` holds the six feature tiles |
| Certifications (hexagon badges, grouped by track) | `index.html` → `<section id="awards">` — add an `<li class="cert">` inside the right track and bump the `13` in the heading |
| Trailhead card (rank, badges, points, superbadges) | `js/script.js` → `const TRAILHEAD = {...}` |
| Talks / blog posts / community | `js/script.js` → `const COMMUNITY = [...]` (hidden while empty) |
| Contact details | `index.html` → `<section id="contact">` |
| Colours / fonts | top of `css/style.css` (`:root { --red: ... }`) — the display font is Bebas Neue from Google Fonts, body is Inter |
| Social preview image | regenerate `assets/og-image.png` (1200×630) |
| Resume PDF | overwrite `assets/Aman_Parate_Resume.pdf` |

### Notes

- The chosen profile is remembered in the visitor's browser (`localStorage`), so the picker
  shows only on the first visit; the chip in the top bar reopens it.
- The "Live from GitHub" tiles call the public GitHub API from the visitor's browser (60 requests/hour
  per IP, no token). If it's rate-limited the tiles show "—" and a note; nothing breaks.
- The skills carousel auto-rotates every ~4s, pauses on hover, and supports drag/swipe, the arrows,
  the dots, and clicking a side card. It honours `prefers-reduced-motion`.
- The phone number from the résumé is intentionally left off the public page; email and
  LinkedIn are the contact channels.
