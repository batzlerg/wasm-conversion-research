# Product Evaluation Against Market Validation Framework

**Date:** January 6, 2026
**Evaluator:** Kai (Claude Code AI)
**Framework:** Market Validation (Phase 1) → Technical Feasibility (Phase 2)

---

## Summary

**Re-evaluated all remaining products using new market validation criteria.**

**Key Finding:** Most CLI tools and several web apps fail market validation due to:
- Existing best-in-class solutions (fclones, Vercel og-image)
- Commoditized markets with no differentiation
- Lack of novel WASM angle

**Products Worth Building:** 2 of 10 remaining products pass validation.

---

## Evaluation Criteria

### Phase 1: Market Validation (MUST PASS 2+ CRITERIA)

- ✅ **Gap in market** - No adequate solution exists
- ✅ **Novel integration** - WASM enables new use case
- ✅ **Unique UX** - Better workflow or solves pain point differently
- ✅ **Connective tissue** - Combines existing concepts uniquely
- ✅ **Real problem** - Frequently encountered by target users

### Phase 2: Technical Feasibility (Only if Phase 1 passes)

- Pure computation, binary data, no WASM blockers

---

## Phase 4: CLI Tools

### hash-vault ❌ REJECT

**Market Validation:**
- ❌ Best-in-class exists: [fclones](https://github.com/pkolaczk/fclones) (Rust, highly optimized)
- ❌ Commoditized market: fdupes, jdupes, rdfind all exist
- ❌ No differentiation: "CLI duplicate finder" offers nothing new
- ❌ No WASM angle: Pure CLI, WASM adds nothing

**Evidence:**
- fclones: "best-in-class performance," parallel processing, device-aware optimization
- jdupes: 7x faster than fdupes, actively maintained
- Market saturated with mature, optimized tools

**Verdict:** Building a slower, less optimized version of fclones is not viable.

---

### mosaicly ❌ REJECT

**Market Validation:**
- ❌ Best-in-class exists: Built-in `gzip`, `bzip2`, native OS tools
- ❌ Commoditized: LZ4 has official CLI, Snappy has CLI wrappers
- ❌ No novel angle: "compression CLI" is solved problem
- ⚠️ Slight WASM angle: Could showcase WASM compression in browser (but that's not a CLI)

**Existing Solutions:**
- `lz4` official CLI (ultra-fast)
- `zstd` (Facebook, better compression than LZ4)
- Built-in OS tools: `gzip`, `bzip2`, `xz`

**Pivot Potential:**
- **Browser compression playground** - Compare LZ4 vs Snappy vs Zstd in browser
- WASM-powered, visual compression comparison tool
- This would be a **static web app**, not CLI

**Verdict:** Reject as CLI. Consider pivot to browser-based compression comparison tool.

---

## Phase 5: Static Sites

### parser-lab ❌ REJECT

**Market Validation:**
- ❌ Existing validators dominate: JSONLint, SQLFiddle, regex101
- ❌ Domain-specific validators are better than generic tools
- ❌ No novel value: "Multiple validators in one site" is not differentiation
- ❌ No real use case: Built to showcase WASM, not to solve a problem
- ❌ Peggy playground exists: Basic but adequate for grammar development

**CRITICAL UX ISSUE DISCOVERED (led to pivot):**

PEGTL (C++) uses hostile syntax:
```cpp
// PEGTL C++ template syntax
struct string : seq< one< '"' >, star< sor< utf8::not_one< '"', '\\' >,
                     seq< one< '\\' >, any > > >, one< '"' > > {};
```

Peggy (JS) uses friendly syntax:
```javascript
// Peggy familiar PEG syntax
String = '"' chars:Char* '"'
Char = [^"\\] / '\\' .
```

**User Experience Validation FAILED:**
- ❌ User-facing syntax is hostile (C++ templates)
- ❌ JS alternative has better DX (Peggy is easier)
- ❌ WASM doesn't enable new UX (just makes existing playground faster)

**Pivot Attempted:** Switch from PEGTL (C++) to Peggy (JS)

**Market Validation FAILED After Pivot:**
- Existing domain-specific validators are better than generic tool
- JSONLint for JSON, SQLFiddle for SQL, regex101 for regex
- No novel value beyond "combining existing validators"
- No real use case: "came about by researching wasm compilation and looking for projects to show off compiled modules"

**User Decision:** "I don't have a use case... if there's no interesting novel project here, shelve and archive it"

**Verdict:** Reject. Built to showcase technology, not solve real problem. Domain-specific validators dominate.

---

## Phase 3: Image Generation

### og-image-edge ⚠️ EVALUATE CAREFULLY

**Market Validation:**
- ⚠️ Best-in-class exists: [Vercel OG Image](https://vercel.com/docs/functions/edge-functions/og-image-generation)
- ⚠️ Commoditized: Cloudflare has `@cloudflare/pages-plugin-satori`
- ✅ Novel angle: Multi-provider templates (article, product, event, technical, simple)
- ✅ Edge + WASM: Satori (React) + resvg-wasm at edge
- ❌ Differentiation unclear: "Another og-image service"

**Existing Solutions:**
- **Vercel OG Image**: Free, built-in to Vercel, Satori-based
- **Cloudflare Pages Plugin**: Free, works on CF Pages
- **og-image.xyz**: SaaS, template marketplace

**Could Be Novel If:**
- Focus on **template marketplace** (community templates)
- **API-first** (better DX than Vercel's)
- **Offline-first** (download templates, run locally)
- **Advanced features**: Animation (GIF/MP4), A/B testing, analytics

**Current Spec:** Just another og-image service with 5 templates.

**Verdict:** ⚠️ Weak. Either add novel angle (template marketplace, offline-first) or skip.

**Recommendation:** **SKIP for now.** If building, pivot to "og-image template marketplace" with community contributions.

---

## Phase 6: Interactive Web Apps

### imageo (Image Editor) ⚠️ EVALUATE

**Market Validation:**
- ❌ Best-in-class exists: Photopea (free, browser-based, feature-rich)
- ❌ Commoditized: Pixlr, Photoshop Web, Figma, Canva
- ✅ Novel angle (potential): WASM filter showcase (run bleeding-edge image algos)
- ⚠️ Differentiation: "Image editor" is saturated

**Existing Solutions:**
- **Photopea**: Free, full Photoshop clone in browser
- **Pixlr**: Free tier, polished UI
- **Squoosh**: Google, image compression focus

**Could Be Novel If:**
- **WASM filter playground**: Showcase new image algorithms (academic papers → WASM)
- **Developer tool**: Batch processing, API-first, scriptable
- **Educational**: Visualize how filters work (before/after/algorithm)

**Current Spec:** Generic image editor with drag-drop.

**Verdict:** ⚠️ Weak. Pivot to **"WASM Image Algorithm Playground"** (showcase bleeding-edge filters) or skip.

**Recommendation:** **SKIP generic editor.** Consider narrow focus: WASM image filter showcase.

---

### wave-shape (Modular Synthesizer) ✅ APPROVED

**Market Validation:**
- ✅ Gap in market: No great browser-based modular synth exists
- ✅ Novel UX: Web Audio API + WASM DSP modules
- ✅ WASM angle: Custom DSP modules (reverb, distortion) in WASM
- ✅ Real problem: Musicians want accessible modular synthesis
- ✅ Educational: Learn synthesis by patching modules

**Existing Solutions:**
- **VCV Rack**: Desktop only (not browser)
- **Zupiter**: Basic, limited modules
- **Web Audio Modules (WAM)**: Standard exists but no great implementation

**Novel Contributions:**
1. **Browser-based**: No installation, instant access
2. **WASM DSP**: High-quality audio processing (Maximilian, custom algos)
3. **Shareable patches**: URL-encoded patches (like music gear forums)
4. **Educational**: Visual signal flow, learn synthesis

**Verdict:** Build this. Real gap, WASM enables high-quality browser audio.

---

### freq-sense (Audio Training Game) ✅ APPROVED

**Market Validation:**
- ✅ Gap in market: Existing tools are boring or expensive
- ✅ Novel UX: Gamified ear training (like Duolingo for audio)
- ✅ WASM angle: DSP for test tone generation, accurate measurements
- ✅ Real problem: Audio engineers need ear training, existing tools suck
- ✅ Educational: Progressive difficulty, spaced repetition

**Existing Solutions:**
- **Quiztones**: iOS app, $7, basic
- **SoundGym**: Web, subscription ($10-15/mo), gamified but expensive
- **TrainYourEars**: Desktop, $40, not accessible

**Novel Contributions:**
1. **Free & browser-based**: Accessible to students
2. **Gamified progression**: Like Duolingo (daily streaks, levels)
3. **WASM DSP**: Accurate test tone generation
4. **Spaced repetition**: Optimized learning (like Anki)

**Verdict:** Build this. Real gap (free, accessible ear training), WASM enables browser-based DSP.

---

### math-viz (3D Math Visualizations) ⚠️ EVALUATE

**Market Validation:**
- ❌ Best-in-class exists: Desmos, GeoGebra, Wolfram Alpha
- ❌ Commoditized: Many math visualization tools
- ✅ WASM angle: Eigen (C++) for fast matrix math
- ⚠️ Differentiation: "3D math viz" is solved

**Existing Solutions:**
- **GeoGebra**: Free, 3D, feature-rich
- **Desmos**: 2D graphing, excellent UX
- **Wolfram Alpha**: Comprehensive

**Could Be Novel If:**
- **Linear algebra focus**: Visualize transformations, eigenvectors (educational)
- **Interactive tutorials**: "Essence of Linear Algebra" (3Blue1Brown) interactive
- **Fast computation**: WASM Eigen for real-time updates

**Current Spec:** Generic 3D math visualizer.

**Verdict:** ⚠️ Weak. Pivot to **"Interactive Linear Algebra"** (3Blue1Brown-style) or skip.

**Recommendation:** **SKIP generic viz.** Consider narrow focus: linear algebra education.

---

### audiomill (Audio Processing) ❌ REJECT

**Market Validation:**
- ❌ Best-in-class exists: Adobe Podcast (free, AI-powered)
- ❌ Commoditized: Audacity (free, open source), Descript, Riverside
- ❌ No differentiation: "Audio processing" is saturated
- ⚠️ WASM angle: Browser-based processing (but Adobe already does this)

**Existing Solutions:**
- **Adobe Podcast**: Free, AI noise reduction, excellent quality
- **Descript**: Freemium, AI-powered, studio-quality
- **Audacity**: Free, open source, feature-rich

**Verdict:** Reject. Cannot compete with Adobe's free AI tools.

---

### physics-box (Physics Sandbox) ⚠️ EVALUATE

**Market Validation:**
- ❌ Best-in-class exists: PhET simulations (free, excellent)
- ❌ Commoditized: Algodoo, powder game, powder toy
- ✅ WASM angle: Fast physics (Box2D, Bullet) in browser
- ⚠️ Differentiation: "Physics sandbox" is crowded

**Existing Solutions:**
- **PhET Interactive Simulations**: Free, university-backed, excellent
- **Algodoo**: Free, 2D physics, polished
- **Powder Game/Toy**: Free, particle physics, cult following

**Could Be Novel If:**
- **Programmable physics**: Scripting API (like Processing but physics)
- **Educational**: Step-through simulation, visualize forces
- **VR/AR**: Physics in 3D space (WebXR)

**Current Spec:** Generic physics sandbox.

**Verdict:** ⚠️ Weak. Pivot to **"Programmable Physics"** (code + physics) or skip.

**Recommendation:** **SKIP generic sandbox.** PhET dominates education market.

---

### spritify (Pixel Editor) ❌ REJECT

**Market Validation:**
- ❌ Best-in-class exists: Aseprite (paid, $20), Piskel (free, browser)
- ❌ Commoditized: Lospec Pixel Editor, GraphicsGale
- ❌ No differentiation: "Pixel editor" is solved
- ⚠️ WASM angle: Could do WASM dithering algorithms (weak)

**Existing Solutions:**
- **Aseprite**: $20, industry standard, feature-rich
- **Piskel**: Free, browser-based, polished
- **Lospec Pixel Editor**: Free, browser-based

**Verdict:** Reject. Aseprite dominates, free alternatives exist.

---

## Final Product Rankings

### ✅ APPROVED (Build These)

| Product | Type | Novel Angle | Market Gap | WASM Role | Priority |
|---------|------|-------------|------------|-----------|----------|
| **wave-shape** | Static Site | Browser modular synth + WASM DSP | No browser-based VCV Rack | Core (WASM DSP modules) | HIGH |
| **freq-sense** | Static Site | Gamified ear training + WASM DSP | Free ear training sucks | Core (test tone generation) | MEDIUM |

---

### ⚠️ WEAK (Pivot or Skip)

| Product | Issue | Pivot Opportunity |
|---------|-------|------------------|
| **og-image-edge** | Vercel exists | Template marketplace + community |
| **imageo** | Photopea exists | WASM filter algorithm showcase |
| **math-viz** | GeoGebra exists | Interactive linear algebra (3Blue1Brown) |
| **physics-box** | PhET exists | Programmable physics (code + sim) |
| **mosaicly CLI** | Built-in tools exist | Browser compression comparison tool |

---

### ❌ REJECTED (Don't Build)

| Product | Reason |
|---------|--------|
| **hash-vault** | fclones is best-in-class, highly optimized |
| **parser-lab** | Domain-specific validators dominate (JSONLint, SQLFiddle); no real use case |
| **audiomill** | Adobe Podcast (free) beats us |
| **spritify** | Aseprite dominates, Piskel is free |

---

## Recommended Build Order

### Immediate Next Build: wave-shape

**Why:**
1. ✅ Fills real gap (no browser-based modular synth like VCV Rack)
2. ✅ Novel WASM showcase (DSP audio processing in browser)
3. ✅ Validates Astro + WASM + Web Audio API pattern
4. ✅ Educational value (learn synthesis)
5. ✅ High-quality implementation differentiator

**Timeline:** 60-80 hours (BUILD_ORDER.md estimate)

---

### Follow-Up Build:

1. **freq-sense** (ear training) - Real gap, educational value, WASM DSP

**Deferred Pending Pivot:**
- og-image-edge (if adding template marketplace)
- imageo (if pivoting to WASM filter showcase)
- math-viz (if pivoting to linear algebra focus)
- physics-box (if adding programmable API)

---

## Key Learnings

### What We Missed Previously:

1. **Commoditized market risk** - Never evaluated if best-in-class solutions exist
2. **Novel angle requirement** - Didn't ask "what makes this unique?"
3. **Market saturation** - Assumed all problems need solving
4. **USER EXPERIENCE VALIDATION** - Never checked if WASM library has usable syntax

### Critical Failure #1: parser-lab PEGTL Assumption (UX Validation Failure)

**What Happened:**
- Assumed PEGTL (C++ parser) → WASM = viable product
- Never validated that PEGTL syntax is user-friendly
- Never compared to Peggy (JS alternative with better DX)
- Failed to apply "Interprets DSL" rule from WASM decision tree

**Why Decision Tree Failed:**
1. **"WASM for WASM's sake"** - Focused on "can we compile it?" not "should we use it?"
2. **Skipped syntax validation** - Assumed all PEG libraries are equivalent
3. **Ignored JS alternatives** - Never researched Peggy/PEG.js ecosystem
4. **No UX evaluation** - Never asked "will users actually write C++ template syntax?"

**What Should Have Caught This:**
- ❌ Existing rule: "Interprets DSL" (parser-lab IS a DSL tool!)
- ❌ New rule: "No adequate JS alternative" (Peggy exists!)
- ❌ Common sense: "Would I write grammars in C++ template syntax?"

**Fix Applied:**
- ✅ Added **Phase 2: User Experience Validation** to decision tree
- ✅ Check user-facing syntax before technical feasibility
- ✅ Compare JS alternative DX before committing to WASM
- ✅ Ask "what does WASM enable?" before assuming it's needed

---

### Critical Failure #2: parser-lab Market Validation (After Pivot)

**What Happened:**
- Pivoted from PEGTL → Peggy to fix UX issue
- Never validated that generic grammar workbench adds value
- Never compared to existing domain-specific validators
- Assumed "grammar workbench" = novel product
- Built to showcase technology, not solve real problem

**User Feedback:**
> "I don't have a use case this came about by researching wasm compilation and looking for projects to show off compiled modules"

**Why This Matters:**
- No real use case = no users
- Domain-specific validators (JSONLint, SQLFiddle, regex101) dominate
- "Multiple validators in one site" is not differentiation
- Technology showcase ≠ viable product

**Why Decision Tree Failed:**
1. **"Technology looking for problem"** - Inverted priority (built because WASM exists, not because problem exists)
2. **Skipped domain-specific validator research** - Never searched for JSONLint, SQLFiddle equivalents
3. **Assumed generic > specific** - Wrong assumption; domain-specific tools win
4. **No use case validation** - Never asked "who needs this weekly?"

**What Should Have Caught This:**
- ❌ Phase 1 rule: "Who encounters this problem weekly?" (Answer: nobody)
- ❌ Phase 1 rule: "What makes this better than X?" (Answer: nothing)
- ❌ Phase 1 rule: "Gap in market" (No gap - domain validators exist)
- ❌ Common sense: "Do I have a use case for this?" (Answer: no)

**Fix Applied:**
- ✅ Added explicit rejection rule: **"Don't build to showcase technology - build to solve real problems"**
- ✅ New validation question: **"Does a real use case exist, or is this a solution looking for a problem?"**
- ✅ New rule: **"Domain-specific tools beat generic tools"** - check if specialized validators exist
- ✅ Document in CLAUDE.md as critical anti-pattern

**Key Learning:**
> "If the only reason to build is 'because we can compile it to WASM,' don't build it."

### Updated Evaluation Process (3 Phases):

**Phase 1: Market Validation**
1. Search: "[problem] best tool 2026"
2. Ask: "What makes this better than X?"
3. Ask: "Who encounters this problem weekly?"
4. Ask: "What's the novel contribution?"

**Phase 2: User Experience Validation (NEW - CRITICAL)**
5. Check user-facing syntax (is it accessible?)
6. Compare JS alternative DX (is WASM better?)
7. Ask: "What does WASM enable that JS can't do?"

**Phase 3: Technical Feasibility**
8. Check WASM decision tree (compilation feasibility)
9. Verify no WASM blockers (SIMD, text parsing, etc.)

### New Rules:

1. **"If the best answer to 'why build this?' is 'because we can,' don't build it."**
2. **"If WASM makes UX worse, don't use WASM."** (NEW after failure #1)
3. **"Always compare to best-in-class JS alternative before using WASM."** (NEW after failure #1)
4. **"Don't build to showcase technology - build to solve real problems."** (NEW after failure #2)
5. **"Domain-specific tools beat generic tools."** (NEW after failure #2)
6. **"Validate use case exists before building."** (NEW after failure #2)

Build things that are:
- Novel (WASM enables something new)
- Needed (real problem, no great solution)
- Differentiated (not commodity)
- **Usable (good DX, not hostile syntax)** (NEW)
- **Solving real problem (not technology showcase)** (NEW)

---

## Next Actions

1. ✅ Update CLAUDE.md with market validation framework
2. ✅ Document evaluation of all remaining products
3. ✅ Document parser-lab rejection (second market validation failure)
4. ⏭️ Build wave-shape (Phase 6, approved)
5. ⏭️ Build freq-sense (Phase 6, approved)

**Total Viable Products:** 2 of 10 remaining (20% pass rate)

**Products to Skip:** 5 rejected, 3 weak (need pivot)

---

**Conclusion:** Market validation filter is critical. Most products failed not on technical grounds but on market viability. Two critical failures (hash-vault commoditization, parser-lab no use case) reinforced importance of validating problem exists before building. Focus on the 2 approved products that have real gaps, novel angles, and WASM differentiation.
