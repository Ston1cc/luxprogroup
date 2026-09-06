# LUXPRO GROUP — pre-production checklist

Single-file static site (`index.html` + `politica-confidentialitate.html` + `img/`). No build step. Backend: Supabase.

## Resolved

- ~~Lead form has no backend~~ — `leadForm` now inserts directly into a Supabase `leads` table via `supabase-js` (loaded from jsdelivr CDN). Verified end-to-end (`POST .../rest/v1/leads` → `201`). RLS policy allows public `insert` only — no public read/update/delete. View submissions in the Supabase dashboard → Table Editor → `leads`.
- ~~No admin panel~~ — built `admin.html`: a login-gated dashboard (Supabase Auth) listing all leads live (Realtime subscription — new submissions appear without a refresh). Redesigned as a minimal table (name/contact/project/message/status/date/delete), color-coded status dots, responsive fallback to labeled stacked rows on mobile. Delete requires two clicks (button turns into a 3-second "Confirmă" state) — no accidental deletes, no jarring native popup. Footer "Admin" link points here instead of the old fake `localStorage` viewer. Login setup and delete permission — see "Admin dashboard setup" below.
- ~~Email-on-new-lead~~ — `supabase/functions/notify-lead` deployed and wired via a Database Webhook to Resend, verified end-to-end. Currently sends to the Resend account's signup email only (Resend sandbox limitation) — full detail in "Admin dashboard setup" below.
- File upload field ("Fotografii / PDF") removed from the form — collecting files and silently dropping them would be worse than not offering it. Decision: skipped for now, not planned short-term (would need a Supabase Storage bucket + policies, upload-on-submit logic, `attachments` column on `leads`, and client-side image compression to stay within the free-tier 1GB storage cap — cap doesn't reset monthly, unlike the 5GB bandwidth allowance).
- ~~Logo file was 5.3MB~~ — the source PNG (3168×3460, uncompressed) was loaded on every page. Cropped a favicon set from the monogram mark (`favicon.ico`, `favicon-32.png`, `favicon-180.png`) and downsized the header/footer logo to 412×450 (109KB) — comfortably crisp at its largest display size (180px in the footer) with 2x retina headroom. Wired favicon `<link>` tags into both `index.html` and `politica-confidentialitate.html`.
- **`index.html` UI reverted to the client-supplied skeleton** — client wanted the original look back (Georgia/Arial fonts, plain buttons, no animations, no mobile-first redesign, no calculator stepper/tier-card redesign), with only the services content updated. Rebuilt `index.html` from the skeleton file, keeping: the curated services tabs/accordion (flat list would be 56 items — the bloat the client explicitly rejected earlier), the calculator's real pricing data (ECO/Standard/Premium/Luxury × Manoperă/Manoperă+materiale, shown inline in the level dropdown), the real Supabase form wiring, the satellite (non-grayscale) map. Also kept two invisible functional fixes: the mobile hamburger menu (skeleton's `.open` class had zero CSS, so it visibly did nothing) and 16px input font-size (prevents iOS Safari auto-zoom on focus). `admin.html`/`404.html`/`politica-confidentialitate.html` were left untouched per client's choice, so they still use the newer font/button style — a visible inconsistency between the homepage and those utility pages, worth revisiting if it bothers the client.
- **Brand color palette — "Marmură & Negru"** — replaced every hardcoded hex color across `index.html` (not just the CSS variables) with a champagne-gold-on-near-black palette (`--gold:#BFA06A`, `--gold2:#E4D3A8`, base `#0A0A0A`, warm off-white text `#F5F3EE`). Chosen by the client after comparing several palette rounds. `img/logo.png` and the favicon set still carry the old bright-gold color baked into the raster — not yet recolored to match (open item below).
- **Floating quick-contact button** — bottom-right FAB on `index.html`, expands into WhatsApp / Viber / Messenger / Email / Call, each with a proper inline SVG icon (no emoji). Messenger links to the real page (`m.me/61592646300930`, from `facebook.com/profile.php?id=61592646300930`); Instagram (`instagram.com/luxprogroup`) was shared but not wired anywhere yet.
- Hero badge text updated to "Reparații la cheie • Construcții la cheie".

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
12. **Legal entity details** — the privacy policy has no registration/IDNO number since none was provided; add it if LUXPRO GROUP is a registered SRL, for legal completeness.
13. **Delete the test lead rows** — "Test Claude", "Test Notificare Email", "Curl Test", "Curl Test 2", and "Test Skeleton Revert" were all inserted into `leads` while verifying the Supabase wiring at various points; delete them via Table Editor before going live.
14. **Finish admin dashboard setup** — see "Admin dashboard setup" below; the code is done but needs a one-time Supabase config step from you.
15. **Confirm hosting serves `404.html` on not-found routes** — the page exists and looks right, but most static hosts need explicit config to actually serve it on a 404 (Netlify/Vercel auto-detect a root `404.html`; Apache needs `ErrorDocument 404 /404.html`; Nginx needs `error_page 404 /404.html`). Check once you know where this deploys.

## Nice-to-have (post-launch fine)

16. Language switcher UI — the `lang()` JS function and RO/RU/EN content already exist but there's no visible button to trigger it.
17. WhatsApp/Viber/Messenger links (contact section + new floating button) are unverified on real devices — deep-link schemes behave differently per OS.
18. Performance pass (Lighthouse) once real images are in — currently artificially fast because Unsplash images are lazy-loaded and modest in size.
19. Recolor `img/logo.png` (and the favicon set cropped from it) to match the new "Marmură & Negru" champagne accent — currently still the old bright gold, a visible mismatch against the rest of the page.
20. Instagram (`instagram.com/luxprogroup`) not linked anywhere on the site yet — only Facebook/WhatsApp/Viber/Messenger/Email/phone are.

## Admin dashboard setup

`admin.html` is built and working, but needs three one-time steps in the Supabase dashboard before it's usable:

1. **SQL Editor** — run:
   ```sql
   alter table public.leads add column if not exists status text not null default 'nou';

   create policy "Allow authenticated read"
     on public.leads for select to authenticated using (true);

   create policy "Allow authenticated update"
     on public.leads for update to authenticated using (true) with check (true);

   create policy "Allow authenticated delete"
     on public.leads for delete to authenticated using (true);
   ```
2. **Authentication → Users → Add user** — create your own login (email + password, check "Auto Confirm User"). That's what you log into `admin.html` with.
3. ~~Email-on-new-lead~~ — **done**. `supabase/functions/notify-lead` is deployed, wired via a Database Webhook (table `leads`, event `INSERT`) to Resend. Verified end-to-end. Currently sends to the Resend account's own signup email (`damiansava4@gmail.com`) — Resend's sandbox mode only allows sending to that address until a domain is verified. Once `luxprogroup.md` is bought, verify it in Resend (Domains → Add Domain → add the DNS records), set `NOTIFY_FROM` to an address on that domain, and `NOTIFY_TO` can then be `LUXPROGROUP@GMAIL.COM` or anything else.

## Stack notes

- Single HTML file per page, inline `<style>`/`<script>`, no framework, no bundler.
- Fonts: Bodoni Moda (display) + Jost (body), Google Fonts CDN.
- Icons: inline SVG sprite, no icon font/library.
- Backend: Supabase. Project ref `mdmrnqlqakojxuohxjyr`. `leads` table, RLS on. Public role: `insert`-only. Authenticated role (via `admin.html` login): `select`/`update`. Client uses the `anon` public key (safe to expose — RLS is what enforces access, not key secrecy) via `supabase-js` from jsdelivr CDN.
- `admin.html`: Supabase Auth (email/password) gated dashboard, Realtime-subscribed to `leads` for live updates.