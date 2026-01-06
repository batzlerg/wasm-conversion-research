# HashVault

**Type:** Standalone App (Browser/Desktop)
**Status:** Spec
**Viability:** ⭐⭐

---

## One-Liner

Content-addressable personal file archive—Git for your personal files, IPFS-inspired organization, entirely local.

## Problem

Personal file management is messy. Duplicate files accumulate across downloads, backups, and projects. No easy way to track what you have or find duplicates without scanning everything repeatedly. Traditional duplicate finders don't embrace content-addressable principles.

## Solution

Local-first file deduplication and organization:
- Scan folders, hash all files with xxHash
- Identify duplicates instantly via content addressing
- Content-addressable storage model (files organized by hash)
- Compress unique files with LZ4 for archiving
- Persistent hash database for incremental scans
- Sync-friendly export format

## Modules Used

- [xxHash](../ACTIVE_PROSPECTS.md#xxhash) (29KB) — Fast file hashing (17.6 GB/s)
- [LZ4](../ACTIVE_PROSPECTS.md#lz4) (15.6KB) — Compression for archiving
- [Snappy](../ACTIVE_PROSPECTS.md#snappy) (21KB) — Alternative compression

## Target Users

- Digital hoarders with disorganized files
- Photographers with duplicate RAW files across drives
- Developers with redundant project copies
- Privacy-focused users wanting local organization
- Anyone drowning in duplicate downloads

## User Flow

1. Grant folder access via File System Access API
2. Scan files (shows progress, 17.6 GB/s)
3. Review duplicates with "keep/delete" workflow
4. Optionally organize unique files into content-addressable structure
5. Compress archive with LZ4
6. Future scans detect new duplicates automatically using stored hashes

## Core Features

- **Fast scanning** — 17.6 GB/s via xxHash
- **Duplicate detection** — Across multiple folders and drives
- **Content-addressable organization** — Files identified by content, not name
- **LZ4 archiving** — Compress unique files efficiently
- **Persistent hash database** — Incremental scans, not full re-scan
- **Change reports** — "What's new since last scan?"

## Competitive Landscape

| Tool | Platform | Approach | Gap |
|------|----------|----------|-----|
| Duplicate file finders | Desktop apps | Name/size matching | Not content-addressable |
| CCleaner, Gemini | Desktop | Basic dup finding | Not Git-like |
| IPFS Desktop | Desktop | Content-addressing | For network sharing, not personal |

## Novel Angle

Duplicate finders exist but none embrace content-addressable organization (like Git's object store or IPFS). HashVault brings version control principles to personal file management—files identified by content, not arbitrary names.

Photographers with thousands of duplicated RAW files across backup drives would find instant value.

## Revenue Model

**Uncertain:**
- One-time purchase ($9-19)?
- Utility app, hard to monetize
- Open source more realistic

## Build Complexity

**High** — Estimated 60-100 hours

**Breakdown:**
- File System Access API integration — 15 hours
- Hash database (IndexedDB) — 15 hours
- Duplicate detection algorithm — 10 hours
- Content-addressable organization — 15 hours
- UI for duplicate review — 12 hours
- Compression/archiving — 8 hours
- Testing across platforms — 15 hours

**Platform issue:** Browser File System Access API has limitations. Desktop app (Electron/Tauri) would be significantly better.

## Success Metrics

- 1,000-5,000 users
- Open source with donations

## Next Steps

- [ ] Assess: Should this be desktop app instead of browser?
- [ ] If browser: Prototype with File System Access API
- [ ] If desktop: Use Tauri for smaller binary
- [ ] Likely decision: Open source utility, not commercial product

---

**Last updated:** January 2026
