# WASM Conversion Prospects

Curated list of top GitHub repositories (C, C++, Rust) that are candidates for WebAssembly conversion experimentation. Compiled January 2025.

**Criteria:**
- Libraries, utilities, CLI tools, drivers only
- No full GUI applications
- No complete products (browsers, game engines, IDEs)
- Prioritized by: WASM feasibility, stars, and utility

---

## Category Legend

| Symbol | Meaning |
|--------|---------|
| ⭐ | Very high potential for WASM |
| 🔶 | Moderate potential, some challenges |
| 🔴 | Low potential (system deps, I/O heavy) |

---

## 1. Parsing & Serialization (Excellent WASM Candidates)

| # | Name | Lang | Stars | Description | WASM Potential |
|---|------|------|-------|-------------|----------------|
| 1 | [simdjson](https://github.com/simdjson/simdjson) | C++ | 23k | Parsing gigabytes of JSON per second | ⭐ |
| 2 | [rapidjson](https://github.com/Tencent/rapidjson) | C++ | 14k | Fast JSON parser/generator with SAX/DOM API | ⭐ |
| 3 | [nlohmann/json](https://github.com/nlohmann/json) | C++ | 48k | JSON for Modern C++ | ⭐ |
| 4 | [jq](https://github.com/jqlang/jq) | C | 33k | Command-line JSON processor | ⭐ |
| 5 | [yaml-cpp](https://github.com/jbeder/yaml-cpp) | C++ | 5k | YAML parser and emitter | ⭐ |
| 6 | [rapidyaml](https://github.com/biojppm/rapidyaml) | C++ | 1.5k | Fast YAML library (~450MB/s) | ⭐ |
| 7 | [protobuf](https://github.com/protocolbuffers/protobuf) | C++ | 70k | Protocol Buffers - data interchange format | ⭐ |
| 8 | [flatbuffers](https://github.com/google/flatbuffers) | C++ | 25k | Memory efficient serialization | ⭐ |
| 9 | [serde](https://github.com/serde-rs/serde) | Rust | 9k | Serialization framework | ⭐ |
| 10 | [serde_json](https://github.com/serde-rs/json) | Rust | 5k | JSON support for Serde | ⭐ |

## 2. Compression (Excellent WASM Candidates)

| # | Name | Lang | Stars | Description | WASM Potential |
|---|------|------|-------|-------------|----------------|
| 11 | [zstd](https://github.com/facebook/zstd) | C | 26k | Fast real-time compression | ⭐ |
| 12 | [lz4](https://github.com/lz4/lz4) | C | 10k | Extremely fast compression | ⭐ |
| 13 | [brotli](https://github.com/google/brotli) | C | 14k | Generic lossless compression | ⭐ |
| 14 | [zlib](https://github.com/madler/zlib) | C | 6k | Compression library | ⭐ |
| 15 | [snappy](https://github.com/google/snappy) | C++ | 6k | Fast compressor/decompressor | ⭐ |
| 16 | [lz4_flex](https://github.com/PSeitz/lz4_flex) | Rust | 500 | Pure Rust LZ4 compression | ⭐ |
| 17 | [brotli-rs](https://github.com/dropbox/rust-brotli) | Rust | 800 | Pure Rust brotli decompressor | ⭐ |

## 3. Cryptography (Good WASM Candidates)

| # | Name | Lang | Stars | Description | WASM Potential |
|---|------|------|-------|-------------|----------------|
| 18 | [openssl](https://github.com/openssl/openssl) | C | 29k | TLS/SSL and crypto library | 🔶 |
| 19 | [libsodium](https://github.com/jedisct1/libsodium) | C | 13k | Modern crypto library | ⭐ |
| 20 | [ring](https://github.com/briansmith/ring) | Rust | 3.5k | Safe, fast crypto | 🔶 |
| 21 | [rustls](https://github.com/rustls/rustls) | Rust | 6k | Modern TLS library in Rust | ⭐ |
| 22 | [RustCrypto](https://github.com/RustCrypto) | Rust | - | Pure Rust crypto implementations | ⭐ |
| 23 | [hashcat](https://github.com/hashcat/hashcat) | C | 25k | Password recovery utility | 🔶 |

## 4. Image Processing (Good WASM Candidates)

| # | Name | Lang | Stars | Description | WASM Potential |
|---|------|------|-------|-------------|----------------|
| 24 | [stb](https://github.com/nothings/stb) | C | 31k | Single-file public domain libraries | ⭐ |
| 25 | [ImageMagick](https://github.com/ImageMagick/ImageMagick) | C | 15k | Image manipulation suite | 🔶 |
| 26 | [CImg](https://github.com/GreycLab/CImg) | C++ | 1.5k | Header-only image processing | ⭐ |
| 27 | [opencv](https://github.com/opencv/opencv) | C++ | 85k | Computer vision library | 🔶 |
| 28 | [image-rs](https://github.com/image-rs/image) | Rust | 5k | Image processing library | ⭐ |
| 29 | [blurhash](https://github.com/woltapp/blurhash) | C | 16k | Image placeholder algorithm | ⭐ |
| 30 | [Simd](https://github.com/ermig1979/Simd) | C++ | 2k | SIMD image processing | 🔶 |

## 5. Audio/Video Processing (Moderate WASM Potential)

| # | Name | Lang | Stars | Description | WASM Potential |
|---|------|------|-------|-------------|----------------|
| 31 | [FFmpeg](https://github.com/FFmpeg/FFmpeg) | C | 56k | Multimedia framework | 🔶 (pre-built exists) |
| 32 | [Maximilian](https://github.com/micknoise/Maximilian) | C++ | 1.5k | Audio DSP library | ⭐ |
| 33 | [q](https://github.com/cycfi/q) | C++ | 1k | Audio DSP library | ⭐ |
| 34 | [eDSP](https://github.com/mohabouje/eDSP) | C++ | 500 | Digital signal processing | ⭐ |
| 35 | [essentia](https://github.com/MTG/essentia) | C++ | 3k | Audio analysis library | 🔶 |
| 36 | [whisper.cpp](https://github.com/ggerganov/whisper.cpp) | C++ | 45k | OpenAI Whisper port | ⭐ |
| 37 | [DSPFilters](https://github.com/vinniefalco/DSPFilters) | C++ | 2k | Digital filter collection | ⭐ |

## 6. Text Processing & Regex (Excellent WASM Candidates)

| # | Name | Lang | Stars | Description | WASM Potential |
|---|------|------|-------|-------------|----------------|
| 38 | [regex](https://github.com/rust-lang/regex) | Rust | 4k | Official Rust regex | ⭐ |
| 39 | [ripgrep](https://github.com/BurntSushi/ripgrep) | Rust | 58k | Fast recursive grep | ⭐ |
| 40 | [the_silver_searcher](https://github.com/ggreer/the_silver_searcher) | C | 27k | Code searching tool (ag) | ⭐ |
| 41 | [PCRE2](https://github.com/PCRE2Project/pcre2) | C | 2k | Perl-compatible regex | ⭐ |
| 42 | [RE2](https://github.com/google/re2) | C++ | 9k | Fast regex library | ⭐ |

## 7. Math & Linear Algebra (Excellent WASM Candidates)

| # | Name | Lang | Stars | Description | WASM Potential |
|---|------|------|-------|-------------|----------------|
| 43 | [Eigen](https://gitlab.com/libeigen/eigen) | C++ | 10k | Linear algebra library | ⭐ |
| 44 | [nalgebra](https://github.com/dimforge/nalgebra) | Rust | 4k | Linear algebra library | ⭐ |
| 45 | [mathc](https://github.com/felselva/mathc) | C | 1k | Pure C math for 2D/3D | ⭐ |
| 46 | [glm](https://github.com/g-truc/glm) | C++ | 9k | OpenGL Mathematics | ⭐ |
| 47 | [BLIS](https://github.com/flame/blis) | C | 2.5k | BLAS-like library | ⭐ |

## 8. Data Structures & Algorithms (Excellent WASM Candidates)

| # | Name | Lang | Stars | Description | WASM Potential |
|---|------|------|-------|-------------|----------------|
| 48 | [uthash](https://github.com/troydhanson/uthash) | C | 4k | Hash table for C structures | ⭐ |
| 49 | [klib](https://github.com/attractivechaos/klib) | C | 4k | Lightweight C algorithms | ⭐ |
| 50 | [stc](https://github.com/stclib/STC) | C | 1k | Modern C container library | ⭐ |
| 51 | [hashbrown](https://github.com/rust-lang/hashbrown) | Rust | 2k | Rust HashMap implementation | ⭐ |
| 52 | [faiss](https://github.com/facebookresearch/faiss) | C++ | 38k | Similarity search library | 🔶 |

## 9. Networking Libraries (Moderate WASM Potential)

| # | Name | Lang | Stars | Description | WASM Potential |
|---|------|------|-------|-------------|----------------|
| 53 | [curl](https://github.com/curl/curl) | C | 40k | Data transfer library | 🔴 |
| 54 | [libuv](https://github.com/libuv/libuv) | C | 26k | Async I/O library | 🔴 |
| 55 | [libhv](https://github.com/ithewei/libhv) | C++ | 7k | Event-loop networking | 🔴 |
| 56 | [uWebSockets](https://github.com/uNetworking/uWebSockets) | C++ | 18k | WebSocket library | 🔶 |
| 57 | [tokio](https://github.com/tokio-rs/tokio) | Rust | 30k | Async runtime | 🔴 |
| 58 | [hyper](https://github.com/hyperium/hyper) | Rust | 14k | HTTP library | 🔶 |

## 10. Database Libraries (Moderate WASM Potential)

| # | Name | Lang | Stars | Description | WASM Potential |
|---|------|------|-------|-------------|----------------|
| 59 | [leveldb](https://github.com/google/leveldb) | C++ | 38k | Fast key-value storage | 🔶 |
| 60 | [rocksdb](https://github.com/facebook/rocksdb) | C++ | 31k | Persistent key-value store | 🔶 |
| 61 | [sqlite](https://github.com/nickmqb/sqlite) | C | - | SQL database engine | ⭐ (sql.js exists) |
| 62 | [libsql](https://github.com/tursodatabase/libsql) | C | 16k | SQLite fork | ⭐ |
| 63 | [duckdb](https://github.com/duckdb/duckdb) | C++ | 35k | Analytical SQL database | 🔶 |
| 64 | [sqlx](https://github.com/launchbadge/sqlx) | Rust | 15k | Async SQL toolkit | 🔴 |
| 65 | [diesel](https://github.com/diesel-rs/diesel) | Rust | 12k | Safe ORM | 🔴 |

## 11. ML/AI Inference (Good WASM Candidates)

| # | Name | Lang | Stars | Description | WASM Potential |
|---|------|------|-------|-------------|----------------|
| 66 | [llama.cpp](https://github.com/ggerganov/llama.cpp) | C++ | 92k | LLM inference | ⭐ |
| 67 | [llama2.c](https://github.com/karpathy/llama2.c) | C | 19k | Minimal LLM inference | ⭐ |
| 68 | [onnxruntime](https://github.com/microsoft/onnxruntime) | C++ | 18k | ML inference engine | 🔶 |
| 69 | [ncnn](https://github.com/Tencent/ncnn) | C++ | 22k | NN inference framework | 🔶 |
| 70 | [tesseract](https://github.com/tesseract-ocr/tesseract) | C++ | 71k | OCR engine | 🔶 |
| 71 | [tract](https://github.com/sonos/tract) | Rust | 2k | ONNX/TF inference | ⭐ |
| 72 | [candle](https://github.com/huggingface/candle) | Rust | 18k | ML framework for Rust | ⭐ |

## 12. CLI Utilities (Moderate WASM Potential)

| # | Name | Lang | Stars | Description | WASM Potential |
|---|------|------|-------|-------------|----------------|
| 73 | [bat](https://github.com/sharkdp/bat) | Rust | 56k | Cat clone with wings | 🔶 |
| 74 | [fd](https://github.com/sharkdp/fd) | Rust | 41k | Fast find alternative | 🔶 |
| 75 | [exa](https://github.com/ogham/exa) | Rust | 24k | Modern ls replacement | 🔶 |
| 76 | [eza](https://github.com/eza-community/eza) | Rust | 19k | Maintained exa fork | 🔶 |
| 77 | [delta](https://github.com/dandavison/delta) | Rust | 28k | Syntax-highlighting pager | 🔶 |
| 78 | [just](https://github.com/casey/just) | Rust | 29k | Command runner | ⭐ |
| 79 | [hyperfine](https://github.com/sharkdp/hyperfine) | Rust | 27k | Benchmarking tool | 🔶 |
| 80 | [nnn](https://github.com/jarun/nnn) | C | 21k | Terminal file manager | 🔴 |
| 81 | [tmux](https://github.com/tmux/tmux) | C | 40k | Terminal multiplexer | 🔴 |

## 13. Logging & Formatting (Excellent WASM Candidates)

| # | Name | Lang | Stars | Description | WASM Potential |
|---|------|------|-------|-------------|----------------|
| 82 | [spdlog](https://github.com/gabime/spdlog) | C++ | 28k | Fast C++ logging | ⭐ |
| 83 | [fmt](https://github.com/fmtlib/fmt) | C++ | 23k | Modern formatting library | ⭐ |
| 84 | [tracing](https://github.com/tokio-rs/tracing) | Rust | 6k | Instrumentation framework | ⭐ |
| 85 | [log](https://github.com/rust-lang/log) | Rust | 2k | Logging facade | ⭐ |

## 14. Testing & Development (Good WASM Candidates)

| # | Name | Lang | Stars | Description | WASM Potential |
|---|------|------|-------|-------------|----------------|
| 86 | [googletest](https://github.com/google/googletest) | C++ | 37k | Testing framework | ⭐ |
| 87 | [Catch2](https://github.com/catchorg/Catch2) | C++ | 19k | Test framework | ⭐ |
| 88 | [criterion](https://github.com/bheisler/criterion.rs) | Rust | 4k | Benchmarking library | ⭐ |

## 15. Embedded & RTOS (Specialized)

| # | Name | Lang | Stars | Description | WASM Potential |
|---|------|------|-------|-------------|----------------|
| 89 | [zephyr](https://github.com/zephyrproject-rtos/zephyr) | C | 14k | RTOS for IoT | 🔴 |
| 90 | [micropython](https://github.com/micropython/micropython) | C | 21k | Python for microcontrollers | 🔶 |
| 91 | [lvgl](https://github.com/lvgl/lvgl) | C | 22k | Embedded graphics | ⭐ |
| 92 | [embassy](https://github.com/embassy-rs/embassy) | Rust | 6k | Embedded framework | 🔴 |
| 93 | [esp-idf](https://github.com/espressif/esp-idf) | C | 17k | ESP32 development | 🔴 |
| 94 | [nanopb](https://github.com/nanopb/nanopb) | C | 3.2k | Protobuf for embedded | ⭐ |

## 16. Build & Packaging Tools

| # | Name | Lang | Stars | Description | WASM Potential |
|---|------|------|-------|-------------|----------------|
| 95 | [ruff](https://github.com/astral-sh/ruff) | Rust | 44k | Python linter/formatter | ⭐ |
| 96 | [uv](https://github.com/astral-sh/uv) | Rust | 76k | Python package manager | 🔴 |
| 97 | [polars](https://github.com/pola-rs/polars) | Rust | 36k | DataFrame library | ⭐ |

## 17. Parsing Libraries (Excellent WASM Candidates)

| # | Name | Lang | Stars | Description | WASM Potential |
|---|------|------|-------|-------------|----------------|
| 98 | [tree-sitter](https://github.com/tree-sitter/tree-sitter) | Rust | 20k | Parser generator | ⭐ |
| 99 | [pest](https://github.com/pest-parser/pest) | Rust | 5k | PEG parser | ⭐ |
| 100 | [nom](https://github.com/rust-bakery/nom) | Rust | 9k | Parser combinators | ⭐ |

---

## Summary Statistics

| Language | Count | Best Candidates |
|----------|-------|-----------------|
| C | 35 | zstd, jq, stb, libsodium, blurhash |
| C++ | 40 | simdjson, llama.cpp, whisper.cpp, fmt, spdlog |
| Rust | 25 | serde, polars, ruff, candle, tree-sitter |

### Top 10 WASM Conversion Priorities

1. **simdjson** - Ultra-fast JSON parsing, header-only
2. **zstd** - Battle-tested compression, widely used
3. **llama2.c** - Minimal LLM inference, no deps
4. **stb** - Single-file libraries, perfect for WASM
5. **blurhash** - Image placeholder, small footprint
6. **nom** - Parser combinators, pure Rust
7. **serde_json** - JSON for Rust ecosystem
8. **fmt** - Modern formatting, header-only
9. **tree-sitter** - Parser generator, already has WASM
10. **nanopb** - Embedded protobuf, minimal deps

---

## Research Notes

### Already Have WASM Builds
- FFmpeg → ffmpeg.wasm
- SQLite → sql.js
- tree-sitter → tree-sitter WASM bindings
- ImageMagick → WASM-ImageMagick

### Known Challenges
- Networking libraries (libuv, curl) need browser APIs
- File I/O heavy tools need virtual filesystem
- Thread-heavy code needs SharedArrayBuffer

### Compilation Tips
- Header-only C++ libraries are easiest
- Pure Rust crates with no `std::fs` or `std::net` ideal
- Check for SIMD usage (may need polyfills)
- Watch for system calls and platform-specific code

---

*Last updated: January 2025*
*Source: GitHub rankings, awesome-* lists, crates.io, web search*
