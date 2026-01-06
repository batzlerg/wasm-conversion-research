# Shimmer — Blurhash at the Edge

> Zero-dependency blurhash generation running on Cloudflare Workers via WebAssembly.
> Open source. Self-host for free. No data leaves the edge.

**Status:** Open Source Project Spec
**Repository name:** `shimmer` or `blurhash-edge`
**Tagline options:**
- "Blurhash at the speed of light"
- "Image placeholders, computed at the edge"
- "The fastest path from URL to blur"

---

## Table of Contents

1. [Why This Exists](#why-this-exists)
2. [How It Works](#how-it-works)
3. [Persona Analysis](#persona-analysis)
4. [Self-Hosting Guide](#self-hosting-guide)
5. [API Reference](#api-reference)
6. [Limits & Pricing Calculator](#limits--pricing-calculator)
7. [WASM Build Pipeline](#wasm-build-pipeline)
8. [Integration Examples](#integration-examples)
9. [Blog Post Draft](#blog-post-draft)
10. [Portfolio Copy](#portfolio-copy)
11. [Naming Analysis](#naming-analysis)
12. [Open Source Strategy](#open-source-strategy)

---

## Why This Exists

### The Problem

Blurhash placeholders improve perceived performance—users see a blurred preview instead of empty space while images load. But generating blurhashes is awkward:

1. **Build-time generation** requires Node.js + sharp (native dependency hell)
2. **Server-side generation** needs a running server (not Jamstack-friendly)
3. **Client-side generation** defeats the purpose (you need the image to hash it)

Static site generators, edge-rendered apps, and CDN-first architectures don't have a clean answer.

### The Solution

Compile the original C blurhash library to WebAssembly. Deploy it on Cloudflare Workers. Call it from anywhere:

```bash
curl "https://shimmer.example.com/blur?url=https://example.com/photo.jpg"
# → {"blurhash":"LEHV6nWB2yk8pyo0adR*.7kCMdnj","width":800,"height":600}
```

- No server to maintain
- No native dependencies
- Works with any static site generator
- Self-host on Cloudflare's free tier
- Your images never touch third-party servers (fetched from edge → processed at edge → response returned)

---

## How It Works

```
┌──────────────┐     ┌─────────────────────────────────────────────────┐
│  Your Site   │     │           Cloudflare Edge (nearest POP)         │
│              │     │                                                 │
│  <img        │     │  ┌─────────┐   ┌──────────┐   ┌──────────────┐ │
│   data-blur= │────▶│  │ Worker  │──▶│ Fetch    │──▶│ stb_image    │ │
│   "LEH..."   │     │  │ Router  │   │ Image    │   │ (WASM decode)│ │
│   src="..."  │     │  └─────────┘   └──────────┘   └──────────────┘ │
│  />          │◀────│                                      │          │
│              │     │  ┌─────────┐   ┌──────────────┐     │          │
└──────────────┘     │  │ Return  │◀──│ blurhash     │◀────┘          │
                     │  │ JSON    │   │ (WASM encode)│                 │
                     │  └─────────┘   └──────────────┘                 │
                     │                                                 │
                     │  ┌─────────────────────────────────────┐       │
                     │  │ KV Cache (optional, for repeat URLs) │       │
                     │  └─────────────────────────────────────┘       │
                     └─────────────────────────────────────────────────┘
```

**Processing steps:**
1. Worker receives request with image URL
2. Fetches image from origin (runs on same edge node)
3. Decodes image using stb_image (WASM, ~103KB)
4. Downsamples to small dimensions for hashing
5. Generates blurhash using blurhash-c (WASM, ~21KB)
6. Returns JSON with blurhash + original dimensions
7. Optionally caches result in Cloudflare KV

---

## Persona Analysis

### Persona 1: Frontend Developer (Primary)

**Profile:** Senior dev building Next.js/Astro/Nuxt sites. Comfortable with APIs and deployment. Cares about performance and developer experience.

**Pain points:**
- Sharp native dependencies break in CI
- Don't want to run a server just for blurhash
- Need blurhash at build time for static sites

**How Shimmer helps:**
- `npm install shimmer-client` for type-safe API calls
- One-click deploy to their own Cloudflare account
- Works in any build pipeline (no native deps)

**User flow:**
```bash
# Deploy once (2 minutes)
git clone https://github.com/you/shimmer
cd shimmer && npm install
npx wrangler deploy

# Use forever
import { getBlurHash } from 'shimmer-client';
const blur = await getBlurHash('https://example.com/photo.jpg');
```

**What they'd share:** GitHub star, tweet about clean DX, blog post about their setup.

---

### Persona 2: Technical Blogger / Content Creator

**Profile:** Runs a Ghost, Astro, or Hugo blog. Writes about tech. Has 50-500 images. Knows enough code to be dangerous.

**Pain points:**
- Blog images cause layout shift
- Tried blurhash plugins but they're complex
- Doesn't want ongoing infrastructure

**How Shimmer helps:**
- Clear step-by-step guide
- Copy-paste code snippets for their platform
- "Set and forget" deployment

**User flow:**
1. Read blog post explaining blurhash benefits
2. Clone repo, deploy with Wrangler (guided by README)
3. Add snippet to blog template
4. All future images automatically get placeholders

**What they'd share:** "How I Added Blur Placeholders to My Blog in 10 Minutes" post.

---

### Persona 3: Agency Developer

**Profile:** Builds sites for clients. Ships 5-20 sites/year. Needs reliable, repeatable solutions.

**Pain points:**
- Can't rely on third-party services that might shut down
- Clients don't want ongoing costs
- Needs to support across different tech stacks

**How Shimmer helps:**
- Self-hosted = no vendor risk
- Free tier handles most client sites
- Same solution works for React, Vue, vanilla JS

**User flow:**
1. Deploy Shimmer once to agency's Cloudflare account
2. Use same endpoint across all client projects
3. Optionally deploy per-client for isolation

**What they'd share:** Internal documentation, conference talk, "tools we use" blog post.

---

### Persona 4: Non-Technical Business Owner

**Profile:** Has a Shopify/Squarespace/Webflow site. Knows images are slow. Heard "blurhash" but doesn't know how to implement.

**Pain points:**
- Wants faster site but can't code
- Doesn't understand the technical details
- Needs someone else to do it

**How Shimmer helps:**
- **Honestly, Shimmer doesn't directly serve this persona.** They need:
  - A Shopify app that handles everything
  - A Webflow integration
  - An agency to implement it

**Opportunity:** The Shopify/Webflow apps could be built on top of Shimmer. But Shimmer itself is a developer tool.

**Realistic path:** They hire a developer who uses Shimmer.

---

### Persona 5: Open Source Contributor

**Profile:** Wants to contribute to a useful project. Looking for well-documented, approachable codebase.

**Pain points:**
- Many projects have poor contribution docs
- Unclear how to set up dev environment
- Don't know where to start

**How Shimmer helps:**
- Clear CONTRIBUTING.md
- Simple architecture (Worker + 2 WASM modules)
- Good first issues labeled
- Automated CI that validates contributions

**Contribution paths:**
- Add support for thumbhash (alternative algorithm)
- Improve error messages
- Add integrations (Astro plugin, Next.js helper)
- Performance optimizations

---

## Self-Hosting Guide

### Prerequisites

- Cloudflare account (free tier works)
- Node.js 18+ and npm
- Wrangler CLI (`npm install -g wrangler`)

### Quick Start (5 minutes)

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/shimmer.git
cd shimmer

# Install dependencies
npm install

# Authenticate with Cloudflare
npx wrangler login

# Deploy to your account
npx wrangler deploy

# Done! Your endpoint is live at:
# https://shimmer.<your-subdomain>.workers.dev
```

### Configuration

Create `wrangler.toml`:

```toml
name = "shimmer"
main = "src/worker.ts"
compatibility_date = "2024-01-01"

# Optional: Enable KV caching
[[kv_namespaces]]
binding = "BLUR_CACHE"
id = "your-kv-namespace-id"

# Optional: Custom domain
routes = [
  { pattern = "blur.yourdomain.com/*", zone_name = "yourdomain.com" }
]

# Optional: Restrict origins (recommended for production)
[vars]
ALLOWED_ORIGINS = "https://yourdomain.com,https://www.yourdomain.com"
```

### With Caching (Recommended)

```bash
# Create KV namespace
npx wrangler kv:namespace create BLUR_CACHE

# Add the returned ID to wrangler.toml
# Deploy with caching enabled
npx wrangler deploy
```

Caching benefits:
- Repeated requests return instantly
- Free tier: 100k reads/day, 1k writes/day
- Most static sites hit cache 95%+ of time after warm-up

---

## API Reference

### GET /blur

Generate blurhash for an image URL.

**Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `url` | string | required | Image URL to process |
| `componentX` | int | 4 | Horizontal components (1-9) |
| `componentY` | int | 3 | Vertical components (1-9) |

**Response:**

```json
{
  "blurhash": "LEHV6nWB2yk8pyo0adR*.7kCMdnj",
  "width": 1200,
  "height": 800,
  "aspectRatio": 1.5,
  "cached": false,
  "processingTimeMs": 4.2
}
```

**Errors:**

```json
{
  "error": "Image too large",
  "message": "Image dimensions (4500x3000) exceed maximum (2000x2000)",
  "code": "IMAGE_TOO_LARGE"
}
```

**Error codes:**
- `INVALID_URL` — Malformed or missing URL
- `FETCH_FAILED` — Couldn't retrieve image from origin
- `DECODE_FAILED` — Image format not supported or corrupted
- `IMAGE_TOO_LARGE` — Exceeds dimension limits
- `TIMEOUT` — Processing exceeded CPU limit

### POST /blur/batch

Generate blurhashes for multiple images.

**Request body:**

```json
{
  "urls": [
    "https://example.com/photo1.jpg",
    "https://example.com/photo2.jpg"
  ],
  "componentX": 4,
  "componentY": 3
}
```

**Response:**

```json
{
  "results": [
    { "url": "...", "blurhash": "...", "width": 800, "height": 600 },
    { "url": "...", "blurhash": "...", "width": 1200, "height": 900 }
  ],
  "errors": [],
  "totalTimeMs": 12.4
}
```

**Limits:** Max 10 URLs per batch request.

### GET /health

Health check endpoint.

```json
{
  "status": "ok",
  "version": "1.2.0",
  "wasmLoaded": true
}
```

---

## Limits & Pricing Calculator

### Cloudflare Free Tier Limits

| Resource | Free | Paid ($5/mo) |
|----------|------|--------------|
| Requests/day | 100,000 | 10M/month |
| CPU time/request | 10ms | 50ms |
| Memory | 128MB | 128MB |
| KV reads/day | 100,000 | 10M/month |
| KV writes/day | 1,000 | 1M/month |

### CPU Time by Image Size

Processing time = decode + downsample + hash:

| Image Size | Est. CPU Time | Free Tier? |
|------------|---------------|------------|
| 200x200 | ~0.5ms | ✅ |
| 500x500 | ~1.5ms | ✅ |
| 800x800 | ~3ms | ✅ |
| 1000x1000 | ~5ms | ✅ |
| 1500x1500 | ~9ms | ✅ (borderline) |
| 2000x2000 | ~18ms | ❌ (needs paid) |
| 4000x4000 | ~72ms | ❌ (needs paid) |

### Calculator: Will Free Tier Work For Me?

**Scenario A: Personal Blog**
- 100 blog posts × 3 images = 300 unique images
- 1,000 visitors/month, most images cached after first hit
- ~300 compute requests (one per unique image)
- **Verdict: ✅ Free tier is plenty**

**Scenario B: E-commerce Site**
- 500 products × 5 images = 2,500 unique images
- 10,000 visitors/month
- ~2,500 compute requests + cache hits
- **Verdict: ✅ Free tier works, enable KV caching**

**Scenario C: Image-Heavy News Site**
- 50 articles/day × 10 images = 500 new images/day
- High traffic, many unique images
- ~15,000 compute requests/month
- **Verdict: ✅ Free tier works, KV caching essential**

**Scenario D: User-Generated Content Platform**
- Users upload images constantly
- 10,000+ unique images/day
- Images are large (user photos, 2000px+)
- **Verdict: ❌ Need paid tier + resize images first**

### Decision Flowchart

```
Do you have more than 100k unique images/day?
  → Yes: Paid tier ($5/mo) or resize before upload
  → No: Continue...

Are most images under 1500x1500?
  → No: Either resize images or use paid tier
  → Yes: Continue...

Will the same images be requested multiple times?
  → Yes: Enable KV caching, free tier works
  → No: Still probably fine, but monitor usage
```

---

## WASM Build Pipeline

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     GitHub Repository                           │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │ blurhash-c  │  │ stb_image   │  │ Worker Source           │ │
│  │ (submodule) │  │ (vendored)  │  │ (TypeScript)            │ │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘ │
│         │                │                      │               │
│         ▼                ▼                      │               │
│  ┌─────────────────────────────┐               │               │
│  │   GitHub Actions Workflow   │               │               │
│  │                             │               │               │
│  │  1. Setup Emscripten        │               │               │
│  │  2. Compile blurhash.wasm   │               │               │
│  │  3. Compile stb_image.wasm  │               │               │
│  │  4. Run tests               │               │               │
│  │  5. Bundle worker           │               │               │
│  └──────────────┬──────────────┘               │               │
│                 │                              │               │
│                 ▼                              ▼               │
│  ┌─────────────────────────────────────────────────┐           │
│  │              dist/                              │           │
│  │  ├── blurhash.wasm (21KB)                       │           │
│  │  ├── stb_image.wasm (103KB)                     │           │
│  │  └── worker.js (bundled, ready for deploy)      │           │
│  └─────────────────────────────────────────────────┘           │
│                           │                                     │
│                           ▼                                     │
│  ┌─────────────────────────────────────────────────┐           │
│  │         GitHub Releases                         │           │
│  │  v1.2.0                                         │           │
│  │  └── shimmer-worker-v1.2.0.zip                  │           │
│  └─────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

### Automated Rebuild Triggers

```yaml
# .github/workflows/build.yml
name: Build WASM

on:
  push:
    branches: [main]
    paths:
      - 'src/**'
      - 'wasm/**'
      - '.github/workflows/build.yml'

  # Rebuild when upstream releases new version
  schedule:
    - cron: '0 0 * * 0'  # Weekly check

  # Manual trigger for testing
  workflow_dispatch:

jobs:
  check-upstream:
    runs-on: ubuntu-latest
    outputs:
      blurhash-updated: ${{ steps.check.outputs.updated }}
    steps:
      - name: Check for blurhash-c updates
        id: check
        run: |
          # Compare current submodule commit with latest upstream
          CURRENT=$(git submodule status wasm/blurhash-c | awk '{print $1}')
          LATEST=$(git ls-remote https://github.com/woltapp/blurhash HEAD | awk '{print $1}')
          echo "updated=$([[ $CURRENT != $LATEST ]] && echo true || echo false)" >> $GITHUB_OUTPUT

  build:
    needs: check-upstream
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: recursive

      - name: Setup Emscripten
        uses: mymindstorm/setup-emsdk@v13
        with:
          version: 3.1.50

      - name: Compile WASM modules
        run: |
          cd wasm
          ./build.sh

      - name: Run tests
        run: npm test

      - name: Bundle worker
        run: npm run build

      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: shimmer-dist
          path: dist/
```

### Version Tracking

```json
// wasm/versions.json
{
  "blurhash-c": {
    "repo": "woltapp/blurhash",
    "commit": "abc123...",
    "version": "0.2.0",
    "lastChecked": "2025-01-05T00:00:00Z"
  },
  "stb_image": {
    "repo": "nothings/stb",
    "commit": "def456...",
    "version": "2.28",
    "lastChecked": "2025-01-05T00:00:00Z"
  },
  "emscripten": "3.1.50"
}
```

### Local Development

```bash
# Install Emscripten (one-time)
brew install emscripten  # macOS
# or: https://emscripten.org/docs/getting_started/downloads.html

# Build WASM modules locally
cd wasm && ./build.sh

# Run worker locally
npx wrangler dev

# Test
curl "http://localhost:8787/blur?url=https://picsum.photos/800/600"
```

---

## Integration Examples

### Next.js (App Router)

```typescript
// lib/shimmer.ts
const SHIMMER_URL = process.env.SHIMMER_URL || 'https://shimmer.your-domain.workers.dev';

export async function getBlurHash(imageUrl: string): Promise<string> {
  const res = await fetch(`${SHIMMER_URL}/blur?url=${encodeURIComponent(imageUrl)}`);
  const data = await res.json();
  return data.blurhash;
}

// components/BlurImage.tsx
import Image from 'next/image';
import { getBlurHash } from '@/lib/shimmer';

export async function BlurImage({ src, alt, ...props }) {
  const blurHash = await getBlurHash(src);
  const blurDataURL = blurHashToDataURL(blurHash); // use blurhash library

  return (
    <Image
      src={src}
      alt={alt}
      placeholder="blur"
      blurDataURL={blurDataURL}
      {...props}
    />
  );
}
```

### Astro (Build-Time)

```typescript
// src/utils/blur.ts
export async function getBlurPlaceholder(src: string) {
  const res = await fetch(`${import.meta.env.SHIMMER_URL}/blur?url=${encodeURIComponent(src)}`);
  return res.json();
}

// src/components/Image.astro
---
import { getBlurPlaceholder } from '../utils/blur';
import { decode } from 'blurhash';

const { src, alt } = Astro.props;
const { blurhash, width, height } = await getBlurPlaceholder(src);

// Convert to tiny data URL for inline placeholder
const pixels = decode(blurhash, 32, 32);
const dataUrl = pixelsToDataURL(pixels, 32, 32);
---

<div class="blur-container" style={`aspect-ratio: ${width}/${height}`}>
  <img
    src={dataUrl}
    class="placeholder"
    aria-hidden="true"
  />
  <img
    src={src}
    alt={alt}
    loading="lazy"
    onload="this.previousElementSibling.remove()"
  />
</div>
```

### Hugo (Static Site)

```html
<!-- layouts/shortcodes/blur-image.html -->
{{ $url := .Get "src" }}
{{ $shimmerURL := site.Params.shimmerURL }}

{{ $blur := getJSON (printf "%s/blur?url=%s" $shimmerURL (urlquery $url)) }}

<div class="blur-image" style="aspect-ratio: {{ $blur.width }}/{{ $blur.height }}">
  <img
    data-blurhash="{{ $blur.blurhash }}"
    data-src="{{ $url }}"
    alt="{{ .Get "alt" }}"
  />
</div>
```

### Vanilla JavaScript

```html
<script type="module">
import { decode } from 'https://esm.sh/blurhash';

async function loadWithBlur(img) {
  const src = img.dataset.src;
  const shimmerUrl = 'https://shimmer.your-domain.workers.dev';

  // Get blurhash
  const res = await fetch(`${shimmerUrl}/blur?url=${encodeURIComponent(src)}`);
  const { blurhash, width, height } = await res.json();

  // Decode to canvas
  const pixels = decode(blurhash, 32, 32);
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(32, 32);
  imageData.data.set(pixels);
  ctx.putImageData(imageData, 0, 0);

  // Show blur placeholder
  img.src = canvas.toDataURL();
  img.style.aspectRatio = `${width}/${height}`;

  // Load real image
  const realImg = new Image();
  realImg.onload = () => { img.src = src; };
  realImg.src = src;
}

document.querySelectorAll('img[data-src]').forEach(loadWithBlur);
</script>
```

---

## Blog Post Draft

### Title Options
- "I Built a Free Blurhash API Using WebAssembly and Cloudflare Workers"
- "Zero-Cost Image Placeholders: Compiling C to WebAssembly for the Edge"
- "How to Add Blur Placeholders to Any Static Site (No Server Required)"

### Draft

---

**I Built a Free Blurhash API Using WebAssembly and Cloudflare Workers**

You know that nice blur effect you see on images before they load? That's called blurhash—a compact string that encodes a blurry preview of any image in about 30 characters.

The problem: generating blurhashes requires either:
- A build step with native dependencies (sharp, which breaks in CI constantly)
- A server running somewhere (goodbye, serverless)
- Processing on the client (defeats the purpose—you need the image to hash it)

I wanted blur placeholders for my static site without any of that hassle. So I compiled the original C blurhash library to WebAssembly and deployed it on Cloudflare Workers.

**The result: a free, self-hosted API that generates blurhashes from any image URL.**

```bash
curl "https://shimmer.example.com/blur?url=https://example.com/photo.jpg"
# → {"blurhash":"LEHV6nWB2yk8pyo0adR*.7kCMdnj","width":800,"height":600}
```

### Why WebAssembly?

The blurhash algorithm is available in many languages, but the C implementation is the reference. Rather than rewriting it in JavaScript (and maintaining parity), I compiled the original C code to WASM.

The resulting module is 21KB—smaller than most images. It runs at near-native speed, processing a typical image in under 5ms.

### Why Cloudflare Workers?

Workers run on Cloudflare's edge network—200+ data centers worldwide. When someone requests a blurhash, the image is fetched from the nearest edge node, processed there, and the result returned. The image never touches a central server.

The free tier includes 100,000 requests per day. For most sites, this is infinite.

### How It Works

1. Your site calls `GET /blur?url=<image_url>`
2. The Worker fetches the image from its origin
3. stb_image (compiled to WASM) decodes the image
4. The image is downsampled to ~32x32 pixels
5. blurhash (compiled to WASM) generates the hash
6. JSON response with blurhash + dimensions

Total processing time: 3-8ms for typical web images.

### The Code

The entire Worker is ~100 lines of TypeScript. The interesting part is loading the WASM modules:

```typescript
import blurhashWasm from './blurhash.wasm';
import stbImageWasm from './stb_image.wasm';

let blurhash: WebAssembly.Instance;
let stbImage: WebAssembly.Instance;

export default {
  async fetch(request: Request): Promise<Response> {
    // Lazy-load WASM modules
    if (!blurhash) {
      blurhash = await WebAssembly.instantiate(blurhashWasm);
      stbImage = await WebAssembly.instantiate(stbImageWasm);
    }

    const url = new URL(request.url);
    const imageUrl = url.searchParams.get('url');

    // Fetch and decode image...
    // Generate blurhash...
    // Return JSON response...
  }
};
```

### Deploy Your Own

```bash
git clone https://github.com/YOUR_USERNAME/shimmer
cd shimmer
npm install
npx wrangler login
npx wrangler deploy
```

That's it. You have your own blurhash API running on Cloudflare's global network, for free.

### Limitations

The free tier has a 10ms CPU limit per request. This works for images up to ~1500x1500 pixels. Larger images need the $5/month paid tier (which gives 50ms).

For most web use cases—blog headers, product images, thumbnails—the free tier is plenty.

### What's Next?

I'm considering adding:
- ThumbHash support (alternative algorithm, slightly better quality)
- Batch endpoint for build-time processing
- Astro/Next.js plugins for easier integration

The code is open source: [link]. PRs welcome.

---

## Portfolio Copy

### One-Liner
> Open-source blurhash API running at the edge via WebAssembly. Zero cost, zero servers, zero native dependencies.

### Elevator Pitch (30 seconds)
Shimmer lets you add blur placeholders to any website without running a server. I compiled the C blurhash library to WebAssembly and deployed it on Cloudflare Workers. Anyone can self-host it on Cloudflare's free tier. It processes images in under 10ms at the edge—the image never leaves Cloudflare's network.

### Technical Summary (For Developers)
- Compiled woltapp/blurhash (C) and nothings/stb (C) to WebAssembly using Emscripten
- Bundled as Cloudflare Worker with TypeScript wrapper
- Handles image decode, downsample, and blurhash encode in single request
- Free tier handles images up to ~1500x1500 within 10ms CPU limit
- Optional KV caching for repeat requests
- GitHub Actions pipeline rebuilds WASM when upstream updates

### Impact Metrics (Once Launched)
- X GitHub stars
- X forks/deployments
- Featured in [newsletter/blog]
- Used by [notable projects]

---

## Naming Analysis

| Name | Pros | Cons |
|------|------|------|
| **Shimmer** | Evocative, describes the visual effect, memorable, good domain availability | Doesn't mention "blur" or "hash" explicitly |
| **BlurEdge** | Descriptive, implies edge computing | Generic, forgettable |
| **blurhash-edge** | Explicit, SEO-friendly | Boring, hyphenated |
| **Haze** | Short, evocative | Could be confused with other projects |
| **Placeholder** | Descriptive | Too generic |
| **BlurAPI** | Clear purpose | Generic, says nothing about edge/WASM |
| **blur.run** | Domain-style, memorable | Requires specific domain |

**Recommendation:** `shimmer` for the brand/repo name, with SEO-optimized description "blurhash at the edge" for discoverability.

Repository: `github.com/YOUR_USERNAME/shimmer`
npm package: `shimmer-blur` or `@shimmer/edge`
Worker default subdomain: `shimmer.YOUR_SUBDOMAIN.workers.dev`

---

## Open Source Strategy

### License
MIT — Maximum adoption, no friction.

### Repository Structure

```
shimmer/
├── README.md           # Quick start, badges, deploy button
├── CONTRIBUTING.md     # How to contribute
├── LICENSE             # MIT
├── wrangler.toml       # Cloudflare Worker config
├── package.json
├── tsconfig.json
│
├── src/
│   ├── worker.ts       # Main Worker entry
│   ├── blurhash.ts     # Blurhash WASM wrapper
│   ├── image.ts        # Image decode/resize logic
│   └── cache.ts        # KV caching logic
│
├── wasm/
│   ├── build.sh        # WASM compilation script
│   ├── blurhash-c/     # Git submodule
│   ├── stb/            # Vendored stb_image.h
│   ├── blurhash.wasm   # Compiled (gitignored, built in CI)
│   └── stb_image.wasm  # Compiled (gitignored, built in CI)
│
├── test/
│   ├── worker.test.ts  # Integration tests
│   └── fixtures/       # Test images
│
├── examples/
│   ├── nextjs/         # Next.js integration example
│   ├── astro/          # Astro integration example
│   └── vanilla/        # Plain HTML/JS example
│
└── .github/
    ├── workflows/
    │   ├── build.yml   # WASM build + test
    │   └── release.yml # Version + publish
    └── ISSUE_TEMPLATE/
```

### Launch Checklist

- [ ] Core implementation complete
- [ ] README with quick start
- [ ] CONTRIBUTING.md with development setup
- [ ] GitHub Actions CI/CD
- [ ] Example integrations (Next.js, Astro)
- [ ] npm package for client library
- [ ] Blog post ready
- [ ] Social announcement drafted
- [ ] Submit to Cloudflare Community
- [ ] Submit to WASM Weekly newsletter
- [ ] Post to r/webdev, r/javascript, HackerNews

### Success Metrics

- **Adoption:** GitHub stars, forks, npm downloads
- **Usage:** (Optional) Analytics on demo endpoint
- **Community:** Issues filed, PRs merged, contributors
- **Visibility:** Blog mentions, conference talks, newsletter features

---

## Summary

Shimmer is a viable open source project that:

1. **Solves a real problem** — Blurhash integration is genuinely annoying for static sites
2. **Has clear value proposition** — Self-host for free, no dependencies, works everywhere
3. **Showcases technical skills** — WASM compilation, edge computing, clean architecture
4. **Low maintenance burden** — Automated builds, simple codebase, no server to run
5. **Good for portfolio** — Demonstrates full-stack thinking, DevOps, documentation skills

**Not viable as a paid service** because anyone can deploy their own. But excellent as:
- Portfolio piece
- Developer tool
- Foundation for more complex image products
- Entry point into edge/WASM ecosystem

Next step: Build it, launch it, write the blog post.
