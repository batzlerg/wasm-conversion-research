# WASM Conversion Research

## Project Purpose

Deep implementation research for compiling native libraries to WebAssembly. Documents what works, what doesn't, and provides a repeatable process for future conversion attempts.

## Key Learnings

### 1. Check for JavaScript Alternatives First

**Before attempting WASM conversion**, search for existing JavaScript libraries that solve the same problem.

| Domain | JS Alternative | Why It's Often Better |
|--------|---------------|----------------------|
| CSV parsing | PapaParse | JS often faster (no boundary overhead) |
| Math expressions | math.js, expr-eval | Mature, well-documented |
| PEG parsing | peggy, nearley, chevrotain | Easier setup, smaller bundle |
| Image compression | Native browser APIs, Squoosh | Already optimized |

**Rule of thumb**: Only use WASM when:
1. No JS alternative exists
2. You're porting existing C++/Rust code
3. Computation is genuinely CPU-bound (not I/O or string manipulation)
4. Performance testing proves WASM is faster

### 2. Pre-built WASM Libraries Are Usually Better

Using someone else's WASM compilation (FFmpeg.wasm, Squoosh codecs) is almost always better than doing it yourself:

- They've solved the hard problems
- Active maintenance and bug fixes
- Community-tested edge cases
- Documentation exists

### 3. WASM Compilation Is Not Free Performance

**Critical insight from ImportCSV's research**:
> "JavaScript remained faster across all file sizes tested"

Why WASM can be slower:
- Memory allocation overhead in WASM
- JS/WASM boundary crossing cost
- Serialization/deserialization overhead
- V8's JIT is very good at optimizing JS

**WASM wins for**: Image encoding, cryptography, physics simulation, compression
**WASM loses for**: String manipulation, CSV parsing, JSON processing

---

## Pre-Conversion Decision Tree

**Use this before attempting any WASM conversion to avoid wasted effort.**

Based on 13 conversion experiments, apply these filters in order:

### 🚫 Stop Immediately If:

1. **Interprets a domain-specific language** (DSL)
   - Examples: jq (115x slower), SQL engines, expression evaluators, template engines
   - Why: Parsing overhead + frequent boundary crossing

2. **Parses text format with V8 native equivalent**
   - Examples: JSON (simdjson 30% slower), CSV, YAML, XML
   - Why: V8's native parsers are compiled C++ without WASM boundary overhead

3. **Performance relies on SIMD instructions**
   - Examples: Libraries requiring AVX2/SSE without scalar fallback
   - Why: WASM SIMD support incomplete, falls back to slow scalar code

4. **Primarily string manipulation**
   - Examples: Text editors, log parsers, regex (when JS RegExp sufficient)
   - Why: UTF-8↔UTF-16 conversion + V8 string optimizations beat WASM

5. **Pre-built WASM exists and is maintained**
   - Examples: tesseract.js, ffmpeg.wasm, opencv.js, duckdb-wasm
   - Why: Use existing solutions, avoid days of dependency wrangling

6. **Target is Cloudflare Workers AND library requires wasm-bindgen**
   - Examples: Rust libraries compiled with wasm-pack (ammonia, etc.)
   - Why: wasm-bindgen uses `__wbindgen_start()` which Workers runtime doesn't support
   - Alternatives: Use workers-rs (full Rust worker) or manual WebAssembly.instantiate()
   - Evidence: ammonia WASM compiled successfully (278 KB) but can't integrate with Workers
   - See: `/experiments/ammonia-wasm/BLOCKERS.md`

### ✅ Proceed If 3+ Are True:

- [ ] **Pure computation** - Math, crypto, compression, DSP (11/13 successes were this)
- [ ] **Binary data processing** - Images, audio, video (no string conversion)
- [ ] **Header-only or single-file** - Easy compilation, low risk
- [ ] **No adequate JS alternative** - Filling a real performance gap
- [ ] **Porting existing C/C++/Rust** - Don't rewrite from scratch

### 📊 Evidence from Experiments:

| Pattern | Success Rate | Avg Speedup | Examples |
|---------|--------------|-------------|----------|
| Pure computation | 11/11 | 7.2x | DSPFilters (13.5x), Eigen (7.4x), xxHash (5.87x) |
| Binary data | 6/6 | 4.5x | blurhash, stb_image, LZ4, Snappy |
| Interpreters/DSL | 0/1 | 0.008x | jq (115x slower) |
| Text parsers | 0/1 | 0.7x | simdjson (30% slower than JSON.parse) |
| Pre-built available | N/A | N/A | tesseract (just use tesseract.js) |

---

## Emscripten Compilation Guide

### Minimum Viable Compilation

```bash
em++ -std=c++17 -O2 \
  -I./library/include \
  --bind \
  -sMODULARIZE \
  -sEXPORT_ES6=1 \
  -fexceptions \
  -o output.js \
  source.cpp
```

### Critical Flags Explained

| Flag | Purpose | Consequence if Missing |
|------|---------|----------------------|
| `--bind` | Enable embind for C++/JS interop | No way to call C++ from JS |
| `-sMODULARIZE` | Export as callable factory function | Can't use ES6 import |
| `-sEXPORT_ES6=1` | ES6 module syntax | Need to use script tags |
| `-fexceptions` | Enable C++ exception handling | **Exceptions become raw pointers!** |

### Exception Handling Is Critical

**Without `-fexceptions`**, C++ exceptions propagate to JavaScript as raw memory addresses:

```javascript
// What you see without -fexceptions:
catch (e) {
    console.log(e); // "85848" - a memory pointer, not an error message!
}

// What you see WITH -fexceptions:
catch (e) {
    console.log(e); // "ERROR: input:1:25: parse error matching tao::pegtl::eof"
}
```

**Cost**: Binary size increases ~30% (136KB → 176KB in our test)

### JavaScript Integration Pattern

```javascript
// Correct pattern for Emscripten ES6 modules
const createModule = (await import('./module.js')).default;
const wasm = await createModule();

// Call exported functions
const result = wasm.myFunction(input);
```

### Error Handling in JavaScript

Always wrap WASM calls in try/catch that handles both proper errors and raw pointers:

```javascript
try {
    const result = wasm.parseExpression(input);
} catch (e) {
    if (typeof e === 'number') {
        // Raw C++ exception pointer - module compiled without -fexceptions
        console.error(`C++ exception (ptr: ${e}) - recompile with -fexceptions`);
    } else {
        console.error(e);
    }
}
```

---

## Research Workflow

### Phase 1: Feasibility Assessment

1. **Search for JS alternatives** - npm, GitHub, awesome-* lists
2. **Check if pre-built WASM exists** - often it does
3. **Evaluate library complexity**:
   - Header-only? ✅ Easy
   - Few dependencies? ⚠️ Moderate
   - System calls, I/O, GUI? ❌ Hard/impossible

### Phase 2: Minimal Compilation Test

1. Clone the library
2. Write minimal C++ wrapper with one function
3. Compile with Emscripten
4. **Test in Node.js first** (faster iteration than browser)
5. Check for errors, especially exceptions

### Phase 3: Browser Integration

1. Create simple HTML test page
2. Test all code paths including errors
3. Verify error messages are useful (not memory pointers)
4. Measure performance vs. JS alternatives

### Phase 4: Decision Point

Ask yourself:
- Is this actually faster than JS?
- Is the binary size acceptable?
- Is the complexity justified?
- Would I recommend this to another developer?

---

## What Works Well for WASM

✅ **Good candidates**:
- Pre-built libraries (FFmpeg.wasm, Squoosh)
- Header-only C++ libraries
- Computational algorithms (not I/O bound)
- Cryptographic operations
- Image/video codecs

❌ **Poor candidates**:
- String-heavy processing (CSV, JSON)
- Libraries with system dependencies
- GUI/rendering libraries
- Anything with good JS alternatives

---

## File Structure

```
experiments/
├── ffmpeg-image-compressor/   # Pre-built WASM wrapper
│   └── Uses @ffmpeg/ffmpeg (someone else's work)
└── pegtl-parser/              # Custom C++ → WASM
    ├── parser.cpp             # C++ source with embind
    ├── parser.js              # Emscripten output (JS glue)
    ├── parser.wasm            # Compiled WASM binary
    ├── test-node.mjs          # Node.js test (faster iteration)
    └── index.html             # Browser test harness

research/
├── rust-csv.md                # Why WASM CSV parsing loses to JS
├── ffmpeg-wasm.md             # Pre-built solution documentation
├── cpp-pegtl.md               # Custom compilation learnings
└── cpp-plotting.md            # Why plotting libs don't work
```

---

## Common Pitfalls

1. **Assuming WASM = faster** - Test it, don't assume
2. **Forgetting `-fexceptions`** - Cryptic errors in production
3. **Wrong module loading** - Use factory function pattern
4. **Not testing error paths** - Invalid input reveals hidden issues
5. **Building what exists** - Always search for alternatives first
6. **Browser-first testing** - Node.js iteration is faster
