# Friska Wellness — Website

Static site (HTML/CSS/JS), no build step. Hosted on GitHub Pages.
Palette and typography match the Friska quote generator (navy #0a1a6e, emerald #10b981, Poppins).

## Structure
```
Friska-Website/
├── index.html
├── about.html
├── blog.html
├── privacy-policy.html
├── terms-conditions.html
├── refund-policy.html
├── CNAME
├── css/
│   └── style.css
├── js/
│   └── main.js
└── assets/
    └── (your images — see assets/README.md)
```
All six HTML pages share `css/style.css` and `js/main.js`. Change the palette in the
`:root` block at the top of style.css and every page updates.

## Local preview
```bash
cd Friska-Website
python3 -m http.server 8000
```
Open http://localhost:8000 — catches broken paths before you push.

## Deploy
Repo → Settings → Pages → Source: `main` branch, `/root`.
Staging URL: https://friskawellnessfoods.github.io/Friska-Website/

## Domain cutover (do this LAST, after the site is finished)
1. Repo → Settings → Pages → Custom domain: `friskawellness.com` → Save
2. At the registrar, set DNS:
   - `A` @ → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - `CNAME` www → `friskawellnessfoods.github.io`
3. Wait for propagation, then tick "Enforce HTTPS"
4. Only then cancel Wix. Wix stays live and serving leads until this step.

## Still to do
- Add real images to `assets/` (see assets/README.md for exact filenames)
- Replace placeholder testimonials on index.html with real reviews
- Write real blog posts (blog.html currently has 3 placeholder cards)
- Contact form (deliberately skipped — CTAs go to WhatsApp for now)
- Link in the quote generator and other tools
