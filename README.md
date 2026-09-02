# amanparate.github.io

Personal developer portfolio for **Aman Parate** — Senior Salesforce Developer.

Live site: `https://amanparate.github.io/`

The UI is modelled on Salesforce Lightning Experience (global header, app navigation
bar, a Contact record highlights panel, a Sales Path for career stages, Lightning cards,
Trailhead-style hexagon badges, and a utility bar). It is built with plain HTML/CSS/JS —
no framework, no build step — using SLDS design tokens re-implemented by hand.

> UI inspired by the Salesforce Lightning Design System. This is a personal portfolio and
> is not affiliated with or endorsed by Salesforce.

## Structure

```
.
├── index.html           # all page content/markup
├── css/style.css        # SLDS-inspired tokens, layout, components, dark mode, responsive
├── js/script.js         # path stages, global search, toasts, timeline, theme, nav
├── assets/
│   ├── aman.jpg                 # YOUR PHOTO — square, ≥ 400×400px (initials show until it exists)
│   ├── favicon.svg
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
| Name, title, tagline, highlight fields | `index.html` → `<section class="card highlights">` |
| My Story text + "Currently" block | `index.html` → `<section id="about">` |
| How I Work principles / lead value | `index.html` → `<section id="how-i-work">` |
| Case studies (text, diagrams, outcomes) | `index.html` → `<section id="case-studies">` — each `.tab-panel` is one study; diagrams are inline SVG |
| Trailhead profile card (rank, badges, points, superbadges) | `js/script.js` → `const TRAILHEAD = {...}` — the card stays hidden until `profileUrl` is set |
| Talks / blog posts / community | `js/script.js` → `const COMMUNITY = [...]` |
| Apex Doctor showcase (screenshots, features, stats) | `assets/apex-doctor/` + `<section id="projects">` — `.thumb` buttons swap the framed screenshot; `.feature-grid` holds the six feature tiles |
| Career Path stages (labels) | `index.html` → `<ol class="path" id="careerPath">` |
| Career Path details (Key Fields / Guidance text per stage) | `js/script.js` → `const STAGES = [...]` |
| Details fields (years, downloads, education…) | `index.html` → `<section id="details">` |
| Skills pills | `index.html` → `<section id="skills">` |
| Certifications (hexagon badges, grouped by track) | `index.html` → `<section id="certifications">` — add an `<li class="cert">` inside the right track and bump the `(13)` count |
| Work experience bullets | `index.html` → `<section id="experience">` |
| Project text, "Why I built it", features | `index.html` → `<section id="projects">` |
| Contact details | `index.html` → `<section id="contact">` |
| Colours / spacing tokens | top of `css/style.css` (`:root { --brand: ... }`), dark-mode overrides just below |
| Resume PDF | overwrite `assets/Aman_Parate_Resume.pdf` |

### Notes

- The global search (top bar, or press `/`) indexes sections, skill pills, certifications,
  roles, and the project automatically — nothing to maintain when you add content.
- The "Live from GitHub" tiles call the public GitHub API from the visitor's browser (60 requests/hour
  per IP, no token). If it's rate-limited the tiles show "—" and a note; nothing breaks.
- The current-role duration in the Career Path ("1 yr 9 mos") is computed at runtime from
  `Jan 2025`; update the start date in `js/script.js` if you change roles.
- The phone number from the résumé is intentionally left off the public page; email and
  LinkedIn are the contact channels. Add it in the Contact card if you'd like it listed.
