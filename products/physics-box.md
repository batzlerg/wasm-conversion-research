# PhysicsBox

**Type:** Standalone App (Browser)
**Status:** Spec
**Viability:** ⭐⭐

---

## One-Liner

Interactive physics simulator with real-time parameter tweaking—PhET for the modern web.

## Problem

Physics education relies on static diagrams and formulas in textbooks. Students can't experiment with parameters and see results in real-time. PhET simulations exist but feel Flash-era and are passive—you adjust sliders but can't truly construct experiments.

## Solution

Interactive physics sandbox:
- Projectile motion with air resistance and wind
- Collision simulations (elastic, inelastic)
- Wave interference visualization
- Spring/damper/pendulum systems
- Orbital mechanics playground
- Electric/magnetic field visualization
- Export data for graphing/analysis

## Modules Used

- [Eigen](../ACTIVE_PROSPECTS.md#eigen) (113KB) — Physics calculations, linear algebra
- [nalgebra](../ACTIVE_PROSPECTS.md#nalgebra) (72KB) — Alternative, smaller
- [mathc](../ACTIVE_PROSPECTS.md#mathc) (19KB) — Vector math for visualization

## Target Users

- High school physics students
- AP/IB physics exam prep
- Physics educators creating demonstrations
- Hobbyist scientists
- Engineering students

## User Flow

1. Select simulation type (projectile, collision, orbit, wave)
2. Place objects and set initial conditions
3. Run simulation
4. Pause and adjust parameters mid-simulation
5. Observe results, see force vectors and energy graphs
6. Export data or share simulation via URL

## Core Features

- **Multiple physics domains** — Mechanics, waves, electrostatics, orbits
- **Real-time parameter adjustment** — Change gravity, drag, mass while running
- **Data export** — CSV for graphing in Excel/Python
- **Preset experiments** — Common textbook problems pre-configured
- **Step-by-step mode** — See force vectors at each timestep
- **Shareable URLs** — Send specific simulation states
- **Mobile-friendly** — Modern responsive design

## Competitive Landscape

| Tool | Quality | Gap |
|------|---------|-----|
| PhET | Excellent content | Flash-era UI, passive |
| Khan Academy | Good explanations | Static, not interactive |
| Algodoo | 2D physics sandbox | Desktop only, not educational |
| Physics simulation apps | Basic | Mobile-only, limited |

## Novel Angle

PhET simulations have billions of runs but feel dated. They're also passive—you can adjust sliders but not construct experiments from primitives. PhysicsBox is a modern sandbox where you build experiments, not just watch canned demos.

The 7.4x linear algebra speedup enables complex N-body simulations that would lag in pure JS.

## Revenue Model

**Institutional + Free:**
- Individual users: Free
- Schools/districts: $500-2,000/year for dashboard, assignment integration

**Challenge:** PhET is free and established. Very hard to compete.

## Build Complexity

**Medium** — Estimated 60-80 hours

**Breakdown:**
- Physics engine — 20 hours
- Visualization system — 15 hours
- UI for experiment building — 12 hours
- Data export — 6 hours
- Preset library — 10 hours
- Testing physics accuracy — 12 hours
- Documentation — 8 hours

## Success Metrics

### Launch
- 1,000 users
- Teacher adoption in 5 schools

### Year 1
- 10,000 users
- 3 institutional licenses ($3,000)

**Realistic:** PhET dominance makes this hard. Consider as open source educational project rather than revenue.

## Next Steps

- [ ] Research PhET limitations (what do teachers complain about?)
- [ ] Build one simulation type (projectile motion)
- [ ] Test with physics teachers
- [ ] Assess if differentiation is strong enough
- [ ] If not: Open source for portfolio, don't pursue revenue

---

**Last updated:** January 2026
