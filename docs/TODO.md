# Meng Wei Yue Opera — TODO

Living backlog for the public site and admin CMS. Update this file when work starts or finishes.

**Last updated:** 2026-09-08

---

## Status key

| Symbol | Meaning |
|--------|---------|
| ⬜ | Not started |
| 🔄 | In progress |
| ✅ | Done |
| ⏸ | Blocked (needs client input) |

---

## Client feature backlog

From [Website updates and to-dos](dadebf0b-ecda-47dc-b2d5-6496a87df88a) (Aug 2026). These are the main outstanding product requests.

| # | Status | Task | Notes |
|---|--------|------|-------|
| 1 | ✅ | **Gallery by event** + event-page album link | `eventId` on photos, album index at `/gallery`, filtered view `/gallery?event=…`, album row on `/events/[id]` (`lib/gallery-albums.ts`, `Gallery.tsx`, `EventBody.tsx`). |
| 2 | ⏸ | **YouTube playlist** | No playlist URL or placement decided (nav, footer, dedicated section, or landing block). |
| 3 | ⏸ | **Music / audio on site** | No player component or source files/URLs. Decide UX (ambient, section embed, or standalone player). |
| 4 | ⬜ | **十载芳馨 as a season event** | Anniversary copy lives at `/special/10th-anniversary`; not a row in `season.events[]`. Add event entry in `content/data/home.json` (admin → **活动**) so it appears on `/events` and can drive gallery albums. |
| 5 | ✅ | **Editable special-event tabs + nav title** | Superseded by the special-event CMS below: tab labels, hub copy, logo, and nav entry are all editable per event in admin → **专场**. |
| 8 | ✅ | **Special-event CMS** | Special events are one JSON file each (`content/data/special/<slug>.json`), routed at `/special/<slug>` + `/special/<slug>/<page>`. Admin → **专场** creates/deletes events, adds pages from the 场刊 / 节目单 / 导赏 templates, and edits each page's content. `/anniversary*` redirects to `/special/10th-anniversary*`. |
| 6 | ✅ | **About page — Maggie bio, team, team photo** | Studio bio (`bio` Reveal) includes team photo placeholder via `bio.imageUrl`; Maggie in `founder` section (`AboutPage.tsx`, `home.json`). |
| 7 | ✅ | **Contact form — phone required, email optional** | Phone required in `AboutPage.tsx` + `/api/contact`; email optional with format check when provided; labels in `content/data/home.json`. |

### Open questions (client)

- **#2** — YouTube playlist URL and where it should live.
- **#3** — Audio files or streaming URLs and intended placement.
- **#4** — Confirm event title, date, venue, images, and whether it should be `home: true`.

---

## Content & assets

| Status | Task | Notes |
|--------|------|-------|
| ⬜ | **Event signup URLs** | Most `season.events[]` rows have empty `formUrl`; only `yuespiration` has a Google Form. Empty/`#` shows CSS QR placeholder on detail pages. |
| ⬜ | **Replace logo placeholder** | Mobile design system notes the red “孟” stamp + wordmark in nav is provisional; swap for final studio logo (SVG preferred). See `design-system/mobile-design-system.md`. |
| ⬜ | **Stale meta copy** | `app/layout.tsx` meta may still say “Founded 2018”; studio copy says 2016. Align when editing SEO fields. |

---

## Infrastructure & ops

| Status | Task | Notes |
|--------|------|-------|
| ⬜ | **Production deploy** | No deploy config in repo. Use Git-connected host (Vercel/Netlify) so admin GitHub commits trigger redeploys. |
| ⬜ | **Environment variables** | `AUTH_SECRET`, `ADMIN_PASSWORD`, `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO` (admin); `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` (contact form). |
| ⬜ | **Contact form env in prod** | API returns 500 if Resend vars missing. |

---

## CMS gaps (optional / later)

From backend audit ([Website backend status](a26ff19b-7af7-440f-9217-5bb6b7a615d2)). Not on the client backlog unless requested.

| Task | Notes |
|------|-------|
| Editable per-route SEO (`/about`, `/events`, `/gallery`, `/anniversary`) | Currently hardcoded in `app/*/page.tsx`. |
| `galleryPage.lightbox.stamp` | Field exists in JSON; `Gallery.tsx` does not read it. |
| Consolidated site contact email in CMS | Footer, nav mailto, studio CTA may use separate strings today. |

---

## Completed (reference)

Do not re-open unless regressing.

| Area | Notes |
|------|-------|
| Hero redesign | Bilingual wordmark behind cutout (`docs/superpowers/plans/2026-07-11-hero-redesign.md`). |
| Hero GSAP entrance / veil | Dark-to-light load beat + scroll exit (`docs/superpowers/plans/2026-07-11-hero-gsap-animation.md`). |
| Mobile hero layout | Poster composition ≤767px (`docs/superpowers/plans/2026-07-11-mobile-hero-layout.md`). |
| Desktop fullscreen nav menu | Replaces `LandingMenu`; gallery photos in overlay (`docs/superpowers/plans/2026-07-11-desktop-fullscreen-nav-menu.md`). |
| GSAP landing scroll-storytelling | Overture, About, Season, Studio pin, Repertoire horizontal scroll. |
| Admin dashboard | Password gate, JSON + image upload via GitHub API. |
| Event retirement + past-by-year listing | `lib/event-lifecycle.ts`, grouped archive on `/events`. |
| Gallery by event | Event-linked albums, `/gallery?event=…`, event-page album link, admin `eventId` (backlog **#1**). |

---

## Stale plan files

`docs/superpowers/plans/*.md` still contain unchecked `- [ ]` steps for work that has largely shipped. Treat **this file** as the backlog; use plan files only as implementation history.

---

## How to use

1. Pick an item and move its status in the tables above.
2. Link PRs or commits in the Notes column when done.
3. When client answers open questions, move answers into Notes and clear ⏸.
