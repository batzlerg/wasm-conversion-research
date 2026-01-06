# AssetHash

**Type:** Developer Library (Browser)
**Status:** Spec
**Viability:** ⭐⭐⭐⭐⭐

---

## One-Liner

Unified asset pipeline in your browser—optimize, hash, and generate placeholders with one drag-and-drop.

## Problem

Frontend developers manually optimize images, generate content hashes for cache busting, and create placeholders using multiple scattered CLI tools. This requires Node.js setup, native dependencies (sharp), and custom scripts. No unified local tool exists—just `imagemin` + `blurhash-cli` + `hash-files` + manual glue code.

## Solution

Developer-focused asset pipeline in browser:
- Drop folder of assets
- Auto-optimize images (resize, compress, WebP/AVIF conversion)
- Generate content hashes for filenames (`image.a3f2b1.webp`)
- Create thumbhash placeholders for each image
- Export manifest.json with original→processed mappings
- Generate copy-paste code snippets for React/Vue/Svelte
- Optional: LZ4-compress entire output

## Modules Used

- [xxHash](../ACTIVE_PROSPECTS.md#xxhash) (29KB) — Content hashing (5.87x faster than JS)
- [LZ4](../ACTIVE_PROSPECTS.md#lz4) (15.6KB) — Archive compression
- [thumbhash](../ACTIVE_PROSPECTS.md#thumbhash) (15KB) — Placeholder generation
- [image-rs](../ACTIVE_PROSPECTS.md#image-rs) (785KB) — Image optimization
- [QOI](../ACTIVE_PROSPECTS.md#qoi) (8.9KB) — Optional format

## Target Users

- Frontend developers (Next.js, Astro, Nuxt, SvelteKit)
- Static site builders
- Jamstack developers
- Indie devs avoiding paid CDN services
- Agencies standardizing asset workflows

## User Flow

1. Drop folder of images/assets into browser
2. Configure optimization:
   - Target sizes (thumbnail, mobile, desktop)
   - Output formats (WebP, AVIF, original)
   - Quality settings
3. Preview optimized results with size comparison
4. Generate manifest
5. Download ZIP containing:
   - Optimized images with content-hash filenames
   - manifest.json mapping originals to processed
   - Code snippets for framework integration

## Core Features

- **Automatic format detection** — Processes PNG, JPEG, WebP, SVG
- **Content-hash filenames** — `image.a3f2b1.webp` for cache busting
- **Thumbhash generation** — One for every image
- **Manifest export** — JSON mapping for easy import
- **Framework snippets** — Copy-paste for Next.js Image, Astro, etc.
- **Preset saving** — Consistent processing across projects
- **Deduplication** — Detect identical images with different names

## Competitive Landscape

| Tool | Setup | Capabilities | Gap |
|------|-------|--------------|-----|
| imagemin | npm install, Node.js | Optimization only | No placeholders, no hashing |
| sharp | Native deps, breaks in CI | Powerful but complex | CLI only, setup pain |
| blurhash-cli | npm, requires sharp | Placeholders only | Doesn't optimize |
| Squoosh | Browser, easy | Single image | No batch, no manifest |
| Cloudinary/imgix | Paid API | Full pipeline | $89+/mo, vendor lock-in |

## Novel Angle

AssetHash replaces a 4-tool chain (imagemin + sharp + blurhash-cli + custom hash script) with one drag-and-drop browser tool. It generates framework-ready output—you drop images, get back optimized assets + manifest + code snippets.

Particularly valuable for Jamstack developers who want Vercel/Netlify-tier image optimization without paying for it or managing infrastructure.

## Revenue Model

**Open Source + Optional Services:**
- Core: Free, open source (MIT license)
- Pro ($5/mo): Saved presets, project configs, batch history
- Sponsorware: Early access to features for GitHub sponsors

**Alternative:** Freemium web app, open core

**Why this works:**
- Developer tools have low CAC (devs share freely)
- Open source builds trust and adoption
- Premium features for power users
- Consulting funnel (agencies hire you for custom integrations)

## Build Complexity

**Low-Medium** — Estimated 30-50 hours

**Breakdown:**
- File handling UI — 10 hours
- WASM integration (5 modules) — 10 hours
- Manifest generation — 8 hours
- Framework snippet generator — 8 hours
- Preset system — 6 hours
- Testing — 8 hours

## Success Metrics

### Launch (Month 1)
- 500 GitHub stars
- Featured on Hacker News front page
- 1,000 weekly users

### Growth (Month 6)
- 5,000 stars
- 20,000 weekly users
- 50 Pro subscribers ($250 MRR)
- 5 consulting leads from users

### Established (Year 1)
- 10k+ stars
- Mentioned in web dev courses
- 200 Pro subscribers ($1,000 MRR)
- 3-5 consulting projects/year from it

## Next Steps

- [ ] Build basic version (optimize + hash only, no placeholders)
- [ ] Post on r/webdev, r/javascript for feedback
- [ ] Add thumbhash generation
- [ ] Add manifest export
- [ ] Launch on Product Hunt + Hacker News
- [ ] Create tutorial: "Replace your entire asset pipeline with one browser tool"

---

**Last updated:** January 2026
