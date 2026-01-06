# Product Ideas

Product concepts derived from WASM conversion research. Each idea gets its own spec file regardless of viability—star ratings indicate priority for execution.

**Last Updated:** January 2026

---

## Product Types

- **Standalone App** — Full browser application users interact with directly
- **API Primitive** — Single-purpose edge API, composable building block
- **Pipeline Service** — Multi-step workflow orchestrating multiple primitives
- **Developer Library** — npm package, embeddable in other applications

---

## Active Products

| Name | Type | Status | Viability | Revenue Model |
|------|------|--------|-----------|---------------|
| [thumbhash-edge](thumbhash-edge.md) | API Primitive | Spec | ⭐⭐⭐⭐⭐ | Free (OSS self-host) |
| [imageo](imageo.md) | Standalone App | Spec | ⭐⭐⭐⭐⭐ | Freemium ($9/mo) |
| [freq-sense](freq-sense.md) | Standalone App | Spec | ⭐⭐⭐⭐⭐ | Subscription ($7/mo) |
| [asset-hash](asset-hash.md) | Developer Library | Spec | ⭐⭐⭐⭐⭐ | OSS (consulting funnel) |
| [og-image-edge](og-image-edge.md) | Pipeline Service | Spec | ⭐⭐⭐⭐ | SaaS ($15/mo) |
| [sanitize-edge](sanitize-edge.md) | API Primitive | Spec | ⭐⭐⭐⭐⭐ | Pay-per-use ($0.15/1k) |
| [minify-edge](minify-edge.md) | API Primitive | Spec | ⭐⭐⭐⭐ | Pay-per-use ($0.10/1k) |
| [readable-edge](readable-edge.md) | Pipeline Service | Spec | ⭐⭐⭐⭐ | Pay-per-use ($0.25/1k) |
| [wave-shape](wave-shape.md) | Standalone App | Spec | ⭐⭐⭐⭐ | Freemium ($5/mo) |
| [math-viz](math-viz.md) | Standalone App | Spec | ⭐⭐⭐⭐ | Edu licensing ($99/yr) |
| [webhook-edge](webhook-edge.md) | Pipeline Service | Spec | ⭐⭐⭐ | Pay-per-use ($0.20/1k) |
| [audiomill](audiomill.md) | Standalone App | Spec | ⭐⭐⭐ | Freemium ($8/mo) |
| [mosaicly](mosaicly.md) | Standalone App | Spec | ⭐⭐⭐ | Free (OSS) |
| [parser-lab](parser-lab.md) | Standalone App | Spec | ⭐⭐⭐ | OSS (reputation) |
| [spritify](spritify.md) | Standalone App | Spec | ⭐⭐ | One-time ($19) |
| [physics-box](physics-box.md) | Standalone App | Spec | ⭐⭐ | Institutional ($500/yr) |
| [hash-vault](hash-vault.md) | Standalone App | Spec | ⭐⭐ | OSS |
| [audio-dna](audio-dna.md) | Developer Library | Spec | ⭐ | Open core |

---

## By Type

### Standalone Apps (7)
Full browser applications with UI:
- [imageo](imageo.md) ⭐⭐⭐⭐⭐
- [freq-sense](freq-sense.md) ⭐⭐⭐⭐⭐
- [wave-shape](wave-shape.md) ⭐⭐⭐⭐
- [math-viz](math-viz.md) ⭐⭐⭐⭐
- [audiomill](audiomill.md) ⭐⭐⭐
- [mosaicly](mosaicly.md) ⭐⭐⭐
- [parser-lab](parser-lab.md) ⭐⭐⭐
- [spritify](spritify.md) ⭐⭐
- [physics-box](physics-box.md) ⭐⭐
- [hash-vault](hash-vault.md) ⭐⭐

### API Primitives (3)
Single-purpose edge endpoints:
- [thumbhash-edge](thumbhash-edge.md) ⭐⭐⭐⭐⭐
- [sanitize-edge](sanitize-edge.md) ⭐⭐⭐⭐⭐
- [minify-edge](minify-edge.md) ⭐⭐⭐⭐

### Pipeline Services (3)
Multi-step workflows at edge:
- [og-image-edge](og-image-edge.md) ⭐⭐⭐⭐
- [readable-edge](readable-edge.md) ⭐⭐⭐⭐
- [webhook-edge](webhook-edge.md) ⭐⭐⭐

### Developer Libraries (2)
Embeddable packages:
- [asset-hash](asset-hash.md) ⭐⭐⭐⭐⭐
- [audio-dna](audio-dna.md) ⭐

---

## By Viability

### ⭐⭐⭐⭐⭐ Highest Priority
- imageo (batch image, privacy angle)
- freq-sense (proven subscription model)
- asset-hash (dev tool, low CAC)
- thumbhash-edge (real demand, portfolio value)
- sanitize-edge (security-critical, unique)

### ⭐⭐⭐⭐ High Priority
- wave-shape (education, viral potential)
- math-viz (education market)
- minify-edge (fills CF deprecation gap)
- og-image-edge (proven revenue, Vercel charges)
- readable-edge (LLM workflow demand)

### ⭐⭐⭐ Medium Priority
- webhook-edge (useful but niche)
- audiomill (crowded market)
- mosaicly (utility, OSS)
- parser-lab (niche, education)

### ⭐⭐ Low Priority
- spritify (very niche, QOI adoption unclear)
- physics-box (PhET dominates)
- hash-vault (wrong platform)

### ⭐ Exploratory
- audio-dna (Chromaprint exists, high complexity)

---

## Primitive Bundle Concept

**Note:** A "primitives bundle" only makes sense if we build multiple API primitives targeting the same developer audience. Current candidates:

**Content Processing Bundle:**
- /thumbhash — Image placeholders
- /sanitize — HTML sanitization
- /minify — Content minification
- /markdown — HTML→Markdown
- /hash — Content addressing

**Target:** Jamstack developers, headless CMS builders, static site users

**Pricing:** $5/mo for 100k calls across all endpoints

**Decision:** Only pursue if we validate demand for 3+ primitives individually first.

---

## Next Actions

### Immediate
1. Build thumbhash-edge (2-4 hours)
2. Validate with real Next.js users
3. Write blog post

### If thumbhash-edge succeeds
4. Build sanitize-edge (3-5 hours)
5. Build minify-edge (2-3 hours)
6. Test bundle hypothesis

### Browser products (longer-term)
7. Prototype Imageo MVP
8. Prototype FreqSense MVP
9. Validate revenue assumptions

---

*For technical library evaluation, see [ACTIVE_PROSPECTS.md](../ACTIVE_PROSPECTS.md)*
