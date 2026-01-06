# WaveShape

**Type:** Standalone App (Browser)
**Status:** Spec
**Viability:** ⭐⭐⭐⭐

---

## One-Liner

Educational synthesis playground with professional-grade DSP—Chrome Music Lab for adults who want to actually learn synths.

## Problem

Learning synthesis requires installing multi-GB DAWs (Ableton, FL Studio). Web synths exist but most are toys (Chrome Music Lab is for children) or incomplete demonstrations (Ableton Learning Synths lacks depth). Musicians want to experiment with real synthesis without installing complex software.

## Solution

Educational synthesis playground:
- Visual modular synth builder (drag oscillators, filters, envelopes)
- Real-time waveform and spectrum visualization
- "What does this filter sound like?" explorer
- Preset library of classic synth sounds (Moog bass, 303 acid, etc.)
- Export presets as Web Audio API code for integration
- MIDI input support for playing with keyboard/controller
- Educational overlays explaining synthesis concepts

## Modules Used

- [Maximilian](../ACTIVE_PROSPECTS.md#maximilian) (39KB) — Audio synthesis engine
- [DSPFilters](../ACTIVE_PROSPECTS.md#dspfilters) (59KB) — Professional-grade filters
- [mathc](../ACTIVE_PROSPECTS.md#mathc) (19KB) — Math for modulation, envelopes

## Target Users

- Music production beginners learning synthesis
- Audio programming students understanding DSP
- Sound design hobbyists experimenting with patches
- Educators teaching synthesis fundamentals
- Musicians exploring new sounds without DAW commitment

## User Flow

1. Open app, start with basic oscillator
2. Drag filter module from palette, connect visually
3. Adjust filter frequency/resonance, hear result instantly
4. Add envelope to shape filter cutoff over time
5. See waveform and spectrum update in real-time
6. Save patch to library
7. Optionally export as Web Audio API code snippet

## Core Features

- **Visual modular design** — Drag and connect synthesis modules
- **Real-time visualization** — Waveform + spectrum analyzer
- **Filter comparison tool** — Hear Butterworth vs Chebyshev vs Biquad side-by-side
- **Preset library** — Classic sounds with explanations
- **MIDI support** — Play with keyboard or controller
- **Code export** — Generate Web Audio API JavaScript
- **Tutorial mode** — Guided lessons on synthesis basics
- **Randomizer** — Generate random patches for exploration

## Competitive Landscape

| Tool | Pricing | Quality | Gap |
|------|---------|---------|-----|
| Chrome Music Lab | Free | Toy-like, for children | Not educational for adults |
| Ableton Learning Synths | Free | Good but shallow | No depth, can't save |
| Syntorial | $129 | Professional course | Paid course, not playground |
| Web Audio Demos | Free | Scattered examples | Not cohesive, outdated |
| Helm Synth | Free (native) | Professional | Requires install |

## Novel Angle

Chrome Music Lab is too simple. Syntorial is a paid course, not a playground. Ableton Learning Synths is great but doesn't let you truly experiment or save patches. WaveShape bridges the gap:

- **Professional DSP** — Real filters (Butterworth, Chebyshev), not toys
- **Educational overlays** — "Why does this filter sound warmer?"
- **Exportable patches** — Take your sound into real DAW or Web Audio app
- **Visual + Audio** — See the waveform change as you tweak

The 8-12M samples/sec performance (Maximilian) means zero latency when tweaking parameters—critical for learning "cause and effect."

## Revenue Model

**Freemium + Embed Licensing:**
- Free: Core synth, basic presets, ads
- Pro ($5/mo): Save patches, MIDI learn, export code, no ads
- Embed ($99-499): License for music education platforms to white-label

**Why embed licensing works:**
- Coursera, Skillshare, Udemy want interactive content
- YouTube educators want embeddable synth demos
- Music schools want integrated tools

## Build Complexity

**Medium** — Estimated 50-80 hours

**Breakdown:**
- Synthesis engine integration — 15 hours
- Visual module system — 15 hours
- Waveform/spectrum visualization — 12 hours
- Preset system — 8 hours
- WebMIDI integration — 8 hours
- Code export feature — 6 hours
- Tutorial content — 10 hours
- Testing — 10 hours

## Success Metrics

### Launch (Month 1)
- 500 users
- Featured on r/synthesizers
- YouTube demo video: 5k views

### Growth (Month 6)
- 5,000 users
- 100 Pro subscribers ($500 MRR)
- 2 embed licenses ($198 one-time)

### Established (Year 1)
- 20,000 users
- 400 Pro subscribers ($2,000 MRR)
- 10 embed licenses ($990 one-time)
- Tutorial video viral (100k+ views)

## Next Steps

- [ ] Build basic oscillator + filter prototype
- [ ] Add real-time visualization
- [ ] Create 5 classic preset sounds
- [ ] Test with music production students
- [ ] Add MIDI support
- [ ] Create tutorial series
- [ ] Launch on Product Hunt + music subreddits

---

**Last updated:** January 2026
