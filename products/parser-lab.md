# ParserLab

**Type:** Standalone App (Browser)
**Status:** Spec
**Viability:** ⭐⭐⭐

---

## One-Liner

Regex101 for parsers—visual PEG grammar builder with real-time parse tree visualization.

## Problem

Learning to write parsers is difficult. PEG grammars are powerful but abstract. Parser generators are CLI tools with cryptic error messages. No interactive way to build and test grammars—you write rules, compile, run, see errors, repeat.

## Solution

Visual PEG grammar builder:
- Drag-and-drop grammar construction (sequences, choices, repetitions)
- Real-time parse tree visualization
- Test input updates parse tree immediately
- Errors highlight the failing grammar rule
- Library of common patterns (JSON subset, CSV, Markdown, URLs)
- Export to multiple languages (JavaScript, Python, Rust)
- Shareable grammar URLs

## Modules Used

- [PEGTL](../ACTIVE_PROSPECTS.md#pegtl) (176KB) — C++ PEG parser, already converted

## Target Users

- CS students learning compiler/parsing courses
- Language designers prototyping DSLs
- Developers building configuration parsers
- Educators teaching parser theory
- Anyone who found parser generators confusing

## User Flow

1. Start with simple grammar template (or blank)
2. Add rules using visual blocks or text
3. Paste test input in right pane
4. See parse tree update in real-time
5. When errors occur, failing rule highlights
6. Refine grammar based on visual feedback
7. Export to target language when satisfied
8. Share URL with team or for homework

## Core Features

- **Drag-and-drop grammar builder** — Visual rule construction
- **Real-time parse tree** — See structure as you type
- **Error highlighting** — Know exactly which rule failed
- **Pattern library** — Common grammars (JSON, CSV, etc.) as starting points
- **Multi-language export** — Generate parser code for JS/Python/Rust
- **Shareable URLs** — Save and share grammars
- **Tutorial mode** — Learn PEG concepts interactively

## Competitive Landscape

| Tool | Format | Gap |
|------|--------|-----|
| Regex101 | Regular expressions | Huge success, but only regex |
| peggy | PEG (JS) | CLI-based, no visualization |
| nearley | PEG-like | CLI-based, complex setup |
| ANTLR | Parser generator | Java-based, heavyweight |
| Tree-sitter playground | Tree-sitter grammars | Specific to tree-sitter |

## Novel Angle

Regex101 proved that visual, interactive tools make complex topics accessible. ParserLab brings the same "build and see immediately" experience to parser development.

It's particularly valuable for CS students—abstract parser theory becomes tangible when you can drag rules and watch the parse tree form.

## Revenue Model

**Open Source + Optional Pro:**
- Free: Full functionality, limited saves
- Pro ($5/mo): Unlimited saved grammars, private sharing, code export

**Realistic assessment:** Niche audience. Better as open source with GitHub Sponsors.

## Build Complexity

**High** — Estimated 80-120 hours

**Breakdown:**
- Visual grammar editor — 25 hours
- Parse tree visualization — 20 hours
- Error highlighting system — 15 hours
- Pattern library — 10 hours
- Multi-language export — 20 hours
- URL sharing — 8 hours
- Tutorial content — 12 hours
- Testing — 15 hours

## Success Metrics

### If Open Source
- 1,000+ GitHub stars
- Used in CS courses
- Mentioned in compiler textbooks/courses

### If Paid
- 100 Pro subscribers ($500 MRR)

## Next Steps

- [ ] Build basic version (text grammar, simple parse tree)
- [ ] Test with CS students
- [ ] Add visual grammar builder
- [ ] Create 5 example grammars
- [ ] Launch as open source
- [ ] Reach out to compiler course instructors

---

**Last updated:** January 2026
