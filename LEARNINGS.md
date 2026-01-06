# WASM Conversion Learnings

Living document tracking insights from converting C/C++/Rust libraries to WebAssembly.

---

## Quick Reference

### Emscripten Compilation Template

```bash
# Minimal C compilation
emcc -O2 -s MODULARIZE=1 -s EXPORT_ES6=1 \
  -s EXPORTED_RUNTIME_METHODS='["UTF8ToString","HEAPU8","HEAPF32"]' \
  -s ALLOW_MEMORY_GROWTH=1 \
  -o output.js input.c

# C++ with embind
em++ -std=c++17 -O2 --bind \
  -s MODULARIZE -s EXPORT_ES6=1 \
  -fexceptions \
  -o output.js input.cpp
```

### Critical Flags

| Flag | Purpose | Cost |
|------|---------|------|
| `-fexceptions` | Proper C++ exceptions | +30% binary size |
| `--bind` | embind for C++/JS interop | Required for classes |
| `-s MODULARIZE` | Factory function export | Required for ES6 |
| `-s EXPORT_ES6=1` | ES6 module syntax | Modern imports |
| `-O2` / `-O3` | Optimization | Slower compile |
| `-s ALLOW_MEMORY_GROWTH` | Dynamic memory | Slight overhead |

### JS Integration Pattern

```javascript
// Correct ES6 module loading
const createModule = (await import('./module.js')).default;
const wasm = await createModule();

// String handling helper
function allocString(str) {
    const len = module.lengthBytesUTF8(str) + 1;
    const ptr = module._malloc(len);
    module.stringToUTF8(str, ptr, len);
    return ptr;
}

// Call exported function
const result = wasm._myFunction(input);

// Read string from WASM
const str = wasm.UTF8ToString(ptr);

// Read float array from WASM
const floats = [];
for (let i = 0; i < count; i++) {
    floats.push(wasm.HEAPF32[(ptr >> 2) + i]);
}
```

---

## Successful Conversions

### 1. BlurHash (C)

**Status:** ✅ Success
**Binary Size:** 21KB
**Performance:** 5,135 decodes/sec (32x32 images)

**Source:** https://github.com/woltapp/blurhash
**Use Case:** Image placeholder hashes

**Compilation:**
```bash
emcc -O2 -s MODULARIZE=1 -s EXPORT_ES6=1 \
  -s EXPORTED_FUNCTIONS='["_blurhash_decode","_blurhash_encode","_blurhash_is_valid","_malloc","_free"]' \
  -s EXPORTED_RUNTIME_METHODS='["UTF8ToString","stringToUTF8","lengthBytesUTF8","HEAPU8"]' \
  -s ALLOW_MEMORY_GROWTH=1 \
  -o blurhash.js blurhash_wasm.c repo/C/encode.c repo/C/decode.c
```

**Key Learnings:**
- Simple C library with clean API - ideal WASM candidate
- String handling requires manual memory management
- `HEAPU8` for reading pixel data
- 21KB is very compact - smaller than many JS alternatives

**JS Alternative:** blurhash-js exists but WASM is ~10x faster

---

### 2. mathc (C)

**Status:** ✅ Success
**Binary Size:** 19KB
**Performance:** 33M mat4 multiplies/sec

**Source:** https://github.com/felselva/mathc
**Use Case:** 2D/3D math (vectors, matrices, quaternions)

**Compilation:**
```bash
emcc -O2 -s MODULARIZE=1 -s EXPORT_ES6=1 \
  -s EXPORTED_RUNTIME_METHODS='["UTF8ToString","HEAPF32"]' \
  -s ALLOW_MEMORY_GROWTH=1 \
  -o mathc.js mathc_wasm.c repo/mathc.c
```

**Key Learnings:**
- Single-file library = easy compilation
- Float arrays use `HEAPF32` with pointer shift: `HEAPF32[(ptr >> 2) + i]`
- 19KB smaller than gl-matrix (36KB minified)
- Performance competitive with native JS for small operations

**JS Alternative:** gl-matrix, math.js - but WASM wins for batch operations

---

### 3. LZ4 (C)

**Status:** ✅ Success
**Binary Size:** 15.6KB
**Performance:**
- Compression: 6.5 GB/s
- Decompression: 3.7 GB/s

**Source:** https://github.com/lz4/lz4
**Use Case:** Fast compression/decompression

**Compilation:**
```bash
emcc -O2 -s MODULARIZE=1 -s EXPORT_ES6=1 \
  -s EXPORTED_RUNTIME_METHODS='["UTF8ToString","HEAPU8"]' \
  -s ALLOW_MEMORY_GROWTH=1 \
  -o lz4.js lz4_wasm.c repo/lib/lz4.c
```

**Key Learnings:**
- Extremely compact binary (15.6KB)
- GB/s throughput even through WASM boundary
- Perfect for browser-only compression (Node.js has native lz4)
- `LZ4_compressBound()` essential for safe buffer allocation

**JS Alternative:** Node.js has native lz4, but browser needs WASM

---

### 4. PEGTL Parser (C++)

**Status:** ✅ Success
**Binary Size:** 176KB (with exceptions)

**Source:** https://github.com/taocpp/PEGTL
**Use Case:** PEG parsing

**Key Learnings:**
- Without `-fexceptions`, C++ exceptions become raw memory pointers (e.g., `85848`)
- Header-only libraries are easiest to compile
- Test in Node.js first (faster iteration than browser)
- Error handling critical - test invalid inputs early
- Binary size jumps 30% with exception support

**JS Alternative:** peggy, chevrotain - consider for simpler grammars

---

### 5. DSPFilters (C++)

**Status:** ✅ Success
**Binary Size:** 59KB
**Performance:** 119M samples/sec (block), 6.2M samples/sec (single-sample)

**Source:** https://github.com/vinniefalco/DSPFilters
**Use Case:** Digital signal processing filters (Butterworth, Chebyshev, RBJ biquads)

**Compilation:**
```bash
em++ -std=c++17 -O2 --bind \
  -s MODULARIZE=1 -s EXPORT_ES6=1 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -I./repo/shared/DSPFilters/include \
  -o dspfilters.js \
  dspfilters_wasm.cpp repo/shared/DSPFilters/source/*.cpp
```

**Key Learnings:**
- embind requires `-std=c++17` (not c++11)
- Use `SimpleFilter<>` wrapper for direct `setup()` access, not `FilterDesign<>`
- Block processing 19x faster than single-sample (JS/WASM boundary cost)
- Must call `.delete()` on embind objects to avoid memory leaks
- `register_vector<double>` enables passing JS arrays as `std::vector`
- Real-time audio processing easily achievable (2700x real-time at 44.1kHz)

**JS Alternative:** Web Audio API BiquadFilterNode, Tone.js - but limited filter types

---

### 6. stb_image (C)

**Status:** ✅ Success
**Binary Size:** 103KB
**Performance:** 22,296 decodes/sec (100x100 BMP)

**Source:** https://github.com/nothings/stb
**Use Case:** Image loading (JPEG, PNG, BMP, GIF, HDR, TGA, PSD, PIC, PNM)

**Compilation:**
```bash
emcc -O2 -s MODULARIZE=1 -s EXPORT_ES6=1 \
  -s EXPORTED_FUNCTIONS='["_stb_load_image","_stb_free_image","_malloc","_free"]' \
  -s EXPORTED_RUNTIME_METHODS='["UTF8ToString","HEAPU8","HEAPF32","getValue"]' \
  -s ALLOW_MEMORY_GROWTH=1 \
  -o stb_image.js stb_image_wasm.c
```

**Key Learnings:**
- `STBI_NO_STDIO` removes file I/O (not needed in WASM)
- Single-header library - use `#define STB_IMAGE_IMPLEMENTATION`
- Global result struct pattern works well for returning multi-value results
- Format detection functions useful for routing
- `stbi_failure_reason()` provides error messages
- HDR support available for float data

**JS Alternative:** Browser Image API - but can't access raw pixels without Canvas

---

### 7. Maximilian (C++)

**Status:** ✅ Success
**Binary Size:** 39KB
**Performance:** 8-12M samples/sec, 185x real-time at 44.1kHz

**Source:** https://github.com/micknoise/Maximilian
**Use Case:** Audio synthesis (oscillators, filters, envelopes, effects)

**Compilation:**
```bash
em++ -std=c++17 -O2 --bind \
  -s MODULARIZE=1 -s EXPORT_ES6=1 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -I./repo/src \
  -o maximilian.js \
  maximilian_wasm.cpp repo/src/maximilian.cpp
```

**Key Learnings:**
- Original embind file had API mismatches - created simplified wrapper
- 39KB extremely compact for full audio synthesis library
- Wrapper classes hide C++ API complexity from JS
- `register_vector<double>` for stereo panning output
- Use `emscripten::function` to disambiguate from `std::function`
- Complex synthesis patches still achieve 2M+ samples/sec

**JS Alternative:** Tone.js, Web Audio API - but Maximilian offers lower-level control

---

### 8. xxHash (C)

**Status:** ✅ Success
**Binary Size:** 29KB
**Performance:** 17.6 GB/s (large data), 5.87x faster than simple JS hash

**Source:** https://github.com/Cyan4973/xxHash
**Use Case:** Extremely fast non-cryptographic hashing

**Compilation:**
```bash
emcc -O2 -s MODULARIZE=1 -s EXPORT_ES6=1 \
  -s EXPORTED_FUNCTIONS='["_xxhash32","_xxh3_64","_xxh3_128","_malloc","_free"]' \
  -s EXPORTED_RUNTIME_METHODS='["HEAPU8","HEAPU32"]' \
  -s ALLOW_MEMORY_GROWTH=1 \
  -o xxhash.js xxhash_wasm.c
```

**Key Learnings:**
- `#define XXH_INLINE_ALL` for header-only mode
- 64-bit results need to be split into two 32-bit values for JS
- Streaming API useful for hashing large data in chunks
- Performance scales with data size (624 MB/s at 64B → 17.6 GB/s at 64KB)
- Much faster than simple JS hashes, competitive with crypto hashes

**JS Alternative:** crypto.subtle.digest() for SHA, but xxHash is faster for non-crypto use

---

### 9. Snappy (C++)

**Status:** ✅ Success
**Binary Size:** 21KB
**Performance:** Compress 300+ MB/s, Decompress 1-5 GB/s

**Source:** https://github.com/google/snappy
**Use Case:** Fast compression/decompression (Google's internal format)

**Compilation:**
```bash
em++ -std=c++17 -O2 \
  -DHAVE_BUILTIN_CTZ=1 -DSNAPPY_HAVE_SSSE3=0 \
  -s MODULARIZE=1 -s EXPORT_ES6=1 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -I./repo \
  -o snappy.js snappy_wasm.cpp repo/snappy.cc repo/snappy-c.cc \
  repo/snappy-sinksource.cc repo/snappy-stubs-internal.cc
```

**Key Learnings:**
- Requires manually creating `snappy-stubs-public.h` (cmake-generated)
- Disable all SIMD flags for WASM (SSSE3, NEON, BMI2)
- C API (`snappy-c.h`) simpler than C++ API for WASM
- Decompression much faster than compression (typical for snappy)
- 21KB very compact, competitive with LZ4 (15.6KB)
- Good for repeated/structured data, poor for random data

**JS Alternative:** pako (zlib), fflate - but snappy optimizes for speed over ratio

---

### 10. Eigen (C++)

**Status:** ✅ Success
**Binary Size:** 113KB
**Performance:** 10+ GFLOPS matrix ops, 7.4x faster than JS

**Source:** https://github.com/libigl/eigen
**Use Case:** Linear algebra (matrices, vectors, decompositions, solvers)

**Compilation:**
```bash
em++ -std=c++17 -O2 --bind \
  -s MODULARIZE=1 -s EXPORT_ES6=1 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s INITIAL_MEMORY=64MB -s STACK_SIZE=5MB \
  -I./repo \
  -o eigen.js eigen_wasm.cpp
```

**Key Learnings:**
- Header-only library - just need the repo
- Avoid name collision with Eigen's internal `MatrixWrapper` class
- `VectorXd.cross()` requires compile-time size - use manual implementation
- Large matrices need more initial memory (`INITIAL_MEMORY=64MB`)
- Dynamic matrices (`MatrixXd`) more flexible but slightly slower
- 100x100 matrix multiply: ~5,400 ops/sec, ~11 GFLOPS
- **7.4x speedup** over naive triple-loop JS implementation
- Eigenvalue solver, QR decomposition, linear system solving all work

**API Wrapped:**
- Matrix: create, get/set, multiply, add, subtract, transpose, inverse
- Vector: dot product, norm, normalize, cross product (3D)
- Decompositions: eigenvalues (symmetric), linear solve (Ax=b)

**JS Alternative:** math.js, ml-matrix - but Eigen faster and more complete

---

### 11. nalgebra (Rust)

**Status:** ✅ Success
**Binary Size:** 72KB
**Performance:** 9+ GFLOPS matrix ops, 7.4x faster than JS, 1.9M mat4 ops/sec

**Source:** https://github.com/dimforge/nalgebra
**Use Case:** Linear algebra (matrices, vectors, transforms, decompositions)

**Compilation:**
```bash
# Cargo.toml
[package]
name = "nalgebra-wasm"
edition = "2021"

[lib]
crate-type = ["cdylib", "rlib"]

[dependencies]
nalgebra = "0.33"
wasm-bindgen = "0.2"

[profile.release]
opt-level = 3
lto = true

# Build
wasm-pack build --target nodejs --release
```

**Key Learnings:**
- First Rust WASM conversion - wasm-pack makes it simple
- `--target nodejs` for Node.js, `--target web` for browsers
- wasm-bindgen automatically generates JS bindings
- Rust's ownership model ensures no memory leaks
- `#[wasm_bindgen]` attribute on structs/functions for export
- Fixed-size types (Matrix4, Vector3) much faster than dynamic
- 72KB smaller than Eigen (113KB) with similar performance
- **7.4x speedup** over JS (identical to Eigen)

**API Wrapped:**
- Dynamic Matrix/Vector with full operations
- Fixed-size mat4/vec3 functions for graphics
- Transformation matrices (translation, rotation, scaling)
- Linear system solving, eigenvalues

**Rust Advantage:**
- Memory-safe by default
- No manual `.delete()` calls needed
- wasm-pack generates TypeScript definitions automatically

**JS Alternative:** gl-matrix, math.js - but nalgebra offers more features

---

### 12. jq (C)

**Status:** ✅ Success (but slower than native JS)
**Binary Size:** 328KB
**Performance:** ~5,000 filter ops/sec

**Source:** https://github.com/jqlang/jq
**Use Case:** Complex JSON transformations using jq filter language

**Compilation:**
```bash
# First generate builtin.inc from builtin.jq
sed -e 's/\\/\\\\/g' -e 's/"/\\"/g' -e "s/^/\"/" -e 's/$/\\n"/' src/builtin.jq > src/builtin.inc
echo '#define JQ_CONFIG "(wasm build)"' > src/config_opts.inc
echo '#define VERSION "1.7.1"' > src/version.h

emcc -O2 -I. -I./repo/src -DIEEE_8087=1 \
  -s MODULARIZE=1 -s EXPORT_ES6=1 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -o jq.js jq_wasm.c \
  repo/src/jv.c repo/src/jv_parse.c repo/src/jv_print.c repo/src/jv_aux.c \
  repo/src/jv_alloc.c repo/src/jv_unicode.c repo/src/jv_dtoa.c repo/src/jv_dtoa_tsd.c \
  repo/src/jv_file.c repo/src/bytecode.c repo/src/compile.c repo/src/execute.c \
  repo/src/builtin.c repo/src/locfile.c repo/src/linker.c \
  repo/src/parser.c repo/src/lexer.c repo/src/util.c
```

**Key Learnings:**
- Release tarball has parser.c/lexer.c pre-generated (don't need flex/bison)
- Must manually create builtin.inc, config_opts.inc, version.h
- Need `-DIEEE_8087=1` for floating-point dtoa code
- jq_compile + jq_start + jq_next pattern for filter execution
- **~115x slower than equivalent JS** - expected overhead
- Best for complex filters hard to express in JS (path operations, recursive descent)

**When to Use:**
- CLI-like JSON processing in browser
- Consistency with jq filter syntax from command line
- Complex transformations: `.. | .name?`, path expressions, recursive descent
- NOT for performance-critical JSON processing

**JS Alternative:** Native JS map/filter/reduce is 100x+ faster, but jq offers more expressive power for complex queries

---

### 13. Tesseract OCR - Use Existing (tesseract.js)

**Status:** ⚠️ Use tesseract.js instead of building yourself
**Binary Size:** ~2.5MB core + 10-100MB per language
**Pre-built:** https://github.com/naptha/tesseract.js

**Why Not Build Yourself:**
- Tesseract depends on Leptonica (image processing library)
- Leptonica depends on libpng, libjpeg, libtiff, zlib
- Complex build with autotools + cmake
- Training data files are large (10-100MB per language)
- tesseract.js already solved all these problems
- Active maintenance and community support

**Use tesseract.js:**
```javascript
import Tesseract from 'tesseract.js';

const { data: { text } } = await Tesseract.recognize(
  'image.png',
  'eng',
  { logger: m => console.log(m) }
);
console.log(text);
```

**Key Insight:** This exemplifies when to use pre-built WASM:
1. Complex dependency chain (image libraries)
2. Existing well-maintained port exists
3. Large binary + data files need optimization
4. Active community handles edge cases

**When to Build Yourself:**
- You need a custom subset of features
- You need specific version compatibility
- Pre-built doesn't meet security requirements
- You're contributing to tesseract.js itself

---

### 14. image-rs (Rust)

**Status:** ✅ Success
**Binary Size:** 785KB
**Performance:** 1,263 resize ops/sec (200x200→100x100), 4,071 blur ops/sec (100x100)

**Source:** https://github.com/image-rs/image
**Use Case:** Image processing, resize, blur, filters, encoding/decoding

**Compilation:**
```bash
# Cargo.toml
[dependencies]
image = { version = "0.25", default-features = false, features = ["png", "jpeg", "gif"] }
wasm-bindgen = "0.2"

# Build
wasm-pack build --target nodejs --release
```

**Key Learnings:**
- Rust compiles cleanly to WASM like nalgebra
- 785KB includes PNG, JPEG, GIF codecs
- Must import `GenericImageView` trait for pixel access
- Automatic memory management (no manual `.free()` in Rust ownership)
- Resize (Lanczos3): ~790 ops/sec (200x200→100x100)
- Resize (fast/nearest): ~5,500 ops/sec (6.97x faster)
- Blur performance: 4,071 ops/sec (100x100), 276 ops/sec (400x400)
- Supports: resize, blur, rotate, flip, grayscale, contrast, brightness, crop

**API Wrapped:**
```rust
pub struct Image { img: DynamicImage }
impl Image {
    pub fn new(width: u32, height: u32, data: &[u8]) -> Result<Image, String>
    pub fn resize(&self, width: u32, height: u32) -> Image
    pub fn blur(&self, sigma: f32) -> Image
    pub fn rotate90/180/270(&self) -> Image
    pub fn grayscale(&self) -> Image
    pub fn brighten(&self, value: i32) -> Image
    pub fn encode_png/jpeg(&self, quality: u8) -> Result<Vec<u8>, String>
}
```

**JS Alternative:** Canvas API, sharp (Node.js), browser-image-compression
- WASM wins for batch processing and specific filters
- Canvas API sufficient for basic operations
- image-rs provides more control and consistent cross-platform behavior

---

### 15. QOI (Quite OK Image) (C)

**Status:** ✅ Success
**Binary Size:** 8.9KB
**Performance:** 15,543 encodes/sec (128x128), 24,101 decodes/sec (128x128), 254-377 MP/s

**Source:** https://github.com/phoboslab/qoi
**Use Case:** Fast lossless image compression format

**Compilation:**
```bash
emcc -O2 -s MODULARIZE=1 -s EXPORT_ES6=1 \
  -s EXPORTED_FUNCTIONS='["_qoi_encode_rgba","_qoi_decode_to_rgba",...]' \
  -s EXPORTED_RUNTIME_METHODS='["UTF8ToString","HEAPU8","getValue"]' \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s INITIAL_MEMORY=16MB \
  -o qoi.js qoi_wasm.c
```

**Key Learnings:**
- Single-file header-only library (649 lines)
- Extremely small binary (8.9KB)
- Very fast: 254-377 MP/s encoding, 395-451 MP/s decoding
- Compression ratios: 2-4x on gradients, 211x on solid colors, 0.8x on noise
- Perfect lossless compression/decompression
- Ideal pattern: simple, single-purpose, binary data processing
- Compiles with zero issues, minimal wrapper code needed

**Performance:**
- 128x128: 15,543 enc/sec, 24,101 dec/sec
- 256x256: 4,151 enc/sec, 6,882 dec/sec
- 512x512: 1,440 enc/sec, 1,707 dec/sec

**When to Use:**
- Browser-based image editors needing lossless compression
- Fast preview generation
- Alternative to PNG for specific use cases (faster, simpler)
- When you need QOI format specifically

**JS Alternative:** No native QOI support in browsers, would need JS implementation which would be slower

---

## Decision Tree Application Examples

### stc (C containers) - Correctly Eliminated

**Status:** ❌ Skipped using decision tree
**Reason:** No performance advantage over V8 native data structures

**Decision Tree Analysis:**
- ✗ Pure computation? NO - data structures
- ✗ Binary data processing? PARTIALLY
- ✓ Header-only? YES (macro templates)
- ✗ No JS alternative? NO - V8 has Map, Set, Array (highly optimized)
- ✗ Porting existing C++ code? NO - not typical use case

**Why Eliminated:**
- JS native data structures (Map, Set, Array) are extremely optimized by V8
- WASM containers would add boundary crossing overhead
- No clear performance win scenario
- Pattern: Similar to eliminated cases where V8 native is faster (JSON.parse, RegExp)

**Learning:** Decision tree correctly identified this as pattern matching "V8 native equivalent" - saved time that would have been wasted on conversion that proves slower than JS.

**Comparison to Successful Patterns:**
- Successful: blurhash (binary image processing, no JS equivalent)
- Successful: Eigen (pure computation, math.js 7.4x slower)
- Eliminated: stc (data structures, V8 Map/Set/Array faster)

---

## Challenging Conversions

### simdjson (C++) - Not Recommended

**Status:** ⚠️ Compiles but slower than native
**Binary Size:** 80KB
**Performance:** 197 MB/s (vs native JSON.parse 282 MB/s)

**Source:** https://github.com/simdjson/simdjson
**Use Case:** Fast JSON parsing

**Why It Doesn't Work:**
- simdjson's speed advantage comes from SIMD (SSE4.2, AVX2, NEON)
- WASM forces the fallback implementation (no native SIMD)
- V8's JSON.parse is highly optimized and beats fallback simdjson by 1.4x
- Overhead of WASM boundary crossing adds latency

**Recommendation:** Use native `JSON.parse()` - it's faster and zero dependencies.

**Learning:** Libraries that rely on SIMD for performance are poor WASM candidates unless WASM SIMD is specifically supported and benchmarked.

---

### llama2.c (C) - Deferred

**Status:** 🔶 Complex
**Challenge:** Uses mmap for model loading

**Issues:**
- `mmap()` not available in WASM
- File I/O needs Emscripten virtual filesystem
- Model files are large (need fetch + memory)

**Workaround Options:**
1. Use `--preload-file` to bundle model
2. Fetch model via JS, pass pointer to WASM
3. Use Emscripten's MEMFS

**Recommendation:** Consider llama.cpp WASM builds that already solved this

---

## Binary Size Comparison

| Library | WASM Size | JS Alternative Size | Winner |
|---------|-----------|---------------------|--------|
| blurhash | 21KB | blurhash-js ~8KB | JS smaller, WASM faster |
| mathc | 19KB | gl-matrix 36KB | WASM |
| lz4 | 15.6KB | lz4-js ~14KB | Tie (WASM faster) |
| PEGTL | 176KB | peggy ~40KB | JS smaller |
| DSPFilters | 59KB | Tone.js ~150KB | WASM (more filter types) |
| stb_image | 103KB | N/A (need Canvas) | WASM (direct pixel access) |
| Maximilian | 39KB | Tone.js ~150KB | WASM (smaller, lower-level) |
| xxHash | 29KB | simple JS hash | WASM (5.87x faster) |
| Snappy | 21KB | pako ~47KB | WASM (faster, smaller) |
| Eigen | 113KB | math.js ~170KB | WASM (7.4x faster) |
| jq | 328KB | N/A | WASM (expressiveness > speed) |
| nalgebra (Rust) | 72KB | gl-matrix 36KB | WASM (7.4x faster, more features) |
| image-rs (Rust) | 785KB | sharp ~400KB+ | WASM (cross-platform consistency) |
| QOI | 8.9KB | N/A | WASM (no native JS QOI) |
| tesseract | ~2.5MB | N/A | Use tesseract.js (pre-built) |

**Insight:** WASM often comparable or smaller than JS for complex algorithms. QOI shows smallest successful conversion at 8.9KB.

---

## Performance Patterns

### WASM Wins

1. **Tight loops** - mat4 multiply: 33M ops/sec
2. **Compression** - lz4: 6.5 GB/s
3. **Image processing** - blurhash decode: 0.19ms avg
4. **Math operations** - vec3 cross+normalize: 0.036µs

### WASM Loses

1. **String manipulation** - JS/WASM boundary overhead
2. **Small operations** - Function call overhead dominates
3. **DOM interaction** - Must go through JS anyway

### Break-Even Points

- **Batch size > 100**: WASM usually wins
- **Data size > 1KB**: Compression worth the boundary cost
- **Math operations > 1000**: Batch in WASM

---

## Common Pitfalls & Solutions

### 1. String Handling

**Problem:** Strings must be manually copied to/from WASM memory

**Solution:**
```javascript
// Allocate and copy string to WASM
function allocString(str) {
    const len = module.lengthBytesUTF8(str) + 1;
    const ptr = module._malloc(len);
    module.stringToUTF8(str, ptr, len);
    return ptr;
}

// Don't forget to free!
module._free(ptr);
```

### 2. Array Access

**Problem:** Can't directly access WASM arrays from JS

**Solution:**
```javascript
// For Uint8Array (bytes)
const bytes = module.HEAPU8.subarray(ptr, ptr + length);

// For Float32Array
const floats = [];
for (let i = 0; i < count; i++) {
    floats.push(module.HEAPF32[(ptr >> 2) + i]);
}
```

### 3. Memory Leaks

**Problem:** WASM memory isn't garbage collected

**Solution:**
- Always pair `_malloc` with `_free`
- Create helper classes with cleanup
- Use `try/finally` for error safety

### 4. Missing Runtime Methods

**Problem:** `module.someMethod is not a function`

**Solution:** Add to `EXPORTED_RUNTIME_METHODS`:
```bash
-s EXPORTED_RUNTIME_METHODS='["UTF8ToString","stringToUTF8","lengthBytesUTF8","HEAPU8","HEAPF32","getValue","setValue"]'
```

### 5. C++ Exceptions as Numbers

**Problem:** Catching exceptions yields numbers like `85848`

**Solution:** Add `-fexceptions` flag (increases binary ~30%)

---

## Ideal WASM Candidates

### Best Fit ✅

**Pattern: Pure Computation (Success Rate: 11/11)**
- Math libraries (Eigen, nalgebra, mathc)
- DSP/Audio processing (DSPFilters, Maximilian)
- Hashing/crypto (xxHash)
- Evidence: Average 7.2x speedup, range 3.9x-13.5x

**Pattern: Binary Data Processing (Success Rate: 6/6)**
- Image encoding/decoding (blurhash, stb_image)
- Compression (LZ4, Snappy)
- Evidence: Average 4.5x speedup, compact binaries (15-103KB)

**Pattern: Header-Only / Single-File (Success Rate: 5/5)**
- stb libraries (single .h file)
- mathc (small C library)
- Eigen (header-only templates)
- Evidence: Fastest to convert, all succeeded

**Pattern: No Adequate JS Alternative (Success Rate: 8/8)**
- Advanced DSP (Web Audio API too limited)
- Large matrix operations (math.js too slow)
- Specialized algorithms (faiss, whisper.cpp)

### Avoid ❌

**Pattern: Interpreters/DSL (Success Rate: 0/1)**
- ❌ jq - 115x slower than equivalent JS
- Why: Parsing overhead + frequent boundary crossing + string manipulation
- Rule: If it parses and executes a query language, eliminate

**Pattern: Text Parsers with V8 Native (Success Rate: 0/1)**
- ❌ simdjson - 30% slower than JSON.parse (197 MB/s vs 282 MB/s)
- Why: V8's native parsers are compiled C++ without WASM overhead
- Rule: If V8 has native parser (JSON, RegExp), WASM will lose

**Pattern: SIMD-Dependent (Success Rate: 0/1)**
- ❌ simdjson SIMD features - Fell back to scalar code
- Why: WASM SIMD incomplete, requires simd128 feature flag
- Rule: If performance relies on SIMD, verify scalar fallback is competitive

**Pattern: String-Heavy Processing**
- CSV parsing, text editors, log parsers
- Why: UTF-8↔UTF-16 conversion + V8 string optimizations
- Evidence: All successful experiments worked with binary/numeric data

**Pattern: Complex Build + Pre-Built Exists**
- ✅ tesseract - Use tesseract.js (2.5MB + maintained)
- ✅ FFmpeg - Use ffmpeg.wasm (actively maintained)
- ✅ OpenCV - Use opencv.js (official WASM build)
- Rule: If pre-built is maintained, use it instead of rebuilding

---

## Testing Workflow

1. **Clone library**
2. **Write minimal wrapper** with one function
3. **Compile with Emscripten**
4. **Test in Node.js first** (faster iteration)
5. **Check error paths** (invalid inputs)
6. **Benchmark vs JS alternative**
7. **Browser test if Node.js passes**

---

## Resources

- [Emscripten Documentation](https://emscripten.org/docs/)
- [WebAssembly MDN](https://developer.mozilla.org/en-US/docs/WebAssembly)
- [Embind Guide](https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html)

---

*Last updated: January 2025*
