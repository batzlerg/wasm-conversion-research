# WASM Conversion Research

Deep implementation research for compiling native libraries to WebAssembly for browser-based utilities.

**Date:** 2026-01-05

## Executive Summary

Researched WASM compilation feasibility for various native libraries. Built two working test harnesses and documented key findings about when WASM compilation makes sense vs. when JavaScript is sufficient.

### Key Findings

| Target | Status | Recommendation |
|--------|--------|----------------|
| **FFmpeg.wasm** | ✅ Working | **BUILD** - Pre-built, mature solution |
| **PEGTL Parser** | ✅ Working | **BUILD** - 136KB binary, fast |
| **Rust CSV (qsv)** | ⚠️ Research | **SKIP** - JS often faster |
| **C++ Plotting** | ❌ Skip | **SKIP** - Use JS rendering |

## Working Test Harnesses

### 1. FFmpeg Image Compressor
**Location:** `experiments/ffmpeg-image-compressor/`

```bash
cd experiments/ffmpeg-image-compressor
bun run server.ts
# Open http://localhost:3000
```

Features:
- WebP, AVIF, JPEG, PNG conversion
- Quality selection
- Size comparison stats
- Privacy-first (all client-side)

### 2. PEGTL Parser Playground
**Location:** `experiments/pegtl-parser/`

```bash
cd experiments/pegtl-parser
python3 -m http.server 3001
# Open http://localhost:3001
```

Features:
- Mathematical expression parsing
- Token extraction
- Real-time validation
- 136KB WASM binary

## Research Findings

### When WASM Makes Sense

✅ **Good candidates:**
- Pre-built solutions (FFmpeg.wasm, Squoosh codecs)
- Header-only C++ libraries (PEGTL)
- Computationally heavy operations
- Cryptographic operations
- Image/video encoding

❌ **Poor candidates:**
- CSV parsing (JavaScript often faster)
- GUI/rendering libraries (use JS rendering)
- Libraries with heavy dependencies
- Simple text processing

### Performance Insight: CSV Parsing

From ImportCSV's research:
> "JavaScript remained faster across all file sizes tested"

| File Size | PapaParse (JS) | WASM Parser |
|-----------|----------------|-------------|
| 10MB      | 191ms          | 228ms       |
| 60MB      | 1,068ms        | 1,484ms     |

**Root cause:** Memory allocation and JS/WASM boundary crossing overhead.

### Recommended Architecture

For complex browser tools, use a **hybrid approach**:

```
┌─────────────────────────────────────────────┐
│  JavaScript Layer                           │
│  - UI, file handling, rendering             │
├─────────────────────────────────────────────┤
│  WASM Module                                │
│  - Heavy computation only                   │
│  - Returns data, not rendered output        │
└─────────────────────────────────────────────┘
```

## Directory Structure

```
wasm-conversion-research/
├── README.md                    # This file
├── CLAUDE.md                    # Project context
├── research/                    # Detailed findings
│   ├── rust-csv.md             # CSV parsing research
│   ├── ffmpeg-wasm.md          # FFmpeg findings
│   ├── cpp-pegtl.md            # PEGTL compilation
│   └── cpp-plotting.md         # Plotting library analysis
└── experiments/                 # Working harnesses
    ├── ffmpeg-image-compressor/ # Browser image compressor
    └── pegtl-parser/           # PEG grammar playground
```

## Build Requirements

### Rust → WASM
```bash
rustup target add wasm32-unknown-unknown
cargo install wasm-pack
```

### C++ → WASM (macOS)
```bash
brew install emscripten
```

### Compilation Example (PEGTL)
```bash
em++ -std=c++17 -O2 -I./pegtl/include --bind -o parser.js parser.cpp
```

## Next Steps

Based on this research, the recommended projects to build:

### Phase 1: Ship These
1. **WASM Image Compressor** - FFmpeg.wasm is ready, just needs polish
2. **PEG Grammar Playground** - PEGTL harness works, expand to full tool

### Phase 2: Explore
3. **Rust TOTP Generator** - Client-side 2FA codes
4. **Scientific Data Processor** - WASM computation + JS plotting

### Skip
- CSV tools (use PapaParse)
- Full plotting libraries in WASM
- Complex GUI applications

## Sources

- [FFmpeg.wasm GitHub](https://github.com/ffmpegwasm/ffmpeg.wasm)
- [PEGTL GitHub](https://github.com/taocpp/PEGTL)
- [Emscripten Documentation](https://emscripten.org/)
- [ImportCSV: WASM CSV Parser Story](https://www.importcsv.com/blog/wasm-csv-parser-complete-story)
- [Squoosh by Google](https://squoosh.app/)
- [Rust and WebAssembly Book](https://rustwasm.github.io/book/)
