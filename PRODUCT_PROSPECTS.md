# WASM Product Prospects

Deep analysis of product opportunities leveraging our 13 successful WASM conversions. Focus: usefulness, novelty, and buildability—not timeline.

**Last Updated:** January 2025

---

## Available Modules Summary

| Module | Size | Performance | Core Capability |
|--------|------|-------------|-----------------|
| **blurhash** | 21KB | 5,135 decodes/sec | Image placeholder hashes |
| **mathc** | 19KB | 33M mat4 ops/sec | 2D/3D vector/matrix math |
| **LZ4** | 15.6KB | 6.5 GB/s | Ultra-fast compression |
| **PEGTL** | 176KB | - | PEG parser generator |
| **DSPFilters** | 59KB | 119M samples/sec | Audio filters (Butterworth, Chebyshev, biquads) |
| **stb_image** | 103KB | 22k decodes/sec | Image decoding (JPEG/PNG/BMP/GIF/HDR/TGA/PSD) |
| **Maximilian** | 39KB | 8-12M samples/sec | Audio synthesis (oscillators, filters, effects) |
| **xxHash** | 29KB | 17.6 GB/s | Non-cryptographic hashing |
| **Snappy** | 21KB | 300+ MB/s | Google's fast compression |
| **Eigen** | 113KB | 10+ GFLOPS | Linear algebra, eigenvalues, solvers |
| **nalgebra** | 72KB | 10+ GFLOPS | Rust linear algebra |
| **image-rs** | 785KB | 1,263 resize/sec | Full image processing suite |
| **QOI** | 8.9KB | 377 MP/s | Fast lossless image format |

---

## Market Context (2025)

### Key Trends Favoring Browser WASM Apps

1. **Privacy/Local-First Movement**: Users abandoning cloud tools for local processing. Over 2.9B people lack reliable internet. Data sovereignty concerns rising.

2. **Browser-as-Platform**: FL Studio Web launched. Figma, Adobe Premiere Rush prove WASM viability. Unity/Unreal running in browsers.

3. **Offline-First Architecture**: Edge computing, on-device AI, sync-when-available patterns becoming standard.

4. **No-Install Preference**: Browser tools eliminating friction. Squoosh proved users prefer "just works" over downloads.

5. **WASM Performance**: 3-20x faster than JS for compute-heavy tasks. Powers 3%+ of Chrome websites.

### Competitive Landscape Gaps

| Domain | Existing Leaders | Gap Opportunity |
|--------|-----------------|-----------------|
| Image Optimization | Squoosh, TinyPNG | Batch processing, asset pipelines, offline-first |
| Browser DAW | BandLab, Soundtrap | Lightweight tools, education-focused, effects-only |
| Ear Training | SoundGym, EarMaster | Producer-focused, real-time visualization |
| 3D/CAD | Chili3D, TinkerCAD | Lightweight calculators, educational physics |
| Dev Tools | Scattered utilities | Unified asset pipeline, local-first tooling |

---

## Tier 1: High Viability Products

Products with clear market demand, proven user behavior, and straightforward buildability.

---

### 1. **PixelForge** — Privacy-First Batch Image Processor

**Modules:** image-rs + blurhash + QOI + stb_image + xxHash + LZ4

**Problem:** Designers/developers process hundreds of images but worry about uploading to cloud services. Current tools (Squoosh) are single-image only. Enterprise teams need audit trails.

**Solution:** Offline-first batch image processor with:
- Drag-and-drop batch processing (resize, compress, convert formats)
- Auto-generate blurhash placeholders for each image
- Content-addressable storage via xxHash (dedupe detection)
- LZ4-compressed export archives
- Zero server uploads—all processing local

**Novel Angle:** Unlike Squoosh (single image) or TinyPNG (cloud upload), PixelForge processes batches locally with automatic placeholder generation and deduplication.

**Target Users:**
- Web developers optimizing assets
- Design agencies processing client work
- Privacy-conscious enterprises
- Indie game developers

**Viability Evidence:**
- Squoosh has millions of monthly users
- "Batch processing" is top feature request in Squoosh issues
- GDPR/privacy concerns driving local-first adoption
- Uploadcare, Cloudinary charge for processing—free local alternative

**Revenue Model:**
- Free core (10 images/batch)
- Pro ($9/mo): unlimited batch, presets, CLI export
- Team ($29/mo): shared presets, asset library

**Build Complexity:** Medium — UI for batch processing, web workers for parallel processing

---

### 2. **FreqSense** — Producer Ear Training for EQ/Effects

**Modules:** DSPFilters + Maximilian + Eigen (for FFT visualization)

**Problem:** Audio producers spend years developing "golden ears" to identify frequencies, compression artifacts, and spatial characteristics. Existing ear trainers focus on musicians (intervals, chords), not producers (EQ curves, compression ratios).

**Solution:** Gamified ear training specifically for audio production:
- "Identify the boosted frequency" challenges (like SoundGym but lighter)
- Real-time filter visualization showing what you're hearing
- Compression/limiting ear training
- A/B comparison drills with instant feedback
- Progress tracking and skill leveling

**Novel Angle:** Combines SoundGym's producer focus with real-time DSP visualization. Existing tools either visualize OR train—not both simultaneously. WASM enables responsive real-time audio without lag.

**Target Users:**
- Bedroom producers learning mixing
- Audio engineering students
- Podcasters improving their ear
- Sound designers

**Viability Evidence:**
- SoundGym: 200+ countries, subscription model works
- MixSense proving producer ear training market
- Audio production education is $2B+ market
- "Ear training" YouTube videos get millions of views

**Revenue Model:**
- Free: 3 exercises/day
- Pro ($7/mo): unlimited exercises, progress analytics
- Edu ($99/year): classroom licenses

**Build Complexity:** Medium — Audio worklet integration, real-time visualization

---

### 3. **AssetHash** — Developer Asset Pipeline Tool

**Modules:** xxHash + LZ4 + blurhash + image-rs + QOI

**Problem:** Frontend developers manually optimize images, generate hashes for cache busting, create placeholders. No unified local tool—just scattered CLI commands or cloud services.

**Solution:** Developer-focused asset pipeline in browser:
- Drop folder of assets
- Auto-optimize (resize, compress, convert to WebP/AVIF)
- Generate content hashes for filenames (cache busting)
- Create blurhash/thumbhash for each image
- Export manifest.json with all metadata
- Optional: compress entire output with LZ4

**Novel Angle:** Replaces `imagemin` + `blurhash-cli` + `hash-files` + manual work with one drag-and-drop tool. Generates framework-ready output (Next.js, Astro, etc.).

**Target Users:**
- Frontend developers
- Static site builders
- Jamstack developers
- Indie devs avoiding paid services

**Viability Evidence:**
- Imagemin downloads: 4M+/week
- Developers constantly ask "how to add blurhash to Next.js"
- Vercel/Netlify image optimization is paid tier feature
- "Asset pipeline" is recurring DevTwitter discussion

**Revenue Model:**
- Free: full functionality (open source core)
- Pro ($5/mo): saved presets, project configs, batch exports
- Sponsorware model possible

**Build Complexity:** Low-Medium — File handling, manifest generation

---

### 4. **WaveShape** — Lightweight Browser Synth/Effects Playground

**Modules:** Maximilian + DSPFilters + mathc

**Problem:** Learning synthesis requires installing DAWs (GB+ downloads). Web synths exist but most are toys without real DSP. Musicians want to experiment without commitment.

**Solution:** Educational synthesis playground:
- Visual oscillator/filter/envelope builders
- Real-time waveform and spectrum visualization
- Preset library of classic synth sounds
- Filter explorer (hear/see Butterworth vs Chebyshev vs biquad)
- Export presets as Web Audio API code
- MIDI input support

**Novel Angle:** Unlike Syntorial (paid course) or Ableton Learning Synths (toy-like), WaveShape provides professional-grade DSP with educational overlays. The 13.5x DSP speedup enables smooth real-time interaction.

**Target Users:**
- Music production beginners
- Audio programming students
- Sound design hobbyists
- Educators teaching synthesis

**Viability Evidence:**
- Chrome Music Lab: millions of users
- Ableton Learning Synths: viral success
- "How synthesizers work" videos: 10M+ views
- r/synthesizers: 500k+ members

**Revenue Model:**
- Free: core synth with ads
- Pro ($3/mo): preset saving, MIDI learn, export
- Embed license ($99): for music education sites

**Build Complexity:** Medium — WebMIDI, preset system, visualization

---

### 5. **MathViz** — Interactive Linear Algebra Explorer

**Modules:** Eigen + nalgebra + mathc

**Problem:** Linear algebra is taught abstractly. Students struggle to visualize transformations, eigenvalues, and matrix operations. Existing tools (Desmos, GeoGebra) focus on graphing, not matrix math.

**Solution:** Interactive linear algebra visualization:
- 2D/3D transformation visualizer (see what matrices do)
- Eigenvalue/eigenvector explorer with visual decomposition
- Step-by-step matrix operation breakdown
- SVD, QR, LU decomposition visualized
- Importable from LaTeX or code
- Practice problems with visual feedback

**Novel Angle:** Combines 3Blue1Brown's visual approach with interactive manipulation. The 7.4x speedup over JS enables real-time manipulation of large matrices that would lag in pure JS.

**Target Users:**
- Linear algebra students
- ML practitioners understanding transformations
- Graphics programmers learning math
- Educators teaching linear algebra

**Viability Evidence:**
- 3Blue1Brown "Essence of Linear Algebra": 20M+ views
- GeoGebra: 100M+ users
- Linear algebra courses on Coursera/Udemy: top performers
- "I finally understand eigenvectors" posts go viral regularly

**Revenue Model:**
- Free: core visualizer
- Pro ($4/mo): save sessions, export animations
- Edu ($99/year): classroom tools, assignment builder

**Build Complexity:** Medium — 3D rendering (Three.js), step animation

---

## Tier 2: Medium Viability Products

Interesting opportunities with less obvious product-market fit or requiring more validation.

---

### 6. **CompressKit** — In-Browser File Compression Suite

**Modules:** LZ4 + Snappy + xxHash

**Problem:** Sending large files via email or messaging has size limits. Cloud services require upload/download. No good in-browser compression that works offline.

**Solution:** Local-first file compression:
- Drag files, compress with LZ4 or Snappy
- Verify integrity with xxHash before/after
- Split large archives for email attachment limits
- Works completely offline (PWA)
- No file ever leaves the browser

**Novel Angle:** 7-Zip and WinRAR are desktop apps. Online tools upload your data. CompressKit is "7-Zip in your browser" with zero installation and zero upload.

**Target Users:**
- Users sending files via email
- Privacy-conscious file sharers
- Chromebook users (no native apps)
- Quick file compression needs

**Viability Evidence:**
- 7-Zip: 500M+ downloads
- Online compression tools exist but require upload
- Chromebook market growing rapidly
- "Send large file" is common search query

**Revenue Model:**
- Free with ads
- Pro ($2/mo): remove ads, higher limits, presets
- One-time purchase ($9.99) option

**Build Complexity:** Low — File handling, progress UI, PWA setup

**Uncertainty:** LZ4/Snappy formats aren't standard—recipients need decompression. Zstd would be better but not yet converted.

---

### 7. **SoundSculpt** — Audio Effects Processor

**Modules:** DSPFilters + Maximilian + Eigen

**Problem:** Processing podcast audio or music samples requires DAW knowledge. Simple tasks (remove bass hum, add warmth, normalize) need complex software.

**Solution:** One-purpose audio processor:
- Upload audio file
- Apply preset effect chains (podcast cleanup, vinyl warmth, vocal clarity)
- Preview in real-time
- Export processed audio
- Non-destructive editing

**Novel Angle:** Unlike full DAWs (overwhelming) or simple trimmers (limited), SoundSculpt offers "Instagram filters for audio"—one-click processing with professional DSP.

**Target Users:**
- Podcasters
- YouTubers processing audio
- Musicians polishing samples
- Voice-over artists

**Viability Evidence:**
- Podcast market: 500M+ listeners
- "How to improve podcast audio" gets massive search volume
- Descript, Auphonic charge for audio processing
- Adobe Podcast (AI enhance) proved demand

**Revenue Model:**
- Free: 1 file/day, watermark
- Pro ($8/mo): unlimited, preset creation, batch

**Build Complexity:** Medium-High — Audio worklet, preset system, file export

**Uncertainty:** Competes with Adobe Podcast's AI approach. Differentiation needs clarity.

---

### 8. **ParserLab** — Visual Grammar Builder

**Modules:** PEGTL

**Problem:** Learning to write parsers is difficult. PEG grammars are powerful but abstract. No interactive way to build and test grammars.

**Solution:** Visual PEG grammar builder:
- Drag-and-drop grammar construction
- Real-time parse tree visualization
- Test input against grammar instantly
- Export to multiple formats (JS, Python, Rust)
- Library of common patterns (JSON, CSV, Markdown subsets)

**Novel Angle:** Regex101 for parsers. Most grammar tools are CLI—this is visual, interactive, and educational.

**Target Users:**
- CS students learning parsing
- Language designers prototyping
- Developers building DSLs
- Educators teaching compilers

**Viability Evidence:**
- Regex101: millions of users
- Parser/compiler courses consistently popular
- "Build your own programming language" content goes viral
- Tree-sitter's growth shows parser interest

**Revenue Model:**
- Free core
- Pro ($5/mo): save grammars, code export, collaboration

**Build Complexity:** High — Grammar visualization, parse tree rendering, multi-language export

**Uncertainty:** Niche audience. May work better as open-source with sponsorship.

---

### 9. **PixelPerfect** — QOI Image Editor

**Modules:** QOI + stb_image + image-rs

**Problem:** QOI (Quite OK Image) format is gaining traction for game development and pixel art, but no dedicated editor exists. PNG editors don't understand QOI's strengths.

**Solution:** QOI-native image editor:
- Import/export QOI natively
- Pixel art tools optimized for QOI's compression
- Batch convert PNG/JPEG to QOI
- Compare compression ratios vs PNG
- Color palette optimization

**Novel Angle:** First editor designed around QOI. Shows real-time compression ratio as you edit.

**Target Users:**
- Pixel artists
- Indie game developers
- QOI format enthusiasts
- Image compression researchers

**Viability Evidence:**
- QOI GitHub: 9k+ stars
- Pixel art is growing niche (Aseprite has loyal following)
- Game dev forums discussing QOI adoption
- r/gamedev threads on QOI vs PNG

**Revenue Model:**
- Free: basic editing
- Pro ($6/mo): advanced tools, batch processing
- One-time ($19): perpetual license

**Build Complexity:** Medium — Canvas-based editor, QOI integration

**Uncertainty:** Very niche. QOI adoption unclear. May be feature of larger tool, not standalone.

---

### 10. **PhysicsBox** — Interactive Physics Simulator

**Modules:** Eigen + nalgebra + mathc

**Problem:** Physics education relies on static diagrams and formulas. Students can't experiment with parameters and see results in real-time.

**Solution:** Interactive physics sandbox:
- Projectile motion with drag/wind
- Collision simulations
- Wave interference visualization
- Spring/pendulum systems
- Orbital mechanics playground
- Export data for analysis

**Novel Angle:** PhET simulations are Flash-era. This is modern, mobile-friendly, with export capabilities and real-time parameter tweaking powered by 7.4x faster linear algebra.

**Target Users:**
- High school physics students
- AP/IB physics prep
- Physics educators
- Hobbyist scientists

**Viability Evidence:**
- PhET: billions of simulations run
- Physics education apps consistently downloaded
- Khan Academy physics very popular
- "Physics simulation" YouTube popular

**Revenue Model:**
- Free: core simulations
- Edu ($79/year): classroom tools, assignment integration
- Embed ($49): for educational platforms

**Build Complexity:** Medium — Physics engine, visualization, parameter controls

**Uncertainty:** Competes with established PhET. Need strong differentiation.

---

## Tier 3: Exploratory Products

Novel ideas requiring significant validation or representing new market categories.

---

### 11. **HashVault** — Content-Addressable Personal Archive

**Modules:** xxHash + LZ4 + Snappy

**Problem:** Personal file management is messy. Duplicates accumulate. No easy way to track what you have or find duplicates.

**Solution:** Local-first file deduplication and organization:
- Scan folders, hash all files with xxHash
- Identify duplicates instantly
- Content-addressable storage model
- Compress unique files with LZ4
- Sync-friendly export format

**Novel Angle:** Git for your personal files. Hash-based organization inspired by IPFS but for personal use, entirely local.

**Target Users:**
- Digital hoarders
- Photographers with duplicate RAW files
- Developers with redundant project copies
- Privacy-focused users

**Viability Evidence:**
- Duplicate file finders are popular utilities
- "Organize my files" is perennial need
- IPFS/content-addressing gaining developer awareness

**Revenue Model:** Uncertain — possibly utility with one-time purchase

**Build Complexity:** High — File system access, database, sync logic

**Uncertainty:** Desktop app would be better. Browser file access limited.

---

### 12. **AudioDNA** — Audio Fingerprinting Library

**Modules:** DSPFilters + xxHash + Eigen

**Problem:** Identifying audio matches (like Shazam) requires cloud services. No client-side fingerprinting for developers.

**Solution:** Browser-based audio fingerprinting:
- Generate compact audio fingerprints
- Compare fingerprints locally
- Detect audio similarity/duplication
- Library for developers to embed

**Novel Angle:** Shazam-like capability running entirely in browser. No audio uploaded to servers.

**Target Users:**
- Developers building music apps
- Rights management systems
- Podcast deduplication
- Audio researchers

**Viability Evidence:**
- Audio fingerprinting is established technology
- Privacy-first audio matching has no solution
- Developer library could enable new apps

**Revenue Model:**
- Open source core
- Enterprise license for commercial use
- Consulting/integration services

**Build Complexity:** Very High — Spectrogram analysis, fingerprint algorithm, matching

**Uncertainty:** Chromaprint exists. Would need significant accuracy validation.

---

### 13. **BlurAPI** — Blurhash-as-a-Service for Static Sites

**Modules:** blurhash + image-rs + stb_image

**Problem:** Adding blurhash to static sites requires build-time processing. Developers want an easy API but don't want to run servers.

**Solution:** Cloudflare Worker powered by WASM:
- `GET /blur?url=<image_url>` returns blurhash string
- Batch endpoint for multiple images
- CDN-cached results
- Works with any static site generator

**Novel Angle:** Blurhash generation typically requires Node.js sharp or native dependencies. This runs on edge (Cloudflare Workers) with WASM—no server management.

**Target Users:**
- Static site developers
- Jamstack agencies
- CMS platforms needing image processing

**Viability Evidence:**
- Cloudflare Workers WASM support proven
- Blurhash adoption growing (unlazy, Next.js integration)
- Image optimization APIs are paid tier in most platforms

**Revenue Model:**
- Free: 1k requests/month
- Pro ($9/mo): 100k requests, custom domains
- Enterprise: volume pricing

**Build Complexity:** Low-Medium — WASM on Workers, API design, caching

**Uncertainty:** Cloudflare has image optimization. May be feature not product.

---

## Multi-Module Combination Opportunities

The most novel products combine multiple modules to create capabilities greater than their parts.

---

### Combo 1: **Complete Image Pipeline**
**Modules:** stb_image + image-rs + blurhash + QOI + xxHash + LZ4

Creates full asset pipeline: decode any format → process → generate placeholders → hash for deduplication → compress for storage → export.

**Products:** PixelForge, AssetHash, BlurAPI

---

### Combo 2: **Audio Processing Stack**
**Modules:** DSPFilters + Maximilian + Eigen

Real-time audio: synthesis + filtering + spectral analysis. Enables professional-grade audio tools in browser.

**Products:** FreqSense, WaveShape, SoundSculpt, AudioDNA

---

### Combo 3: **Scientific Computing Suite**
**Modules:** Eigen + nalgebra + mathc

Complete linear algebra: 2D/3D graphics math + full matrix operations + decompositions. Powers interactive education.

**Products:** MathViz, PhysicsBox

---

### Combo 4: **Developer Utilities**
**Modules:** xxHash + LZ4 + Snappy + PEGTL

Hashing + compression + parsing. Foundation for dev tools, asset processing, file management.

**Products:** AssetHash, CompressKit, ParserLab

---

## Viability Matrix

| Product | Market Size | Competition | Differentiation | Build Effort | Score |
|---------|-------------|-------------|-----------------|--------------|-------|
| PixelForge | Large | Medium | Strong (batch + local) | Medium | ⭐⭐⭐⭐⭐ |
| FreqSense | Medium | Low | Strong (visual DSP) | Medium | ⭐⭐⭐⭐⭐ |
| AssetHash | Medium | Low | Strong (unified local) | Low-Med | ⭐⭐⭐⭐⭐ |
| WaveShape | Medium | Medium | Medium (education focus) | Medium | ⭐⭐⭐⭐ |
| MathViz | Medium | Medium | Strong (interactive) | Medium | ⭐⭐⭐⭐ |
| CompressKit | Small | Low | Medium (browser-native) | Low | ⭐⭐⭐ |
| SoundSculpt | Medium | High | Weak (many competitors) | Med-High | ⭐⭐⭐ |
| ParserLab | Small | Low | Strong (visual parsers) | High | ⭐⭐⭐ |
| PixelPerfect | Very Small | Low | Strong (QOI native) | Medium | ⭐⭐ |
| PhysicsBox | Medium | High | Weak (PhET dominates) | Medium | ⭐⭐ |
| HashVault | Small | Medium | Medium | High | ⭐⭐ |
| AudioDNA | Small | High | Medium | Very High | ⭐ |
| BlurAPI | Small | Medium | Weak (commoditized) | Low-Med | ⭐⭐ |

---

## Recommended Next Steps

### Immediate (Validation)
1. **Build PixelForge MVP** — Clear market, proves multi-module integration
2. **Prototype FreqSense** — Differentiated, underserved market
3. **Ship AssetHash** — Low effort, developer audience (your people)

### Medium-Term (Expansion)
4. **WaveShape** — Educational angle, viral potential
5. **MathViz** — Pairs well with educational content marketing

### Long-Term (Platform)
6. Combine tools into **"Local Tools"** brand — privacy-first productivity suite
7. Open source cores, monetize premium features
8. Build audience through educational content about WASM

---

## Key Insights

1. **Privacy is the wedge**: "No upload required" differentiates from cloud tools
2. **Education unlocks virality**: Tools that teach spread organically
3. **Developer tools have low CAC**: Build for developers, they self-market
4. **Multi-module = moat**: Competitors would need same WASM investment
5. **Batch/pipeline beats single-use**: Squoosh gap is workflow, not features
6. **WASM performance matters most for audio**: Real-time DSP needs the speedup

---

## Sources & References

### Image Tools Market
- [Squoosh Alternatives - AlternativeTo](https://alternativeto.net/software/squoosh/)
- [Best Online Image Optimizers 2025 - Themeisle](https://themeisle.com/blog/best-online-image-optimizer-tools/)
- [BlurHash Best Practices - Uploadcare](https://uploadcare.com/blog/blurhash-images/)

### Audio/DAW Market
- [FL Studio Web Launch - SynthAnatomy](https://synthanatomy.com/2025/12/fl-studio-web-popular-digital-audio-workstation-arrives-in-your-browser.html)
- [Online DAWs New Era - MusicRadar](https://www.musicradar.com/music-tech/daws/how-online-daws-are-ushering-in-a-new-era-for-music-making)
- [Best Ear Training Apps 2025 - eMastered](https://emastered.com/blog/best-ear-training-apps)
- [SoundGym - Audio Ear Training](https://www.soundgym.co/)

### WebAssembly Trends
- [WebAssembly 2025 - The New Stack](https://thenewstack.io/see-what-webassembly-can-do-in-2025/)
- [WASM High Performance 2025 - Atak Interactive](https://www.atakinteractive.com/blog/webassembly-in-2025-the-future-of-high-performance-web-applications)

### Local-First Movement
- [Rise of Offline Apps - ZeroCloudApps](https://zerocloudapps.com/2025/11/26/%F0%9F%8C%90-the-rise-of-offline-apps-why-people-are-returning-to-local-only-tools/)
- [Offline-First in 2025 - Vasundhara](https://vasundhara.io/blogs/offline-first-app-development-still-relevant-in-2025)
- [Local-First Future - DEV.to](https://dev.to/bertrand_atemkeng/why-local-first-and-offline-first-software-is-the-future-7mf)

### 3D/CAD/Game Engines
- [Chili3D - GitHub](https://github.com/xiangechen/chili3d)
- [Babylon.js](https://babylonjs.com/)
- [Three.js Game Dev 2025 - Playgama](https://playgama.com/blog/general/master-browser-based-game-development-with-three-js/)

---

*Last updated: January 2025*
