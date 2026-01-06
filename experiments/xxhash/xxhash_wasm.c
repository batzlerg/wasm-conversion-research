/**
 * xxHash WASM Wrapper
 * Extremely fast hash algorithm
 */

#include <emscripten.h>
#include <stdlib.h>
#include <stdint.h>

#define XXH_INLINE_ALL
#include "repo/xxhash.h"

/**
 * Compute 32-bit xxHash
 */
EMSCRIPTEN_KEEPALIVE
uint32_t xxhash32(const void* data, size_t len, uint32_t seed) {
    return XXH32(data, len, seed);
}

/**
 * Compute 64-bit xxHash
 */
EMSCRIPTEN_KEEPALIVE
uint64_t xxhash64(const void* data, size_t len, uint64_t seed) {
    return XXH64(data, len, seed);
}

/**
 * Compute 64-bit xxHash and return as two 32-bit values (for JS compatibility)
 * Returns pointer to static array [low32, high32]
 */
static uint32_t xxhash64_result[2];

EMSCRIPTEN_KEEPALIVE
uint32_t* xxhash64_split(const void* data, size_t len, uint32_t seed_low, uint32_t seed_high) {
    uint64_t seed = ((uint64_t)seed_high << 32) | seed_low;
    uint64_t hash = XXH64(data, len, seed);
    xxhash64_result[0] = (uint32_t)(hash & 0xFFFFFFFF);
    xxhash64_result[1] = (uint32_t)(hash >> 32);
    return xxhash64_result;
}

/**
 * XXH3 64-bit (fastest for medium-sized data)
 */
EMSCRIPTEN_KEEPALIVE
uint32_t* xxh3_64(const void* data, size_t len) {
    uint64_t hash = XXH3_64bits(data, len);
    xxhash64_result[0] = (uint32_t)(hash & 0xFFFFFFFF);
    xxhash64_result[1] = (uint32_t)(hash >> 32);
    return xxhash64_result;
}

/**
 * XXH3 64-bit with seed
 */
EMSCRIPTEN_KEEPALIVE
uint32_t* xxh3_64_withSeed(const void* data, size_t len, uint32_t seed_low, uint32_t seed_high) {
    uint64_t seed = ((uint64_t)seed_high << 32) | seed_low;
    uint64_t hash = XXH3_64bits_withSeed(data, len, seed);
    xxhash64_result[0] = (uint32_t)(hash & 0xFFFFFFFF);
    xxhash64_result[1] = (uint32_t)(hash >> 32);
    return xxhash64_result;
}

/**
 * XXH3 128-bit (strongest)
 * Returns pointer to static array [low0, high0, low1, high1]
 */
static uint32_t xxhash128_result[4];

EMSCRIPTEN_KEEPALIVE
uint32_t* xxh3_128(const void* data, size_t len) {
    XXH128_hash_t hash = XXH3_128bits(data, len);
    xxhash128_result[0] = (uint32_t)(hash.low64 & 0xFFFFFFFF);
    xxhash128_result[1] = (uint32_t)(hash.low64 >> 32);
    xxhash128_result[2] = (uint32_t)(hash.high64 & 0xFFFFFFFF);
    xxhash128_result[3] = (uint32_t)(hash.high64 >> 32);
    return xxhash128_result;
}

// Streaming API for large data

static XXH3_state_t* g_streaming_state = NULL;

EMSCRIPTEN_KEEPALIVE
int xxh3_streaming_init(void) {
    if (g_streaming_state) {
        XXH3_freeState(g_streaming_state);
    }
    g_streaming_state = XXH3_createState();
    if (!g_streaming_state) return 0;
    XXH3_64bits_reset(g_streaming_state);
    return 1;
}

EMSCRIPTEN_KEEPALIVE
int xxh3_streaming_update(const void* data, size_t len) {
    if (!g_streaming_state) return 0;
    return XXH3_64bits_update(g_streaming_state, data, len) == XXH_OK;
}

EMSCRIPTEN_KEEPALIVE
uint32_t* xxh3_streaming_digest(void) {
    if (!g_streaming_state) {
        xxhash64_result[0] = 0;
        xxhash64_result[1] = 0;
        return xxhash64_result;
    }
    uint64_t hash = XXH3_64bits_digest(g_streaming_state);
    xxhash64_result[0] = (uint32_t)(hash & 0xFFFFFFFF);
    xxhash64_result[1] = (uint32_t)(hash >> 32);
    return xxhash64_result;
}

EMSCRIPTEN_KEEPALIVE
void xxh3_streaming_free(void) {
    if (g_streaming_state) {
        XXH3_freeState(g_streaming_state);
        g_streaming_state = NULL;
    }
}

/**
 * Get version
 */
EMSCRIPTEN_KEEPALIVE
const char* xxhash_version(void) {
    return "xxhash-wasm 1.0.0";
}
