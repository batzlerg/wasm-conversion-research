# Spritify

**Type:** Standalone App (Browser)
**Status:** Spec
**Viability:** ⭐⭐

---

## One-Liner

QOI-native image editor showing real-time compression ratio as you draw—pixel art optimized for the QOI format.

## Problem

QOI (Quite OK Image) format is gaining traction for game development and pixel art, but no dedicated editor exists. Existing editors (Aseprite, Photoshop) treat QOI as import/export only—they don't understand QOI's compression characteristics or optimize for it.

## Solution

QOI-native image editor:
- Import/export QOI natively
- Real-time compression ratio display as you edit
- Pixel art tools optimized for QOI's strengths
- Batch convert PNG/JPEG to QOI
- Side-by-side size comparison (QOI vs PNG vs WebP)
- Palette optimization suggestions based on QOI algorithm

## Modules Used

- [QOI](../ACTIVE_PROSPECTS.md#qoi) (8.9KB) — QOI encoding/decoding
- [stb_image](../ACTIVE_PROSPECTS.md#stb_image) (103KB) — Import other formats
- [image-rs](../ACTIVE_PROSPECTS.md#image-rs) (785KB) — Editing operations

## Target Users

- Pixel artists creating game sprites
- Indie game developers adopting QOI
- QOI format enthusiasts
- Image compression researchers
- Retro game developers

## User Flow

1. Create new canvas or import existing image
2. Draw with pixel art tools (pencil, fill, line, selection)
3. See real-time QOI size estimate update as you draw
4. System suggests palette optimizations for better compression
5. Export as QOI with comparison to PNG/WebP size

## Core Features

- **Native QOI support** — First-class format, not afterthought
- **Real-time compression feedback** — See file size as you edit
- **Pixel art tools** — Pencil, fill, line, dithering, palette
- **Batch converter** — PNG/JPEG → QOI for existing assets
- **Compression education** — Learn why some patterns compress better
- **Palette optimizer** — Suggests colors for better QOI compression

## Competitive Landscape

| Tool | QOI Support | Gap |
|------|-------------|-----|
| Aseprite | Export only | Not QOI-native |
| Photoshop | Export plugin | Not QOI-native |
| GIMP | Export only | Not QOI-native |
| Online editors | None | Don't support QOI |

## Novel Angle

First editor **designed around QOI**. Shows real-time compression ratio and teaches users how their editing choices affect file size. Particularly relevant for game developers who care about both visual quality and asset size.

## Revenue Model

**One-time purchase:**
- $19-29 one-time
- $49 for "pro" version with batch tools

**Very small market** — QOI enthusiasts + pixel artists (niche × niche)

**Realistic:** Might sell 500-2,000 copies total. Lifestyle business at best.

## Build Complexity

**Medium** — Estimated 40-60 hours

**Breakdown:**
- Canvas-based editor — 15 hours
- Pixel art tools — 12 hours
- QOI integration — 8 hours
- Compression feedback system — 8 hours
- Batch converter — 6 hours
- UI/UX — 8 hours
- Testing — 8 hours

## Success Metrics

- 500-2,000 lifetime sales
- Featured on r/gamedev
- QOI community adoption

## Next Steps

- [ ] Assess QOI adoption trajectory
- [ ] If QOI grows: Build MVP
- [ ] If QOI stagnates: Abandon or make feature of larger tool

---

**Last updated:** January 2026
