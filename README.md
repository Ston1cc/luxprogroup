# LUXPRO GROUP — pre-production checklist

Single-file static site (`index.html` + `politica-confidentialitate.html` + `img/`). No build step. Backend: Supabase.

## Resolved

- ~~Lead form has no backend~~ — `leadForm` now inserts directly into a Supabase `leads` table via `supabase-js` (loaded from jsdelivr CDN). Verified end-to-end (`POST .../rest/v1/leads` → `201`). RLS policy allows public `insert` only — no public read/update/delete. View submissions in the Supabase dashboard → Table Editor → `leads`.
- ~~Fake "Admin" footer link~~ — removed, along with the `localStorage`-based leads viewer modal it opened. Real lead viewing is the Supabase dashboard now; a proper authenticated admin UI is a future nice-to-have, not a blocker.
- File upload field ("Fotografii / PDF") removed from the form for now rather than shipped non-functional — collecting files and silently dropping them would be worse than not offering it. Re-add once a Supabase Storage bucket + policies are wired (needs: bucket, upload-on-submit logic, `attachments` column on `leads`).
- ~~Logo file was 5.3MB~~ — the source PNG (3168×3460, uncompressed) was loaded on every page. Cropped a favicon set from the monogram mark (`favicon.ico`, `favicon-32.png`, `favicon-180.png`) and downsized the header/footer logo to 412×450 (109KB) — comfortably crisp at its largest display size (180px in the footer) with 2x retina headroom. Wired favicon `<link>` tags into both `index.html` and `politica-confidentialitate.html`.

## Blockers (must-fix before launch)

1. **Placeholder reviews** — the 3 review cards literally say "Aici va apărea recenzia reală" — fake filler, must be swapped for real testimonials or removed until real ones exist.
2. **Stock photos everywhere** — hero background + all 7 portfolio/before-after images are Unsplash hotlinks, not real LUXPRO project photos. Hotlinking is also fragile (Unsplash can rate-limit or an image can disappear).
3. **No `og:image`** — links shared on WhatsApp/Facebook/Viber show no preview image, which matters for a lead-gen business relying on social shares. (The new favicon-180 is too small/square for this — a proper 1200×630 branded graphic is needed.)
4. **Confirm `luxprogroup.md` is a real, owned, live domain** — canonical URLs and the privacy policy both reference it. If it's not live yet, that blocks launch, not just SEO.

## Should-fix (quality bar for a paid client site)

6. **`robots.txt` + `sitemap.xml`** — neither exists.
7. **Cross-browser/device testing** — everything verified so far only in one Chromium instance. Needs a real pass on Safari/iOS (font rendering, `:has()` selector support for tier cards — Safari 15.4+ only, input styling) and a real Android phone.
8. **Form spam protection** — no honeypot, no rate limiting, no captcha on the now-live Supabase insert. Open to bot spam filling the `leads` table.
9. **Image optimization** — once real photos replace the stock ones, they need responsive `srcset`/compression, not one giant JPEG per image.
10. **Analytics** — no GA4/Plausible/Clarity wired in; launching blind to traffic and conversion behavior.
11. **Cookie consent banner** — the privacy policy mentions cookies/Google Maps; no actual consent mechanism exists yet for non-essential cookies.
12. **404 page** — none exists; broken links fall through to the server default.
13. **Legal entity details** — the privacy policy has no registration/IDNO number since none was provided; add it if LUXPRO GROUP is a registered SRL, for legal completeness.
14. **Delete the test lead row** — a "Test Claude" row was inserted into `leads` while verifying the Supabase wiring; delete it via Table Editor before going live.

## Nice-to-have (post-launch fine)

15. Language switcher UI — the `lang()` JS function and RO/RU/EN content already exist but there's no visible button to trigger it.
16. WhatsApp/Viber/Telegram links are unverified on real devices — deep-link schemes behave differently per OS.
17. Performance pass (Lighthouse) once real images are in — currently artificially fast because Unsplash images are lazy-loaded and modest in size.
18. Email/SMS notification on new lead (e.g. a Supabase Edge Function or Zapier hook on insert) so leads don't require someone to actively check the dashboard.

## Stack notes

- Single HTML file per page, inline `<style>`/`<script>`, no framework, no bundler.
- Fonts: Bodoni Moda (display) + Jost (body), Google Fonts CDN.
- Icons: inline SVG sprite, no icon font/library.
- Backend: Supabase. Project ref `mdmrnqlqakojxuohxjyr`. `leads` table, RLS on, public `insert`-only policy. Client uses the `anon` public key (safe to expose — RLS is what enforces access, not key secrecy) via `supabase-js` from jsdelivr CDN.
