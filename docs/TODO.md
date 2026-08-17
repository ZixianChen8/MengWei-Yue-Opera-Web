# Meng Wei Yue Opera — TODO

Living backlog for the public site and admin CMS. Update this file when work starts or finishes.

**Last updated:** 2026-08-17

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

| # | Status | Task | Notes |
|---|--------|------|-------|
| 1 | ✅ | **Gallery by event** + event-page album link | `eventId` on photos, album index at `/gallery`, filtered view `/gallery?event=…`, album row on `/events/[id]`. |
| 2 | ⏸ | **YouTube playlist** | No playlist URL or placement decided. |
| 3 | ⏸ | **Music / audio on site** | No player component or source files/URLs. |
| 4 | ⬜ | **十载芳馨 as a season event** | Anniversary copy lives in `/special/10th-anniversary` + `specials.json`; not a row in `season.events[]`. |
| 5 | ✅ | **Editable special-event tabs + nav title** | Anniversary template at `/special/[slug]`. Admin → **特别活动** creates hubs, toggles 场刊 / 节目单 / 导赏, sets nav title. Admin → **导航** edits core `nav.links`. `/anniversary` redirects to `/special/10th-anniversary`. |
| 6 | ✅ | **About page — Maggie bio, team, team photo** | `aboutPage` in `AboutPage.tsx` / `home.json`. |
| 7 | ✅ | **Contact form — phone required, email optional** | Phone required; email optional with format check when provided. |
| 8 | ⬜ | **Landing ticker** | Scrolling acknowledgement; no component yet. |

---

## How to use

1. Pick an item and move its status in the tables above.
2. Link PRs or commits in the Notes column when done.
