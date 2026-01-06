# Eliminated WASM Conversion Prospects

Libraries and modules we **will not pursue** for WASM conversion, with detailed reasoning based on our decision tree and experimental evidence.

**Last Updated:** January 2026

---

## Organization

This document is organized by **why** we eliminated each prospect, not by category. Understanding the elimination reason helps apply the decision tree to future candidates.

---

## Category 1: V8 Native Equivalents (Fast JS Wins)

**Decision tree rule:** If V8 has a native, highly-optimized implementation, WASM will lose due to boundary overhead.

### Proven Failures (Experimentally Validated)

| Library | Tested | Result | Evidence |
|---------|--------|--------|----------|
| **simdjson** | ✅ | 30% slower than JSON.parse | 197 MB/s vs 282 MB/s |
| **jq** | ✅ | 115x slower than JS | ~5k ops/sec vs map/filter/reduce |

### Eliminated Without Testing (Same Pattern)

| Library | Lang | JS Alternative | Why Skip |
|---------|------|----------------|----------|
| rapidjson | C++ | JSON.parse | Same as simdjson, V8 native wins |
| nlohmann/json | C++ | JSON.parse | Same as simdjson |
| serde_json | Rust | JSON.parse | Same pattern |
| yaml-cpp | C++ | js-yaml | V8 string processing + mature library |
| rapidyaml | C++ | js-yaml | Same as above |
| regex (Rust) | Rust | JS RegExp | V8 regex engine is fast, 720KB WASM cost |
| PCRE2 | C | JS RegExp | Native sufficient |
| RE2 | C++ | JS RegExp | re2-wasm exists but not needed |

**Key insight:** V8's native parsers (JSON, RegExp, YAML via js-yaml) are compiled C++ without WASM boundary. We can't beat them.

---

## Category 2: Pre-Built WASM Exists (Use Instead of Building)

**Decision tree rule:** If maintained WASM build exists, use it. Don't reinvent.

| Library | Pre-Built Solution | Why Use Pre-Built |
|---------|-------------------|-------------------|
| **tesseract** | tesseract.js | Complex deps (Leptonica, libpng, libjpeg), 2.5MB, actively maintained |
| **FFmpeg** | ffmpeg.wasm | 30MB, all codecs, community-tested |
| **OpenCV** | opencv.js | Official Google build, comprehensive |
| **duckdb** | duckdb-wasm | Official, optimized, complete SQL |
| **sqlite** | sql.js, better-sqlite3 | Battle-tested, widespread use |
| **ImageMagick** | wasm-imagemagick | Exists, complex build avoided |
| **libsodium** | libsodium.js | Official WASM build by author |
| **tree-sitter** | web-tree-sitter | Official, gold standard for parsing |

**Key insight:** These took person-months or years to build properly. Use them.

---

## Category 3: Node.js/Browser Native APIs (Built-In Wins)

**Decision tree rule:** If the platform provides it natively, using WASM adds needless complexity.

### Networking & I/O

| Library | Native Alternative | Why Skip |
|---------|-------------------|----------|
| curl | fetch, axios | Native HTTP in browsers/Node |
| libuv | Node.js event loop | Core Node.js |
| tokio | async/await | Native async in JS |
| hyper | fetch, undici | Native HTTP |
| uWebSockets | WebSocket API | Browser native |

### Compression (HTTP Level)

| Library | Native Alternative | Why Skip |
|---------|-------------------|----------|
| zstd | Node.js 22+ native zlib.zstd | Built into Node.js |
| brotli | Node.js native zlib.brotli | Built into Node.js |
| brotli-rs | Node.js native | Same as above |
| zlib | Node.js native zlib | Core module |
| lz4_flex | lz4 npm (native bindings) | Available |

**Note:** LZ4 and Snappy succeeded for **browser use** where Node.js natives don't exist. Edge case matters.

### Crypto

| Library | Native Alternative | Why Skip |
|---------|-------------------|----------|
| openssl | Web Crypto API | Browser/Node native, audited |
| ring | noble-curves, noble-hashes | Pure JS, audited, no WASM needed |
| rustls | Node.js TLS | Native support |
| RustCrypto | noble-* suite | Complete, audited |

### Data Structures

| Library | Native Alternative | Why Skip |
|---------|-------------------|----------|
| **stc** | Map, Set, Array | V8-optimized, no WASM advantage (proven by decision tree) |
| uthash | Native Map/Object | JS Map is O(1), optimized |
| klib | Native data structures | Built-in sufficient |
| hashbrown | Native Map | Same as above |

---

## Category 4: String-Heavy Processing (Boundary Overhead Kills Performance)

**Decision tree rule:** UTF-8↔UTF-16 conversion + V8 string optimizations beat WASM for string manipulation.

| Library | JS Alternative | Why Skip |
|---------|---------------|----------|
| ripgrep | String.indexOf/search | String boundary crossing |
| the_silver_searcher | Native search | Same as above |
| pest | peggy, chevrotain, nearley | Mature JS parser generators |
| nom | parsimmon, chevrotain | JS parser combinators work well |

**Experimental support:** CSV parsing (rust-csv research) showed JS (PapaParse) is faster.

---

## Category 5: Not Browser/Edge Suitable

**Decision tree rule:** Requires filesystem, OS services, or hardware not available in browser/edge.

### Terminal/CLI Tools

| Library | Why Unsuitable |
|---------|---------------|
| nnn | Terminal UI, needs TTY |
| tmux | Terminal multiplexer |
| bat/fd/exa/delta/hyperfine | Filesystem-dependent CLI tools |
| ruff | Python linter, file I/O heavy |
| just | Command runner, shell access needed |

### Embedded/RTOS

| Library | Why Unsuitable |
|---------|---------------|
| zephyr | Real-time OS, hardware-specific |
| embassy | Embedded Rust, hardware access |
| esp-idf | ESP32 hardware framework |
| lvgl | Embedded UI, unclear browser use |

### System/Platform Tools

| Library | Why Unsuitable |
|---------|---------------|
| uv | Python package manager, file I/O |
| hashcat | Password cracking, GPU-dependent |

---

## Category 6: Framework/Infrastructure (Wrong Layer)

**Decision tree rule:** These are frameworks, not libraries. Can't meaningfully "convert."

| Library | Why Skip |
|---------|----------|
| serde | Rust serialization framework (not a codec) |
| protobuf | Use @bufbuild/protobuf (official JS) |
| flatbuffers | Google maintains official JS/TS bindings |
| sqlx | Rust SQL toolkit, not a database |
| diesel | Rust ORM, use knex/prisma in JS |

---

## Category 7: Logging/Testing/Dev Tools (Mature JS Ecosystem)

**Decision tree rule:** JS testing/logging is mature. No performance gap justifies WASM.

### Logging

| Library | JS Alternative | Why Skip |
|---------|---------------|----------|
| spdlog | pino, winston | Pino is 5-10x faster than most loggers |
| fmt | Template literals | Native formatting works |
| tracing | pino, winston | See above |
| log | console.*, pino | Native logging |

### Testing/Benchmarking

| Library | JS Alternative | Why Skip |
|---------|---------------|----------|
| googletest | jest, vitest | Mature, integrated ecosystem |
| Catch2 | jest, vitest | Same as above |
| criterion | benchmark.js, tinybench | JS benchmarking mature |

---

## Category 8: Mature JS Alternatives Exist (No Gap to Fill)

**Decision tree rule:** If JS library has 80-90%+ feature parity and good performance, skip WASM.

| Library | JS Alternative | Adoption | Why Skip |
|---------|---------------|----------|----------|
| glm | gl-matrix | Very high | Industry standard for WebGL |
| mathc | gl-matrix | High | 36KB, well-tested (but we converted anyway for comparison) |

---

## Category 9: Edge-Specific Eliminations

**Why:** Cloudflare or other platforms provide native solutions, or constraints make edge unsuitable.

### Cloudflare Has Native Solutions

| Library | Cloudflare Native | Why Skip |
|---------|------------------|----------|
| faiss (vector search) | Vectorize | Platform feature |
| tract/ncnn (ML inference) | Workers AI | Platform feature |
| image-rs (resize) | Cloudflare Images | Paid feature but exists |
| leveldb/rocksdb | KV, D1, R2 | Storage primitives |
| LZ4/Snappy (HTTP compression) | Automatic compression | HTTP level |

### Too Large for Edge CPU Limits

| Library | Issue | Why Skip for Edge |
|---------|-------|-------------------|
| llama.cpp | Models 1-7GB | Exceeds 128MB memory, slow inference |
| llama2.c | Models 15MB+ | Same as above |
| whisper.cpp | Models 50MB-1.5GB | Same as above |
| polars | Large data processing | Doesn't fit request/response |

### Better Client-Side or Server-Side

| Library | Better Where | Why |
|---------|-------------|-----|
| tree-sitter | Client-side (Shiki, Prism) | Large grammars, better with caching |
| printpdf | Traditional server | Complex, needs resources |
| regex (720KB) | Client or avoid | Too large for edge benefit |
| Eigen/nalgebra (math) | Client-side | No edge use case for matrix ops |
| DSPFilters/Maximilian | Client-side | Audio doesn't fit request/response |
| PEGTL | Client-side | Parsing better at build or client |

---

## Category 10: Niche or Unproven

**Decision tree rule:** Too specialized or unclear market need.

| Library | Why Niche/Unproven |
|---------|-------------------|
| nanopb | Embedded protobuf, very specialized |
| Simd | SIMD library, WASM SIMD incomplete |
| micropython | Interpreter, likely slow like jq |
| nanoid | crypto.randomUUID exists, JS version tiny |
| QOI | Format has minimal adoption (we converted for research) |

---

## Summary Statistics

| Elimination Reason | Count | % of Total |
|-------------------|-------|------------|
| V8 Native Equivalent | 11 | 14% |
| Pre-Built WASM Exists | 8 | 10% |
| Node.js/Browser Native API | 15 | 19% |
| String-Heavy Processing | 4 | 5% |
| Not Browser/Edge Suitable | 13 | 16% |
| Framework/Infrastructure | 6 | 8% |
| Mature JS Alternative | 2 | 3% |
| Edge-Specific Constraints | 12 | 15% |
| Niche/Unproven | 5 | 6% |
| Logging/Testing/Dev Tools | 7 | 9% |
| **Total Eliminated** | **83** | **100%** |

---

## Lessons Applied

### From jq Failure
- **Eliminated:** All DSL interpreters and query languages
- **Reason:** Parsing + frequent boundary crossing = 115x slowdown

### From simdjson Failure
- **Eliminated:** All JSON/text parsers where V8 has native support
- **Reason:** 30% slower than JSON.parse despite SIMD attempt

### From stc Pre-Elimination
- **Eliminated:** Container/data structure libraries
- **Reason:** Decision tree correctly predicted V8 native would win

### From Compression Tests
- **Kept for browser, eliminated for Node:** LZ4/Snappy
- **Reason:** Node.js has natives, browsers don't

---

## Quick Reference: "Should I Eliminate This?"

```
Does V8 have a native version? (JSON.parse, RegExp, crypto, etc.)
  → YES: Eliminate

Does a maintained WASM build exist?
  → YES: Use that instead

Is it primarily string manipulation?
  → YES: Eliminate

Is it a CLI/terminal/embedded/OS tool?
  → YES: Eliminate (not browser-suitable)

Does Node.js/browser provide it natively?
  → YES: Eliminate

Does Cloudflare provide it as platform feature?
  → YES: Skip for edge (maybe build for browser)

Is there a mature JS library with 80%+ feature parity?
  → YES: Probably eliminate unless specific performance need

Does it match success patterns? (pure computation, binary data, header-only)
  → NO: Eliminate
```

---

*Last updated: January 2026*
