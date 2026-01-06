# Mosaicly

**Type:** Standalone App (Browser)
**Status:** Spec
**Viability:** ⭐⭐⭐

---

## One-Liner

7-Zip in your browser—compress files locally without upload, works offline, perfect for Chromebooks.

## Problem

Sending large files via email has attachment limits (25MB Gmail, 20MB Outlook). Cloud compression services require uploading your data to their servers. Desktop tools (7-Zip, WinRAR) require installation and aren't available on Chromebooks or locked-down corporate machines.

## Solution

Local-first file compression:
- Drag files, compress with LZ4 (speed) or Snappy (balance)
- Verify integrity with xxHash checksums before/after
- Split large archives for email attachment size limits
- Works completely offline as PWA
- No file ever leaves the browser

## Modules Used

- [LZ4](../ACTIVE_PROSPECTS.md#lz4) (15.6KB) — 6.5 GB/s compression
- [Snappy](../ACTIVE_PROSPECTS.md#snappy) (21KB) — 300+ MB/s, balanced
- [xxHash](../ACTIVE_PROSPECTS.md#xxhash) (29KB) — Integrity verification

## Target Users

- General users sending files via email
- Privacy-conscious file sharers
- Chromebook users (can't install native apps)
- Users on locked-down corporate machines
- Quick compression needs without software installation

## User Flow

1. Drop files into browser window
2. Select compression algorithm (LZ4 fast, Snappy balanced)
3. Optional: Split output for email limits (20MB chunks)
4. Compress with progress bar
5. Download compressed archive(s)
6. Recipient uses same tool to decompress and verify integrity

## Core Features

- **LZ4 and Snappy compression** — Choose speed vs ratio
- **Integrity verification** — xxHash checksums before/after
- **File splitting** — Automatic chunks for email attachment limits
- **PWA with offline support** — Install once, use anywhere
- **Batch compression** — Multiple files at once
- **Decompression** — Full round-trip with checksum validation
- **No upload** — Everything local, privacy-preserving

## Competitive Landscape

| Tool | Platform | Privacy | Gap |
|------|----------|---------|-----|
| 7-Zip | Desktop only | Private | Requires install |
| WinRAR | Desktop only | Private | Requires install, paid |
| Online compressors | Browser | Upload to server | Privacy concern |
| Native browser tools | Browser | Private | Don't exist |

## Novel Angle

7-Zip and WinRAR are desktop apps. Online compression tools upload your data. Mosaicly is "7-Zip in your browser"—no installation, no upload, works on Chromebooks.

The 6.5 GB/s LZ4 throughput means even large files compress quickly.

## Revenue Model

**Likely free/open source:**
- Free with ads (but low CPM for utility apps)
- One-time purchase ($4.99) to remove ads
- Realistically: Open source for goodwill

**Why not viable:** Utility apps rarely generate revenue unless you're WinRAR surviving on guilt.

**Better play:** Open source portfolio piece

## Build Complexity

**Low** — Estimated 20-30 hours

**Breakdown:**
- File handling UI — 8 hours
- WASM integration (3 modules) — 6 hours
- Progress UI — 4 hours
- PWA setup — 4 hours
- Splitting logic — 4 hours
- Testing — 6 hours

## Success Metrics

### Launch (Month 1)
- 200 GitHub stars
- Featured on Hacker News
- 1,000 users

### Steady State
- 5,000 monthly users
- Open source contributions
- Referenced in "browser tools" lists

## Next Steps

- [ ] Build basic compression (LZ4 only)
- [ ] Add decompression
- [ ] Add integrity verification
- [ ] Add file splitting
- [ ] Launch as open source
- [ ] Write blog post: "Why I built a compression tool instead of using 7-Zip"

---

**Last updated:** January 2026
