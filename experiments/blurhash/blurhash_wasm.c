/**
 * BlurHash WASM Wrapper
 * Exposes blurhash encode/decode functions to JavaScript via Emscripten
 */

#include <emscripten.h>
#include <stdlib.h>
#include <string.h>
#include "repo/C/encode.h"
#include "repo/C/decode.h"

// Re-export decode functions directly
EMSCRIPTEN_KEEPALIVE
uint8_t* blurhash_decode(const char* blurhash, int width, int height, int punch, int nChannels) {
    return decode(blurhash, width, height, punch, nChannels);
}

EMSCRIPTEN_KEEPALIVE
int blurhash_decode_to_array(const char* blurhash, int width, int height, int punch, int nChannels, uint8_t* pixelArray) {
    return decodeToArray(blurhash, width, height, punch, nChannels, pixelArray);
}

EMSCRIPTEN_KEEPALIVE
int blurhash_is_valid(const char* blurhash) {
    return isValidBlurhash(blurhash) ? 1 : 0;
}

EMSCRIPTEN_KEEPALIVE
void blurhash_free(uint8_t* pixelArray) {
    freePixelArray(pixelArray);
}

// Encode function - takes pixel data and returns hash string
EMSCRIPTEN_KEEPALIVE
const char* blurhash_encode(int xComponents, int yComponents, int width, int height, uint8_t* rgb, int bytesPerRow) {
    return blurHashForPixels(xComponents, yComponents, width, height, rgb, (size_t)bytesPerRow);
}

// Helper to allocate memory for pixel input from JS
EMSCRIPTEN_KEEPALIVE
uint8_t* blurhash_alloc(int size) {
    return (uint8_t*)malloc(size);
}

// Get version for testing
EMSCRIPTEN_KEEPALIVE
const char* blurhash_version() {
    return "blurhash-wasm 1.0.0";
}
