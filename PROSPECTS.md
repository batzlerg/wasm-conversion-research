# WASM Conversion Prospects

Curated list of C, C++, Rust libraries vetted for WebAssembly conversion. Updated January 2025 after JS alternative analysis.

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

**Total Eliminated: 48**

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
| 13 | rapidjson | C++ | 14k | SAX/DOM JSON | Streaming use cases |
| 14 | nlohmann/json | C++ | 48k | Modern C++ JSON | Header-only, easy port |
| 15 | jq | C | 33k | JSON processor CLI | No full jq in pure JS |
| 16 | snappy | C++ | 6k | Google compression | Browser-only use case |
| 17 | lz4 | C | 10k | Fastest compression | Browser-only decompression |
| 18 | CImg | C++ | 1.5k | Header-only image | Simpler than sharp for basic ops |
| 19 | image-rs | Rust | 5k | Pure Rust image | Could compile to smaller WASM |
| 20 | Maximilian | C++ | 1.5k | Audio DSP | Web Audio API limited for DSP |
| 21 | q (cycfi) | C++ | 1k | Audio DSP | Same gap |
| 22 | eDSP | C++ | 500 | Signal processing | Same gap |
| 23 | DSPFilters | C++ | 2k | Digital filters | Same gap |
| 24 | essentia | C++ | 3k | Audio analysis | No JS equivalent |
| 25 | ripgrep | Rust | 58k | Fast search | Browser file search use case |
| 26 | the_silver_searcher | C | 27k | Code search | Same use case |
| 27 | mathc | C | 1k | 2D/3D math | Smaller than gl-matrix |
| 28 | BLIS | C | 2.5k | BLAS operations | Performance-critical math |
| 29 | stc | C | 1k | Modern C containers | Potential for tight code |
| 30 | tesseract | C++ | 71k | OCR | tesseract.js is 2-20s/image |
| 31 | tract | Rust | 2k | ONNX inference | Pure Rust, good WASM target |
| 32 | ncnn | C++ | 22k | NN inference | Mobile-optimized |
| 33 | onnxruntime | C++ | 18k | ML inference | WASM backend exists |
| 34 | leveldb | C++ | 38k | Key-value store | Browser storage use case |
| 35 | rocksdb | C++ | 31k | Key-value store | Same use case |
| 36 | duckdb | C++ | 35k | Analytics DB | duckdb-wasm exists |

### Tier 3: Conditional (Research Needed)

| # | Name | Lang | Stars | Notes |
|---|------|------|-------|-------|
| 37 | ImageMagick | C | 15k | WASM-ImageMagick exists, evaluate vs sharp |
| 38 | Simd | C++ | 2k | SIMD may not translate well to WASM |
| 39 | FFmpeg | C | 56k | ffmpeg.wasm exists, evaluate completeness |
| 40 | micropython | C | 21k | Pyodide alternative, niche use |
| 41 | lvgl | C | 22k | Embedded UI, browser use unclear |
| 42 | nanopb | C | 3.2k | Embedded protobuf, small but niche |
| 43 | uWebSockets | C++ | 18k | WebSocket in browser already native |
| 44 | ruff | Rust | 44k | Python linter, very specialized |
| 45 | just | Rust | 29k | Command runner, limited browser use |
| 46 | bat/fd/exa/delta/hyperfine | Rust | Various | CLI tools, filesystem dependent |

---

## Revised Conversion Priority Queue

Based on vetting, here are the **top 15 candidates** to convert:

### Immediate Conversions (Header-only, minimal deps)

1. **blurhash** - Small, fast, clear JS performance gap
2. **stb_image** - Single-file, widely needed
3. **llama2.c** - Minimal LLM, educational value
4. **simdjson** - If SIMD works in WASM
5. **mathc** - Small math library

### Short-term Conversions (More complex)

6. **Eigen** - Linear algebra performance
7. **nalgebra** - Rust linear algebra
8. **Maximilian** - Audio DSP
9. **DSPFilters** - Digital signal processing
10. **lz4** - Browser compression

### Research Conversions (Verify viability)

11. **polars** - DataFrame (already has wasm efforts)
12. **faiss** - Vector search
13. **whisper.cpp** - Speech recognition
14. **tesseract** - OCR (compare to tesseract.js)
15. **jq** - JSON processing

---

## Summary After Vetting

| Category | Original | Eliminated | Surviving |
|----------|----------|------------|-----------|
| Parsing/Serialization | 10 | 6 | 4 |
| Compression | 7 | 5 | 2 |
| Cryptography | 6 | 6 | 0 |
| Image Processing | 7 | 1 | 6 |
| Audio/Video | 7 | 1 | 6 |
| Text/Regex | 5 | 3 | 2 |
| Math/Linear Algebra | 5 | 1 | 4 |
| Data Structures | 5 | 3 | 2 |
| Networking | 6 | 6 | 0 |
| Database | 7 | 4 | 3 |
| ML/AI | 7 | 0 | 7 |
| CLI Utilities | 9 | 2 | 7 |
| Logging/Formatting | 4 | 4 | 0 |
| Testing | 3 | 3 | 0 |
| Embedded | 6 | 4 | 2 |
| Build Tools | 3 | 1 | 2 |
| Parsing Libs | 3 | 2 | 1 |
| **TOTAL** | **100** | **52** | **48** |

---

*Last updated: January 2025*
*Vetting criteria: JS alternative with 80-90%+ feature overlap = eliminate*
