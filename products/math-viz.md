# MathViz

**Type:** Standalone App (Browser)
**Status:** Spec
**Viability:** ⭐⭐⭐⭐

---

## One-Liner

Interactive linear algebra visualization—3Blue1Brown but you can manipulate the math and see it transform in real-time.

## Problem

Linear algebra is taught abstractly with formulas and notation. Students struggle to understand what matrices actually DO—how they transform space, what eigenvalues mean geometrically, why certain decompositions matter. Existing tools (Desmos, GeoGebra) focus on graphing functions, not matrix operations.

## Solution

Interactive linear algebra visualization:
- 2D/3D transformation visualizer (input matrix, see transformation)
- Eigenvalue/eigenvector explorer with visual decomposition
- Step-by-step matrix operation animations
- SVD, QR, LU decomposition with geometric interpretation
- Import matrices from LaTeX or code
- Practice problems with visual feedback
- Export visualizations as GIF or shareable URL

## Modules Used

- [Eigen](../ACTIVE_PROSPECTS.md#eigen) (113KB) — Full linear algebra operations
- [nalgebra](../ACTIVE_PROSPECTS.md#nalgebra) (72KB) — Rust alternative, smaller binary
- [mathc](../ACTIVE_PROSPECTS.md#mathc) (19KB) — 3D rendering math

## Target Users

- Linear algebra students (undergrad/grad)
- ML practitioners understanding transformations
- Graphics programmers learning the math behind rendering
- Educators teaching linear algebra courses
- Self-learners watching 3Blue1Brown videos

## User Flow

1. Input matrix (paste, type, or select from template library)
2. See immediate 2D/3D visualization of transformation
3. Drag matrix values, watch transformation update in real-time
4. Click "Analyze" → see eigenvalues/eigenvectors visually
5. Step through operations (matrix multiplication) with animation
6. Try practice problems with hints
7. Export visualization or share via URL

## Core Features

- **Real-time 2D/3D visualization** — See transformations as you edit
- **Eigenvalue decomposition** — Visual separation of eigenvectors
- **Matrix operations** — Multiply, inverse, transpose with step-by-step
- **Decompositions** — SVD, QR, LU with geometric meaning
- **LaTeX support** — Input/output in math notation
- **Shareable URLs** — Send specific matrix state to students
- **Practice mode** — Problems with interactive hints
- **Animation controls** — Step through transformations frame-by-frame

## Competitive Landscape

| Tool | Focus | Gap |
|------|-------|-----|
| 3Blue1Brown (videos) | Visual explanations | Passive, can't manipulate |
| GeoGebra | Function graphing | Not matrix-focused |
| Desmos | Graphing calculator | No linear algebra |
| Wolfram Alpha | Symbolic math | No visualization |
| MATLAB/Octave | Professional | Complex, requires install |

## Novel Angle

3Blue1Brown's "Essence of Linear Algebra" has 20M+ views because visualization makes matrices intuitive—but videos are passive. GeoGebra doesn't handle matrix decompositions. MathViz is "3Blue1Brown but interactive":

- **Manipulate matrices** → see the transformation
- **Drag values** → watch eigenvectors rotate
- **Step through** → understand how operations work

The 7.4x speedup over JS means 100×100 matrices respond instantly—critical for the "immediate feedback" learning experience.

## Revenue Model

**Education-Focused:**
- Free: Core visualizer, basic features
- Pro ($4/mo): Save sessions, export animations, unlimited matrices
- Edu ($99/year per teacher): Classroom tools, assignment builder, student tracking

**Institutional sales:**
- University/school district licenses: $500-2,000/year

**Why institutional works:**
- Schools pay for tools that improve outcomes
- Teacher dashboard with student progress valuable
- Assignment integration (problem sets) drives adoption

## Build Complexity

**Medium** — Estimated 50-70 hours

**Breakdown:**
- Matrix visualization (2D/3D) — 15 hours
- Step-by-step animation system — 12 hours
- Eigenvalue/decomposition visuals — 10 hours
- LaTeX input/output — 8 hours
- Practice problem system — 10 hours
- UI/UX — 10 hours
- Testing — 10 hours

## Success Metrics

### Launch (Month 1)
- 1,000 users
- Featured on r/math, r/learnprogramming
- 3Blue1Brown community mentions it

### Growth (Month 6)
- 10,000 users
- 50 Pro subscribers ($200 MRR)
- 3 Edu licenses ($25 MRR)
- YouTube tutorials reference it

### Established (Year 1)
- 50,000 users
- 200 Pro ($800 MRR)
- 20 Edu ($165 MRR)
- 5 institutional licenses ($4,000/year one-time)
- **Total:** ~$1,000 MRR + institutional

## Next Steps

- [ ] Build basic matrix visualizer (2D only)
- [ ] Test with linear algebra students
- [ ] Add eigenvalue visualization
- [ ] Create 10 practice problems
- [ ] Add LaTeX support
- [ ] Reach out to math YouTubers for feedback
- [ ] Launch with educational content marketing

---

**Last updated:** January 2026
