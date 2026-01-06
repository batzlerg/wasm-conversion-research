# Edge-Deployable WASM Prospects

Deep research into libraries compilable to WebAssembly for deployment on Cloudflare Workers and similar edge runtimes. Focus: small binary size, fast execution within CPU limits, and solving real problems at the edge.

**Last Updated:** January 2026

---

## Edge Runtime Constraints

Before evaluating candidates, understand the constraints:

| Constraint | Cloudflare Free | Cloudflare Paid ($5/mo) |
|------------|-----------------|-------------------------|
| CPU time/request | **10ms** | 50ms |
| Memory | 128MB | 128MB |
| Script size | 1MB | 10MB |
| Subrequests | 50/request | 50/request |
| No native DNS | ✓ | ✓ |
| No filesystem | ✓ | ✓ |

**Key insight:** The 10ms CPU limit is the primary constraint. Libraries must be fast AND small.

---

## Decision Tree for Edge Candidates

```
✅ PROCEED if:
├── Pure computation (no I/O dependencies)
├── Small binary size (<500KB, ideally <100KB)
├── Fast execution (<10ms for typical input)
├── Solves problem that CAN'T be done client-side
├── No adequate edge-native alternative exists
└── Request/response model fits naturally

❌ SKIP if:
├── Requires filesystem access
├── Needs native DNS resolution
├── Large model/data files required
├── Long-running computation (>50ms)
├── Cloudflare already offers native solution
├── Better solved client-side
└── Requires persistent state beyond KV
```

---

## Tier 1: High-Confidence Edge Candidates

Libraries with proven WASM support, small size, and clear edge use cases.

---

### 1. **thumbhash** — Better Blurhash Alternative

**Source:** [github.com/evanw/thumbhash](https://github.com/evanw/thumbhash)
**Language:** Rust, Swift, Java, JavaScript
**WASM Size:** ~15KB estimated
**Performance:** Comparable to blurhash

**What it does:** Generates compact image placeholders with better color accuracy and alpha channel support than blurhash.

**Why it's better than blurhash:**
- Supports images with transparency (alpha channel)
- Encodes more detail in same space
- More accurate colors
- Similar complexity and speed

**Edge use case:** Same as blurhash-edge but with superior output quality.

**Decision tree:**
- ✅ Pure computation
- ✅ Small binary
- ✅ Fast execution
- ✅ Can't be done client-side (need hash before image loads)
- ✅ No native alternative

**Verdict:** ⭐⭐⭐⭐⭐ **BUILD** — Direct upgrade to blurhash-edge

**References:**
- [ThumbHash Demo](https://evanw.github.io/thumbhash/)
- [DatoCMS ThumbHash Introduction](https://www.datocms.com/blog/introducing-thumbhash-the-compact-placeholder-with-alpha-support)

---

### 2. **ammonia** — HTML Sanitization

**Source:** [github.com/rust-ammonia/ammonia](https://github.com/rust-ammonia/ammonia)
**Language:** Rust
**WASM Bindings:** [ammonia-wasm](https://github.com/lucacasonato/ammonia-wasm)
**WASM Size:** ~200KB estimated
**Performance:** 15x faster than Python bleach

**What it does:** Whitelist-based HTML sanitizer that prevents XSS, layout breaking, and clickjacking. Built on html5ever.

**Edge use case:** Sanitize user-generated HTML at the edge before storing or rendering. Essential for:
- Comment systems
- Rich text editors
- Email content processing
- Markdown rendering pipelines

**Why WASM matters:** DOMPurify requires a DOM. Ammonia works without browser APIs—perfect for edge.

**Decision tree:**
- ✅ Pure computation (string in, string out)
- ✅ Reasonable binary size
- ✅ Fast execution
- ✅ Server-side sanitization is security best practice
- ✅ No native Cloudflare alternative

**Verdict:** ⭐⭐⭐⭐⭐ **BUILD** — Critical security tool for edge

**References:**
- [Ammonia Rust Docs](https://docs.rs/ammonia/)
- [Deno ammonia package](https://deno.land/x/ammonia@0.3.1)

---

### 3. **minify-html** — HTML/CSS/JS Minification

**Source:** [github.com/wilsonzlin/minify-html](https://github.com/wilsonzlin/minify-html)
**Language:** Rust
**WASM Size:** ~300KB
**Performance:** Extremely fast, smart context-aware minification

**What it does:** Minifies HTML, CSS, and JavaScript with intelligent whitespace handling. Knows to preserve whitespace in `<pre>` and `<code>` tags.

**Edge use case:** On-the-fly minification at the edge. Cloudflare deprecated their Auto Minify feature in August 2024—this fills the gap.

**Why edge:**
- Transform responses before caching
- Minify dynamic content that can't be pre-built
- Replace deprecated Cloudflare Auto Minify

**Decision tree:**
- ✅ Pure computation
- ✅ Reasonable binary size
- ⚠️ May exceed 10ms for large documents
- ✅ Replaces deprecated Cloudflare feature
- ✅ No current native alternative

**Verdict:** ⭐⭐⭐⭐ **BUILD** — Fills Cloudflare gap, but watch CPU limits

**References:**
- [cf-wasm package](https://github.com/fineshopdesign/cf-wasm)
- [WASM browser wrapper](https://github.com/dxpr/minify-html-wasm-browser-wrapper)

---

### 4. **pulldown-cmark** — Markdown to HTML

**Source:** [github.com/pulldown-cmark/pulldown-cmark](https://github.com/pulldown-cmark/pulldown-cmark)
**Language:** Rust
**WASM Bindings:** [pulldown-cmark-wasm](https://github.com/tschneidereit/pulldown-cmark-wasm)
**WASM Size:** ~100KB estimated
**Performance:** Very fast pull-parser, SIMD accelerated

**What it does:** Parses CommonMark Markdown to HTML. Used by `cargo doc`.

**Edge use case:**
- Render Markdown at the edge for CMS/blog platforms
- Transform Markdown API responses
- Combine with ammonia for safe Markdown rendering

**Why edge:**
- Dynamic Markdown rendering without origin server
- Combine with sanitization for secure pipeline

**Decision tree:**
- ✅ Pure computation
- ✅ Small binary
- ✅ Very fast
- ✅ Server-side rendering valuable for SEO
- ⚠️ Could be done at build time for static content

**Verdict:** ⭐⭐⭐⭐ **BUILD** — Great when combined with ammonia

**Alternative:** [comrak](https://github.com/kivikakk/comrak) for GitHub Flavored Markdown

**References:**
- [Fastly WASM Markdown Demo](https://markdown.fastlylabs.com/)

---

### 5. **resvg** — SVG to PNG Rendering

**Source:** [github.com/RazrFalcon/resvg](https://github.com/RazrFalcon/resvg)
**Language:** Rust
**WASM Bindings:** [resvg-js](https://github.com/nicoe/resvg-js)
**WASM Size:** ~2-3MB (larger, but powerful)
**Performance:** Fast, comprehensive SVG support

**What it does:** Renders SVG to PNG/raster images. Pure Rust, no unsafe code.

**Edge use case:**
- Generate PNG from SVG at the edge
- Dynamic chart/diagram rendering
- OG image generation (combined with Satori)

**Why edge:**
- Vercel uses resvg for their OG image generation
- Dynamic image creation without Puppeteer/Chrome

**Decision tree:**
- ✅ Pure computation
- ⚠️ Larger binary (~3MB)
- ⚠️ May exceed 10ms for complex SVGs
- ✅ Enables OG image generation at edge
- ✅ No native alternative

**Verdict:** ⭐⭐⭐⭐ **BUILD** — Essential for OG images, needs paid tier

**References:**
- [Vercel OG Image Generation](https://vercel.com/blog/introducing-vercel-og-image-generation-fast-dynamic-social-card-images)
- [Satori + resvg tutorial](https://anasrin.dev/blog/generate-image-from-html-using-satori-and-resvg/)

---

### 6. **QR Code Generator** — wasm-qrcode

**Source:** [github.com/yishiashia/wasm-qrcode](https://github.com/yishiashia/wasm-qrcode)
**Language:** Rust
**WASM Size:** ~50KB
**Performance:** Fast, outputs SVG

**What it does:** Generates QR codes as SVG from text input.

**Edge use case:**
- Dynamic QR code generation for URLs, vCards, etc.
- Payment QR codes
- Event ticket QR codes

**Why edge:**
- No external service needed
- Privacy (data doesn't leave edge)
- Fast, cacheable responses

**Decision tree:**
- ✅ Pure computation
- ✅ Small binary
- ✅ Very fast
- ⚠️ Could be done client-side
- ✅ No native alternative

**Verdict:** ⭐⭐⭐⭐ **BUILD** — Simple, useful, low risk

**References:**
- [qr.paazmaya.fi](https://qr.paazmaya.fi/) (privacy-first QR generator)
- [qrcode-rust](https://github.com/kennytm/qrcode-rust)

---

### 7. **saffron** — Cron Expression Parser

**Source:** [github.com/cloudflare/saffron](https://github.com/cloudflare/saffron)
**Language:** Rust
**WASM Size:** Small (Cloudflare uses it in production)
**Performance:** Very fast

**What it does:** Parses cron expressions, calculates next run times, generates human-readable descriptions.

**Edge use case:**
- Validate cron expressions in user input
- Calculate "next run" times for scheduling UIs
- Generate descriptions ("Every Monday at 9am")

**Why edge:**
- Cloudflare built this for their own Cron Triggers
- Already proven in production WASM use

**Decision tree:**
- ✅ Pure computation
- ✅ Small binary
- ✅ Very fast
- ✅ Validated by Cloudflare in production
- ✅ No native alternative for custom use

**Verdict:** ⭐⭐⭐⭐⭐ **USE** — Already production-proven by Cloudflare

**References:**
- [Cloudflare Blog: Using One Cron Parser Everywhere](https://blog.cloudflare.com/using-one-cron-parser-everywhere-with-rust-and-saffron/)

---

### 8. **texting_robots** — robots.txt Parser

**Source:** [github.com/Smerity/texting_robots](https://github.com/Smerity/texting_robots)
**Language:** Rust
**WASM Size:** Small
**Performance:** Tested against 34 million robots.txt files

**What it does:** Parses robots.txt files and checks if a URL is allowed for a given user agent.

**Edge use case:**
- Crawler/bot management at the edge
- Respect robots.txt in edge-based web tools
- Validate crawler access before proxying requests

**Why edge:**
- WASI proof of concept exists (50-75% native speed)
- Battle-tested against real-world edge cases
- No external dependencies

**Decision tree:**
- ✅ Pure computation
- ✅ Small binary
- ✅ Fast
- ✅ Unique edge use case
- ✅ No native alternative

**Verdict:** ⭐⭐⭐⭐ **BUILD** — Niche but valuable for crawler tools

**References:**
- [Texting Robots Blog Post](https://state.smerity.com/smerity/state/01FZ3813Q79VTTVDHWHFA2A15E)

---

### 9. **woothee** — User Agent Parser

**Source:** [github.com/woothee/woothee-rust](https://github.com/woothee/woothee-rust)
**Language:** Rust
**WASM Size:** ~100KB estimated
**Downloads:** 8.4M+ on crates.io

**What it does:** Parses user agent strings to extract browser, OS, and device information.

**Edge use case:**
- Device-specific content at the edge
- Bot detection
- Analytics without client-side JS
- A/B testing by device type

**Why edge:**
- Process before request reaches origin
- Reduce origin load by handling device-specific logic at edge

**Decision tree:**
- ✅ Pure computation
- ✅ Small binary
- ✅ Fast
- ⚠️ Cloudflare provides some UA info in cf object
- ✅ More detailed than native cf data

**Verdict:** ⭐⭐⭐ **BUILD** — Useful, but Cloudflare's cf object provides basics

**Alternative:** [easegress-rust-uaparser](https://github.com/easegress-io/easegress-rust-uaparser)

---

### 10. **infer** — MIME Type Detection

**Source:** [github.com/bojand/infer](https://github.com/bojand/infer)
**Language:** Rust
**WASM Size:** Very small (no_std, no_alloc support)
**Performance:** Very fast (magic byte detection)

**What it does:** Detects file type and MIME type by checking magic number signatures.

**Edge use case:**
- Validate uploaded file types at the edge
- Set correct Content-Type headers
- Block disallowed file types before they reach origin

**Why edge:**
- No external database required
- Works with first few bytes only
- Security validation at the edge

**Decision tree:**
- ✅ Pure computation
- ✅ Very small binary (no_std)
- ✅ Very fast
- ✅ Security use case
- ✅ No native alternative

**Verdict:** ⭐⭐⭐⭐ **BUILD** — Tiny, fast, useful for uploads

---

## Tier 2: Medium-Confidence Candidates

Promising but with caveats (size, CPU, or niche use case).

---

### 11. **ada-url** — Fast URL Parser

**Source:** [github.com/ada-url/ada](https://github.com/ada-url/ada)
**Language:** C++ (Rust bindings: [ada-url](https://crates.io/crates/ada-url))
**WASM Size:** Small
**Performance:** 3.49x faster than Rust url crate, used by Node.js

**What it does:** WHATWG-compliant URL parser. Default in Node.js since v18.

**Edge use case:**
- URL validation and normalization
- URL manipulation (query params, path segments)
- Redirect handling

**Why edge:**
- Used by Node.js, Cloudflare Workers, Kong, Telegram, DataDog
- Proven at massive scale

**Decision tree:**
- ✅ Pure computation
- ✅ Small binary
- ✅ Very fast
- ⚠️ JS URL API exists in Workers
- ⚠️ May not add much over native

**Verdict:** ⭐⭐⭐ **MAYBE** — Fast, but native URL API might suffice

---

### 12. **similar** — Text Diffing

**Source:** [github.com/mitsuhiko/similar](https://github.com/mitsuhiko/similar)
**Language:** Rust
**WASM Size:** Small (has wasm32_web_time feature)
**Performance:** Fast (Patience algorithm)

**What it does:** Computes diffs of text (lines, words, chars). Returns similarity ratio.

**Edge use case:**
- Content change detection
- Webhook payload diffing
- Cache invalidation decisions

**Decision tree:**
- ✅ Pure computation
- ✅ Small binary
- ✅ Has WASM-specific features
- ⚠️ Niche use case
- ⚠️ Often better at build time

**Verdict:** ⭐⭐⭐ **MAYBE** — Useful but narrow edge use case

**Alternative:** [dissimilar](https://github.com/dtolnay/dissimilar) (Google's diff-match-patch port)

---

### 13. **jsonschema** — JSON Schema Validation

**Source:** [github.com/Stranger6667/jsonschema](https://github.com/Stranger6667/jsonschema)
**Language:** Rust
**WASM Size:** Medium
**Performance:** High-performance validator

**What it does:** Validates JSON against JSON Schema specs.

**Edge use case:**
- Validate API request payloads at the edge
- Block invalid requests before reaching origin
- Schema-based routing

**Decision tree:**
- ✅ Pure computation
- ⚠️ Medium binary size
- ✅ Fast validation
- ✅ Security/validation use case
- ⚠️ JS alternatives exist (Ajv)

**Verdict:** ⭐⭐⭐ **MAYBE** — Useful but Ajv works in Workers

---

### 14. **fast-base64** — SIMD Base64

**Source:** [github.com/mitschabaude/fast-base64](https://github.com/mitschabaude/fast-base64)
**Language:** Hand-written WASM text format
**WASM Size:** Very small
**Performance:** 20x faster than JS on 100KB, uses SIMD

**What it does:** Base64 encoding/decoding with WASM SIMD.

**Edge use case:**
- Processing base64-encoded payloads
- Data URL handling
- Binary protocol encoding

**Decision tree:**
- ✅ Pure computation
- ✅ Very small binary
- ✅ Very fast (SIMD)
- ⚠️ Built-in btoa/atob exist
- ⚠️ Only matters for large payloads

**Verdict:** ⭐⭐⭐ **MAYBE** — Only if processing large base64 data

---

### 15. **libsodium.js** — Cryptography

**Source:** [github.com/jedisct1/libsodium.js](https://github.com/jedisct1/libsodium.js)
**Language:** C (compiled to WASM)
**WASM Size:** ~200KB (standard), larger for sumo
**Performance:** Near-native crypto performance

**What it does:** Modern, easy-to-use crypto library. Supports encryption, signatures, hashing.

**Edge use case:**
- Encrypt/decrypt data at the edge
- Signature verification
- Password hashing (with caveats)

**Decision tree:**
- ✅ Pure computation
- ⚠️ Medium binary size
- ✅ Fast
- ⚠️ WebCrypto API exists in Workers
- ⚠️ Memory-hard functions may hit limits

**Verdict:** ⭐⭐⭐ **MAYBE** — WebCrypto covers most needs

**References:**
- [libsodium WASM benchmarks](https://00f.net/2019/04/09/benchmarking-webassembly-using-libsodium/)

---

### 16. **chrono-tz** — Timezone Handling

**Source:** [github.com/chronotope/chrono-tz](https://github.com/chronotope/chrono-tz)
**Language:** Rust
**WASM Size:** Medium (embeds IANA database)
**Performance:** Fast lookups

**What it does:** Timezone-aware datetime handling using IANA database.

**Edge use case:**
- Display times in user's timezone
- Schedule calculations across timezones
- Timezone-aware logging

**Decision tree:**
- ✅ Pure computation
- ⚠️ Medium binary (includes TZ database)
- ✅ Fast
- ⚠️ Cloudflare provides timezone in cf object
- ⚠️ Date API has some TZ support

**Verdict:** ⭐⭐⭐ **MAYBE** — Useful for complex TZ logic

---

## Tier 3: Lower Priority / Specialized

Narrower use cases or significant constraints.

---

### 17. **tree-sitter** — Syntax Highlighting

**Source:** [github.com/tree-sitter/tree-sitter](https://github.com/tree-sitter/tree-sitter)
**Language:** C/Rust
**WASM Size:** Large (~1MB+ with grammars)
**Performance:** Incremental parsing, very fast

**What it does:** Incremental parser generator for syntax highlighting and code analysis.

**Edge use case:**
- Syntax highlighting API
- Code snippet rendering
- AST-based code analysis

**Decision tree:**
- ⚠️ Large binary (grammars add up)
- ✅ Fast parsing
- ⚠️ Better done client-side (Shiki, Prism)
- ⚠️ Build-time highlighting usually sufficient

**Verdict:** ⭐⭐ **UNLIKELY** — Better client-side or build-time

---

### 18. **printpdf** — PDF Generation

**Source:** [github.com/fschutt/printpdf](https://github.com/fschutt/printpdf)
**Language:** Rust
**WASM Size:** Large
**Performance:** Moderate

**What it does:** Creates PDF documents from scratch.

**Edge use case:**
- Generate receipts, invoices at edge
- Dynamic PDF creation

**Decision tree:**
- ⚠️ Larger binary
- ⚠️ May exceed CPU limits for complex PDFs
- ⚠️ Often better server-side with more resources
- ⚠️ Font handling is complex in WASM

**Verdict:** ⭐⭐ **UNLIKELY** — Better on traditional server

---

### 19. **regex** (Rust) — Regular Expressions

**Source:** [docs.rs/regex](https://docs.rs/regex/)
**Language:** Rust
**WASM Size:** ~720KB (problematic)

**What it does:** Fast, safe regular expression library.

**Edge use case:**
- Pattern matching in text processing

**Decision tree:**
- ✅ Pure computation
- ❌ Large binary size (~720KB)
- ✅ Fast
- ⚠️ JS RegExp exists and is fast

**Verdict:** ⭐⭐ **UNLIKELY** — Binary too large, use JS RegExp

**Alternative:** [regex-lite](https://docs.rs/regex-lite/) — Zero-dependency, smaller, slower

---

### 20. **nanoid** — Short ID Generation

**Source:** [github.com/ai/nanoid](https://github.com/ai/nanoid)
**Language:** Rust, JavaScript, many others
**WASM Size:** Tiny
**Performance:** 5x faster than ULID, 7x faster than UUID

**What it does:** Generates short, URL-safe unique IDs.

**Edge use case:**
- Generate request IDs
- Create short URLs
- Session identifiers

**Decision tree:**
- ✅ Pure computation
- ✅ Tiny binary
- ✅ Fast
- ⚠️ crypto.randomUUID exists in Workers
- ⚠️ JS nanoid is already tiny

**Verdict:** ⭐⭐ **UNLIKELY** — JS version is fine, crypto.randomUUID exists

---

## Summary Matrix

| Library | Size | CPU | Use Case | Native Alt? | Verdict |
|---------|------|-----|----------|-------------|---------|
| **thumbhash** | ~15KB | <5ms | Image placeholders | No | ⭐⭐⭐⭐⭐ BUILD |
| **ammonia** | ~200KB | <5ms | HTML sanitization | No | ⭐⭐⭐⭐⭐ BUILD |
| **saffron** | Small | <1ms | Cron parsing | No | ⭐⭐⭐⭐⭐ USE |
| **minify-html** | ~300KB | 5-15ms | Minification | Deprecated | ⭐⭐⭐⭐ BUILD |
| **pulldown-cmark** | ~100KB | <5ms | Markdown | No | ⭐⭐⭐⭐ BUILD |
| **resvg** | ~3MB | 10-50ms | SVG→PNG | No | ⭐⭐⭐⭐ BUILD (paid) |
| **wasm-qrcode** | ~50KB | <5ms | QR codes | No | ⭐⭐⭐⭐ BUILD |
| **texting_robots** | Small | <5ms | robots.txt | No | ⭐⭐⭐⭐ BUILD |
| **infer** | Tiny | <1ms | MIME detection | No | ⭐⭐⭐⭐ BUILD |
| **woothee** | ~100KB | <5ms | UA parsing | Partial (cf) | ⭐⭐⭐ BUILD |
| **ada-url** | Small | <1ms | URL parsing | JS URL API | ⭐⭐⭐ MAYBE |
| **similar** | Small | <5ms | Text diff | No | ⭐⭐⭐ MAYBE |
| **jsonschema** | Medium | <10ms | Validation | Ajv (JS) | ⭐⭐⭐ MAYBE |
| **fast-base64** | Tiny | <1ms | Base64 | btoa/atob | ⭐⭐⭐ MAYBE |
| **libsodium** | ~200KB | varies | Crypto | WebCrypto | ⭐⭐⭐ MAYBE |
| **chrono-tz** | Medium | <5ms | Timezones | Partial (cf) | ⭐⭐⭐ MAYBE |
| **tree-sitter** | ~1MB+ | varies | Syntax HL | Client-side | ⭐⭐ UNLIKELY |
| **printpdf** | Large | varies | PDF gen | Server | ⭐⭐ UNLIKELY |
| **regex** | ~720KB | <5ms | Pattern matching | JS RegExp | ⭐⭐ UNLIKELY |
| **nanoid** | Tiny | <1ms | ID gen | crypto.randomUUID | ⭐⭐ UNLIKELY |

---

## Recommended Build Order

### Phase 1: Core Utilities (High Value, Low Risk)
1. **thumbhash-edge** — Direct upgrade from blurhash-edge
2. **ammonia-edge** — Critical security tool
3. **qr-edge** — Simple, useful, fast win

### Phase 2: Content Processing
4. **minify-edge** — Fills Cloudflare deprecation gap
5. **markdown-edge** — Combine pulldown-cmark + ammonia

### Phase 3: Specialized Tools
6. **og-image-edge** — resvg + satori combination
7. **robots-edge** — texting_robots for crawler tools
8. **mime-edge** — infer for upload validation

---

## Combination Opportunities

### Content Pipeline
```
Markdown → pulldown-cmark → ammonia → minify-html → Response
```

### OG Image Generation
```
HTML/CSS → Satori → SVG → resvg → PNG
```
(This is what Vercel does)

### Secure Upload Handling
```
Upload → infer (validate type) → ammonia (if HTML) → Store
```

### Crawler/Bot Tools
```
Request → woothee (UA parse) → texting_robots (check allowed) → Proxy
```

---

## Open Source Strategy

Each edge tool should follow the blurhash-edge model:

1. **Descriptive name** — `{library}-edge` (e.g., `thumbhash-edge`, `ammonia-edge`)
2. **Self-hostable** — One-click deploy to user's Cloudflare account
3. **Clear limits docs** — What works on free tier vs paid
4. **Integration examples** — Next.js, Astro, vanilla JS
5. **Blog post** — Technical writeup for portfolio/discoverability

---

## Sources & References

### Runtime Documentation
- [Cloudflare Workers Rust Support](https://developers.cloudflare.com/workers/languages/rust/)
- [Cloudflare Workers WASM in JS](https://developers.cloudflare.com/workers/runtime-apis/webassembly/javascript/)
- [WasmEdge Runtime](https://wasmedge.org/)

### Libraries & Projects
- [awesome-cloudflare-workers](https://github.com/lukeed/awesome-cloudflare-workers)
- [cf-wasm Collection](https://github.com/fineshopdesign/cf-wasm)
- [workers-rs (Rust for Workers)](https://github.com/cloudflare/workers-rs)

### Performance Research
- [Rust WASM 8-10x Faster Benchmarks](https://byteiota.com/rust-webassembly-performance-8-10x-faster-2025-benchmarks/)
- [Large WASM Builds with Rust Regex](https://esimmler.com/large-wasm-builds-with-rust-regex)
- [Building Fast Interpreters in Rust (Cloudflare)](https://blog.cloudflare.com/building-fast-interpreters-in-rust/)

### Case Studies
- [Vercel OG Image Generation](https://vercel.com/blog/introducing-vercel-og-image-generation-fast-dynamic-social-card-images)
- [Cloudflare Saffron Blog](https://blog.cloudflare.com/using-one-cron-parser-everywhere-with-rust-and-saffron/)
- [Wasmer Edge Web Scraper](https://wasmer.io/posts/news-scraper-on-edge)

---

*Last updated: January 2026*
