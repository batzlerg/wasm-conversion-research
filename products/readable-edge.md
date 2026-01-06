# readable-edge

**Type:** Pipeline Service (Edge)
**Status:** Spec
**Viability:** ⭐⭐⭐⭐

---

## One-Liner

URL→clean Markdown API for LLMs—Jina AI Reader alternative that's self-hostable and privacy-preserving.

## Problem

LLMs consume tokens. Raw HTML is verbose, full of scripts, ads, and noise. Developers need clean Markdown from web pages for LLM context. Jina AI Reader solves this but it's a hosted service—your URLs go through their servers.

## Solution

Multi-step pipeline at the edge:
```bash
POST /readable
{ "url": "https://techcrunch.com/article" }

→ Returns:
{
  "markdown": "# Article Title\n\nClean content...",
  "wordCount": 1250,
  "readingTime": "5 min",
  "hash": "a3f2b1"
}
```

**Pipeline steps:**
1. Check robots.txt (ethical scraping)
2. Fetch HTML
3. Extract main article content (readability algorithm)
4. Sanitize HTML (remove scripts, ads)
5. Minify HTML (reduce tokens)
6. Convert to Markdown
7. Hash for caching

## Modules Used

### WASM modules:
- [texting_robots](../EDGE_PROSPECTS.md#texting_robots) — robots.txt parsing
- [ammonia](../EDGE_PROSPECTS.md#ammonia) (~200KB) — HTML sanitization
- [minify-html](../EDGE_PROSPECTS.md#minify-html) (~300KB) — Minification
- [xxHash](../ACTIVE_PROSPECTS.md#xxhash) (29KB) — Content hashing

### Needs research (may be JS):
- **readability algorithm** (article extraction) — Find Rust crate or use JS
- **html2md** (HTML→Markdown) — Find Rust crate or use turndown.js

## Target Users

- LLM application developers
- AI agent builders needing web content
- RAG (Retrieval Augmented Generation) systems
- Research tools scraping web content
- Documentation aggregators

## User Flow

**Developer integration:**
```javascript
// Prepare web page for LLM
const result = await fetch('https://readable.your-domain.workers.dev/readable', {
  method: 'POST',
  body: JSON.stringify({ url: articleUrl })
});

const { markdown } = await result.json();

// Send to LLM
await openai.chat.completions.create({
  messages: [
    { role: 'system', content: 'Summarize this article' },
    { role: 'user', content: markdown }
  ]
});
```

## Core Features

- **Ethical scraping** — Respects robots.txt automatically
- **Article extraction** — Main content only, no ads/navigation
- **Clean Markdown** — Optimized for LLM consumption
- **Token reduction** — Minified = fewer tokens = cheaper LLM calls
- **Content hashing** — Dedupe repeated URLs
- **Caching** — KV cache for popular URLs
- **Privacy** — Self-hostable, URLs don't go to third party

## Competitive Landscape

| Service | Pricing | Gap |
|---------|---------|-----|
| Jina AI Reader | Free tier → paid | Third-party service, privacy concern |
| Firecrawl | $20/mo | Expensive, complex |
| Custom scraping | Dev time | 8-16 hours to build safely |

## Novel Angle

Jina AI Reader is popular but you're sending URLs to their service. readable-edge is self-hostable—your content never leaves your Cloudflare account. Appeals to:
- Privacy-conscious developers
- Enterprise with data policies
- Developers wanting control

## Revenue Model

**Pay-per-use:**
- Free: 1k requests/month
- Pay-as-you-go: $0.25/1k requests (higher due to complexity)
- Pro ($10/mo): 50k requests

**Alternative:** Free (OSS self-host) with deployment guide

**Bundle opportunity:** Combine with sanitize-edge and minify-edge as "Content Pipeline Bundle"

## Build Complexity

**Medium-High** — Estimated 40-60 hours

**Breakdown:**
- Find/integrate readability algorithm — 12 hours
- Find/integrate html2md — 8 hours
- Orchestrate pipeline — 10 hours
- Error handling (malformed HTML, failed fetches) — 8 hours
- Caching layer — 6 hours
- robots.txt checking — 4 hours
- Documentation — 8 hours
- Testing across different sites — 12 hours

**Research needed:** Find good Rust crates for readability and html2md, or use JS alternatives.

## Success Metrics

### Launch
- 100 users
- Featured in LLM dev communities

### Year 1
- 1,000 users
- 50 paying ($500 MRR)
- Referenced in RAG tutorials

## Next Steps

- [ ] Research: Find rust-readability or readability-rs crate
- [ ] Research: Find html2md Rust crate
- [ ] Build proof-of-concept (fetch → simple html2md only)
- [ ] Test with diverse websites (news, blogs, docs)
- [ ] Add full pipeline
- [ ] Launch targeting LLM developers

---

**Last updated:** January 2026
