/**
 * Simple server for FFmpeg.wasm testing
 * Adds required COOP/COEP headers for SharedArrayBuffer support
 */

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname;

    // Default to index.html
    if (path === "/") {
      path = "/index.html";
    }

    // Try to serve the file
    const file = Bun.file(`${import.meta.dir}${path}`);
    if (await file.exists()) {
      const contentType = getContentType(path);
      return new Response(file, {
        headers: {
          "Content-Type": contentType,
          // Required for SharedArrayBuffer (FFmpeg threading)
          "Cross-Origin-Opener-Policy": "same-origin",
          "Cross-Origin-Embedder-Policy": "require-corp",
        },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

function getContentType(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase();
  const types: Record<string, string> = {
    html: "text/html",
    js: "application/javascript",
    mjs: "application/javascript",
    css: "text/css",
    json: "application/json",
    wasm: "application/wasm",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    avif: "image/avif",
    svg: "image/svg+xml",
  };
  return types[ext || ""] || "application/octet-stream";
}

console.log(`
╔══════════════════════════════════════════════════════════╗
║  FFmpeg.wasm Image Compressor Test Server                ║
╠══════════════════════════════════════════════════════════╣
║  URL: http://localhost:${server.port}                           ║
║                                                          ║
║  COOP/COEP headers enabled for SharedArrayBuffer         ║
║  Press Ctrl+C to stop                                    ║
╚══════════════════════════════════════════════════════════╝
`);
