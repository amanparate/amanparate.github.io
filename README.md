# amanparate.github.io

Personal developer portfolio for **Aman Parate** — Salesforce Developer.

Live site (once deployed): `https://amanparate.github.io/`

## Structure

```
.
├── index.html          # all page content/markup
├── css/style.css        # theme, layout, responsive styles
├── js/script.js         # nav, dark mode, scroll animations, stat counters
├── assets/
│   ├── favicon.svg
│   └── Aman_Parate_Resume.pdf   # replace with an updated copy any time
└── README.md
```

No build step, no dependencies — it's plain HTML/CSS/JS, so it deploys directly to GitHub Pages.

## Deploy to GitHub Pages

1. Create a new repository on GitHub named **exactly** `amanparate.github.io`
   (this special name makes GitHub serve it at the root domain automatically).
2. Push this folder's contents to the `main` branch:

   ```bash
   cd amanparate.github.io
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/amanparate/amanparate.github.io.git
   git push -u origin main
   ```

3. In the repo, go to **Settings → Pages**, and under "Build and deployment" confirm
   the source is **Deploy from a branch**, branch `main`, folder `/ (root)`. (For a
   `username.github.io` repo this is usually already the default — no Actions/build
   step needed.)
4. Wait a minute or two, then visit `https://amanparate.github.io/`.

If you'd rather host it as a project site under an existing repo instead (e.g.
`github.com/amanparate/portfolio`), it will be served at
`https://amanparate.github.io/portfolio/` instead — same steps, just a different
repo name and Pages will need to be enabled for that repo specifically.

## Customizing

- **Content**: everything is hand-written in `index.html` — search for the section
  you want to change (`<section id="about">`, `<section id="projects">`, etc.).
- **Colors/theme**: CSS custom properties live at the top of `css/style.css`
  (`:root { --brand-600: ... }`). Dark mode variables are defined right below.
- **Resume**: drop a new PDF at `assets/Aman_Parate_Resume.pdf` (same filename) to
  update the "Resume" button without touching any markup, or rename both the file
  and its two references in `index.html`.
- **Projects**: the Projects section currently features Apex Doctor. To add another
  project, duplicate the `.project-card` block and adjust the content, tags, and link.

## Notes

- The public phone number from the résumé was intentionally left off the public
  page to avoid spam; email and LinkedIn are the primary contact channels. Add it
  back in the Contact section of `index.html` if you'd like it listed.
- Fonts (Inter, JetBrains Mono) load from Google Fonts; icons are inline SVG — no
  external icon library needed.
