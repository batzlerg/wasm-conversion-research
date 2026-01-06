# WASM Conversion Research - Executive Summary

**Last Updated:** January 2026
**Status:** Active Research - Documentation Reorganized

---

## Project Organization

This research has been reorganized into focused documents:

- **[ELIMINATED.md](ELIMINATED.md)** — 83 libraries we won't pursue (with reasons why)
- **[ACTIVE_PROSPECTS.md](ACTIVE_PROSPECTS.md)** — 34 viable candidates (13 completed, 21 remaining)
- **[LEARNINGS.md](LEARNINGS.md)** — Technical details of all 15 conversion attempts
- **[EDGE_PROSPECTS.md](EDGE_PROSPECTS.md)** — 20 edge-specific candidates evaluated
- **[PRODUCT_PROSPECTS.md](PRODUCT_PROSPECTS.md)** — Product ideas leveraging conversions
- **[CLAUDE.md](CLAUDE.md)** — Decision tree and workflow guide
- **[products/thumbhash-edge.md](products/thumbhash-edge.md)** — First edge deployment spec

---

## Current State

### Completed Conversions: 13 Successful

**All documented in LEARNINGS.md:**
1. ✅ blurhash (C) - 21KB, 5,135 decodes/sec
2. ✅ mathc (C) - 19KB, 33M mat4 ops/sec
3. ✅ LZ4 (C) - 15.6KB, 6.5 GB/s compression
4. ✅ PEGTL (C++) - 176KB, parser generator
5. ✅ DSPFilters (C++) - 59KB, 119M samples/sec
6. ✅ stb_image (C) - 103KB, 22k decodes/sec
7. ✅ Maximilian (C++) - 39KB, 8-12M samples/sec
8. ✅ xxHash (C) - 29KB, 17.6 GB/s, 5.87x faster than JS
9. ✅ Snappy (C++) - 21KB, 300+ MB/s compress
10. ✅ Eigen (C++) - 113KB, 7.4x faster than JS
11. ✅ nalgebra (Rust) - 72KB, 7.4x faster than JS
12. ✅ image-rs (Rust) - 785KB, image processing suite
13. ✅ QOI (C) - 8.9KB, 254-377 MP/s encoding

### Eliminated: 4 (Learning Cases)

1. ❌ simdjson (C++) - 30% slower than JSON.parse (SIMD failed)
2. ❌ jq (C) - 115x slower than JS (interpreter overhead)
3. ❌ stc (C) - Skipped via decision tree (V8 native faster)
4. ⚠️ tesseract - Use tesseract.js (pre-built exists)

### Total Evaluated: 100+

- **Eliminated:** 83 libraries (see ELIMINATED.md)
- **Active prospects:** 34 libraries (see ACTIVE_PROSPECTS.md)
- **Completed:** 13 conversions
- **Success rate:** 13/13 when decision tree criteria met

---

## Key Achievements

### 1. Decision Tree Validated (CLAUDE.md)
- **Purpose:** Pre-screen candidates before attempting conversion
- **Success:** Correctly eliminated stc (C containers) without wasting time
- **Evidence:** 13/13 attempted conversions succeeded when passing criteria

**Stop Criteria** (any match = skip):
- Interprets a DSL (jq: 115x slower)
- Parses text with V8 native (simdjson: 30% slower)
- Relies on SIMD (incomplete WASM support)
- String-heavy processing (UTF-8↔UTF-16 overhead)
- Pre-built WASM exists (use instead)

**Proceed Criteria** (3+ needed):
- Pure computation (11/11 success, 7.2x avg speedup)
- Binary data processing (6/6 success, 4.5x avg)
- Header-only/single-file (5/5 success)
- No JS alternative
- Porting existing C/C++/Rust

### 2. Pattern Documentation (LEARNINGS.md)
- All 15 conversions documented with:
  - Compilation commands
  - Performance metrics
  - Binary sizes
  - Key learnings
  - When to use vs JS alternatives
- Common pitfalls and solutions
- Decision tree application examples

### 3. Prospect List Refined (PROSPECTS.md)
- Original: 100 candidates
- Eliminated: 54 (using JS alternatives analysis + meta-patterns)
- Use pre-built: 5 (tesseract.js, ffmpeg.wasm, etc.)
- Surviving: 30 high-value candidates
- Completed: 13 conversions

---

## Success Patterns (Proven)

### Pure Computation: 11/11 Success
**Average Speedup:** 7.2x (range: 3.9x-13.5x)
- DSPFilters: 13.5x
- Eigen: 7.4x
- nalgebra: 7.4x
- Maximilian: 6.7x
- xxHash: 5.87x
- stb_image: 3.9x

### Binary Data Processing: 6/6 Success
**Average Speedup:** 4.5x
- LZ4: 6.5 GB/s compression
- Snappy: 300+ MB/s
- blurhash: 5,135 decodes/sec
- QOI: 254-377 MP/s
- stb_image: 22k decodes/sec

### Header-Only/Single-File: 5/5 Success
- QOI: 8.9KB (smallest!)
- mathc: 19KB
- stb_image: 103KB
- Eigen: 113KB (header-only)

---

## Failure Patterns (Proven)

### Interpreters/DSL: 0/1 Success
- jq: 115x slower than JS map/filter/reduce
- Reason: Parsing overhead + boundary crossing

### Text Parsers vs V8 Native: 0/1 Success
- simdjson: 30% slower than JSON.parse
- Reason: V8's native parser is compiled C++ without WASM boundary

### SIMD-Dependent: 0/1 Success
- simdjson: Fell back to scalar code
- Reason: WASM SIMD incomplete

---

## Repository Status

### Documentation
- ✅ CLAUDE.md - Updated with decision tree
- ✅ LEARNINGS.md - 15 conversions documented
- ✅ PROSPECTS.md - Refined to 30 survivors
- ⚠️ Not committed (pending)

### Experiments (15 total)
- ✅ blurhash/ - Complete with tests
- ✅ mathc/ - Complete with tests
- ✅ lz4/ - Complete with tests
- ✅ pegtl-parser/ - Complete with tests
- ✅ dspfilters/ - Complete with tests
- ✅ stb_image/ - Complete with tests
- ✅ maximilian/ - Complete with tests
- ✅ xxhash/ - Complete with tests
- ✅ snappy/ - Complete with tests
- ✅ eigen/ - Complete with tests
- ✅ nalgebra/ - Complete with tests
- ✅ jq/ - Complete (documented as slow)
- ✅ image-rs/ - Complete with tests
- ✅ qoi/ - Complete with tests
- ✅ simdjson/ - Complete (documented as slower)
- ⚠️ cimg/, q-dsp/, stc/ - Cloned but not converted

---

## What Remains

### Immediate (High-Confidence Candidates)
Based on proven patterns, these should succeed:

**Audio DSP** (similar to DSPFilters/Maximilian):
- essentia (audio analysis)
- q (cycfi) - needs I/O wrapper
- eDSP - signal processing

**Math** (similar to Eigen/nalgebra):
- BLIS (BLAS operations)

**Image** (similar to stb_image/QOI):
- CImg (header-only, 70K lines - complex but feasible)

### Research Needed (Verify Patterns)
**ML/AI** (check for I/O dependencies):
- llama2.c (mmap issue - needs investigation)
- llama.cpp (large, complex)
- whisper.cpp (audio ML)
- tract (Rust ONNX)
- faiss (vector search)
- polars (DataFrames)
- candle (ML framework)

**Databases** (I/O heavy - may violate decision tree):
- leveldb/rocksdb (check if browser storage use case valid)

### Not Worth Pursuing
Based on decision tree:
- Parsing libraries (V8 native faster)
- CLI tools (string-heavy, file I/O)
- Networking libs (browser APIs better)
- Anything with pre-built WASM

---

## Next Steps (If Continuing)

### Option 1: Complete High-Confidence Set
Convert remaining proven-pattern matches:
1. essentia (audio analysis)
2. BLIS (BLAS)
3. CImg (if header-only parsing works)

**Time:** ~3-5 hours
**Value:** Validate pattern consistency

### Option 2: Research Complex Candidates
Investigate viability of ML/AI libraries:
1. llama2.c (solve mmap issue)
2. tract (Rust ONNX - check size/complexity)
3. faiss (vector search - pure computation)

**Time:** ~5-10 hours
**Value:** Explore new domains

### Option 3: Document & Conclude
1. Commit all work
2. Write final summary report
3. Create comparison matrix
4. Publish findings

**Time:** ~2 hours
**Value:** Shareable research artifact

---

## Key Insights

1. **Decision tree works:** Saved time on stc, correctly predicts success
2. **Patterns are reliable:** 13/13 conversions succeeded when criteria met
3. **Rust is easier:** wasm-pack simpler than Emscripten (nalgebra, image-rs)
4. **V8 is fast:** Native parsers (JSON, RegExp) beat WASM
5. **SIMD is unreliable:** WASM SIMD not production-ready
6. **Size range:** 8.9KB (QOI) to 785KB (image-rs with codecs)
7. **Speedup range:** 3.9x-13.5x for pure computation

---

## Recommendation

**For This Research Project:**
- ✅ Pattern validation complete (13 successes prove decision tree)
- ✅ Documentation comprehensive
- ⚠️ Commit current work before proceeding
- ➡️ Either: Complete 3-5 more high-confidence conversions
- ➡️ Or: Document & conclude with findings

**For Production Use:**
1. Use decision tree to pre-screen candidates
2. Prefer Rust (wasm-pack) over C++ (Emscripten) when possible
3. Always check for pre-built WASM first
4. Benchmark against JS alternatives
5. Focus on pure computation and binary data domains
