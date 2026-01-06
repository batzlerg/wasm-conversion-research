# sanitize-edge

**Type:** API Primitive (Edge)
**Status:** Spec
**Viability:** ⭐⭐⭐⭐⭐

---

## One-Liner

HTML sanitization API running at the edge—DOMPurify without the DOM, XSS prevention as a service.

## Problem

Sanitizing user-generated HTML is security-critical for comment systems, rich text editors, and CMSs. DOMPurify (the standard) requires a DOM—it works in browsers but not in edge runtimes or serverless. Developers need server-side sanitization but edge environments don't have DOM APIs.

## Solution

Ammonia-powered HTML sanitization at Cloudflare's edge:
```bash
POST /sanitize
{ "html": "<script>alert('xss')</script><p>Safe content</p>" }

→ Returns: { "clean": "<p>Safe content</p>" }
```

Runs at edge (low latency), no DOM required, security-critical operation happens before content reaches your origin.

## Modules Used

- [ammonia](../EDGE_PROSPECTS.md#ammonia) (~200KB) — Rust HTML sanitizer, 15x faster than Python bleach
- Requires: stb_image NOT needed, ammonia is standalone

**Note:** ammonia needs WASM compilation. Bindings exist: [ammonia-wasm](https://github.com/lucacasonato/ammonia-wasm)

## Target Users

- Comment system developers (Disqus alternatives)
- CMS platforms (headless CMS, Ghost, Strapi)
- Rich text editor integrations (TipTap, ProseMirror users)
- Form builders accepting HTML input
- Email rendering systems

## User Flow

**Developer integration:**
```javascript
// Before storing user content
const response = await fetch('https://sanitize.your-domain.workers.dev/sanitize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    html: userInput,
    allowedTags: ['p', 'a', 'strong', 'em'] // optional
  })
});

const { clean } = await response.json();
// Store `clean` safely in database
```

## Core Features

- **XSS prevention** — Removes malicious scripts, event handlers
- **Whitelist-based** — Only allowed tags/attributes pass through
- **Configurable** — Customize allowed tags per use case
- **Fast** — 15x faster than Python bleach, runs at edge
- **No DOM dependency** — Works in any edge runtime
- **Standards-compliant** — Uses html5ever parser

## Competitive Landscape

| Solution | Platform | Gap |
|----------|----------|-----|
| DOMPurify | Browser/jsdom only | Needs DOM, can't run at edge |
| sanitize-html (npm) | Node.js | Can run at edge but slower |
| Cloudflare | No native sanitizer | They don't offer this |

## Novel Angle

DOMPurify is the standard but requires a DOM. Ammonia works without browser APIs—perfect for edge. This is the ONLY way to do HTML sanitization in Cloudflare Workers without bundling a full DOM implementation.

## Revenue Model

**Pay-per-use:**
- Free: 10k requests/month
- Pay-as-you-go: $0.15/1k requests
- Pro ($10/mo): 100k requests + priority

**Why people pay:**
- Security-critical (worth paying for)
- Saves development time (4-8 hours implementing safely)
- No server to manage
- Scales automatically

**Alternative:** Free (OSS self-host), enterprise licensing for support

## Build Complexity

**Low-Medium** — Estimated 15-25 hours

**Breakdown:**
- Compile ammonia to WASM — 6 hours
- Worker API wrapper — 4 hours
- Configuration handling — 4 hours
- Error handling — 3 hours
- Documentation — 4 hours
- Testing — 6 hours

## Success Metrics

### Launch
- 50 sign-ups
- 5 paying users ($50 MRR)

### Year 1
- 500 total users
- 100 paying ($1,500 MRR)
- Referenced in "edge security" guides

## Next Steps

- [ ] Compile ammonia to WASM using existing bindings
- [ ] Deploy to Cloudflare Workers
- [ ] Test with real HTML exploits
- [ ] Create integration guide for popular frameworks
- [ ] Launch on Hacker News with security angle
- [ ] Reach out to headless CMS communities

---

**Last updated:** January 2026
