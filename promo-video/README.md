# Bolt Food Ukraine — August 2026 MBR Promo Video

Vertical motion design video (1080×1920) for the Bolt Food Ukraine Sales Team Monthly Business Review, August 2026.

## Output

- **File:** `out/promo.mp4`
- **Duration:** ~33 seconds (990 frames @ 30 fps)
- **Resolution:** 1080×1920 (Instagram/TikTok Reels vertical)
- **Codec:** H.264

## Scenes

| # | Scene | Frames | Duration |
|---|-------|--------|----------|
| 1 | Hook — explosive brand intro | 0–59 | 2s |
| 2 | Intro — "August 2026 · Sales MBR" | 60–209 | 5s |
| 3 | Deals Closed — animated counter to 1,247 | 210–359 | 5s |
| 4 | Cities — Kyiv · Lviv · Odesa · Dnipro | 360–479 | 4s |
| 5 | Top Performer — Olena Kovalenko reveal | 480–629 | 5s |
| 6 | Big Wins — 3 achievement cards | 630–749 | 4s |
| 7 | Winner Mentality — motivational interlude | 750–839 | 3s |
| 8 | Revenue Champion — UAH 86,532 counter | 840–929 | 3s |
| 9 | CTA — "Keep the bar high and execute the plan" | 930–990 | 2s |

## Music & Sound Sources

All tracks are royalty-free from [Mixkit](https://mixkit.co) — free for commercial use, no attribution required.

### Background Track
**"Tech House Background"** by Mixkit  
→ https://mixkit.co/free-stock-music/tag/electronic/  
License: [Mixkit Free License](https://mixkit.co/license/#sfxFree) — free commercial use

### Alternative Tracks (same Mixkit category)
- **"Upbeat Corporate"** — https://mixkit.co/free-stock-music/tag/corporate/
- **"Inspiring Future"** — https://mixkit.co/free-stock-music/tag/motivational/
- **"Dynamic Percussion"** — https://mixkit.co/free-stock-music/tag/percussion/

> Note: The video is designed so cut points (every ~2–5 seconds) align to typical 4/4 beat grids at 120–128 BPM. Any track from the Mixkit electronic or corporate category at that tempo will sync naturally.

## Brand Colors

| Token | Hex | Use |
|-------|-----|-----|
| `darkBg` | `#080F0A` | Main background |
| `darkGreen` | `#0C2C1C` | Card backgrounds |
| `green` | `#3CC46B` | Primary accent |
| `neon` | `#77F8B0` | Highlights, scene flashes |
| `gold` | `#F5C842` | Revenue, achievements |
| `red` | `#FF4D6A` | Warnings, contrasts |
| `white` | `#FFFFFF` | Primary text |

## Tech Stack

- **[Remotion](https://www.remotion.dev/) v4.0.532** — React-based programmatic video
- **React 19** — component-driven animation
- **TypeScript** — type-safe scene composition
- **Chromium headless** — frame rendering

## Rendering

```bash
cd promo-video
npm install

# Render to MP4
npx remotion render src/index.ts BoltFoodPromo out/promo.mp4 \
  --codec=h264 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell \
  --gl=angle \
  --concurrency=2 \
  --overwrite
```

## Data (August 2026)

- Deals closed: **1,247**
- Active cities: **4** (Kyiv, Lviv, Odesa, Dnipro)
- Top performer: **Olena Kovalenko** — 143 deals
- Revenue champion deal: **UAH 86,532**
- Plan execution: **112%**
- New restaurant partners: **+89**
- Revenue growth: **+23% MoM**
