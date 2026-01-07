# WASM Conversion Research: Chronology

**Project Lifespan:** December 2025 - January 2026
**Purpose:** Understand WASM compilation feasibility, build products that leverage WASM in browser

---

## Phase 1: Technical Exploration (Dec 2025)

### Goal
Answer: "What C/C++/Rust libraries can we compile to WASM?"

### Activities
- **13 conversion experiments** across diverse library types
- Documented compilation process, bundle sizes, performance
- Built repeatable Emscripten compilation patterns

### Key Experiments

| Library | Type | Result | Performance | Size |
|---------|------|--------|-------------|------|
| **xxHash** | Hashing | ✅ Success | 5.87x faster than JS | 29 KB |
| **DSPFilters** | Audio DSP | ✅ Success | 13.5x faster than JS | - |
| **Eigen** | Linear algebra | ✅ Success | 7.4x faster than JS | - |
| **blurhash** | Image placeholder | ✅ Success | 4x faster than JS | - |
| **LZ4** | Compression | ✅ Success | - | - |
| **Snappy** | Compression | ✅ Success | - | - |
| **stb_image** | Image decoding | ✅ Success | - | - |
| **ammonia** | HTML sanitization | ⚠️ Compiled, runtime blocker | - | 278 KB |
| **jq** | JSON query DSL | ❌ Failed | 115x SLOWER | - |
| **simdjson** | JSON parsing | ❌ Failed | 30% slower than native | - |
| **PEGTL** | PEG parser | ⚠️ Hostile C++ syntax | - | - |

### Learnings

**✅ WASM wins for:**
- Pure computation (math, crypto, DSP)
- Binary data processing (images, audio, compression)
- Header-only or single-file libraries

**❌ WASM loses for:**
- Text parsing (JSON, CSV, XML) - V8 native parsers faster
- DSL interpreters (jq) - boundary crossing overhead
- SIMD-dependent code without scalar fallback
- String manipulation - UTF-8↔UTF-16 conversion cost

### Outputs
- Emscripten compilation guide (minimum viable flags)
- Decision tree for WASM conversion feasibility
- Exception handling patterns (`-fexceptions` critical)
- ES6 module integration patterns

---

## Phase 2: Product Development (Dec 2025 - Jan 2026)

### Goal
Build products that use WASM-compiled libraries or leverage edge deployment

### Build Order Strategy
1. **Phase 1**: Edge workers (Cloudflare Workers)
2. **Phase 2**: npm libraries
3. **Phase 3**: Image generation (og-image-edge)
4. **Phase 4**: CLI tools
5. **Phase 5**: Static sites
6. **Phase 6**: Interactive web apps with WASM

### Products Shipped (5 Edge Workers)

| Product | Type | WASM Used? | Value Proposition |
|---------|------|------------|------------------|
| **sanitize-edge** | CF Worker | ✅ ammonia WASM | HTML sanitization at edge |
| **thumbhash-edge** | CF Worker | ❌ JS library | Image placeholders at edge |
| **minify-edge** | CF Worker | ❌ JS (Terser, clean-css) | Asset minification at edge |
| **readable-edge** | CF Worker | ❌ JS (Readability, Turndown) | Article extraction at edge |
| **webhook-edge** | CF Worker | ❌ JS (Web Crypto API) | Webhook validation at edge |

**Key Insight**: 4 of 5 shipped products derive value from **edge deployment**, not WASM compilation.

**Only sanitize-edge** is truly "WASM-first" (ammonia WASM for HTML sanitization).

### Products Rejected

| Product | Reason | Validation Failure |
|---------|--------|-------------------|
| **hash-vault** | fclones (Rust) is best-in-class | Commoditized market |
| **parser-lab** | JSONLint/SQLFiddle/regex101 dominate | No use case, technology showcase |
| **audiomill** | Adobe Podcast (free, AI-powered) | Best-in-class exists |
| **spritify** | Aseprite dominates, Piskel (free) | Best-in-class exists |

### Products Approved (Not Yet Built)

| Product | Type | WASM Role | Value Proposition |
|---------|------|-----------|------------------|
| **wave-shape** | Static site | Core (WASM DSP modules) | Browser modular synth (no VCV Rack alternative) |
| **freq-sense** | Static site | Core (test tone generation) | Gamified ear training (free alternatives poor) |

---

## Phase 3: Market Validation Failures (Jan 2026)

### Critical Failure #1: hash-vault (Commoditized Market)

**What Happened:**
- Built CLI tool for finding duplicate files by content hash
- Never checked if best-in-class solutions exist
- Discovered **fclones** (Rust) - highly optimized, parallel processing, actively maintained

**Why Decision Tree Failed:**
- Focused on "can we build it?" not "should we build it?"
- Assumed all problems need solving
- No "best-in-class exists" check

**Learning:** Check for commoditized markets BEFORE technical work

---

### Critical Failure #2: parser-lab (Technology Showcase)

**What Happened:**

**Stage 1: UX Failure (PEGTL)**
- Assumed PEGTL (C++) → WASM = viable product
- Never validated user-facing syntax
- PEGTL uses hostile C++ template syntax:
  ```cpp
  struct string : seq< one< '"' >, star< sor< utf8::not_one< '"', '\\' >,
                       seq< one< '\\' >, any > > >, one< '"' > > {};
  ```
- Peggy (JS) has friendly syntax:
  ```javascript
  String = '"' chars:Char* '"'
  Char = [^"\\] / '\\' .
  ```

**Stage 2: Pivot to Peggy**
- Switched to Peggy (JS) to fix UX issue
- Assumed "grammar workbench" = novel product

**Stage 3: Market Validation Failure**
- Domain-specific validators dominate (JSONLint, SQLFiddle, regex101)
- "Multiple validators in one site" is not differentiation
- No real use case: "came about by researching wasm compilation and looking for projects to show off compiled modules"

**User Decision:**
> "I don't have a use case... if there's no interesting novel project here, shelve and archive it"

**Why Decision Tree Failed:**
1. **Technology looking for problem** - Built because WASM exists, not because problem exists
2. **Skipped domain-specific validator research**
3. **Assumed generic > specific** - Wrong; domain-specific tools win
4. **No use case validation**

**Learning:** Don't build to showcase technology - build to solve real problems

---

## Phase 4: Framework Refinement (Jan 2026)

### Original Framework (Technical-First)

**Pre-Conversion Decision Tree:**
1. Interprets DSL? → Stop
2. Parses text with V8 equivalent? → Stop
3. Requires SIMD? → Stop
4. String manipulation? → Stop
5. Pre-built WASM exists? → Use that
6. Cloudflare Workers + wasm-bindgen? → Blocker

**Then:** Check market validation

### Problem Identified

**Framework prioritized technical feasibility over value creation.**

Result: Built things we COULD build, not things we SHOULD build.

### Updated Framework (Value-First)

**Phase 0: WASM Value Validation** (NEW - CRITICAL)

WASM must add value through ONE of these:

1. **Novel Access** - Makes library usable in browser that wasn't before
   - Example: FFmpeg.wasm (video editing in browser)
   - Example: ammonia WASM (HTML sanitization in browser)
   - Test: "Can users do something new that was impossible before?"

2. **Performance Advantage** - Measurably faster than JS equivalent
   - Example: Image compression (WASM 3-5x faster)
   - Test: "Did we benchmark against best-in-class JS?"

3. **Unique Code** - Substantial differentiation built around WASM library
   - Example: wave-shape (modular synth UI + WASM DSP)
   - Test: "Is there 10+ hours of unique code beyond WASM wrapper?"

**If none of these → Don't build it.**

**Phase 1: Market Validation**
1. Best-in-class solution exists? → Stop
2. Commoditized market? → Stop
3. Problem doesn't exist? → Stop
4. Technology showcase with no use case? → Stop
5. Domain-specific alternatives dominate? → Stop

**Phase 2: User Experience Validation**
1. User-facing syntax hostile? → Stop (or use JS alternative)
2. JS alternative has better DX? → Stop (or use JS)
3. WASM doesn't enable new UX? → Stop

**Phase 3: Technical Feasibility**
- Check WASM decision tree (compilation feasibility)
- Verify no WASM blockers

---

## Key Learnings

### What Worked

1. **Edge deployment** - 5 products shipped, all provide edge computing value
2. **WASM for browser access** - sanitize-edge (ammonia WASM) works well
3. **Repeatable process** - Can compile most pure computation libraries
4. **Fast iteration** - Bun + Vitest + Cloudflare Workers = rapid development

### What Didn't Work

1. **WASM for WASM's sake** - Building to showcase technology, not solve problems
2. **Generic tools** - Domain-specific validators beat generic workbenches
3. **Commoditized markets** - Can't compete with best-in-class (fclones, Aseprite)
4. **Hostile syntax** - WASM library with bad UX doesn't add value

### Anti-Patterns Identified

1. **"Technology looking for problem"** - Starting with WASM capability, then finding problems
2. **Skipping market research** - Not checking if best-in-class solutions exist
3. **Assuming generic > specific** - Domain-specific tools dominate
4. **No use case validation** - Building without asking "who needs this weekly?"

### New Rules

1. "If the best answer to 'why build this?' is 'because we can,' don't build it."
2. "If WASM makes UX worse, don't use WASM."
3. "Always compare to best-in-class JS alternative before using WASM."
4. "Don't build to showcase technology - build to solve real problems."
5. "Domain-specific tools beat generic tools."
6. "Validate use case exists before building."

---

## Outcomes

### Technical Knowledge Gained

- ✅ Repeatable WASM compilation process (Emscripten)
- ✅ Know what compiles well (pure computation, binary data)
- ✅ Know what fails (text parsing, interpreters, SIMD-dependent)
- ✅ Edge worker patterns (CORS, validation, multi-provider)
- ✅ Cloudflare Workers deployment expertise

### Products Shipped

| Category | Shipped | Approved (Not Built) | Rejected |
|----------|---------|---------------------|----------|
| **Edge Workers** | 5 (1 WASM) | 0 | 0 |
| **npm Libraries** | 0 | 0 | 0 |
| **CLI Tools** | 0 | 0 | 2 |
| **Static Sites** | 0 | 0 | 2 |
| **WASM Web Apps** | 0 | 2 | 2 |
| **Total** | **5** | **2** | **6** |

### Pass Rate

- **Products evaluated**: 13 (5 shipped, 2 approved, 6 rejected)
- **Pass rate**: 54% (7 of 13)
- **WASM-first products shipped**: 1 (sanitize-edge with ammonia)
- **Edge products shipped**: 5 (value from edge deployment, not WASM)

### Time Investment

**Research Phase** (Dec 2025): ~40-60 hours
- 13 conversion experiments
- Documentation of compilation patterns
- Performance benchmarking

**Development Phase** (Dec-Jan 2026): ~100-150 hours
- 5 edge workers shipped
- 6 product evaluations (later rejected)
- Market validation framework built

**Wasted Time** (rejected products): ~30-50 hours
- parser-lab spec, research, pivot
- hash-vault evaluation
- Other rejected product research

---

## Current State (January 2026)

### Deployed Products

1. **sanitize-edge** - HTML sanitization (ammonia WASM) at edge
2. **thumbhash-edge** - Image placeholders at edge
3. **minify-edge** - Asset minification at edge
4. **readable-edge** - Article extraction at edge
5. **webhook-edge** - Webhook validation at edge

### Next Viable Products

1. **wave-shape** - Browser modular synthesizer (WASM DSP modules)
2. **freq-sense** - Gamified ear training (WASM test tone generation)

### Decision

**Focus on 2 approved products** that pass all validation:
- Real market gaps
- Novel WASM integration
- Actual use cases
- Differentiation from existing tools

---

## Reflection

### Original Goal
"Research WASM compilation to make powerful libraries accessible in browser"

### What We Learned
1. **WASM compilation is feasible** - Most pure computation libraries compile successfully
2. **But value creation requires more** - WASM alone doesn't make a product valuable
3. **Market validation is critical** - Most products failed on viability, not feasibility
4. **Edge deployment is valuable** - 5 products shipped, mostly derive value from edge, not WASM

### Corrected Approach

**Old approach:**
1. Find library → Compile to WASM → Look for use case → Build product

**New approach:**
1. Identify real problem → Check if WASM adds value → Validate market → Build product

### Success Metrics

**Technical success**: ✅ Achieved repeatable WASM compilation process

**Product success**: ⚠️ Mixed
- 5 products shipped (mostly edge value, not WASM value)
- 1 WASM-first product shipped (sanitize-edge)
- 2 viable WASM products identified (wave-shape, freq-sense)

**Learning success**: ✅ Built robust product validation framework

---

## Recommendations for Future WASM Work

### Before Starting

1. **Validate value first** - Does WASM add novel access, performance, or enable unique code?
2. **Check market** - Do best-in-class solutions exist? Is market commoditized?
3. **Verify use case** - Do you or target users encounter this problem weekly?

### During Development

1. **Compare to JS alternatives** - Is WASM actually better?
2. **Check UX** - Is user-facing interface acceptable?
3. **Benchmark performance** - Test against best-in-class JS

### After Building

1. **Deploy incrementally** - Ship MVP, validate with users
2. **Measure adoption** - Are people using it?
3. **Iterate based on feedback** - Add features users request

---

**Last updated:** January 6, 2026
