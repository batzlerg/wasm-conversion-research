# FreqSense

**Type:** Standalone App (Browser)
**Status:** Spec
**Viability:** ⭐⭐⭐⭐⭐

---

## One-Liner

Gamified ear training for audio producers with real-time DSP visualization—learn to hear EQ, compression, and spatial effects.

## Problem

Audio producers spend years developing "golden ears" to identify frequencies, compression artifacts, and spatial characteristics. Existing ear trainers focus on musicians (intervals, chords), not producers (EQ curves, compression ratios, reverb tails). Training apps either let you hear OR see, but not both simultaneously.

## Solution

Gamified ear training specifically for audio production:
- "Identify the boosted frequency" challenges
- Real-time DSP visualization synced to audio playback
- Compression/limiting detection drills
- Stereo imaging and reverb identification
- A/B comparison with instant feedback
- Progress tracking, streaks, skill leveling
- Genre-specific training (podcast, EDM, jazz, rock)

## Modules Used

- [DSPFilters](../ACTIVE_PROSPECTS.md#dspfilters) (59KB) — EQ, filters for challenges
- [Maximilian](../ACTIVE_PROSPECTS.md#maximilian) (39KB) — Audio synthesis, effects
- [Eigen](../ACTIVE_PROSPECTS.md#eigen) (113KB) — FFT for spectrum visualization

## Target Users

- Bedroom producers learning mixing/mastering
- Audio engineering students
- Podcasters improving their audio skills
- Sound designers for games/film
- Music producers upgrading from beginner to intermediate

## User Flow

1. Sign up / log in (track progress)
2. Choose training mode: Frequency ID, Compression, Reverb, or Mixed
3. Listen to audio sample with hidden processing
4. Make guess using frequency wheel or effect slider
5. See instant feedback: correct answer + spectrum visualization overlay
6. View explanation: "This was a 6dB boost at 2kHz using a bell curve"
7. Track progress: accuracy %, streak days, skill rating
8. Unlock harder difficulties and new training modes

## Core Features

- **Real-time visualization** — See spectrum analyzer while training
- **Multiple training modes** — EQ, compression, reverb, stereo imaging, saturation
- **Adaptive difficulty** — Starts easy, gets harder as you improve
- **Progress analytics** — Track accuracy by frequency range, identify weaknesses
- **Reference library** — Genre-specific frequency charts (kick drum, vocals, etc.)
- **Streak system** — Daily training incentive
- **Leaderboard** — Optional competitive mode
- **Audio worklet integration** — Zero-latency real-time processing

## Competitive Landscape

| Competitor | Pricing | Focus | Gap |
|------------|---------|-------|-----|
| SoundGym | $15/mo | Producers | No real-time DSP visualization |
| MixSense | $8/mo | Producers (EQ focus) | Limited exercise variety |
| EarMaster | $60 one-time | Musicians (intervals) | Not for producers |
| Perfect Ear | Free | Musicians | Not for producers |
| Quiztones | $5 one-time | Frequency training | No visualization, dated UI |

## Novel Angle

SoundGym and MixSense train producers but don't show you what's happening in real-time. Traditional ear trainers target musicians, not producers. FreqSense uniquely combines:

- **Hear + See simultaneously** — Visual feedback matches audio (like a tutor explaining)
- **Producer-specific** — EQ curves, not intervals
- **Modern UI** — Not Flash-era, mobile-friendly
- **Educational overlays** — Explains WHY this frequency matters for bass vs vocals

The 13.5x DSP speedup (from DSPFilters WASM) enables lag-free real-time visualization that would stutter in pure JS.

## Revenue Model

**Subscription (proven by SoundGym):**
- Free: 3 exercises/day, basic modes
- Pro ($7/mo): Unlimited exercises, all modes, analytics, export progress
- Edu ($99/year): Classroom licenses, student tracking, assignment builder

**Why people pay:**
- Gamification (streaks) drives retention
- Daily limit creates FOMO
- Progress analytics show improvement
- Educational institutions pay for tracking

**LTV estimate:** $84/year × 24-month retention = $168 LTV (SoundGym-like)

## Build Complexity

**Medium** — Estimated 60-100 hours

**Breakdown:**
- Audio worklet setup — 12 hours
- DSP integration (filters, effects) — 15 hours
- Visualization (spectrum, waveform) — 15 hours
- Game mechanics (scoring, progression) — 10 hours
- Exercise generation — 10 hours
- Progress tracking / analytics — 10 hours
- UI/UX — 15 hours
- Authentication — 8 hours
- Testing — 15 hours

## Success Metrics

### Launch (Month 1)
- 200 sign-ups
- 50% return for day 2
- Featured on r/audioengineering

### Growth (Month 6)
- 2,000 users
- 100 Pro subscribers ($700 MRR)
- 5 Edu licenses ($495/year = $41 MRR)
- 30% weekly active rate

### Established (Year 1)
- 10,000 users
- 500 Pro subscribers ($3,500 MRR)
- 20 Edu licenses ($1,980/year = $165 MRR)
- **Total:** $3,665 MRR = $43,980 ARR

## Next Steps

- [ ] Validate demand: Survey in r/audioengineering, r/mixingmastering
- [ ] Build single exercise prototype (frequency ID only)
- [ ] Test with 10 producers for feedback
- [ ] Build progression system
- [ ] Add authentication and progress tracking
- [ ] Soft launch with free tier
- [ ] Add paid tier after 100 DAU

---

**Last updated:** January 2026
