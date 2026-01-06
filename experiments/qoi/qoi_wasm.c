#include <emscripten.h>
#include <stdlib.h>
#include <string.h>

#define QOI_IMPLEMENTATION
#define QOI_MALLOC(sz) malloc(sz)
#define QOI_FREE(p) free(p)
#include "repo/qoi.h"

// Encode RGBA pixels to QOI format
// Returns pointer to encoded data (caller must free with qoi_free_encoded)
EMSCRIPTEN_KEEPALIVE
unsigned char* qoi_encode_rgba(const unsigned char* pixels, int width, int height, int* out_len) {
    qoi_desc desc = {
        .width = width,
        .height = height,
        .channels = 4,
        .colorspace = QOI_SRGB
    };

    return qoi_encode(pixels, &desc, out_len);
}

// Encode RGB pixels to QOI format
EMSCRIPTEN_KEEPALIVE
unsigned char* qoi_encode_rgb(const unsigned char* pixels, int width, int height, int* out_len) {
    qoi_desc desc = {
        .width = width,
        .height = height,
        .channels = 3,
        .colorspace = QOI_SRGB
    };

    return qoi_encode(pixels, &desc, out_len);
}

// Decode QOI format to RGBA pixels
// Returns pointer to decoded pixels (caller must free with qoi_free_decoded)
EMSCRIPTEN_KEEPALIVE
unsigned char* qoi_decode_to_rgba(const unsigned char* data, int size, int* out_width, int* out_height) {
    qoi_desc desc;
    unsigned char* pixels = qoi_decode(data, size, &desc, 4);

    if (pixels) {
        *out_width = desc.width;
        *out_height = desc.height;
    }

    return pixels;
}

// Decode QOI format to RGB pixels
EMSCRIPTEN_KEEPALIVE
unsigned char* qoi_decode_to_rgb(const unsigned char* data, int size, int* out_width, int* out_height) {
    qoi_desc desc;
    unsigned char* pixels = qoi_decode(data, size, &desc, 3);

    if (pixels) {
        *out_width = desc.width;
        *out_height = desc.height;
    }

    return pixels;
}

// Free encoded data
EMSCRIPTEN_KEEPALIVE
void qoi_free_encoded(void* data) {
    free(data);
}

// Free decoded pixels
EMSCRIPTEN_KEEPALIVE
void qoi_free_decoded(void* data) {
    free(data);
}

EMSCRIPTEN_KEEPALIVE
const char* qoi_wasm_version() {
    return "qoi-wasm 1.0.0";
}
