# Rust CSV → WASM Research

**Date:** 2026-01-05
**Status:** CAUTION ADVISED

## Key Finding: JavaScript May Be Faster

From [ImportCSV's WASM CSV Parser Experience](https://www.importcsv.com/blog/wasm-csv-parser-complete-story):

> "We built a Rust-to-WASM CSV parser expecting to outperform PapaParse, but JavaScript remained faster across all file sizes tested"

### Performance Comparison (ImportCSV findings)

| File Size | PapaParse (JS) | WASM Parser |
|-----------|----------------|-------------|
| 10MB      | 191ms          | 228ms       |
| 60MB      | 1,068ms        | 1,484ms     |
| 122MB     | 2,294ms        | 3,734ms     |

## Critical Challenges

### Memory Allocation
> "The biggest performance killer in WASM isn't computation—it's memory allocation. Every `String::new()` costs more than 100 arithmetic operations."

### Serialization Overhead
- Converting between Rust and JavaScript types proved devastating to speed
- Direct JavaScript array construction was **10x faster** than using serde for data exchange

### Type Conversion Friction
- The boundary between languages created unexpected bottlenecks
- Optimization couldn't fully resolve this fundamental issue

## Optimizations That Helped (But Didn't Win)

1. **Zero-Copy Architecture** — eliminated unnecessary string allocations
2. **Fast Paths** — specialized handling for simple CSVs (no quotes) doubled performance
3. **SIMD Vectorization** — processing 16 bytes simultaneously achieved near-native performance
4. **Memory Pre-allocation** — used lookup tables for character classification

## Why PapaParse Still Dominates

- Zero configuration
- Universal compatibility (browsers, Node.js, React Native, Electron, Workers)
- Production maturity (10+ years, 2,000+ GitHub issues resolved)
- Adequate performance for 95% of use cases (files under 10MB)

## qsv Specifically

**NOT a good WASM candidate** because:
- Heavy dependencies (polars, python bindings, fetch, geocode, luau)
- Many features require native system access
- No existing WASM support documented

## Existing Alternative: czv-wasm

From [czv documentation](https://mueezkhan.com/blog/czv-for-csv-operations):

- **npm**: `bun install czv-wasm`
- **Features**: Row count, column count, basic operations
- **Limitation**: NOT full SQL-like query support

## Recommendation

**SKIP building a WASM CSV tool** unless:
1. You have a specific use case where SIMD WASM provides advantages
2. You need computation that JS genuinely cannot do
3. Privacy requirements mandate zero-JS processing

**Better approach**: Use PapaParse + client-side processing for CSV tools.

## Alternative Projects Worth Pursuing

If privacy-first client-side processing is the goal, focus on:
1. **Image processing** (FFmpeg.wasm) - actual performance advantage
2. **Cryptographic operations** - WASM has clear advantages
3. **Scientific computing** - linear algebra, signal processing

## Sources

- [ImportCSV: WASM CSV Parser Complete Story](https://www.importcsv.com/blog/wasm-csv-parser-complete-story)
- [czv-wasm on npm](https://www.npmjs.com/package/czv-wasm)
- [Rust and WebAssembly Book](https://rustwasm.github.io/book/)
