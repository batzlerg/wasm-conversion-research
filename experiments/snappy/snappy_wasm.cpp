/**
 * Snappy WASM Wrapper
 * Google's fast compression/decompression
 */

#include <emscripten.h>
#include <cstdlib>
#include <cstring>

// Need to create the config header that cmake would generate
#define HAVE_BUILTIN_CTZ 1
#define HAVE_BUILTIN_EXPECT 1
#define SNAPPY_HAVE_SSSE3 0
#define SNAPPY_HAVE_X86_CRC32 0
#define SNAPPY_HAVE_NEON 0
#define SNAPPY_HAVE_NEON_CRC32 0
#define SNAPPY_HAVE_BMI2 0
#define SNAPPY_HAVE_ATTRIBUTE_ALWAYS_INLINE 1

#include "repo/snappy.h"
#include "repo/snappy-c.h"

extern "C" {

/**
 * Compress data
 * @param input Input data
 * @param input_length Length of input
 * @param output Pre-allocated output buffer
 * @param output_length Pointer to output length (in: capacity, out: actual size)
 * @return 0 on success
 */
EMSCRIPTEN_KEEPALIVE
int snappy_wasm_compress(const char* input, size_t input_length,
                         char* output, size_t* output_length) {
    return snappy_compress(input, input_length, output, output_length);
}

/**
 * Decompress data
 * @param input Compressed input
 * @param input_length Length of compressed input
 * @param output Pre-allocated output buffer
 * @param output_length Pointer to output length (in: capacity, out: actual size)
 * @return 0 on success
 */
EMSCRIPTEN_KEEPALIVE
int snappy_wasm_uncompress(const char* input, size_t input_length,
                           char* output, size_t* output_length) {
    return snappy_uncompress(input, input_length, output, output_length);
}

/**
 * Get maximum compressed length for given input size
 */
EMSCRIPTEN_KEEPALIVE
size_t snappy_wasm_max_compressed_length(size_t source_length) {
    return snappy_max_compressed_length(source_length);
}

/**
 * Get uncompressed length from compressed data
 * @param compressed Compressed data
 * @param compressed_length Length of compressed data
 * @param result Pointer to store uncompressed length
 * @return 0 on success
 */
EMSCRIPTEN_KEEPALIVE
int snappy_wasm_uncompressed_length(const char* compressed, size_t compressed_length,
                                    size_t* result) {
    return snappy_uncompressed_length(compressed, compressed_length, result);
}

/**
 * Validate compressed buffer
 * @return 0 if valid
 */
EMSCRIPTEN_KEEPALIVE
int snappy_wasm_validate(const char* compressed, size_t compressed_length) {
    return snappy_validate_compressed_buffer(compressed, compressed_length);
}

/**
 * Get version string
 */
EMSCRIPTEN_KEEPALIVE
const char* snappy_wasm_version() {
    return "snappy-wasm 1.0.0";
}

} // extern "C"
