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

## Challenging Conversions

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

**Insight:** WASM often comparable or smaller than JS for complex algorithms

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

- **Single-file/header-only libraries** - Easy compilation
- **Pure computation** - No I/O, no system calls
- **Batch processing** - Amortize boundary crossing
- **No string manipulation** - Numeric/binary data
- **Existing C/C++/Rust code** - Don't rewrite JS

### Avoid ❌

- **Heavy string processing** - CSV, JSON parsing
- **File I/O** - Needs virtual filesystem
- **Network I/O** - Use browser APIs instead
- **GUI/DOM** - Must go through JS anyway
- **Good JS alternative exists** - Don't reinvent

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
