# FFmpeg.wasm Research

**Date:** 2026-01-05
**Status:** WORKING - Test harness built

## Summary

FFmpeg.wasm is a mature, pre-built WASM solution for browser-based media processing. Unlike building your own WASM conversions, this is ready to use.

## Key Findings

### Advantages
- **Pre-built**: No compilation required - just import
- **Feature-rich**: Full FFmpeg capabilities (video, audio, images)
- **Privacy-first**: All processing happens client-side
- **Well-documented**: Active community, good examples

### Challenges
- **Large bundle**: ~30MB WASM binary download
- **Browser-only**: Does NOT support Node.js/Bun
- **Requires COOP/COEP headers**: SharedArrayBuffer needs cross-origin isolation
- **AVIF encoding slow**: Complex codecs take 5-10x longer

## Implementation Details

### Required HTTP Headers

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

### Basic Usage Pattern

```javascript
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

const ffmpeg = new FFmpeg();

// Load WASM (async, ~30MB)
await ffmpeg.load({
  coreURL: await toBlobURL('ffmpeg-core.js', 'text/javascript'),
  wasmURL: await toBlobURL('ffmpeg-core.wasm', 'application/wasm'),
});

// Write input file
await ffmpeg.writeFile('input.jpg', await fetchFile(file));

// Run FFmpeg command
await ffmpeg.exec(['-i', 'input.jpg', '-c:v', 'libwebp', '-quality', '80', 'output.webp']);

// Read output
const data = await ffmpeg.readFile('output.webp');
const blob = new Blob([data], { type: 'image/webp' });
```

### Format-Specific Commands

| Format | Command Flags |
|--------|---------------|
| WebP | `-c:v libwebp -quality 80` |
| AVIF | `-c:v libaom-av1 -crf 30 -still-picture 1` |
| JPEG | `-q:v 5` (lower = better, 2-31) |
| PNG | (lossless, no quality flag) |

## Test Harness

Built a working test harness at:
`experiments/ffmpeg-image-compressor/`

Features:
- Drag & drop upload
- WebP/AVIF/JPEG/PNG conversion
- Quality selection (50-90)
- Size comparison stats
- Processing time measurement

Run with: `bun run server.ts`

## Performance Expectations

| Operation | Typical Time |
|-----------|--------------|
| WASM load | 2-5s (first time, cached after) |
| JPEG conversion | 1-2s |
| WebP conversion | 1-3s |
| AVIF conversion | 5-15s |

## Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome 91+ | Full |
| Firefox 79+ | Full |
| Safari 15.2+ | Limited (threading) |
| Edge 91+ | Full |

## Verdict: BUILD THIS

FFmpeg.wasm is **ready to ship**:
- ✅ Pre-built, no compilation
- ✅ Working test harness created
- ✅ Privacy-first architecture
- ✅ Real use case (image compression)

**Recommendation**: Use this as the foundation for a WASM Image Compressor utility.

## Sources

- [FFmpeg.wasm GitHub](https://github.com/ffmpegwasm/ffmpeg.wasm)
- [Official Documentation](https://ffmpegwasm.netlify.app/docs/overview/)
- [Telerik Tutorial](https://www.telerik.com/blogs/browser-image-conversion-using-ffmpeg.wasm)
- [Squoosh by Google](https://squoosh.app/) - Similar architecture inspiration
