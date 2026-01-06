# Active WASM Conversion Prospects

Libraries and modules we **are pursuing or considering** for WASM conversion, organized by status and target platform (browser vs edge).

**Last Updated:** January 2026

---

## Organization

- **Completed & Proven** — Already converted with documented success
- **Browser-Targeted** — Best as client-side tools (PixelForge, FreqSense, etc.)
- **Edge-Targeted** — Best as Cloudflare Workers APIs (thumbhash-edge, etc.)
- **Research Needed** — Promising but need validation

---

## Completed & Proven (13 Conversions)

These passed the decision tree and experimental validation. All are documented in LEARNINGS.md.

### Image Processing

| Library | Size | Performance | Use Case | Target Platform |
|---------|------|-------------|----------|-----------------|
| **blurhash** | 21KB | 5,135 decodes/sec | Image placeholders | Browser + Edge |
| **stb_image** | 103KB | 22k decodes/sec | Decode JPEG/PNG/BMP/GIF/HDR | Browser + Edge |
| **image-rs** | 785KB | 1,263 resize/sec | Full image processing suite | Browser |
| **QOI** | 8.9KB | 377 MP/s | Fast lossless format | Browser |

**Why active:** All 4/4 succeeded. Binary data processing pattern proven.

**Next steps:**
- thumbhash (upgrade from blurhash) for edge
- Combine in PixelForge browser app

---

### Compression

| Library | Size | Performance | Use Case | Target Platform |
|---------|------|-------------|----------|-----------------|
| **LZ4** | 15.6KB | 6.5 GB/s compress | Fast compression | Browser only |
| **Snappy** | 21KB | 300+ MB/s | Google compression | Browser only |
| **xxHash** | 29KB | 17.6 GB/s, 5.87x faster | Non-crypto hashing | Browser + Edge (maybe) |

**Why active:** Proven browser performance. Node.js has natives, but browsers don't.

**Next steps:**
- Browser-based compression tools (CompressKit)
- Content-addressable systems (HashVault)
- xxHash possibly useful at edge for ETags

**Edge note:** HTTP compression exists, so skip LZ4/Snappy for edge. xxHash might work for content hashing.

---

### Linear Algebra / Math

| Library | Size | Performance | Use Case | Target Platform |
|---------|------|-------------|----------|-----------------|
| **Eigen** | 113KB | 7.4x faster, 10+ GFLOPS | Full linear algebra | Browser |
| **nalgebra** | 72KB | 7.4x faster | Rust linear algebra | Browser |
| **mathc** | 19KB | 33M mat4 ops/sec | 2D/3D graphics math | Browser |

**Why active:** Pure computation pattern = 100% success rate. 7.4x speedup proven.

**Next steps:**
- MathViz (interactive linear algebra education)
- PhysicsBox (physics simulations)
- 3D/game engine math libraries

**Edge note:** No edge use case. These are for browser-side computation.

---

### Audio / DSP

| Library | Size | Performance | Use Case | Target Platform |
|---------|------|-------------|----------|-----------------|
| **DSPFilters** | 59KB | 119M samples/sec, 13.5x faster | Digital filters | Browser |
| **Maximilian** | 39KB | 8-12M samples/sec | Audio synthesis | Browser |

**Why active:** Massive speedup (13.5x) enables real-time audio. Web Audio API is limited.

**Next steps:**
- FreqSense (ear training with DSP visualization)
- WaveShape (educational synth)
- SoundSculpt (audio effects processor)

**Edge note:** Audio processing doesn't fit request/response model. Browser only.

---

### Parsing

| Library | Size | Performance | Use Case | Target Platform |
|---------|------|-------------|----------|-----------------|
| **PEGTL** | 176KB | Fast | PEG parser generator | Browser |

**Why active:** Successfully converted. Educational value (ParserLab).

**Next steps:**
- ParserLab (visual grammar builder)
- DSL prototyping tools

**Edge note:** Could work at edge for validation APIs, but niche.

---

## Browser-Targeted Prospects (Not Yet Converted)

Libraries that fit browser use but not edge deployment.

### Audio Analysis

| Library | Lang | Stars | Why Active | Product Fit |
|---------|------|-------|------------|-------------|
| **essentia** | C++ | 3k | Audio analysis, no JS equiv | FreqSense, music tools |
| **q (cycfi)** | C++ | 1k | Audio DSP like Maximilian | Audio product suite |
| **eDSP** | C++ | 500 | Signal processing | Same as above |

**Decision tree:**
- ✅ Pure computation
- ✅ Binary data (audio)
- ✅ No adequate JS alternative
- ✅ Similar to successful DSPFilters/Maximilian

**Why not edge:** Audio processing is long-running, not request/response.

**Confidence:** High — matches successful pattern

---

### Advanced Math

| Library | Lang | Stars | Why Active | Product Fit |
|---------|------|-------|------------|-------------|
| **BLIS** | C | 2.5k | BLAS operations | Scientific computing tools |

**Decision tree:**
- ✅ Pure computation
- ✅ Performance-critical
- ✅ Similar to successful Eigen/nalgebra

**Why not edge:** No edge use case for matrix operations.

**Confidence:** High — matches successful pattern

---

### Image Processing

| Library | Lang | Stars | Why Active | Product Fit |
|---------|------|-------|------------|-------------|
| **CImg** | C++ | 1.5k | Header-only image processing | Browser image tools |

**Decision tree:**
- ✅ Header-only (easy compilation)
- ✅ Binary data processing
- ✅ Similar to successful stb_image

**Why not edge:** Cloudflare Images exists. Better for browser.

**Confidence:** Medium — large header (70k lines) may cause issues

---

## Edge-Targeted Prospects

Libraries specifically suitable for Cloudflare Workers deployment.

### Tier 1: Build These (High Confidence)

| Library | Size | CPU | Why Active | Value Proposition |
|---------|------|-----|------------|-------------------|
| **thumbhash** | ~15KB | <5ms | Better than blurhash, alpha support | Next.js needs this, Vercel doesn't offer it |
| **ammonia** | ~200KB | <5ms | HTML sanitization without DOM | Critical security tool, DOMPurify needs browser |
| **minify-html** | ~300KB | 5-15ms | HTML/CSS/JS minification | Cloudflare Auto Minify deprecated Aug 2024 |
| **pulldown-cmark** | ~100KB | <5ms | Markdown→HTML parsing | Dynamic rendering, pair with ammonia |
| **resvg** | ~3MB | 10-50ms | SVG→PNG rendering | OG image generation (Vercel charges $20/mo) |
| **wasm-qrcode** | ~50KB | <5ms | QR code generation | Privacy, no external service |
| **texting_robots** | Small | <5ms | robots.txt parser | Crawler tools, 34M file tested |
| **infer** | Tiny | <1ms | MIME detection (magic bytes) | Upload validation, no_std |

**Decision tree passed:**
- ✅ All are pure computation
- ✅ All small binaries (except resvg, needs paid tier)
- ✅ All fast enough for 10ms limit
- ✅ All solve problems that can't be client-side
- ✅ No Cloudflare native equivalents

**Why valuable:**
- thumbhash: Real demand, Vercel gap
- resvg: Proven revenue model ($20/mo)
- ammonia: Security critical
- minify-html: Fills deprecation gap
- Others: Portfolio value, solve real problems

---

### Tier 2: Maybe (Need Validation)

| Library | Size | Issue | When Useful |
|---------|------|-------|-------------|
| **woothee** | ~100KB | CF provides basic UA data | If need MORE detail than cf object |
| **ada-url** | Small | JS URL API exists | Marginal performance gain |
| **similar** | Small | Niche | Text diff at edge (cache decisions) |
| **jsonschema** | Medium | Ajv works in Workers | If avoiding JS deps |
| **fast-base64** | Tiny | btoa/atob exist | Only for huge payloads |
| **libsodium** | ~200KB | WebCrypto exists | Specific crypto needs |
| **chrono-tz** | Medium | CF provides timezone in cf object | Complex TZ logic |
| **saffron** | Small | Already WASM by Cloudflare | Reference only, don't rebuild |

**Verdict:** Most are **reference examples**, not products. Only build if specific need arises.

---

### Tier 3: Unlikely for Edge

| Library | Why Unlikely |
|---------|-------------|
| tree-sitter | Better client-side, large with grammars |
| printpdf | Better on traditional server |
| regex (Rust) | 720KB too large |
| nanoid | crypto.randomUUID sufficient |

---

---

## Missing Building Blocks (Research Needed)

Libraries identified as valuable for pipeline products but not yet evaluated for WASM conversion.

### Content Processing (For readable-edge, LLM prep)

| Library | Purpose | Why Needed | Priority |
|---------|---------|------------|----------|
| **html2md** (Rust crate) | HTML→Markdown | LLM content prep, token reduction | High |
| **readability-rs** | Article extraction | Clean content from noisy pages | High |
| **scraper** (Rust) | HTML parsing/DOM querying | Extract specific elements | Medium |
| **Open Graph parser** | Extract OG meta tags | Metadata extraction APIs | Medium |

**Action:** Research if these exist in Rust/can compile to WASM, or use JS alternatives.

### Validation & Security (For webhook-edge, API gateways)

| Library | Purpose | Why Needed | Priority |
|---------|---------|------------|----------|
| **jose** (JWT) | Webhook signature verification | Security validation | Medium |
| **jsonschema** | JSON Schema validation | API request validation | Medium |
| **semver** | Version parsing/comparison | API version routing | Low |

**Action:** Check if Rust versions work at edge, or if JS libraries (jose, Ajv) are sufficient.

---

## Research Needed (Validate Before Committing)

### ML/AI (Check Model Size Constraints)

| Library | Lang | Stars | What to Validate |
|---------|------|-------|-----------------|
| **candle** | Rust | 18k | Check if small models exist (<50MB) |
| **tract** | Rust | 2k | ONNX inference, check WASM support quality |
| **onnxruntime** | C++ | 18k | Has WASM backend, check if better than tract |

**Research questions:**
- Can we find models under 50MB?
- Is inference fast enough for edge (<50ms)?
- Or is this better client-side?

**Likely outcome:** Client-side is better. Edge has Workers AI anyway.

---

### Databases (Check Browser IndexedDB Integration)

| Library | Lang | Stars | What to Validate |
|---------|------|-------|-----------------|
| **leveldb** | C++ | 38k | Browser storage use case vs IndexedDB |
| **rocksdb** | C++ | 31k | Same as above |

**Research questions:**
- Does IndexedDB fill this need?
- Is there value in WASM key-value store?

**Likely outcome:** IndexedDB is sufficient. Skip.

---

## Conversion Priority Queue

Based on decision tree + market demand + buildability:

### Next 5 Conversions (Browser Products)

| Priority | Library | Why Build | Product |
|----------|---------|-----------|---------|
| 1 | **CImg** | Header-only image, validates pattern | PixelForge component |
| 2 | **essentia** | Audio analysis, unique capability | FreqSense advanced mode |
| 3 | **BLIS** | BLAS operations, validates Eigen pattern | MathViz advanced features |
| 4 | **q (cycfi)** | Audio DSP, validates pattern | WaveShape expansion |
| 5 | **eDSP** | More DSP options | Audio product suite |

**Estimated effort:** 3-5 hours each (based on previous conversions)

### Next 3 Edge Deployments

| Priority | Library | Why Build | Value |
|----------|---------|-----------|-------|
| 1 | **thumbhash** | Direct upgrade, proven pattern | Real demand |
| 2 | **ammonia** | Critical security tool | Unique capability |
| 3 | **resvg + satori** | OG images (proven revenue) | Vercel charges $20/mo |

**Estimated effort:**
- thumbhash: 2-4 hours (similar to blurhash)
- ammonia: 3-5 hours (bindings exist)
- resvg: 5-10 hours (integration with Satori)

---

## Success Criteria Checklist

Before converting any new library, verify:

### For Browser-Targeted

- [ ] Matches success pattern? (pure computation OR binary data)
- [ ] No adequate JS alternative exists?
- [ ] Speedup likely >3x based on pattern?
- [ ] Fits into product vision? (PixelForge, FreqSense, MathViz)
- [ ] Binary size reasonable? (<1MB)

### For Edge-Targeted

- [ ] Matches success pattern?
- [ ] Binary size <500KB (ideally <200KB)?
- [ ] CPU time <10ms for free tier (or worth paid tier)?
- [ ] Solves problem that CAN'T be client-side?
- [ ] No Cloudflare native alternative?
- [ ] Request/response model fits naturally?
- [ ] Real demand or portfolio value?

---

## Summary Statistics

| Category | Browser | Edge | Research | Total |
|----------|---------|------|----------|-------|
| **Completed** | 13 | 0 | 0 | 13 |
| **High Priority** | 5 | 3 | 0 | 8 |
| **Medium Priority** | 0 | 8 | 0 | 8 |
| **Research Needed** | 0 | 0 | 5 | 5 |
| **Total Active** | 18 | 11 | 5 | **34** |

---

## Platform Decision Matrix

| If the library... | Target |
|-------------------|--------|
| Processes audio/video continuously | Browser (not edge) |
| Does heavy computation (>50ms) | Browser (not edge) |
| Needs user interaction / real-time | Browser (not edge) |
| Processes request data quickly (<10ms) | Edge (maybe) |
| Can't be done client-side (security, timing) | Edge |
| Benefits from global distribution | Edge |
| Large binary (>500KB) | Browser |

---

## Quick Reference: "Should This Be Active?"

```
Does it match a proven success pattern?
  Pure computation? → Browser (11/11 success)
  Binary data? → Browser or Edge (6/6 success)
  Header-only? → Either (5/5 success)

Is there a clear product use case?
  Browser: PixelForge, FreqSense, MathViz, WaveShape
  Edge: thumbhash-edge, ammonia-edge, og-image-edge

Does it fill a gap?
  No JS alternative? → Keep
  Pre-built exists? → Use that
  Platform provides it? → Skip

Can we build it?
  Header-only? → Easy
  Few deps? → Moderate
  Complex build? → Hard (but doable)
  System calls/I/O? → Skip
```

---

*Last updated: January 2026*
