# WASM Conversion Research

Deep implementation research for compiling native libraries to WebAssembly. Documents what works, what doesn't, and provides product opportunities.

**Last Updated:** January 2026
**Status:** 13 conversions completed, 34 active prospects, 18 product ideas

---

## Quick Navigation

### 📊 Overview
- **[EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md)** — Project status, key achievements, patterns

### 🔬 Library Evaluation
- **[PROSPECTS.md](PROSPECTS.md)** — Master historical list (everything evaluated)
- **[ACTIVE_PROSPECTS.md](ACTIVE_PROSPECTS.md)** — What we're pursuing (34 libraries)
- **[ELIMINATED.md](ELIMINATED.md)** — What we rejected and why (83 libraries)
- **[LEARNINGS.md](LEARNINGS.md)** — Technical conversion details
- **[CLAUDE.md](CLAUDE.md)** — Decision tree and workflow

### 💡 Product Ideas
- **[products/](products/)** — 18 product specs (see [products/README.md](products/README.md))
  - 5-star: pixel-forge, freq-sense, asset-hash, thumbhash-edge, sanitize-edge
  - 4-star: wave-shape, math-viz, og-image-edge, readable-edge, minify-edge
  - 3-star and below: Various exploratory ideas

---

## Key Results

### Completed: 13 Successful Conversions

| Library | Performance | Product Use |
|---------|-------------|-------------|
| **DSPFilters** | 13.5x faster | freq-sense, wave-shape |
| **Eigen/nalgebra** | 7.4x faster | math-viz, physics-box |
| **xxHash** | 5.87x faster | asset-hash, content APIs |
| **LZ4** | 6.5 GB/s | compress-kit, archives |
| **blurhash** | 5k dec/sec | thumbhash-edge (upgraded) |

Full list in [EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md)

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
