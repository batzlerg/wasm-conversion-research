# Ammonia WASM Conversion - Integration Blockers

**Date:** 2026-01-06
**Status:** ⛔ **Blocked - Cloudflare Workers incompatibility**
**Original Goal:** Replace isomorphic-dompurify in sanitize-edge worker

---

## What Was Built

### ✅ Successful WASM Compilation

**Rust Library:** `/experiments/ammonia-wasm/`

**Functions Implemented:**
```rust
pub fn clean(html: &str) -> String
pub fn clean_with_tags(html: &str, allowed_tags: Vec<String>) -> String
pub fn is_safe(html: &str) -> bool
```

**Test Results:**
- ✅ All 3 Rust tests passing
- ✅ Compiles to WASM successfully
- ✅ Size: 676 KB raw, 278 KB gzipped

**Dependencies:**
- `ammonia = "4.0"` - Rust HTML sanitizer
- `wasm-bindgen = "0.2"` - WebAssembly bindings

---

## 🚫 Integration Blocker

### Issue: wasm-bindgen Incompatible with Cloudflare Workers

**Error:**
```
Uncaught TypeError: wasm2.__wbindgen_start is not a function
  at ammonia_wasm.js:5:6
```

**Root Cause:**

wasm-bindgen generates initialization code that calls `__wbindgen_start()`, which is **not supported** in Cloudflare Workers runtime.

**Generated code (ammonia_wasm.js):**
```javascript
import * as wasm from "./ammonia_wasm_bg.wasm";
export * from "./ammonia_wasm_bg.js";
import { __wbg_set_wasm } from "./ammonia_wasm_bg.js";
__wbg_set_wasm(wasm);
wasm.__wbindgen_start();  // ❌ This fails in Workers
```

**Attempted Targets:**
- `wasm-pack build --target bundler` ❌
- `wasm-pack build --target web` ❌
- `wasm-pack build --target nodejs` ❌

All generate code with `__wbindgen_start()`.

---

## Alternative Approaches (Not Pursued)

### 1. Cloudflare workers-rs

Write the entire worker in Rust, compile to WASM.

**Pros:**
- Native Workers compatibility
- Full Rust ecosystem

**Cons:**
- Complete rewrite of sanitize-edge
- Different deployment workflow
- More complex debugging

**Decision:** Out of scope - goal was WASM conversion of ammonia only, not full Rust worker.

---

### 2. Manual WebAssembly.instantiate()

Write custom JavaScript glue code instead of using wasm-bindgen.

**Pros:**
- Full control over initialization
- No wasm-bindgen runtime

**Cons:**
- Significant manual work
- Must handle memory management manually
- Error-prone

**Decision:** Too low-level for this use case.

---

### 3. Use Pre-existing ammonia-wasm (Deno)

Found: https://github.com/lucacasonato/ammonia-wasm

**Pros:**
- Already exists
- Maintained

**Cons:**
- **Deno-only** (not npm-compatible)
- Still uses wasm-bindgen (same blocker)
- Doesn't solve the problem

**Decision:** Same integration issue.

---

## Why This Matters for WASM Decision Tree

### New Stop Criterion

**Add to decision tree:**

> ❌ **Stop if:** Library requires wasm-bindgen AND target is Cloudflare Workers
>
> **Reason:** wasm-bindgen uses `__wbindgen_start()` which Workers runtime doesn't support. Must use workers-rs (full Rust worker) or manual WASM instantiation.

### Supported WASM Bindings for Cloudflare Workers

| Binding Method | Workers Compatible | Notes |
|----------------|-------------------|-------|
| wasm-bindgen | ❌ No | Uses `__wbindgen_start()` |
| workers-rs | ✅ Yes | Full Rust worker framework |
| Manual WebAssembly.instantiate() | ✅ Yes | Requires custom glue code |
| wasm-pack (any target) | ❌ No | All targets use wasm-bindgen |

---

## Learnings

### What Worked

1. **Rust → WASM compilation:** Straightforward with wasm-bindgen
2. **Library wrapping:** Clean API surface with 3 functions
3. **Testing:** Standard Rust tests work perfectly
4. **Size optimization:** `opt-level = "z"` + LTO produces reasonable 278 KB gzipped

### What Didn't Work

1. **Workers integration:** wasm-bindgen output incompatible
2. **Target switching:** No wasm-pack target avoids `__wbindgen_start()`
3. **Drop-in replacement:** Can't replace DOMPurify without rewriting worker

---

## Original Problem Recap

**sanitize-edge deployment error:**
```
import_isomorphic_dompurify.default.sanitize is not a function
```

**Root cause:** DOMPurify requires DOM APIs (browser environment), which Workers doesn't provide.

**Attempted solution:** Replace with ammonia WASM
**Result:** ⛔ Blocked by wasm-bindgen incompatibility

---

## Recommended Path Forward

### Option A: Use Alternative Library (Non-WASM)

Find a Workers-compatible sanitization library that doesn't require DOM or wasm-bindgen.

**Caveat:** Goes against requirement of "only WASM conversions I've actually worked on."

### Option B: Full Rust Worker (workers-rs)

Rewrite sanitize-edge entirely in Rust using workers-rs framework.

**Estimated effort:** 4-6 hours
**Value:** Learn workers-rs, get native Rust performance
**Alignment:** Counts as WASM conversion work

### Option C: Shelve sanitize-edge

Mark as blocked, focus on other workers.

**Status quo:** 3/5 workers functional, 2/5 blocked

---

## Files Created

```
experiments/ammonia-wasm/
├── Cargo.toml           # Rust project config
├── src/
│   └── lib.rs          # WASM bindings (278 KB gzipped)
├── pkg/                # Generated WASM output
│   ├── ammonia_wasm_bg.wasm
│   ├── ammonia_wasm.js
│   └── ...
└── BLOCKERS.md         # This file
```

---

## Decision

**Status:** ⛔ **SHELVED**

Blocking issue documented. Not pursuing further without commitment to:
1. Full workers-rs rewrite, OR
2. Manual WebAssembly glue code

**Reason:** Integration complexity exceeds value for sanitize-edge specifically. Better to focus on other products where WASM integration is proven (thumbhash-edge, minify-edge, webhook-edge all working).

---

**Last Updated:** 2026-01-06
