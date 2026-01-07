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

**Products Worth Building:** 3 of 10 remaining products pass validation.

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

### parser-lab ✅ APPROVED

**Market Validation:**
- ✅ Gap in market: Existing tools ([Peggy playground](https://pegjs.org/online)) are basic web forms
- ✅ Novel UX: Interactive workbench vs one-shot test
- ✅ WASM angle: PEGTL (C++) in browser, demonstrates WASM capability
- ✅ Real problem: Developers building parsers need iteration environment
- ✅ Connective tissue: Grammar editor + test runner + parse tree viz + shareable URLs

**What's Missing from Existing Tools:**
- No localStorage persistence (lose work on refresh)
- No grammar library (can't save/load grammars)
- No test case management (manual copy-paste)
- No visual parse tree
- No shareable URLs (can't share grammar + test cases)

**Novel Contributions:**
1. **WASM showcase**: PEGTL (C++ parser) running in browser
2. **Developer workflow**: Save grammars, manage test suites, iterate
3. **Educational**: Visual parse tree helps learn PEG grammars
4. **Shareable**: URL-encoded grammar + tests (like playground.rust-lang.org)

**Verdict:** Build this. Fills real gap, demonstrates WASM + Astro pattern.

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

| Product | Type | Novel Angle | Market Gap | Priority |
|---------|------|-------------|------------|----------|
| **parser-lab** | Static Site | PEGTL WASM + developer workflow | No good grammar workbench | HIGH |
| **wave-shape** | Static Site | Browser modular synth + WASM DSP | No browser-based VCV Rack | HIGH |
| **freq-sense** | Static Site | Gamified ear training + WASM DSP | Free ear training sucks | MEDIUM |

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
| **audiomill** | Adobe Podcast (free) beats us |
| **spritify** | Aseprite dominates, Piskel is free |

---

## Recommended Build Order

### Immediate Next Build: parser-lab

**Why:**
1. ✅ Fills real gap (no good grammar workbench)
2. ✅ Novel WASM showcase (PEGTL C++ in browser)
3. ✅ Validates Astro + WASM pattern (needed for all future web apps)
4. ✅ Educational value (learn PEG grammars)
5. ✅ Fully automatable (minimal UI decisions)

**Timeline:** 40-60 hours (BUILD_ORDER.md estimate)

---

### Follow-Up Builds (In Order):

1. **wave-shape** (modular synth) - Real gap, WASM DSP showcase
2. **freq-sense** (ear training) - Real gap, educational value

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

### Updated Evaluation Process:

**Phase 1: Market Validation (NEW)**
1. Search: "[problem] best tool 2026"
2. Ask: "What makes this better than X?"
3. Ask: "Who encounters this problem weekly?"
4. Ask: "What's the novel contribution?"

**Phase 2: Technical Feasibility**
5. Check WASM decision tree (existing)
6. Verify compilation feasibility

### New Rule:

**"If the best answer to 'why build this?' is 'because we can,' don't build it."**

Build things that are:
- Novel (WASM enables something new)
- Needed (real problem, no great solution)
- Differentiated (not commodity)

---

## Next Actions

1. ✅ Update CLAUDE.md with market validation framework
2. ✅ Document evaluation of all remaining products
3. ⏭️ Build parser-lab (Phase 5, approved)
4. ⏭️ Build wave-shape (Phase 6, approved)
5. ⏭️ Build freq-sense (Phase 6, approved)

**Total Viable Products:** 3 of 10 remaining (30% pass rate)

**Products to Skip:** 4 rejected, 3 weak (need pivot)

---

**Conclusion:** Market validation filter is critical. Most products failed not on technical grounds but on market viability. Focus on the 3 approved products that have real gaps, novel angles, and WASM differentiation.
