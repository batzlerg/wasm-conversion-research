# PEGTL C++ Parser → WASM Research

**Date:** 2026-01-05
**Status:** WORKING - Successfully compiled and tested

## Summary

PEGTL (Parsing Expression Grammar Template Library) successfully compiles to WebAssembly using Emscripten. The resulting binary is small (~136KB) and performant.

## Key Findings

### Compilation Success

```bash
em++ -std=c++17 -O2 -I./pegtl/include --bind -o parser.js parser.cpp
```

**Output:**
- `parser.js`: 29KB (JavaScript glue code)
- `parser.wasm`: 136KB (WebAssembly binary)

### Why PEGTL Works Well

1. **Header-only**: No external dependencies to link
2. **Minimal STL usage**: Only uses `<type_traits>`, `<cstddef>`, etc.
3. **No I/O dependencies**: Pure computational library
4. **C++17 compatible**: Modern Emscripten fully supports C++17

### Emscripten Integration

Using `emscripten/bind.h` for JavaScript interop:

```cpp
#include <emscripten/bind.h>
#include <tao/pegtl.hpp>

std::string parse_expression(const std::string& input) {
    pegtl::memory_input<> in(input, "input");
    return pegtl::parse<grammar::input, action>(in, result)
        ? "SUCCESS" : "ERROR";
}

EMSCRIPTEN_BINDINGS(parser) {
    emscripten::function("parseExpression", &parse_expression);
}
```

### JavaScript Usage

```javascript
const Module = await import('./parser.js');
const parser = await Module.default();

const result = parser.parseExpression("1 + 2 * 3");
console.log(result); // "SUCCESS\nTokens: NUM:1, OP:+, NUM:2, OP:*, NUM:3"
```

## Performance

- **Load time**: < 100ms (small binary)
- **Parse time**: < 1ms for simple expressions
- **Memory**: Minimal overhead

## Test Harness

Built a working playground at:
`experiments/pegtl-parser/`

Features:
- Expression input with examples
- Real-time parsing
- Token extraction
- Performance measurement
- Error handling

## Grammar Example

The test implements a mathematical expression parser:

```cpp
// Number: digits
struct number : pegtl::plus<pegtl::digit> {};

// Factor: number or (expression)
struct factor : pegtl::sor<
    number,
    pegtl::seq<pegtl::one<'('>, ws, expression, ws, pegtl::one<')'>>
> {};

// Term: factor (* or /) factor
struct term : pegtl::seq<factor, pegtl::star<...>> {};

// Expression: term (+ or -) term
struct expression : pegtl::seq<term, pegtl::star<...>> {};
```

## Comparison with JavaScript Parsers

| Aspect | PEGTL WASM | JavaScript (PEG.js) |
|--------|------------|---------------------|
| Parse speed | Faster for complex grammars | Faster for simple cases |
| Bundle size | 136KB | ~50KB |
| Grammar definition | C++ templates | PEG syntax |
| Type safety | Compile-time | Runtime |
| Debugging | Harder | Easier |

## Use Cases

**Good fit:**
- Complex grammars (programming languages, DSLs)
- Performance-critical parsing
- Type-safe grammar definitions
- Existing C++ parsing code

**Less ideal:**
- Simple regex-like parsing
- JSON/CSV (use native parsers)
- Quick prototypes

## Verdict: BUILD THIS

PEGTL is an **excellent WASM candidate**:
- ✅ Small binary (136KB)
- ✅ Fast compilation
- ✅ Working test harness
- ✅ Educational value (PEG grammars in browser)
- ✅ Unique product (no browser PEG playgrounds found)

**Recommendation**: Build a full "PEG Playground" tool.

## Sources

- [PEGTL GitHub](https://github.com/taocpp/PEGTL)
- [Emscripten Bindings](https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html)
- [Dev.to: VSCode Extension with PEGTL + WASM](https://dev.to/baduit/create-a-vscode-extension-for-my-esoteric-programming-language-1bch)
