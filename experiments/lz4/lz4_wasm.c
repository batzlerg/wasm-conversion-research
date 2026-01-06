/**
 * LZ4 WASM Wrapper
 * Exposes LZ4 compression/decompression to JavaScript
 */

#include <emscripten.h>
#include <stdlib.h>
#include <string.h>
#include "repo/lib/lz4.h"

// Version
EMSCRIPTEN_KEEPALIVE
const char* lz4_version() {
    return LZ4_versionString();
}

EMSCRIPTEN_KEEPALIVE
int lz4_version_number() {
    return LZ4_versionNumber();
}

// Memory allocation helpers
EMSCRIPTEN_KEEPALIVE
char* lz4_alloc(int size) {
    return (char*)malloc(size);
}

EMSCRIPTEN_KEEPALIVE
void lz4_free(void* ptr) {
    free(ptr);
}

// Get maximum compressed size for given input size
EMSCRIPTEN_KEEPALIVE
int lz4_compress_bound(int inputSize) {
    return LZ4_compressBound(inputSize);
}

// Compress data
// Returns: compressed size, or 0 if error
EMSCRIPTEN_KEEPALIVE
int lz4_compress(const char* src, char* dst, int srcSize, int dstCapacity) {
    return LZ4_compress_default(src, dst, srcSize, dstCapacity);
}

// Fast compress with acceleration (1 = default, higher = faster but worse ratio)
EMSCRIPTEN_KEEPALIVE
int lz4_compress_fast(const char* src, char* dst, int srcSize, int dstCapacity, int acceleration) {
    return LZ4_compress_fast(src, dst, srcSize, dstCapacity, acceleration);
}

// Decompress data
// Returns: decompressed size, or negative value if error
EMSCRIPTEN_KEEPALIVE
int lz4_decompress(const char* src, char* dst, int compressedSize, int dstCapacity) {
    return LZ4_decompress_safe(src, dst, compressedSize, dstCapacity);
}

// Partial decompression
EMSCRIPTEN_KEEPALIVE
int lz4_decompress_partial(const char* src, char* dst, int compressedSize, int targetOutputSize, int dstCapacity) {
    return LZ4_decompress_safe_partial(src, dst, compressedSize, targetOutputSize, dstCapacity);
}

// High-level compress that allocates output buffer
// Returns pointer to compressed data (caller must free with lz4_free)
// Stores compressed size in *outSize
EMSCRIPTEN_KEEPALIVE
char* lz4_compress_alloc(const char* src, int srcSize, int* outSize) {
    int maxSize = LZ4_compressBound(srcSize);
    char* dst = (char*)malloc(maxSize);
    if (!dst) {
        *outSize = 0;
        return NULL;
    }

    int compressedSize = LZ4_compress_default(src, dst, srcSize, maxSize);
    if (compressedSize <= 0) {
        free(dst);
        *outSize = 0;
        return NULL;
    }

    *outSize = compressedSize;
    return dst;
}

// High-level decompress that allocates output buffer
// originalSize must be known (stored separately when compressing)
EMSCRIPTEN_KEEPALIVE
char* lz4_decompress_alloc(const char* src, int compressedSize, int originalSize, int* outSize) {
    char* dst = (char*)malloc(originalSize);
    if (!dst) {
        *outSize = 0;
        return NULL;
    }

    int decompressedSize = LZ4_decompress_safe(src, dst, compressedSize, originalSize);
    if (decompressedSize < 0) {
        free(dst);
        *outSize = 0;
        return NULL;
    }

    *outSize = decompressedSize;
    return dst;
}
