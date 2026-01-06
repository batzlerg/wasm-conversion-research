# WASM Conversion Prospects — Master List

Comprehensive historical record of all libraries evaluated for WebAssembly conversion. Includes completed conversions, active prospects, eliminated candidates, and reference-only items.

**Last Updated:** January 2026

**For current work, see:**
- [ACTIVE_PROSPECTS.md](ACTIVE_PROSPECTS.md) — Libraries we're pursuing (34 candidates)
- [ELIMINATED.md](ELIMINATED.md) — Libraries we rejected with reasons (83 libraries)
- [LEARNINGS.md](LEARNINGS.md) — Technical details of conversion attempts

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | **COMPLETED** - Successfully converted with documented performance |
| 🎯 | **ACTIVE** - Pursuing conversion (browser or edge) |
| 🔍 | **RESEARCH** - Needs investigation before commitment |
| 📚 | **REFERENCE** - Already exists, use instead of building |
| ❌ | **ELIMINATED** - Rejected per decision tree |

---

## Completed Conversions (13)

Successfully converted to WASM with proven performance. See LEARNINGS.md for technical details.

| Library | Lang | Size | Performance | Status | Use Case |
|---------|------|------|-------------|--------|----------|
| blurhash | C | 21KB | 5,135 dec/sec | ✅ | Image placeholders (being upgraded to thumbhash) |
| mathc | C | 19KB | 33M mat4 ops/sec | ✅ | 2D/3D graphics math |
| LZ4 | C | 15.6KB | 6.5 GB/s | ✅ | Fast compression (browser) |
| PEGTL | C++ | 176KB | Fast | ✅ | PEG parser generator |
| DSPFilters | C++ | 59KB | 119M samples/sec, 13.5x | ✅ | Audio filters |
| stb_image | C | 103KB | 22k dec/sec | ✅ | Image decoding |
| Maximilian | C++ | 39KB | 8-12M samples/sec | ✅ | Audio synthesis |
| xxHash | C | 29KB | 17.6 GB/s, 5.87x | ✅ | Fast hashing |
| Snappy | C++ | 21KB | 300+ MB/s | ✅ | Compression (browser) |
| Eigen | C++ | 113KB | 7.4x faster | ✅ | Linear algebra |
| nalgebra | Rust | 72KB | 7.4x faster | ✅ | Linear algebra (Rust) |
| image-rs | Rust | 785KB | 1,263 resize/sec | ✅ | Image processing |
| QOI | C | 8.9KB | 377 MP/s | ✅ | Fast lossless image |

---

## Active Prospects — Browser-Targeted (8)

Libraries we're pursuing for browser-based products. See ACTIVE_PROSPECTS.md for details.

| Library | Lang | Stars | Why Active | Products |
|---------|------|-------|------------|----------|
| essentia | C++ | 3k | 🎯 Audio analysis, no JS equiv | freq-sense |
| q (cycfi) | C++ | 1k | 🎯 Audio DSP | wave-shape |
| eDSP | C++ | 500 | 🎯 Signal processing | Audio products |
| BLIS | C | 2.5k | 🎯 BLAS operations | math-viz |
| CImg | C++ | 1.5k | 🎯 Header-only image | pixel-forge |

**Priority:** Validate patterns, expand product capabilities

---

## Active Prospects — Edge-Targeted (16)

Libraries suitable for Cloudflare Workers. See ACTIVE_PROSPECTS.md and EDGE_PROSPECTS.md for details.

### Tier 1: High Priority (Build These)

| Library | Lang | Size | CPU | Products |
|---------|------|------|-----|----------|
| thumbhash | Rust/JS | ~15KB | <5ms | 🎯 thumbhash-edge |
| ammonia | Rust | ~200KB | <5ms | 🎯 sanitize-edge, readable-edge |
| minify-html | Rust | ~300KB | 5-15ms | 🎯 minify-edge, readable-edge |
| pulldown-cmark | Rust | ~100KB | <5ms | 🎯 markdown-edge (maybe) |
| resvg | Rust | ~3MB | 10-50ms | 🎯 og-image-edge |
| wasm-qrcode | Rust | ~50KB | <5ms | 🎯 qr-edge (portfolio) |
| texting_robots | Rust | Small | <5ms | 🎯 readable-edge, crawler tools |
| infer | Rust | Tiny | <1ms | 🎯 Upload validation APIs |

### Tier 2: Reference / Maybe

| Library | Status | Notes |
|---------|--------|-------|
| saffron | 📚 | Cloudflare's own cron parser, already WASM—use, don't rebuild |
| woothee | 🎯 | UA parsing, may be useful if cf object insufficient |
| ada-url | 🎯 | Fast URL parsing, marginal over JS URL API |
| similar | 🎯 | Text diff, niche edge use case |
| jsonschema | 🎯 | Schema validation, Ajv may suffice |
| fast-base64 | 🎯 | SIMD base64, only for large payloads |
| libsodium | 🎯 | Crypto, WebCrypto may suffice |
| chrono-tz | 🎯 | Timezones, cf object has basics |

---

## Research Needed — Missing Building Blocks (7)

Identified as valuable for products but not yet evaluated.

| Library | Purpose | Product Need | Action |
|---------|---------|--------------|--------|
| html2md | HTML→Markdown | 🔍 readable-edge | Find Rust crate or use turndown.js |
| readability-rs | Article extraction | 🔍 readable-edge | Find Rust port of Mozilla Readability |
| scraper | HTML parsing | 🔍 metadata APIs | Evaluate Rust crate |
| OG parser | Open Graph extraction | 🔍 meta-edge | Find Rust crate or use cheerio |
| jose (JWT) | Signature verification | 🔍 webhook-edge | Check if JS version works in Workers |
| jsonschema | Schema validation | 🔍 webhook-edge | Rust crate exists, or use Ajv |
| semver | Version parsing | 🔍 API routing | Rust crate exists |

---

## Research Needed (Validate Before Committing)

These look promising but need investigation before conversion.

### ML/AI (Check Model Size Constraints)