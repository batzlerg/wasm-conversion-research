# WASM Conversion Prospects

**⚠️ This document has been superseded by:**
- **[ELIMINATED.md](ELIMINATED.md)** — Libraries we won't pursue (with reasons)
- **[ACTIVE_PROSPECTS.md](ACTIVE_PROSPECTS.md)** — Libraries still under consideration

**Status:** Historical reference. See new docs above for current state.

---

Original curated list of C, C++, Rust libraries vetted for WebAssembly conversion. Updated January 2025 after JS alternative analysis.

---

## Vetting Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | **KEEP** - No adequate JS alternative or WASM offers clear advantage |
| ❌ | **ELIMINATED** - Strong JS alternative exists with 80-90%+ feature overlap |
| 🔶 | **CONDITIONAL** - JS exists but WASM may win on size/performance |

---

## ELIMINATED (Strong JS Alternatives Exist)

| # | Name | Lang | JS Alternative | Why Eliminated |
|---|------|------|----------------|----------------|
| 1 | yaml-cpp | C++ | js-yaml, yaml (22k+ npm dependents) | Mature, fast, full YAML 1.2 support |
| 2 | rapidyaml | C++ | js-yaml, yaml | Same as above |
| 3 | protobuf | C++ | @bufbuild/protobuf, protobufjs | Official JS support, actively maintained |
| 4 | flatbuffers | C++ | flatbuffers (official TS support) | Google maintains official JS/TS bindings |
| 5 | serde | Rust | N/A (Rust-specific) | Only useful within Rust ecosystem |
| 6 | serde_json | Rust | Native JSON.parse, fast-json-parse | V8 JSON.parse is highly optimized |
| 7 | zstd | C | Node.js 22+ native zlib.zstd | Built into Node.js, no dependency needed |
| 8 | brotli | C | Node.js native zlib.brotli | Built into Node.js |
| 9 | zlib | C | Node.js native zlib | Built into Node.js |
| 10 | lz4_flex | Rust | lz4 npm package | Native bindings available |
| 11 | brotli-rs | Rust | Node.js native | See above |
| 12 | openssl | C | Web Crypto API, noble-* | Native browser/Node crypto |
| 13 | libsodium | C | libsodium-wrappers (WASM already) | Pre-built WASM wrappers exist |
| 14 | ring | Rust | noble-curves, noble-hashes | Audited pure JS alternatives |
| 15 | rustls | Rust | tls module (Node.js native) | Native TLS support |
| 16 | RustCrypto | Rust | noble-* suite | Pure JS, audited, complete |
| 17 | hashcat | C | N/A (specialized tool) | Not library-suitable |
| 18 | opencv | C++ | opencv.js (pre-built WASM) | Official WASM build exists |
| 19 | regex (Rust) | Rust | Native JS RegExp, XRegExp | V8 regex is fast |
| 20 | PCRE2 | C | Native JS RegExp | Built-in sufficient |
| 21 | RE2 | C++ | re2-wasm (pre-built) | Pre-built WASM exists |
| 22 | glm | C++ | gl-matrix | Mature, widely used |
| 23 | uthash | C | Native Map/Object | JS Map is O(1), optimized |
| 24 | klib | C | Native JS data structures | Built-in sufficient |
| 25 | hashbrown | Rust | Native Map | See above |
| 26 | curl | C | fetch, axios, got | Native HTTP in JS |
| 27 | libuv | C | Node.js event loop | Built into Node.js |
| 28 | tokio | Rust | Node.js async/await | Native async in JS |
| 29 | hyper | Rust | fetch, undici | Native HTTP |
| 30 | sqlite | C | sql.js, better-sqlite3 | Pre-built WASM exists |
| 31 | libsql | C | sql.js fork exists | Pre-built available |
| 32 | sqlx | Rust | knex, prisma | JS ORMs mature |
| 33 | diesel | Rust | See above | See above |
| 34 | nnn | C | N/A (terminal UI) | Not browser-suitable |
| 35 | tmux | C | N/A (terminal) | Not browser-suitable |
| 36 | spdlog | C++ | pino, winston | Pino is 5-10x faster than most |
| 37 | fmt | C++ | Template literals, util.format | Native formatting adequate |
| 38 | tracing | Rust | pino, winston | See above |
| 39 | log | Rust | console.*, pino | Native logging |
| 40 | googletest | C++ | jest, vitest | Mature JS testing |
| 41 | Catch2 | C++ | jest, vitest | See above |
| 42 | criterion | Rust | benchmark.js, tinybench | JS benchmarking exists |
| 43 | zephyr | C | N/A (RTOS) | Not browser-suitable |
| 44 | embassy | Rust | N/A (embedded) | Not browser-suitable |
| 45 | esp-idf | C | N/A (hardware) | Not browser-suitable |
| 46 | uv | Rust | N/A (Python tool) | Python-specific, file I/O heavy |
| 47 | pest | Rust | peggy, chevrotain, nearley | Mature JS parser generators |
| 48 | nom | Rust | parsimmon, chevrotain | JS parser combinators exist |
| 49 | jq | C | Native JS map/filter/reduce | Interpreter/DSL - 115x slower than JS |
| 50 | rapidjson | C++ | Native JSON.parse | V8 native JSON.parse faster |
| 51 | nlohmann/json | C++ | Native JSON.parse | V8 native JSON.parse faster |
| 52 | simdjson | C++ | Native JSON.parse | 30% slower than JSON.parse (proven) |
| 53 | ripgrep | Rust | Native String.indexOf/search | String-heavy, boundary overhead |
| 54 | the_silver_searcher | C | Native String search | String-heavy, boundary overhead |

**Total Eliminated: 54**

---

## SURVIVORS - Conversion Candidates

### Tier 1: High Priority (Clear WASM Advantage)

| # | Name | Lang | Stars | Why Keep | JS Gap |
|---|------|------|-------|----------|--------|
| 1 | **simdjson** | C++ | 23k | SIMD JSON parsing at GB/s | JSON.parse blocks event loop on large files |
| 2 | **llama.cpp** | C++ | 92k | LLM inference | Transformers.js slower, less model support |
| 3 | **llama2.c** | C | 19k | Minimal LLM inference | No JS equivalent for raw C simplicity |
| 4 | **whisper.cpp** | C++ | 45k | Speech-to-text | whisper.js exists but WASM may be faster |
| 5 | **stb** | C | 31k | Single-file image libs | No single-file JS equivalent |
| 6 | **blurhash** | C | 16k | Compact image placeholder | blurhash-js exists but C is 10x faster |
| 7 | **Eigen** | C++ | 10k | Linear algebra | math.js slow for large matrices |
| 8 | **nalgebra** | Rust | 4k | Linear algebra | Same performance gap |
| 9 | **faiss** | C++ | 38k | Vector similarity search | No JS equivalent at scale |
| 10 | **polars** | Rust | 36k | DataFrame operations | JS alternatives slower |
| 11 | **tree-sitter** | Rust | 20k | Incremental parsing | Already has WASM, gold standard |
| 12 | **candle** | Rust | 18k | ML framework | Emerging, complements Transformers.js |

### Tier 2: Medium Priority (WASM May Win)

| # | Name | Lang | Stars | Why Keep | JS Gap |
|---|------|------|-------|----------|--------|
| 13 | xxHash | C | 1.5k | Hashing | Proven 5.87x faster than JS |
| 14 | snappy | C++ | 6k | Google compression | Proven 4.2x speedup |
| 15 | lz4 | C | 10k | Fastest compression | Proven 6.5 GB/s compress |
| 16 | CImg | C++ | 1.5k | Header-only image | Simpler than sharp for basic ops |
| 17 | image-rs | Rust | 5k | Pure Rust image | Could compile to smaller WASM |
| 18 | Maximilian | C++ | 1.5k | Audio DSP | Proven 6.7x speedup |
| 19 | q (cycfi) | C++ | 1k | Audio DSP | Similar to Maximilian |
| 20 | eDSP | C++ | 500 | Signal processing | Similar to DSPFilters |
| 21 | DSPFilters | C++ | 2k | Digital filters | Proven 13.5x speedup |
| 22 | essentia | C++ | 3k | Audio analysis | No JS equivalent |
| 23 | mathc | C | 1k | 2D/3D math | Proven 33M mat4 ops/sec |
| 24 | BLIS | C | 2.5k | BLAS operations | Performance-critical math |
| 25 | stc | C | 1k | Modern C containers | Potential for tight code |
| 26 | tract | Rust | 2k | ONNX inference | Pure Rust, good WASM target |
| 27 | ncnn | C++ | 22k | NN inference | Mobile-optimized |
| 28 | onnxruntime | C++ | 18k | ML inference | WASM backend exists |
| 29 | leveldb | C++ | 38k | Key-value store | Browser storage use case |
| 30 | rocksdb | C++ | 31k | Key-value store | Same use case |

### Tier 3: Use Pre-Built (Don't Rebuild)

| # | Name | Lang | Stars | Pre-Built Solution | Reason |
|---|------|------|-------|-------------------|--------|
| 31 | tesseract | C++ | 71k | tesseract.js | Proven: Complex deps, 2.5MB maintained |
| 32 | duckdb | C++ | 35k | duckdb-wasm | Official WASM build exists |
| 33 | FFmpeg | C | 56k | ffmpeg.wasm | Actively maintained, complete |
| 34 | OpenCV | C++ | 80k | opencv.js | Official build, well-tested |
| 35 | ImageMagick | C | 15k | wasm-imagemagick | Exists, evaluate before rebuilding |

### Tier 4: Conditional (Verify Pattern Match)

| # | Name | Lang | Stars | Notes |
|---|------|------|-------|-------|
| 36 | Simd | C++ | 2k | SIMD may not translate (verify fallback) |
| 37 | micropython | C | 21k | Interpreter (likely slow like jq) |
| 38 | lvgl | C | 22k | Embedded UI, browser use unclear |
| 39 | nanopb | C | 3.2k | Embedded protobuf, niche |
| 40 | uWebSockets | C++ | 18k | WebSocket already native |
| 41 | ruff | Rust | 44k | Python linter, specialized |
| 42 | just | Rust | 29k | Command runner, limited browser use |
| 43 | bat/fd/exa/delta/hyperfine | Rust | Various | CLI tools, filesystem dependent |

---

## Revised Conversion Priority Queue

Based on 13 conversion experiments with documented success/failure patterns:

### ✅ Completed & Proven

1. ✅ **blurhash** - 5,135 decodes/sec, 21KB
2. ✅ **stb_image** - 3.9x speedup, 103KB
3. ✅ **mathc** - 33M mat4 ops/sec, 19KB
4. ✅ **Eigen** - 7.4x speedup, 113KB
5. ✅ **nalgebra** - 7.4x speedup, 72KB (Rust)
6. ✅ **Maximilian** - 6.7x speedup, 39KB
7. ✅ **DSPFilters** - 13.5x speedup, 59KB
8. ✅ **lz4** - 6.5 GB/s compress, 15.6KB
9. ✅ **snappy** - 4.2x speedup, 21KB
10. ✅ **xxHash** - 5.87x speedup, 29KB

### Next Immediate Conversions (High Confidence)

11. **essentia** - Audio analysis (like Maximilian/DSPFilters)
12. **q (cycfi)** - Audio DSP (similar pattern)
13. **eDSP** - Signal processing (similar pattern)
14. **CImg** - Header-only image (like stb_image)
15. **BLIS** - BLAS operations (like Eigen)

### Research Conversions (Verify viability)

16. **llama2.c** - Minimal LLM (check mmap issue)
17. **llama.cpp** - LLM inference (large, complex)
18. **whisper.cpp** - Speech recognition (check audio I/O)
19. **polars** - DataFrame (check if wasm effort complete)
20. **faiss** - Vector search (pure computation, should work)

---

## Summary After Pattern-Based Vetting

| Category | Original | Eliminated | Use Pre-Built | Surviving |
|----------|----------|------------|---------------|-----------|
| Parsing/Serialization | 10 | 10 | 0 | 0 |
| Compression | 7 | 5 | 0 | 2 ✅ |
| Cryptography | 6 | 6 | 0 | 0 |
| Image Processing | 7 | 1 | 2 | 4 ✅ |
| Audio/Video | 7 | 1 | 1 | 5 ✅ |
| Text/Regex | 5 | 5 | 0 | 0 |
| Math/Linear Algebra | 5 | 0 | 0 | 5 ✅ |
| Data Structures | 5 | 3 | 0 | 2 |
| Networking | 6 | 6 | 0 | 0 |
| Database | 7 | 4 | 2 | 1 |
| ML/AI | 7 | 0 | 0 | 7 ✅ |
| CLI Utilities | 9 | 9 | 0 | 0 |
| Logging/Formatting | 4 | 4 | 0 | 0 |
| Testing | 3 | 3 | 0 | 0 |
| Embedded | 6 | 4 | 0 | 2 |
| Build Tools | 3 | 1 | 0 | 2 |
| Parsing Libs | 3 | 3 | 0 | 0 |
| **TOTAL** | **100** | **54** | **5** | **30** |

**Key Changes from Experiments:**
- Eliminated all JSON/text parsers (simdjson, jq proven slower)
- Eliminated all CLI tools with string-heavy processing
- Moved complex builds with pre-built to separate tier
- Proven conversions marked with ✅ (10 completed, all successful)

---

*Last updated: January 2025*
*Vetting criteria: JS alternative with 80-90%+ feature overlap = eliminate*
