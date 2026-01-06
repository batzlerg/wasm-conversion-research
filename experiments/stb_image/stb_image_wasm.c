/**
 * stb_image WASM Wrapper
 * Image loading for web applications
 */

#include <emscripten.h>
#include <stdlib.h>
#include <string.h>

#define STB_IMAGE_IMPLEMENTATION
#define STBI_NO_STDIO  // Don't need file I/O in WASM
#include "repo/stb_image.h"

// Result struct to return image data and metadata
typedef struct {
    unsigned char* data;
    int width;
    int height;
    int channels;
} ImageResult;

// Global result for returning structured data
static ImageResult g_result;

/**
 * Load image from memory buffer
 * @param buffer Input image data (JPG, PNG, BMP, GIF, etc.)
 * @param len Length of input buffer
 * @param desired_channels 0 = auto, 1 = grey, 2 = grey+alpha, 3 = RGB, 4 = RGBA
 * @return Pointer to ImageResult struct (use getters below)
 */
EMSCRIPTEN_KEEPALIVE
ImageResult* stb_load_image(const unsigned char* buffer, int len, int desired_channels) {
    if (g_result.data) {
        stbi_image_free(g_result.data);
        g_result.data = NULL;
    }

    g_result.data = stbi_load_from_memory(buffer, len, &g_result.width, &g_result.height, &g_result.channels, desired_channels);

    // If desired_channels was specified, update channels to reflect actual output
    if (desired_channels > 0 && g_result.data) {
        g_result.channels = desired_channels;
    }

    return &g_result;
}

/**
 * Get info about image without decoding
 * @return 1 on success, 0 on failure
 */
EMSCRIPTEN_KEEPALIVE
int stb_get_info(const unsigned char* buffer, int len, int* width, int* height, int* channels) {
    return stbi_info_from_memory(buffer, len, width, height, channels);
}

// Getters for result data
EMSCRIPTEN_KEEPALIVE
unsigned char* stb_get_data() {
    return g_result.data;
}

EMSCRIPTEN_KEEPALIVE
int stb_get_width() {
    return g_result.width;
}

EMSCRIPTEN_KEEPALIVE
int stb_get_height() {
    return g_result.height;
}

EMSCRIPTEN_KEEPALIVE
int stb_get_channels() {
    return g_result.channels;
}

EMSCRIPTEN_KEEPALIVE
int stb_get_data_size() {
    if (!g_result.data) return 0;
    return g_result.width * g_result.height * g_result.channels;
}

/**
 * Free the loaded image data
 */
EMSCRIPTEN_KEEPALIVE
void stb_free_image() {
    if (g_result.data) {
        stbi_image_free(g_result.data);
        g_result.data = NULL;
        g_result.width = 0;
        g_result.height = 0;
        g_result.channels = 0;
    }
}

/**
 * Get last error message
 */
EMSCRIPTEN_KEEPALIVE
const char* stb_get_error() {
    return stbi_failure_reason();
}

/**
 * Check if specific format is supported
 */
EMSCRIPTEN_KEEPALIVE
int stb_is_png(const unsigned char* buffer, int len) {
    return stbi_info_from_memory(buffer, len, NULL, NULL, NULL) &&
           len >= 8 && buffer[0] == 0x89 && buffer[1] == 'P' && buffer[2] == 'N' && buffer[3] == 'G';
}

EMSCRIPTEN_KEEPALIVE
int stb_is_jpg(const unsigned char* buffer, int len) {
    return len >= 2 && buffer[0] == 0xFF && buffer[1] == 0xD8;
}

EMSCRIPTEN_KEEPALIVE
int stb_is_gif(const unsigned char* buffer, int len) {
    return len >= 6 && buffer[0] == 'G' && buffer[1] == 'I' && buffer[2] == 'F';
}

EMSCRIPTEN_KEEPALIVE
int stb_is_bmp(const unsigned char* buffer, int len) {
    return len >= 2 && buffer[0] == 'B' && buffer[1] == 'M';
}

// HDR image support
EMSCRIPTEN_KEEPALIVE
int stb_is_hdr(const unsigned char* buffer, int len) {
    return stbi_is_hdr_from_memory(buffer, len);
}

/**
 * Load HDR image (returns float data)
 */
static float* g_hdr_data = NULL;
static int g_hdr_width = 0;
static int g_hdr_height = 0;
static int g_hdr_channels = 0;

EMSCRIPTEN_KEEPALIVE
float* stb_load_hdr(const unsigned char* buffer, int len, int desired_channels) {
    if (g_hdr_data) {
        stbi_image_free(g_hdr_data);
        g_hdr_data = NULL;
    }

    g_hdr_data = stbi_loadf_from_memory(buffer, len, &g_hdr_width, &g_hdr_height, &g_hdr_channels, desired_channels);

    if (desired_channels > 0 && g_hdr_data) {
        g_hdr_channels = desired_channels;
    }

    return g_hdr_data;
}

EMSCRIPTEN_KEEPALIVE
int stb_get_hdr_width() { return g_hdr_width; }

EMSCRIPTEN_KEEPALIVE
int stb_get_hdr_height() { return g_hdr_height; }

EMSCRIPTEN_KEEPALIVE
int stb_get_hdr_channels() { return g_hdr_channels; }

EMSCRIPTEN_KEEPALIVE
int stb_get_hdr_data_size() {
    if (!g_hdr_data) return 0;
    return g_hdr_width * g_hdr_height * g_hdr_channels * sizeof(float);
}

EMSCRIPTEN_KEEPALIVE
void stb_free_hdr() {
    if (g_hdr_data) {
        stbi_image_free(g_hdr_data);
        g_hdr_data = NULL;
        g_hdr_width = 0;
        g_hdr_height = 0;
        g_hdr_channels = 0;
    }
}
