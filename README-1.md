# Ziaulhaq Rahimi — Portfolio

A premium, single-page portfolio for Ziaulhaq Rahimi — banking operations & compliance
professional (Afghan United Bank, Herat) — built as a static site for GitHub Pages.

## Structure

```
index.html              Main page (all sections)
assets/css/style.css    Design system, layout, animations, dark/light theme
assets/js/main.js       Cursor, particles, reveals, counters, tilt, theme toggle, contact form
assets/icons/favicon.svg
manifest.json
robots.txt
sitemap.xml
```

No build step and no backend — it's pure HTML/CSS/JS plus two CDN scripts (GSAP +
ScrollTrigger, used only as a light progressive enhancement) and Font Awesome for icons.

## Run locally

Just open `index.html` in a browser, or serve it locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

1. Push this folder to a repo named `zia-rahimi1997.github.io` (or any repo, using the
   `/docs` or a `gh-pages` branch).
2. In the repo **Settings → Pages**, set the source to the branch/folder containing
   `index.html`.
3. Your site will be live at `https://<username>.github.io/`.

If you deploy under a project repo (e.g. `username.github.io/portfolio`), update the
`og:url`, `twitter:image`, canonical link in `index.html`, and the URL in `sitemap.xml`
and `robots.txt` to match.

## Customizing

- **Colors / fonts**: edit the CSS custom properties at the top of `assets/css/style.css`
  (`:root` for dark theme, `html[data-theme="light"]` for light theme).
- **Content**: all copy lives directly in `index.html`, organized by section
  (`<!-- HERO -->`, `<!-- EXPERIENCE -->`, etc.).
- **Résumé button**: currently opens a pre-filled email requesting the résumé. Replace the
  `href` on `#resume` with a direct link to a hosted PDF (e.g. `assets/Ziaulhaq-Rahimi-Resume.pdf`)
  once you have one to link.
- **Contact form**: submits via `mailto:` (no backend, works on GitHub Pages). To capture
  submissions server-side instead, wire it to a form service such as Formspree or Netlify
  Forms and update `assets/js/main.js`.

## Notes

- Respects `prefers-reduced-motion` — decorative animation (cursor, particles, tilt,
  magnetic buttons, typewriter) is disabled automatically for users who request it.
- Dark theme is the default; the toggle in the nav switches to light and remembers the
  choice in `localStorage`.
