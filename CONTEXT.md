# Meng Wei Yue Opera Web

Official marketing site for 加拿大孟伟越剧艺术传习所 (Meng Wei Yue Opera Studio Canada). Content-driven static Next.js site with scroll-driven motion on the landing page.

## Language

### Hero motion

**Load Entrance**:
A short, one-shot reveal of the hero poster composition when the page first loads — before scroll takes over. Order: Dark-to-Light Opening → Wordmark → Cutout. Target total duration ~2.2s+ (ceremonial; may be shortened after visual review). Cloud Parallax is not part of this beat. If the visitor scrolls early, the entrance timeline still finishes; Scroll Exit and Cloud Parallax only take effect after it completes. Under `prefers-reduced-motion: reduce`, skipped entirely — final poster state only. Not shipped for mobile yet — viewports ≤767px show the final poster with no entrance/exit motion. Hero GSAP (Load Entrance + Scroll Exit) ships at ≥768px, matching the Cloud Parallax cutoff.
_Avoid_: intro, curtain, hero animation (when meaning only the load beat)

**Dark-to-Light Opening**:
The atmosphere beat of Load Entrance: the Veil fades out to reveal the normal parchment/sun field before Wordmark and Cutout enter. Not a sun-only bloom.
_Avoid_: fade in, dimmer, night mode

**Veil**:
The full-bleed dark overlay element used only for Dark-to-Light Opening. Non-interactive once Load Entrance finishes (or skipped under reduced motion).
_Avoid_: overlay, scrim, curtain

**Scroll Exit**:
Motion of the Wordmark as the visitor scrolls the hero out of view: scrubbed `autoAlpha` → 0 with a slight upward `y` drift. Does not move Cutout or Cloud Parallax. Not shipped for mobile yet (≤767px).
_Avoid_: outro, leave animation, scroll animation (when meaning only the exit beat)

**Cloud Parallax**:
The existing scroll-scrubbed depth motion on hero cloud layers, wisps, and mist (`useScrollParallax`). Separate from Load Entrance and Scroll Exit.
_Avoid_: cloud animation, hero parallax (when meaning the whole hero)

**Wordmark**:
The bilingual organization name (`nameZh` / `nameEn`) rendered behind the character cutout.
_Avoid_: title, headline, brand text

**Cutout**:
The `hero_characters` figure layer that sits in front of the Wordmark and behind the clouds. Participates in Load Entrance only — not in Scroll Exit.
_Avoid_: hero image, character image, subject
