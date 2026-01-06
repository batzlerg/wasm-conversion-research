# BUILD_ORDER.md

**Automated Product Build Sequencing for Agentic LLM Development**

Last Updated: January 2026

---

## Executive Summary

This document ranks all 18 product candidates by **automatability** (can Claude Code build without UI/design input?) and **formal verifiability** (can correctness be proven through tests without manual inspection?). Products are sequenced to maximize autonomous completion while building systematic knowledge of required tech stacks.

**Key Insight:** We should build API primitives and libraries first (fully automatable), then pipelines (some verification needed), then CLI tools (no UI), and defer UI-heavy applications until design systems or Graham's input is available.

**IMPORTANT:** "Completion" means **built + formally verified locally**, NOT deployed. Deployment requires credentials (Cloudflare account, npm account) which are not yet automated. All products can reach 100% completion status without deployment.

---

## Evaluation Criteria

### A) Automatability Score (0-10)

| Score | Definition | Examples |
|-------|------------|----------|
| 10 | Pure computation/API, zero UI decisions | npm library, API endpoint |
| 7-9 | Some config/template choices, no visual design | CLI tool, edge worker with presets |
| 4-6 | Output requires visual verification | Image generation, simple UX |
| 1-3 | Heavy UI/UX decisions required | Interactive app with drag-drop, visualizations |

### B) Formal Verifiability Score (0-10)

| Score | Definition | Test Strategy |
|-------|------------|---------------|
| 10 | 100% provable correctness | Hash verification, XSS test suites |
| 7-9 | Core logic provable, edges need sampling | Content extraction, compression ratios |
| 4-6 | Correctness requires human judgment | Visual outputs, UX flows |
| 1-3 | Primarily subjective quality | Audio aesthetics, educational effectiveness |

---

## Deployment Status (Current: Not Automated)

**All products can be built and verified locally without deployment credentials.**

| Product Type | Local Verification | Deployment Needs (Later) |
|--------------|-------------------|-------------------------|
| **npm libraries** | `bun test` passes, package builds | npm account + `npm publish` |
| **Cloudflare Workers** | `wrangler dev` + local tests pass | CF account + `wrangler deploy` |
| **Bun CLI tools** | `bun test` passes, CLI runs locally | npm account (optional) or direct distribution |
| **Static sites (Astro)** | `bun run build` + local preview works | CF Pages / Vercel / Netlify account |
| **Next.js apps** | `bun run dev` + tests pass | Vercel / CF Pages account |

**Completion criteria (no deployment required):**
- ✅ All source code written
- ✅ All tests passing locally
- ✅ Build succeeds (no errors)
- ✅ Local preview/execution works
- ✅ Documentation complete (README, API docs)
- ✅ Formal verification criteria met

**Future deployment setup (batched later):**
- Graham creates Cloudflare account → provides credentials
- Graham creates npm account → provides access token
- Automate deployment in CI/CD after credentials available

---

## Ranked Product List

### TIER 1: Fully Automatable + Verifiable (Build First)

| # | Product | Type | Auto | Verify | Stack | Build Est. |
|---|---------|------|------|--------|-------|------------|
| 1 | **asset-hash** | npm library | 10 | 10 | TypeScript lib | 30-50h |
| 2 | **sanitize-edge** | CF Worker | 10 | 10 | Worker + ammonia | 15-25h |
| 3 | **thumbhash-edge** | CF Worker | 10 | 10 | Worker + stb + thumbhash | 20-30h |
| 4 | **minify-edge** | CF Worker | 10 | 9 | Worker + minify-html | 10-20h |

**Why These First:**
- **No UI decisions** — Pure APIs, fully specifiable via tests
- **Deterministic outputs** — Given input X, output Y is verifiable locally
- **Tech stack learning** — Teaches npm packaging + Cloudflare Worker patterns
- **High utility** — All are 4-5 star viability products
- **100% locally verifiable** — No deployment needed to prove correctness

**Formal Verification Strategy:**
```bash
# asset-hash
- Input: Image file → Output: {hash, thumbhash, dimensions}
- Tests: Known image → expected hash (deterministic)

# sanitize-edge
- Input: Malicious HTML → Output: Safe HTML
- Tests: OWASP XSS test vectors → all blocked

# thumbhash-edge
- Input: Image URL → Output: ThumbHash string
- Tests: Reference images → known thumbhash values

# minify-edge
- Input: HTML with whitespace → Output: Minified HTML
- Tests: Size reduction %, semantic equivalence
```

---

### TIER 2: Automatable Pipelines (Some Manual Verification)

| # | Product | Type | Auto | Verify | Stack | Build Est. |
|---|---------|------|------|--------|-------|------------|
| 5 | **readable-edge** | CF Worker | 8 | 7 | Worker + pipeline | 40-60h |
| 6 | **webhook-edge** | CF Worker | 8 | 9 | Worker + validation | 50-70h |

**Why Second:**
- **Mostly automatable** — Core logic is deterministic
- **Output quality varies** — Markdown extraction depends on source site
- **Per-provider configs** — webhook-edge needs provider-specific templates
- **Complex but testable** — Can test with known inputs

**Verification Strategy:**
```bash
# readable-edge
- Input: TechCrunch article URL → Output: Clean Markdown
- Tests: 20 reference articles → compare output to manual extraction
- Success: 90%+ semantic similarity

# webhook-edge
- Input: Stripe webhook + signature → Output: Valid/Invalid
- Tests: Known signatures → validation correctness
- Per-provider: Stripe, GitHub, Shopify templates
```

---

### TIER 3: Visual/Output Verification Required

| # | Product | Type | Auto | Verify | Stack | Build Est. |
|---|---------|------|------|--------|-------|------------|
| 7 | **og-image-edge** | CF Worker | 7 | 5 | Worker + Satori + resvg | 30-50h |

**Why Third:**
- **Core logic automatable** — Template → PNG generation works
- **Visual verification needed** — "Does this social card look good?"
- **Template decisions** — Need 3-5 preset designs
- **Testable structure** — Can verify dimensions, file size, format

**Verification Strategy:**
```bash
# og-image-edge
- Tests: Template + data → PNG generated successfully
- Dimensions: 1200x630 (verifiable)
- Visual: Graham reviews 5 template designs once
```

---

### TIER 4: CLI Tools (No UI, High Automatability)

| # | Product | Type | Auto | Verify | Stack | Build Est. |
|---|---------|------|------|--------|-------|------------|
| 8 | **hash-vault** (CLI) | CLI tool | 9 | 10 | Bun CLI | 40-60h |
| 9 | **mosaicly** (CLI) | CLI tool | 9 | 10 | Bun CLI | 15-25h |

**Why Fourth:**
- **Start as CLI** — No UI decisions, fully automatable
- **Pure computation** — File hashing, compression
- **Add UI later** — After core logic proven

**Verification Strategy:**
```bash
# hash-vault (CLI)
$ bun run hash-vault scan ~/Documents
→ Found 1,234 files, 234 duplicates (5.2GB saved)

Tests:
- Known duplicate set → correct detection
- Hash persistence → incremental scans work

# mosaicly (CLI)
$ bun run mosaicly compress file.txt
→ Compressed 1.2MB → 384KB (68% reduction)

Tests:
- Compression → decompression roundtrip
- Multiple formats (LZ4, Snappy)
```

---

### TIER 5: Core Engines (No UI, Parser/Logic Only)

| # | Product | Type | Auto | Verify | Stack | Build Est. |
|---|---------|------|------|--------|-------|------------|
| 10 | **parser-lab** (core) | Static site | 8 | 9 | Astro + PEGTL | 40-60h |

**Why Fifth:**
- **Parser engine first** — Visual grammar builder comes later
- **Grammar correctness** — Fully testable with known grammars
- **Astro learning** — Teaches static site generation

**Verification Strategy:**
```bash
# parser-lab (core parser only)
- Input: PEG grammar + test string → Output: Parse tree or error
- Tests: JSON grammar → parse valid/invalid JSON
- Success: All test cases pass
```

---

### TIER 6: Heavy UI Requirements (Defer Until Design Input Available)

| # | Product | Type | Auto | Verify | Stack | Build Est. | Block Reason |
|---|---------|------|------|--------|-------|------------|--------------|
| 11 | **imageo** | Browser app | 3 | 7 | Next.js + WASM | 40-80h | Drag-drop UI, preview system design |
| 12 | **freq-sense** | Browser app | 2 | 6 | Next.js + WASM | 60-100h | Game mechanics, visualization UX |
| 13 | **wave-shape** | Browser app | 2 | 7 | Next.js + WASM | 50-80h | Modular synth UI, visual connections |
| 14 | **math-viz** | Browser app | 3 | 6 | Next.js + WASM | 50-70h | 3D visualization design choices |
| 15 | **audiomill** | Browser app | 2 | 6 | Next.js + WASM | 60-80h | Audio processor UI, A/B interface |
| 16 | **spritify** | Browser app | 2 | 8 | Astro + WASM | 40-60h | Pixel editor UI, tool palette |
| 17 | **physics-box** | Browser app | 3 | 7 | Next.js + WASM | 60-80h | Physics visualization, parameter UI |
| 18 | **audio-dna** | npm library | 5 | 4 | TypeScript lib | 120-200h | Algorithm complexity, accuracy unclear |

**Why Deferred:**
- **UI/UX decisions block automation** — Drag-drop, visualizations, game mechanics
- **Subjective quality** — "Does this look good?" requires human judgment
- **High risk** — audio-dna competes with Chromaprint, unclear advantage
- **Better with design system** — After building 10 products, we'll have patterns

---

## Build Phases

### Phase 1: API Primitives (4 products, ~75-125 hours)

**Goal:** Establish npm + Cloudflare Worker workflows (local verification only)

1. **asset-hash** (30-50h)
   - Teaches: npm package structure, TypeScript library, WASM integration
   - Local output: `dist/` bundle, `bun test` passing
   - Tests: Hash verification, thumbhash generation
   - **No deployment needed** — Package builds, tests pass

2. **sanitize-edge** (15-25h)
   - Teaches: Cloudflare Worker structure, ammonia WASM
   - Local output: `wrangler dev` running, tests passing
   - Tests: XSS test suite (OWASP vectors)
   - **No deployment needed** — Worker runs locally, tests pass

3. **thumbhash-edge** (20-30h)
   - Teaches: Worker + multiple WASM modules, KV caching patterns
   - Local output: `wrangler dev` + tests passing
   - Tests: Reference images → known hashes
   - **No deployment needed** — Worker testable via local server

4. **minify-edge** (10-20h)
   - Teaches: HTML processing at edge
   - Local output: `wrangler dev` + tests passing
   - Tests: Size reduction, semantic preservation
   - **No deployment needed** — Minification verifiable locally

**Milestone:** 4 completed products (built + tested locally), npm + CF Worker expertise

---

### Phase 2: Complex Pipelines (2 products, ~90-130 hours)

**Goal:** Multi-step edge processing (local verification)

5. **readable-edge** (40-60h)
   - Teaches: Pipeline orchestration, multiple WASM modules
   - Local output: `wrangler dev` + 20 test articles passing
   - Tests: Reference articles → markdown extraction quality
   - **No deployment needed** — Pipeline testable with local fixtures

6. **webhook-edge** (50-70h)
   - Teaches: Signature validation, per-provider configs
   - Local output: `wrangler dev` + provider template tests passing
   - Tests: Known signatures (Stripe, GitHub, Shopify), malformed payloads
   - **No deployment needed** — Signature verification provable locally

**Milestone:** 6 completed products, pipeline expertise

---

### Phase 3: Visual Outputs (1 product, ~30-50 hours)

**Goal:** Image generation verification (local)

7. **og-image-edge** (30-50h)
   - Teaches: Satori + resvg, image generation
   - Local output: `wrangler dev` + PNG generation working
   - Verification: Graham reviews 5 template designs (one-time manual check)
   - Tests: Successful PNG generation, correct dimensions (1200x630)
   - **No deployment needed** — Image generation verifiable by file output

**Milestone:** 7 completed products

---

### Phase 4: CLI Tools (2 products, ~55-85 hours)

**Goal:** Command-line workflow (local verification)

8. **hash-vault** CLI (40-60h)
   - Teaches: Bun CLI tool, file system operations
   - Local output: `./hash-vault` executable, tests passing
   - Tests: Duplicate detection accuracy on test fixtures
   - **No deployment needed** — CLI runs locally, tests verify correctness

9. **mosaicly** CLI (15-25h)
   - Teaches: Compression CLI
   - Local output: `./mosaicly` executable, tests passing
   - Tests: Compression/decompression roundtrip
   - **No deployment needed** — Compression verifiable locally

**Milestone:** 9 completed products (6 workers + 1 lib + 2 CLIs)

---

### Phase 5: Static Parsers (1 product, ~40-60 hours)

**Goal:** Astro static site generation (local preview)

10. **parser-lab** core (40-60h)
    - Teaches: Astro framework, PEGTL WASM
    - Local output: `bun run build` succeeds, preview server works
    - Tests: Grammar parsing correctness (JSON, CSV test grammars)
    - **No deployment needed** — Static site builds and previews locally

**Milestone:** 10 completed products (6 workers + 1 lib + 2 CLIs + 1 static site)

---

### Phase 6: Evaluate & Decide

**After 10 products (~290-450 hours):**

✅ **Achieved:**
- npm library workflow (asset-hash)
- Cloudflare Worker deployment (6 workers)
- Bun CLI tools (2 tools)
- Astro static sites (1 site)

🔄 **Update ProjectScaffold:**
- Add Cloudflare Worker template
- Add Bun CLI template
- Refine Astro template based on parser-lab

❓ **Re-evaluate UI products:**
- Do we have design patterns from 10 products?
- Has Graham provided design direction?
- Can we automate UI scaffolding?

---

## Tech Stack Decisions

### Cloudflare Workers (6 products)
- sanitize-edge
- thumbhash-edge
- minify-edge
- readable-edge
- webhook-edge
- og-image-edge

**Rationale:** Edge deployment, WASM-friendly, pay-per-use model

### npm Libraries (2 products)
- asset-hash
- audio-dna (deferred)

**Rationale:** Developer tools, embeddable

### Bun CLI Tools (2 products)
- hash-vault (CLI)
- mosaicly (CLI)

**Rationale:** Fast, modern, TypeScript-native

### Astro Static Sites (2 products)
- parser-lab (core)
- spritify (deferred - also good for Astro)

**Rationale:** Simple, fast, WASM-friendly

### Next.js Apps (5 products, all deferred)
- imageo
- freq-sense
- wave-shape
- math-viz
- audiomill
- physics-box

**Rationale:** File handling, authentication, interactivity, audio worklets

---

## ProjectScaffold Updates Needed

### After Phase 1 (4 products):
- **Create CF Worker template** - `wrangler.toml`, WASM integration, KV setup
- Keep existing Next.js/Astro templates

### After Phase 4 (9 products):
- **Create Bun CLI template** - CLI args, file system, testing
- **Refine WASM integration patterns** - Based on 9 WASM conversions

### After Phase 5 (10 products):
- **Refine Astro template** - Based on parser-lab experience
- **Evaluate UI scaffolding** - Can we automate basic layouts?

---

## Formal Verification Examples

### asset-hash (100% verifiable)
```typescript
describe('asset-hash', () => {
  test('generates deterministic hash', async () => {
    const img = await readFile('test/fixtures/photo.jpg');
    const result = await assetHash(img);

    expect(result.hash).toBe('a3f2b1c4d5e6');
    expect(result.thumbhash).toBe('1QcSHQRnh493V4dIh4eXh1h4kJUI');
    expect(result.dimensions).toEqual({ width: 800, height: 600 });
  });

  test('detects duplicates', async () => {
    const img1 = await readFile('test/photo-original.jpg');
    const img2 = await readFile('test/photo-copy.jpg');

    const hash1 = await assetHash(img1);
    const hash2 = await assetHash(img2);

    expect(hash1.hash).toBe(hash2.hash); // Content-identical
  });
});
```

### sanitize-edge (100% verifiable)
```typescript
describe('sanitize-edge', () => {
  const XSS_VECTORS = [
    '<script>alert("xss")</script>',
    '<img src=x onerror=alert(1)>',
    '<svg onload=alert(1)>',
    // ... 100+ OWASP test vectors
  ];

  test('blocks all XSS vectors', async () => {
    for (const vector of XSS_VECTORS) {
      const result = await sanitize(vector);
      expect(result).not.toContain('<script');
      expect(result).not.toContain('onerror=');
      expect(result).not.toContain('onload=');
    }
  });
});
```

### thumbhash-edge (100% verifiable)
```typescript
describe('thumbhash-edge', () => {
  const REFERENCE_IMAGES = [
    { url: 'https://picsum.photos/800/600', expectedHash: '...' },
    { url: 'https://picsum.photos/400/400', expectedHash: '...' },
  ];

  test('generates correct thumbhash', async () => {
    for (const ref of REFERENCE_IMAGES) {
      const result = await fetch(`/hash?url=${ref.url}`);
      const data = await result.json();

      expect(data.thumbhash).toBe(ref.expectedHash);
    }
  });
});
```

---

## Risk Assessment

### Low Risk (Tier 1-4)
- **asset-hash**, **sanitize-edge**, **thumbhash-edge**, **minify-edge**
- **readable-edge**, **webhook-edge**
- **og-image-edge**
- **hash-vault CLI**, **mosaicly CLI**
- **parser-lab core**

**Why:** Pure computation, deterministic, testable

### Medium Risk (Tier 6, deferred)
- **imageo**, **wave-shape**, **math-viz**, **spritify**

**Why:** UI/UX decisions, but core logic is solid

### High Risk (deferred)
- **freq-sense** (game mechanics + audio DSP)
- **audiomill** (crowded market, Adobe Podcast exists)
- **physics-box** (PhET dominance)
- **audio-dna** (Chromaprint competition, unclear accuracy)

**Why:** Market competition, algorithm complexity, or questionable viability

---

## Success Metrics by Phase

**NOTE:** All metrics are for LOCAL COMPLETION, not deployment.

### Phase 1 (APIs):
- ✅ 4 products built and tested locally
- ✅ npm package builds successfully
- ✅ CF Workers run via `wrangler dev`
- ✅ Test suites 100% passing
- ⏸️ Deployment: Deferred until credentials available

### Phase 2 (Pipelines):
- ✅ 6 total products completed locally
- ✅ Complex pipelines working in `wrangler dev`
- ✅ Per-provider configs validated via tests
- ⏸️ Deployment: Deferred

### Phase 3 (Visual):
- ✅ 7 total products completed locally
- ✅ Image generation working (PNG files generated)
- ⚠️ Graham reviewed templates (one-time manual inspection)
- ⏸️ Deployment: Deferred

### Phase 4 (CLI):
- ✅ 9 total products completed locally
- ✅ CLI tools executable locally
- ✅ File operations tested on fixtures
- ⏸️ Publishing to npm: Deferred

### Phase 5 (Parser):
- ✅ 10 total products completed locally
- ✅ Static site builds and previews
- ✅ Grammar parsing tested
- ⏸️ Deployment: Deferred

---

## Next Actions

### Immediate:
1. **Build asset-hash** — First npm library (local verification only)
2. Document npm package workflow for future products
3. Create template for future npm libraries
4. **Verify locally:** `bun test` passes, package builds

### After asset-hash:
1. **Build sanitize-edge** — First CF Worker (local testing only)
2. Document CF Worker workflow (`wrangler dev`, local tests)
3. Create CF Worker template for ProjectScaffold
4. **Verify locally:** `wrangler dev` runs, XSS tests pass

### After 4 Products (Phase 1 Complete):
1. **Update ProjectScaffold** — Add CF Worker template
2. **Evaluate progress** — Are local builds/tests working smoothly?
3. **Proceed to Phase 2** — readable-edge

### Future (After Phase 5):
1. **Batch deployment setup** — Graham provides credentials
2. **Automate deployments** — Add CI/CD workflows
3. **Publish products** — npm, Cloudflare, etc.

---

## Questions for Graham (Before Starting UI Products)

1. **Design direction for UI products** — Do you have wireframes, or should we use existing design systems (Shadcn, Tailwind UI)?
2. **UI priorities** — Which UI product is most important: imageo, freq-sense, or wave-shape?
3. **Monetization testing** — Should we build free tier + auth immediately, or start with fully open source?

---

## Final Recommendation

**Start with Phase 1 (4 API products) — Local verification only.**

These products are:
- ✅ Fully automatable (no UI decisions)
- ✅ Formally verifiable (deterministic tests)
- ✅ Teach critical workflows (npm packages, CF Workers)
- ✅ **Can be completed 100% locally** without deployment credentials

**Completion criteria:**
1. Source code complete
2. Tests passing (`bun test` 100%)
3. Local execution works (`wrangler dev` or package builds)
4. Documentation complete (README, API docs)
5. Formal verification criteria met

**Deployment deferred until:**
- Graham creates Cloudflare account
- Graham creates npm account
- Credentials are automated in CI/CD

**After Phase 1:** Evaluate ProjectScaffold updates, then proceed to Phase 2.
