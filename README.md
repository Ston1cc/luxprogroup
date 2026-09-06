# LUXPRO GROUP — pre-production checklist

Single-file static site (`index.html` + `politica-confidentialitate.html` + `img/`). No build step, no backend yet.

## Blockers (must-fix before launch)

1. **Lead form has no backend** — submissions save to `localStorage` only (`index.html`, `leadForm` submit handler). No email, no database, no notification. Every quote request currently vanishes into the visitor's own browser and never reaches the business.
2. **Placeholder reviews** — the 3 review cards literally say "Aici va apărea recenzia reală" — fake filler, must be swapped for real testimonials or removed until real ones exist.
3. **Stock photos everywhere** — hero background + all 7 portfolio/before-after images are Unsplash hotlinks, not real LUXPRO project photos. Hotlinking is also fragile (Unsplash can rate-limit or an image can disappear).
4. **No favicon** — browser tab and bookmarks show a blank/default icon.
5. **No `og:image`** — links shared on WhatsApp/Facebook/Viber show no preview image, which matters for a lead-gen business relying on social shares.
6. **Confirm `luxprogroup.md` is a real, owned, live domain** — canonical URLs and the privacy policy both reference it. If it's not live yet, that blocks launch, not just SEO.
7. **Decide fate of the "Admin" footer link** — it opens a client-side viewer reading the same dead `localStorage`. Once the form has a real backend, this either needs a real (authenticated) admin view or should be removed — right now it's a public link to nothing useful.

## Should-fix (quality bar for a paid client site)

8. **`robots.txt` + `sitemap.xml`** — neither exists.
9. **Cross-browser/device testing** — everything verified so far only in one Chromium instance. Needs a real pass on Safari/iOS (font rendering, `:has()` selector support for tier cards — Safari 15.4+ only, input styling) and a real Android phone.
10. **Form validation/spam protection** — no honeypot, no rate limiting, no captcha. Easy spam vector once wired to a real backend.
11. **Image optimization** — once real photos replace the stock ones, they need responsive `srcset`/compression, not one giant JPEG per image.
12. **Analytics** — no GA4/Plausible/Clarity wired in; launching blind to traffic and conversion behavior.
13. **Cookie consent banner** — the privacy policy mentions cookies/Google Maps; no actual consent mechanism exists yet for non-essential cookies.
14. **404 page** — none exists; broken links fall through to the server default.
15. **Legal entity details** — the privacy policy has no registration/IDNO number since none was provided; add it if LUXPRO GROUP is a registered SRL, for legal completeness.

## Nice-to-have (post-launch fine)

16. Language switcher UI — the `lang()` JS function and RO/RU/EN content already exist but there's no visible button to trigger it.
17. WhatsApp/Viber/Telegram links are unverified on real devices — deep-link schemes behave differently per OS.
18. Performance pass (Lighthouse) once real images are in — currently artificially fast because Unsplash images are lazy-loaded and modest in size.

## Stack notes

- Single HTML file per page, inline `<style>`/`<script>`, no framework, no bundler.
- Fonts: Bodoni Moda (display) + Jost (body), Google Fonts CDN.
- Icons: inline SVG sprite, no icon font/library.
- Backend decision pending: Supabase (Postgres-backed, managed, fast to ship) vs. self-hosted Postgres on a VPS (full control, more ops). Supabase free tier is sufficient for expected lead volume at this scale.
