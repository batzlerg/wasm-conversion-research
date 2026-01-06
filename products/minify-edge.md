# minify-edge

**Type:** API Primitive (Edge)
**Status:** Spec
**Viability:** ⭐⭐⭐⭐

---

## One-Liner

HTML/CSS/JS minification at the edge—replaces Cloudflare's deprecated Auto Minify with better performance.

## Problem

Cloudflare deprecated their Auto Minify feature in August 2024. Developers using it need a replacement. Dynamic content (server-rendered, edge-rendered) can't be pre-minified at build time. Minification reduces token count for LLM processing and improves page load times.

## Solution

On-the-fly minification at Cloudflare's edge:
```bash
POST /minify
{
  "html": "<div>  lots   of   whitespace  </div>",
  "type": "html"
}

→ Returns: { "minified": "<div>lots of whitespace</div>", "savings": "42%" }
```

Context-aware minification that preserves whitespace in `<pre>` and `<code>` while aggressively removing it elsewhere.

## Modules Used

- [minify-html](../EDGE_PROSPECTS.md#minify-html) (~300KB) — Rust-based minifier
  - Supports HTML + embedded CSS + embedded JS
  - Context-aware (knows about `<pre>`, `<code>`)
  - Claims 5x faster than JS alternatives

## Target Users

- Developers whose sites used CF Auto Minify (deprecated)
- Server-rendered apps (Next.js, Remix, SvelteKit)
- LLM developers minimizing token count
- CMS platforms generating dynamic HTML
- Anyone wanting to reduce HTML payload

## User Flow

**Developer integration:**
```javascript
// In edge middleware
const response = await fetch(originUrl);
const html = await response.text();

const minified = await fetch('https://minify.your-domain.workers.dev/minify', {
  method: 'POST',
  body: JSON.stringify({ html, type: 'html' })
});

return new Response(minified.html, {
  headers: { 'Content-Type': 'text/html' }
});
```

## Core Features

- **HTML minification** — Remove unnecessary whitespace, comments
- **CSS minification** — Embedded and inline styles
- **JS minification** — Basic minification (not full uglify)
- **Context-aware** — Preserves whitespace in `<pre>`, `<code>`, `<script>`
- **Fast** — Claims 5x faster than JS minifiers
- **Configurable** — Options for aggressiveness

## Competitive Landscape

| Solution | Status | Gap |
|----------|--------|-----|
| Cloudflare Auto Minify | **Deprecated Aug 2024** | Need replacement |
| html-minifier (npm) | Active but slower | Can run at edge but performance gap |
| Build-time minification | Works for static | Doesn't help dynamic content |

## Novel Angle

Cloudflare deprecated their feature. This fills the gap with better performance (Rust-based). Particularly valuable for:
- SSR apps that can't pre-minify
- LLM content prep (fewer tokens)
- Migration path for Auto Minify users

## Revenue Model

**Pay-per-use or free:**
- Free: 50k requests/month
- Pay-as-you-go: $0.10/1k requests
- Pro ($8/mo): 1M requests

**Alternative:** Free (OSS self-host) with tutorial

**Pricing consideration:** Minification is a commodity. Hard to charge unless bundled with other primitives.

## Build Complexity

**Low-Medium** — Estimated 10-20 hours

**Breakdown:**
- Integrate minify-html WASM — 4 hours (already exists for CF Workers)
- Worker API wrapper — 3 hours
- Configuration options — 3 hours
- Error handling — 3 hours
- Documentation — 4 hours
- Testing — 5 hours

**Note:** cf-wasm already has minify-html for Cloudflare Workers. May just need to wrap it.

## Success Metrics

### If Free (OSS)
- 100 GitHub stars
- Used by developers migrating from CF Auto Minify
- Tutorial blog post traffic

### If Paid
- 50 paying users ($400 MRR)

## Next Steps

- [ ] Check if cf-wasm minify-html can be used directly
- [ ] Deploy simple wrapper to Workers
- [ ] Test CPU time on various HTML sizes
- [ ] Document free tier limits clearly
- [ ] Write migration guide for CF Auto Minify users
- [ ] Launch on Cloudflare community forum

---

**Last updated:** January 2026
