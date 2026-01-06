# Deployment & Distribution Strategy

**Overview of where products live and how users access them**

Last Updated: January 2026

---

## Products by Deployment Type

### 1. Cloudflare Workers (Edge Functions)

**Already Built (Phase 1-2):**
- sanitize-edge
- thumbhash-edge
- minify-edge
- readable-edge
- webhook-edge

**Remaining:**
- og-image-edge (Phase 3)

**Total:** 6 Cloudflare Workers

**Deployment:**
```bash
# Deploy to Cloudflare (requires CF account)
cd ~/Documents/projects/sanitize-edge
wrangler deploy
# → Deployed to: https://sanitize-edge.your-username.workers.dev
```

**Infrastructure Required:**
- Cloudflare account (free tier: 100k requests/day)
- Custom domain (optional): `sanitize.yourdomain.com`

**How Users Access:**
- **Direct HTTP API calls** (curl, fetch, etc.)
- **No installation required** (it's a hosted service)
- **Pay-per-use** pricing after free tier

**Example Usage:**
```javascript
// User's code (browser or server)
const response = await fetch('https://sanitize-edge.yourdomain.workers.dev', {
  method: 'POST',
  body: JSON.stringify({ html: userInput })
});
```

**Distribution Model:**
- **SaaS** — You host it, users call your endpoints
- **Self-hosted** — Users deploy to their own CF account (open source)
- **Hybrid** — Free tier on your domain, users can self-host if they want

---

### 2. npm Libraries (Installable Code)

**Already Built (Phase 1):**
- asset-hash

**Remaining:**
- audio-dna (Phase 6, deferred)

**Total:** 2 npm libraries

**Deployment:**
```bash
# Publish to npm registry
cd ~/Documents/projects/asset-hash
npm publish
# → Published to: https://www.npmjs.com/package/asset-hash
```

**Infrastructure Required:**
- npm account (free)
- Package name availability on npm

**How Users Access:**
```bash
# User installs via package manager
bun add asset-hash
# or
npm install asset-hash
```

**Example Usage:**
```typescript
// User's code (runs in their environment)
import { computeHash, generateThumbHash } from 'asset-hash';

const hash = await computeHash(imageBuffer);
```

**Distribution Model:**
- **Open source** (MIT license)
- **User runs locally** (no hosting needed from you)
- **Free to use** (standard npm package)

---

### 3. Bun CLI Tools (Local Executables)

**Remaining:**
- hash-vault (Phase 4)
- mosaicly (Phase 4)

**Total:** 2 CLI tools

**Deployment Options:**

#### Option A: npm Global Install (Recommended)
```bash
# Publish to npm as executable
cd ~/Documents/projects/hash-vault
npm publish

# User installs globally
npm install -g hash-vault
# or with Bun
bun install -g hash-vault

# User runs from anywhere
hash-vault scan ~/Documents
```

**package.json configuration:**
```json
{
  "name": "hash-vault",
  "version": "1.0.0",
  "bin": {
    "hash-vault": "./dist/cli.js"
  },
  "files": ["dist"]
}
```

#### Option B: Direct Download (GitHub Releases)
```bash
# Build standalone executable (Bun 1.0+ feature)
bun build src/cli.ts --compile --outfile hash-vault

# User downloads from GitHub releases
curl -L https://github.com/batzlerg/hash-vault/releases/download/v1.0.0/hash-vault -o hash-vault
chmod +x hash-vault
./hash-vault scan ~/Documents
```

#### Option C: Homebrew (macOS/Linux)
```bash
# Create Homebrew formula
# User installs via brew
brew install batzlerg/tap/hash-vault
hash-vault scan ~/Documents
```

**Infrastructure Required:**
- **Option A:** npm account (same as libraries)
- **Option B:** GitHub Releases (free, already have repos)
- **Option C:** Homebrew tap repo (free GitHub repo)

**How Users Access:**
- **Install once** (global CLI tool)
- **Run locally** (processes their files)
- **No cloud connection** (100% offline)

**Example Usage:**
```bash
# hash-vault — Find duplicate files
hash-vault scan ~/Documents
# → Found 1,234 files, 234 duplicates (5.2GB saved)

hash-vault dedupe --dry-run
# → Would delete: photo-copy-1.jpg, photo-copy-2.jpg

# mosaicly — Compress files
mosaicly compress file.txt
# → Compressed 1.2MB → 384KB (68% reduction)

mosaicly decompress file.txt.lz4
# → Decompressed to file.txt
```

**Distribution Model:**
- **Free & open source** (MIT license)
- **No hosting required** (runs on user's machine)
- **Offline-first** (no API calls, no tracking)

---

### 4. Static Sites (Astro)

**Remaining:**
- parser-lab (Phase 5)
- spritify (Phase 6, deferred)

**Total:** 2 static sites

**Deployment:**

#### Option A: Cloudflare Pages (Free)
```bash
# Build static site
cd ~/Documents/projects/parser-lab
bun run build
# → Generates dist/ folder with HTML/CSS/JS

# Deploy to Cloudflare Pages (automatic from Git)
# → Deployed to: https://parser-lab.pages.dev
# → Custom domain: https://parser-lab.com
```

**Infrastructure Required:**
- Cloudflare Pages account (free, unlimited bandwidth)
- Git repo connected to CF Pages (auto-deploy on push)
- Custom domain (optional)

#### Option B: Vercel (Free)
```bash
# Same build process
bun run build

# Deploy via Vercel CLI or GitHub integration
vercel deploy
# → Deployed to: https://parser-lab.vercel.app
```

#### Option C: Netlify (Free)
```bash
# Same build process
netlify deploy --prod
# → Deployed to: https://parser-lab.netlify.app
```

**How Users Access:**
- **Visit URL in browser** (https://parser-lab.com)
- **No installation** (it's a website)
- **Works offline after first load** (PWA capable)

**Example Usage:**
```
User visits: https://parser-lab.com
1. Pastes PEG grammar in editor
2. Pastes test input
3. Clicks "Parse"
4. Sees parse tree or error
5. Downloads grammar as .peg file
```

**Distribution Model:**
- **Free web app** (hosted on CF Pages/Vercel)
- **No backend needed** (WASM runs in browser)
- **No database** (localStorage for user grammars)
- **Could monetize:** Pro features behind auth

---

### 5. Static Web Apps with WASM (Astro or Next.js Static Export)

**CRITICAL INSIGHT:** WASM runs in the browser. Most "web apps" can be 100% static (no backend needed).

**Remaining (All Phase 6, Deferred):**
- imageo (image editor)
- freq-sense (audio training game)
- wave-shape (modular synthesizer)
- math-viz (3D math visualizations)
- audiomill (audio processing)
- physics-box (physics sandbox)

**Total:** 6 web apps (can all be static)

**Deployment:**

#### Option A: Cloudflare Pages (Recommended for Static)
```bash
# Build static site with WASM
cd ~/Documents/projects/imageo
bun run build
# → Generates dist/ folder with HTML/CSS/JS/WASM

# Deploy to Cloudflare Pages
# → Deployed to: https://imageo.pages.dev
# → Custom domain: https://imageo.com
```

**Infrastructure Required (Static-Only Mode):**
- Cloudflare Pages account (free, unlimited bandwidth)
- Custom domain (optional)
- **No database needed** (uses localStorage or file downloads)
- **No auth needed** (no user accounts)
- **No file storage needed** (files stay in browser)

#### Option B: Vercel (If Adding Backend Later)
```bash
# Start with static export
next build && next export

# Later: Add API routes for user accounts/cloud features
```

**How Users Access (Static Mode):**
- **Visit URL in browser** (https://imageo.com)
- **Upload files** (File API - stays in browser, no server upload)
- **WASM processes** (100% client-side computation)
- **Download results** (direct download from browser)
- **Save projects** (localStorage or JSON file download)

**Example Usage (No Backend):**
```
imageo (100% client-side):
1. User visits https://imageo.com (loads static HTML + WASM)
2. Uploads image via <input type="file"> (stays in browser memory)
3. Applies filters (WASM processes in browser)
4. Downloads optimized image (browser triggers download)
5. Saves project (localStorage or downloads JSON)

wave-shape (100% client-side):
1. User visits https://wave-shape.com
2. Builds modular synth (Web Audio API + WASM)
3. Plays notes (audio runs in browser)
4. Exports patch as JSON (downloads file)
```

**Distribution Model:**

#### Static-First (Recommended)
- **100% free and static** (no backend, no costs)
- **WASM runs in browser** (all processing client-side)
- **Data storage:** localStorage (per-device) or file downloads
- **No user accounts** (no login required)
- **Cost:** $0 forever

#### Backend-Enhanced (Optional, Later)
If you want to add user accounts or cloud features:
- **Auth:** Clerk, Auth0, NextAuth
- **Database:** Neon Postgres, Vercel Postgres
- **File storage:** Cloudflare R2, Vercel Blob
- **Cost:** $0-20/mo for small scale
- **Use cases:** Save projects across devices, social features, leaderboards

**Recommendation:** Ship v1 as 100% static. Add backend only if users request cloud features.

---

## Summary Table

| Product | Type | Deployment | Distribution | User Access | Infrastructure Cost |
|---------|------|------------|--------------|-------------|---------------------|
| **sanitize-edge** | CF Worker | Cloudflare Workers | SaaS or self-hosted | HTTP API | Free tier: 100k req/day |
| **thumbhash-edge** | CF Worker | Cloudflare Workers | SaaS or self-hosted | HTTP API | Free tier: 100k req/day |
| **minify-edge** | CF Worker | Cloudflare Workers | SaaS or self-hosted | HTTP API | Free tier: 100k req/day |
| **readable-edge** | CF Worker | Cloudflare Workers | SaaS or self-hosted | HTTP API | Free tier: 100k req/day |
| **webhook-edge** | CF Worker | Cloudflare Workers | SaaS or self-hosted | HTTP API | Free tier: 100k req/day |
| **og-image-edge** | CF Worker | Cloudflare Workers | SaaS or self-hosted | HTTP API | Free tier: 100k req/day |
| **asset-hash** | npm Library | npm Registry | Open source package | `bun add` | $0 (npm free) |
| **hash-vault** | CLI Tool | npm (global) or GitHub | Free CLI tool | `npm i -g` or download | $0 |
| **mosaicly** | CLI Tool | npm (global) or GitHub | Free CLI tool | `npm i -g` or download | $0 |
| **parser-lab** | Static Site (Astro) | CF Pages / Vercel | Free web app | Browser URL | $0 (static) |
| **spritify** | Static Site (Astro) | CF Pages / Vercel | Free web app | Browser URL | $0 (static) |
| **imageo** | Static Site (Astro/Next) | CF Pages / Vercel | Free web app | Browser URL | $0 (static, WASM in browser) |
| **freq-sense** | Static Site (Astro/Next) | CF Pages / Vercel | Free web app | Browser URL | $0 (static, WASM in browser) |
| **wave-shape** | Static Site (Astro/Next) | CF Pages / Vercel | Free web app | Browser URL | $0 (static, WASM in browser) |
| **math-viz** | Static Site (Astro/Next) | CF Pages / Vercel | Free web app | Browser URL | $0 (static, WASM in browser) |
| **audiomill** | Static Site (Astro/Next) | CF Pages / Vercel | Free web app | Browser URL | $0 (static, WASM in browser) |
| **physics-box** | Static Site (Astro/Next) | CF Pages / Vercel | Free web app | Browser URL | $0 (static, WASM in browser) |
| **audio-dna** | npm Library | npm Registry | Open source package | `bun add` | $0 |

**Note:** All web apps can be 100% static with WASM running in browser. Backend (auth/database) only needed if adding user accounts or cloud features later.

---

## Infrastructure Requirements by Phase

### Phase 3 (og-image-edge)
- **Cloudflare Account** (if deploying centrally)
- **Custom Domain** (optional)
- **Cost:** $0 on free tier

### Phase 4 (CLI Tools)
- **npm Account** (for publishing)
- **GitHub Releases** (alternative distribution)
- **Cost:** $0

### Phase 5 (Static Sites)
- **Cloudflare Pages** or **Vercel** account
- **Custom Domain** (optional)
- **Cost:** $0 on free tier

### Phase 6 (Static Web Apps with WASM)
- **Cloudflare Pages** or **Vercel** account
- **Custom Domain** (optional)
- **Cost:** $0 (100% static, WASM runs in browser)

**Optional Backend (Only If Adding User Accounts Later):**
- **Database:** Neon Postgres (free tier: 1GB), PlanetScale MySQL (free tier: 5GB)
- **Auth Provider:** Clerk ($0-25/mo), Auth0 (free tier: 7000 users)
- **File Storage:** Cloudflare R2 ($0.015/GB), Vercel Blob
- **Cost if adding backend:** $0-20/mo for small scale

---

## Recommended Distribution Strategy

### For Cloudflare Workers (6 products):

**Option 1: Central SaaS** (You host, users call your API)
- Deploy all 6 workers to your CF account
- Custom domains: `sanitize.yourdomain.com`, `webhook.yourdomain.com`, etc.
- Monetize via API keys (Stripe billing)
- **Cost:** $0 on free tier, $5/mo per 10M requests after

**Option 2: Open Source Self-Hosted** (Users deploy to their account)
- Publish repos as open source (MIT license)
- Users clone and run `wrangler deploy` to their own CF account
- You provide docs, they pay their own CF bills
- **Cost to you:** $0

**Option 3: Hybrid** (Free tier on your domain, self-host for power users)
- Free tier: 1000 requests/day per user
- Power users: Deploy to their own CF account
- **Cost:** $0-20/mo depending on usage

**My Recommendation:** Option 3 (Hybrid) — Generous free tier to get users hooked, self-host option for high-volume users.

---

### For CLI Tools (2 products):

**Recommended:** Publish to npm as global CLI tools

**Why:**
- Easiest for users (`npm install -g hash-vault`)
- Automatic updates (`npm update -g`)
- Works on macOS, Linux, Windows
- No hosting costs for you

**Alternative:** Homebrew tap for macOS users (extra polish, but more maintenance)

---

### For Static Sites (2 products):

**Recommended:** Cloudflare Pages (free, unlimited bandwidth)

**Setup:**
```bash
# One-time setup per project
1. Connect GitHub repo to CF Pages
2. Set build command: bun run build
3. Set output directory: dist
4. Auto-deploy on every push to main
```

**Cost:** $0 forever (CF Pages is genuinely free, unlimited bandwidth)

---

### For Static Web Apps with WASM (6 products):

**Recommended:** Cloudflare Pages (100% static)

**Why:**
- Free tier is genuinely unlimited bandwidth
- Perfect for WASM (no backend needed)
- Fast global CDN
- Easy deployment from Git

**Framework Choice:**

**Astro (Recommended for most):**
- Smaller bundle sizes (less JS shipped)
- Faster page loads
- Perfect for "tool" sites (image editor, parser, etc.)
- WASM loads in component islands

**Next.js Static Export (For complex UIs):**
- Better for drag-and-drop interfaces (imageo)
- Rich React ecosystem
- Easy to add backend later if needed

**Cost projection:**
- **Static only:** $0 forever (unlimited bandwidth on CF Pages)
- **If adding backend later:** $0-20/mo (auth + database for user accounts)

**Recommendation:** Ship v1 as 100% static. Only add backend if users explicitly request cloud features (save across devices, sharing, etc.).

---

## CLI Tools: Detailed Distribution Plan

### hash-vault

**What it does:** Scans directories for duplicate files by content hash

**Where it runs:** User's local machine (100% offline)

**Distribution:**

#### Option A: npm Global Install
```bash
# User installs
npm install -g hash-vault

# User runs from any directory
hash-vault scan ~/Documents
hash-vault scan ~/Photos --min-size 1MB
hash-vault dedupe --interactive
```

**package.json:**
```json
{
  "name": "hash-vault",
  "version": "1.0.0",
  "bin": {
    "hash-vault": "./dist/cli.js"
  },
  "preferGlobal": true
}
```

#### Option B: Bun Standalone Binary
```bash
# Build self-contained executable (no Node/Bun runtime needed)
bun build src/cli.ts --compile --outfile hash-vault-macos-arm64
bun build src/cli.ts --compile --target=linux-x64 --outfile hash-vault-linux-x64
bun build src/cli.ts --compile --target=windows-x64 --outfile hash-vault-windows-x64.exe

# Upload to GitHub Releases
# User downloads and runs
curl -L https://github.com/batzlerg/hash-vault/releases/latest/download/hash-vault-macos-arm64 -o hash-vault
chmod +x hash-vault
./hash-vault scan ~/Documents
```

**Recommendation:** **Option A (npm)** for easy installation, **Option B (binaries)** for users without Node/Bun.

---

### mosaicly

**What it does:** Compress/decompress files using LZ4 and Snappy

**Where it runs:** User's local machine (100% offline)

**Distribution:** Same as hash-vault (npm global + optional binaries)

```bash
# User installs
npm install -g mosaicly

# User runs
mosaicly compress file.txt --format lz4
mosaicly decompress file.txt.lz4
mosaicly batch-compress ~/Documents/*.log
```

---

## Answer to Your Question

**Q: Are CLI tools deployed to Cloudflare?**

**A: No.** CLI tools run **100% locally** on the user's machine. They are:

1. **Distributed via npm** (like any CLI: `npm install -g`)
2. **Executed locally** (like `git`, `bun`, `curl`)
3. **No cloud connection** (all processing happens on user's computer)
4. **No hosting needed from you** (users download once, run forever)

**Cloudflare is only for:**
- Edge Workers (sanitize-edge, webhook-edge, etc.) — API endpoints you host
- Cloudflare Pages (parser-lab, etc.) — Static websites you host

**CLI tools are like:**
- `git` (installed globally, runs locally)
- `ffmpeg` (processes files offline)
- `imagemagick` (no cloud dependency)

---

---

## Astro vs Next.js for WASM Apps

### When to Use Astro

**Best for:**
- Tool sites (parser-lab, math-viz, physics-box, spritify)
- Simple UIs with WASM processing
- Maximum performance (minimal JS)

**Astro Pattern:**
```astro
---
// parser-lab/src/pages/index.astro
import WasmParser from '../components/WasmParser.tsx';
---

<html>
  <body>
    <h1>Parser Lab</h1>
    <!-- React island with WASM -->
    <WasmParser client:load />
  </body>
</html>
```

**Bundle size:** ~50KB JS + WASM module

### When to Use Next.js

**Best for:**
- Complex UIs (imageo drag-and-drop editor, wave-shape modular routing)
- Rich state management
- Might need backend later

**Next.js Pattern:**
```typescript
// imageo/pages/index.tsx
export default function ImageEditor() {
  // Complex React state, drag-and-drop, etc.
}

// Build as static site
// next build && next export
```

**Bundle size:** ~150-200KB JS + WASM module

### Recommendation

| Product | Framework | Reason |
|---------|-----------|--------|
| parser-lab | Astro | Simple tool, minimal UI |
| spritify | Astro | Pixel editor, canvas-based |
| math-viz | Astro | 3D WebGL + controls |
| physics-box | Astro | Canvas simulation + sliders |
| imageo | Next.js | Drag-drop, layers, complex state |
| wave-shape | Next.js | Modular routing, patch management |
| freq-sense | Next.js | Game state, progression |
| audiomill | Astro | Simple upload → process → download |

---

## Infrastructure Cost Summary

**All 18 products can be shipped for $0/month:**

| Infrastructure | Products | Monthly Cost |
|---------------|----------|--------------|
| Cloudflare Workers | 6 workers | $0 (free tier: 100k req/day) |
| npm Registry | 2 libraries + 2 CLI tools | $0 (npm is free) |
| Cloudflare Pages | 8 static sites (with WASM) | $0 (unlimited bandwidth) |
| **Total** | **18 products** | **$0/month** |

**Optional costs (only if adding user accounts/social features):**
- Custom domains: ~$12/year per domain
- Auth (Clerk): $0-25/mo (free tier: 5000 users)
- Database (Neon): $0 (free tier: 1GB)

---

## Next Steps

### Immediate (Before Phase 3):
1. **Create Cloudflare account** (if deploying workers centrally)
2. **Create npm account** (for publishing libraries + CLI tools)
3. **Decide:** Self-hosted workers vs central SaaS?

### After Phase 3-5 Complete:
1. **Deploy workers** to Cloudflare (batch deployment)
2. **Publish asset-hash** to npm
3. **Publish CLI tools** to npm
4. **Deploy static sites** to CF Pages

### Before Phase 6 (Static WASM Apps):
1. **Create Cloudflare Pages account** (or Vercel)
2. **Choose framework:** Astro vs Next.js per product
3. **No backend setup needed** (ship v1 as 100% static)
4. **Optional (later):** Add auth/database if users request cloud features

---

## Key Takeaways

1. **WASM = Client-Side Processing** → No backend needed for computation
2. **All 18 products can be free** → $0/month infrastructure cost
3. **Static-first strategy** → Add backend only if users request it
4. **Cloudflare Pages is ideal** → Free unlimited bandwidth for static + WASM
5. **CLI tools run locally** → No cloud deployment needed
