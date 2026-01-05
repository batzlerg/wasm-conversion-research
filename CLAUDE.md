# WASM Conversion Research

## Project Purpose

Deep implementation research for compiling native libraries to WebAssembly. This is exploratory research to determine feasibility of various WASM conversion projects.

## Key Constraints

- **Privacy-first**: All processing must be client-side (no data upload)
- **Weekend-shippable**: Target simple MVPs that can ship in 2-3 days
- **Documentation**: Record all findings, successes, and failures

## Tech Stack

- **Rust → WASM**: wasm-pack, wasm-bindgen
- **C/C++ → WASM**: Emscripten SDK
- **Frontend**: Astro (when building demos)
- **Package Manager**: bun (never npm/yarn/pnpm)

## Research Methodology

1. Find source repository
2. Check existing WASM support/attempts
3. Identify dependencies and complexity
4. Attempt minimal compilation
5. Document blockers and solutions
6. Build test harness if successful

## Priority Order

1. Rust projects (better WASM tooling)
2. C++ header-only libraries (simpler compilation)
3. C++ with dependencies (most complex)
