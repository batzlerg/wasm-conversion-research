# C++ Plotting Libraries → WASM Research

**Date:** 2026-01-05
**Status:** NOT RECOMMENDED for direct WASM compilation

## Summary

C++ plotting libraries are **not good WASM candidates** due to GUI/rendering dependencies. A better approach is to generate plotting data and use JavaScript rendering.

## Libraries Researched

### Matplotplusplus

**Status:** Experimental WASM support (not ready)

From [GitHub discussion](https://github.com/alandefreitas/matplotplusplus/discussions/43):
> "The current OpenGL backend is still experimental and only works for a few types of plots... After that, creating backends for Qt, Wx, xeus-cling and even WASM should be relatively trivial."

**Issues:**
- Requires gnuplot backend (not available in browser)
- OpenGL backend is experimental
- Heavy dependencies (ImageMagick, etc.)

### cpplot

**Status:** Different architecture - generates JSON for plotly.js

From [cpplot documentation](https://cpplot.readthedocs.io/en/latest/):
> "The library allows you to generate most of the figure types that the plot.ly library is capable of, straight from C++."

**Architecture:**
1. C++ code generates JSON (plotly schema)
2. JSON saved to file
3. Browser viewer (React + plotly.js) renders the JSON

**Key insight:** The rendering happens in JavaScript, not WASM.

## Better Approach: Hybrid Architecture

Instead of compiling plotting libraries to WASM:

```
┌─────────────────────────────────────────────────────┐
│                    Browser                           │
├─────────────────────────────────────────────────────┤
│  JavaScript UI                                       │
│  - File upload                                       │
│  - User input                                        │
│  - chart.js / plotly.js / d3.js rendering           │
├─────────────────────────────────────────────────────┤
│  WASM Module (C++/Rust)                             │
│  - Heavy computation                                 │
│  - Data processing                                   │
│  - Statistical analysis                              │
│  - Returns: JSON plotting data                       │
└─────────────────────────────────────────────────────┘
```

### Example: Scientific Data Processor

Instead of compiling Matplot++ to WASM:

1. **Rust/C++ WASM module**: Parse CSV, compute statistics, FFT, etc.
2. **Output**: JSON with plot configuration
3. **JavaScript**: Render with plotly.js

```javascript
// WASM module provides computation
const result = wasmModule.analyzeData(csvData);
// result = { x: [...], y: [...], type: 'scatter', ... }

// JavaScript renders
Plotly.newPlot('chart', [result]);
```

## Recommended Approach for Scientific Plotter

1. **Computation in WASM** (Rust or C++)
   - CSV parsing
   - Statistical calculations
   - Data transformations
   - Signal processing (FFT, filters)

2. **Rendering in JavaScript**
   - plotly.js (publication quality)
   - chart.js (lightweight)
   - d3.js (custom visualizations)

### Example Libraries to Consider

**For WASM computation:**
- `nalgebra` (Rust) - Linear algebra
- `ndarray` (Rust) - N-dimensional arrays
- `Eigen` (C++) - Numerics (header-only, WASM-friendly)
- `FFTW` alternative - Signal processing

**For JavaScript rendering:**
- plotly.js - Interactive, publication quality
- chart.js - Simple, lightweight
- Vega-Lite - Declarative visualization

## Why Not Compile Full Plotting Libraries

| Challenge | Impact |
|-----------|--------|
| GUI dependencies | Not available in browser |
| File system access | Limited in WASM |
| Font rendering | Complex, platform-specific |
| GPU/OpenGL | WebGL available but complex |
| Binary size | Would be 10s of MB |

## Verdict: DON'T DO THIS

**Skip** direct WASM compilation of C++ plotting libraries.

**Instead**: Build a hybrid system:
- WASM for computation (data processing, statistics)
- JavaScript for rendering (plotly.js, chart.js)

This approach:
- ✅ Smaller WASM binary
- ✅ Leverages mature JS plotting libraries
- ✅ Better browser integration
- ✅ Easier maintenance

## Sources

- [Matplotplusplus GitHub](https://github.com/alandefreitas/matplotplusplus)
- [cpplot Documentation](https://cpplot.readthedocs.io/en/latest/)
- [cpplot Viewer](https://github.com/thclark/cpplot-viewer)
- [plotly.js](https://plotly.com/javascript/)
