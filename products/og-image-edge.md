# og-image-edge

**Type:** Pipeline Service (Edge)
**Status:** Spec
**Viability:** ⭐⭐⭐⭐

---

## One-Liner

Dynamic social card generation at the edge—Vercel OG Images but self-hostable and $5/mo cheaper.

## Problem

Social cards (og:image) improve click-through on Twitter, LinkedIn, and Facebook. Generating them dynamically requires either Puppeteer (slow, heavy) or Vercel's $20/mo feature. Static cards don't work for dynamic content (blog posts, user profiles, product pages).

## Solution

Satori + resvg at Cloudflare's edge:
```javascript
POST /og
{
  "title": "My Blog Post",
  "author": "Graham",
  "theme": "dark"
}

→ Returns PNG image (1200x630)
```

Uses Vercel's Satori (HTML→SVG) + resvg (SVG→PNG), both WASM-based.

## Modules Used

- **Satori** — Vercel's open source HTML→SVG converter (WASM)
- [resvg](../EDGE_PROSPECTS.md#resvg) (~3MB) — SVG→PNG rendering
- **NOT our modules** — Both are pre-built, we orchestrate them

**Note:** This is more "integration" than "conversion"—both pieces already exist.

## Target Users

- SaaS products needing dynamic social cards
- Blogs with many posts (Astro, Hugo, Ghost)
- E-commerce sites (product cards)
- User-generated content platforms
- Agencies building sites for clients

## User Flow

**Developer integration:**
```javascript
// In edge function or build step
const og = await fetch('https://og.your-domain.workers.dev/og', {
  method: 'POST',
  body: JSON.stringify({
    title: post.title,
    author: post.author,
    date: post.date,
    theme: 'dark'
  })
});

const imageBuffer = await og.arrayBuffer();
// Save to R2 or return directly
```

## Core Features

- **Template system** — Pre-designed layouts for common use cases
- **Dynamic content** — Generate unique cards per page
- **Custom themes** — Brand colors, fonts, layouts
- **Fast generation** — <100ms at edge (vs 2-5s with Puppeteer)
- **Caching** — KV cache for repeat requests
- **Self-hostable** — Deploy to your Cloudflare account

## Competitive Landscape

| Service | Pricing | Gap |
|---------|---------|-----|
| Vercel OG Images | $20/mo (Pro plan) | Locked to Vercel platform |
| Cloudinary | $89/mo+ | Expensive, complex |
| Puppeteer DIY | Server costs | Slow (2-5s), heavy (300MB Chrome) |
| Static images | Free | Not dynamic |

## Novel Angle

Vercel charges $20/mo for this exact feature (OG Image Generation). They open-sourced the underlying tech (Satori + resvg) but kept it platform-locked. og-image-edge makes it platform-agnostic and cheaper.

Undercut Vercel by $5/mo while offering same functionality.

## Revenue Model

**SaaS (undercut Vercel):**
- Free: 1k images/month
- Starter ($10/mo): 10k images/month
- Pro ($15/mo): 100k images/month
- **vs Vercel's $20/mo**

**Alternative:** Free (OSS self-host) with tutorial

**Consideration:** Vercel's bundling makes this hard. People on Vercel already have it. You're targeting non-Vercel users.

## Build Complexity

**Medium** — Estimated 30-50 hours

**Breakdown:**
- Integrate Satori + resvg — 10 hours
- Worker API design — 6 hours
- Template system — 12 hours
- Caching layer — 6 hours
- Documentation — 8 hours
- Testing — 10 hours

**Note:** Both Satori and resvg have WASM builds. Main work is integration and API design.

## Success Metrics

### Launch (Month 1)
- 50 users
- 10 paying ($100-150 MRR)

### Year 1
- 500 users
- 100 paying ($1,000-1,500 MRR)

## Next Steps

- [ ] Deploy Satori + resvg to Workers (proof of concept)
- [ ] Test CPU time limits (may need paid tier)
- [ ] Create 5 template designs
- [ ] Build API wrapper
- [ ] Write migration guide from Vercel OG
- [ ] Launch targeting Next.js users NOT on Vercel

---

**Last updated:** January 2026
