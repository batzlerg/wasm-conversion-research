# FFmpeg.wasm Image Compressor Test Harness

Browser-based image compression using FFmpeg compiled to WebAssembly.

## Quick Start

```bash
bun run server.ts
# Open http://localhost:3000
```

## Features

- Drag & drop image upload
- Convert to WebP, AVIF, JPEG, PNG
- Adjustable quality settings
- Shows compression stats (size reduction, processing time)
- Side-by-side preview
- All processing happens locally (privacy-first)

## Technical Notes

### Required HTTP Headers

FFmpeg.wasm uses SharedArrayBuffer for threading. This requires:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

The included `server.ts` provides these headers.

### Dependencies

- `@ffmpeg/ffmpeg` - JavaScript wrapper
- `@ffmpeg/core` - WASM binary (~30MB)
- `@ffmpeg/util` - File handling utilities

### Browser Compatibility

- Chrome 91+ (full support)
- Firefox 79+ (full support)
- Safari 15.2+ (limited WASM threading)
- Edge 91+ (full support)

## Performance Notes

From testing:
- Initial load: ~30MB WASM download
- Image conversion: 1-5 seconds depending on size/format
- AVIF encoding is slowest but produces best quality/size ratio
- WebP is fastest for general use

## Limitations

- Browser-only (no Node.js support)
- Large WASM binary (~30MB)
- Requires COOP/COEP headers
- AVIF encoding can be slow
