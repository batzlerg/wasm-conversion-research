# Imageo

**Type:** Standalone App (Browser)
**Status:** Spec
**Viability:** ⭐⭐⭐⭐⭐

---

## One-Liner

Privacy-first batch image processor that runs entirely in your browser—no uploads, no servers.

## Problem

Designers and developers process hundreds of images but worry about uploading to cloud services. Current tools like Squoosh only handle one image at a time. TinyPNG requires cloud upload. Enterprise teams need audit trails but want GDPR compliance.

## Solution

Offline-first batch image processor:
- Drag-and-drop batch processing (10-1000+ images)
- Auto-resize, compress, convert formats (WebP/AVIF/QOI)
- Auto-generate thumbhash placeholders for each image
- Content-addressable filenames via xxHash (cache busting + deduplication)
- Export ZIP with processed images + manifest.json
- Optional LZ4 compression for entire archive
- Zero server uploads—all processing happens locally

## Modules Used

- [image-rs](../ACTIVE_PROSPECTS.md#image-rs) (785KB) — Resize, format conversion, filters
- [thumbhash](../ACTIVE_PROSPECTS.md#thumbhash) (15KB) — Placeholder generation
- [QOI](../ACTIVE_PROSPECTS.md#qoi) (8.9KB) — Fast lossless format option
- [stb_image](../ACTIVE_PROSPECTS.md#stb_image) (103KB) — Decode input formats
- [xxHash](../ACTIVE_PROSPECTS.md#xxhash) (29KB) — Content hashing for deduplication
- [LZ4](../ACTIVE_PROSPECTS.md#lz4) (15.6KB) — Archive compression

## Target Users

- Web developers optimizing assets for production
- Design agencies processing client work (GDPR compliance)
- Privacy-conscious enterprises
- Indie game developers managing sprites/textures
- Static site builders (Astro, Next.js, Hugo users)

## User Flow

1. Open app in browser (PWA, works offline)
2. Drag folder of images or select multiple files
3. Choose output preset: "Web Optimized", "Mobile", "Thumbnails", or custom
4. Preview results with before/after comparison and file size savings
5. Review deduplication suggestions (same content, different filenames)
6. Export as:
   - ZIP of processed images
   - manifest.json mapping originals → processed (with hashes + thumbhashes)
   - Optional: LZ4-compressed archive

## Core Features

- **Batch processing** — 10-1000+ images in parallel using Web Workers
- **Auto-generated placeholders** — thumbhash for every image
- **Content-addressable storage** — Files named by content hash (dedupe + cache busting)
- **Duplicate detection** — Identify same image with different names
- **Framework-ready export** — manifest.json compatible with Next.js, Astro, Nuxt
- **Preset system** — Save and share processing configurations
- **Privacy-first** — All processing local, audit trail without cloud
- **Offline PWA** — Install once, use without internet

## Competitive Landscape

| Competitor | Pricing | Limitations | Our Advantage |
|------------|---------|-------------|---------------|
| Squoosh | Free | Single image only | Batch processing |
| TinyPNG | Free → $25/mo | Cloud upload required | Privacy (local processing) |
| Cloudinary | $89/mo | Expensive, vendor lock-in | Free, self-hosted |
| imagemin (CLI) | Free | Requires Node.js setup | Browser-based, no setup |
| sharp (build-time) | Free | Native deps break CI | No dependencies |

## Novel Angle

Unlike Squoosh (single image) or TinyPNG (cloud upload), Imageo combines:
- Batch processing (Squoosh's #1 feature request)
- Automatic placeholder generation (framework integration ready)
- Content-addressable organization (deduplication built-in)
- Zero cloud dependency (GDPR-compliant by design)

The combination of batch + placeholders + deduplication creates a complete asset pipeline that doesn't exist elsewhere.

## Revenue Model

**Freemium:**
- Free tier: 10 images/batch, basic presets, local only
- Pro ($9/mo): Unlimited batch, custom presets, CLI export, team sharing
- Team ($29/mo): Shared presets across team, audit logs, SSO

**Why people pay:**
- Teams need shared presets for consistency
- Agencies want audit trails for client work
- CLI export enables CI/CD integration

## Build Complexity

**Medium** — Estimated 40-80 hours

**Breakdown:**
- UI/UX (drag-drop, preview) — 20 hours
- WASM integration (6 modules) — 15 hours
- Web Workers (parallel processing) — 10 hours
- Preset system — 8 hours
- Manifest generation — 5 hours
- PWA setup — 5 hours
- Testing — 10 hours

## Success Metrics

### Launch (Month 1)
- 100 GitHub stars
- Featured on Product Hunt
- 500 unique users

### Growth (Month 6)
- 5,000 monthly active users
- 50 Pro subscribers ($450 MRR)
- 3 Team subscribers ($87 MRR)

### Established (Year 1)
- 20,000 MAU
- 200 Pro + 20 Team = $2,380 MRR
- Featured in web dev newsletters

## Next Steps

- [ ] Validate demand: Tweet about concept, gauge response
- [ ] Build basic batch processor (no WASM, just UI)
- [ ] Integrate image-rs + thumbhash
- [ ] Test with real users (10-20 beta testers)
- [ ] Add preset system
- [ ] Launch on Product Hunt

---

**Last updated:** January 2026
