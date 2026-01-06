# SoundSculpt

**Type:** Standalone App (Browser)
**Status:** Spec
**Viability:** ⭐⭐⭐

---

## One-Liner

Instagram filters for audio—one-click podcast cleanup, music mastering, and vocal processing without DAW knowledge.

## Problem

Processing podcast audio or music samples requires DAW knowledge and complex software. Simple tasks like removing bass hum, adding warmth, or normalizing volume require understanding signal chains, compressors, and EQ. Existing solutions are either overwhelming (full DAWs) or too limited (simple trimmers).

## Solution

One-purpose audio processor with presets:
- Upload audio file (podcast, music, voice recording)
- Apply one-click presets: "Podcast Cleanup", "Vinyl Warmth", "Vocal Clarity"
- Preview with A/B toggle (original vs processed)
- Adjust parameters if needed
- Export processed audio in multiple formats
- Non-destructive editing with undo/redo

## Modules Used

- [DSPFilters](../ACTIVE_PROSPECTS.md#dspfilters) (59KB) — EQ, filters, compression
- [Maximilian](../ACTIVE_PROSPECTS.md#maximilian) (39KB) — Reverb, saturation, effects
- [Eigen](../ACTIVE_PROSPECTS.md#eigen) (113KB) — Optional for spectral processing

## Target Users

- Podcasters improving audio quality
- YouTubers processing voice-overs
- Musicians polishing demo recordings
- Voice-over artists cleaning up recordings
- Content creators without audio expertise

## User Flow

1. Upload audio file or record directly
2. Select preset or build custom effect chain
3. Preview with A/B comparison toggle
4. Adjust effect parameters via sliders
5. See visual feedback (waveform, spectrum)
6. Export as MP3, WAV, or FLAC

## Core Features

- **One-click presets** — Podcast cleanup, music mastering, vocal enhancement
- **Real-time preview** — A/B comparison with instant switching
- **Custom effect chains** — Drag-and-drop effect ordering
- **Non-destructive** — Undo/redo, always have original
- **Batch processing** — Apply preset to multiple files
- **Format conversion** — Import/export various formats
- **Visual feedback** — Waveform and spectrum analyzer

## Competitive Landscape

| Tool | Focus | Gap |
|------|-------|-----|
| Adobe Podcast | AI enhancement | Cloud-based, no manual control |
| Auphonic | Podcast processing | $11/mo for 9hrs, cloud upload |
| Descript | Full podcast editor | $24/mo, heavyweight |
| Audacity | Full DAW | Overwhelming for simple tasks |
| Simple audio trimmers | Basic editing | No professional effects |

## Novel Angle

Full DAWs are overwhelming for "just clean up my podcast." Simple editors lack professional effects. Adobe Podcast uses AI but requires cloud processing. SoundSculpt offers "Instagram filter" simplicity with professional DSP quality, all running locally.

The 119M samples/sec throughput means effects apply in near-real-time.

## Revenue Model

**Freemium:**
- Free: 1 file/day, basic presets, watermark
- Pro ($8/mo): Unlimited, custom presets, batch, no watermark

**Uncertainty:** Crowded market. Adobe Podcast is free and AI-powered. Hard to differentiate without AI approach.

## Build Complexity

**Medium-High** — Estimated 60-80 hours

**Breakdown:**
- Audio worklet setup — 12 hours
- Effect chain system — 15 hours
- Preset creation (5-10 presets) — 15 hours
- A/B preview system — 8 hours
- File export — 8 hours
- UI/UX — 15 hours
- Testing — 12 hours

## Success Metrics

### Launch (Month 1)
- 500 users
- Featured on r/podcasting

### If viable (Month 6)
- 5,000 users
- 100 Pro subscribers ($800 MRR)

## Next Steps

- [ ] Validate: Survey podcasters on r/podcasting
- [ ] Build single preset (podcast cleanup only)
- [ ] Test with 20 podcasters
- [ ] Assess if people would pay vs use Adobe Podcast
- [ ] If validation fails: Pivot or abandon

---

**Last updated:** January 2026
