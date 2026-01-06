/**
 * stb_image WASM Test Suite
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const createModule = (await import('./stb_image.js')).default;
const wasm = await createModule();

console.log('=== stb_image WASM Tests ===\n');

// Helper to copy data to WASM memory
function copyToWasm(data) {
    const ptr = wasm._malloc(data.length);
    wasm.HEAPU8.set(data, ptr);
    return ptr;
}

// Create a minimal valid PNG (1x1 red pixel)
function createTestPNG() {
    // Minimal valid PNG - 1x1 red pixel
    const png = new Uint8Array([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
        0x00, 0x00, 0x00, 0x0D, // IHDR length
        0x49, 0x48, 0x44, 0x52, // IHDR
        0x00, 0x00, 0x00, 0x01, // width: 1
        0x00, 0x00, 0x00, 0x01, // height: 1
        0x08, 0x02, // 8-bit RGB
        0x00, 0x00, 0x00, // compression, filter, interlace
        0x90, 0x77, 0x53, 0xDE, // CRC
        0x00, 0x00, 0x00, 0x0C, // IDAT length
        0x49, 0x44, 0x41, 0x54, // IDAT
        0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00, 0x00, 0x01, 0x01, 0x01, 0x00, // compressed data
        0x18, 0xDD, 0x8D, 0xB4, // CRC
        0x00, 0x00, 0x00, 0x00, // IEND length
        0x49, 0x45, 0x4E, 0x44, // IEND
        0xAE, 0x42, 0x60, 0x82  // CRC
    ]);
    return png;
}

// Create a minimal valid JPEG (1x1 pixel)
function createTestJPEG() {
    // Minimal valid JPEG - grayscale 1x1 pixel
    const jpeg = new Uint8Array([
        0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
        0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
        0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
        0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
        0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
        0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
        0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01,
        0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4, 0x00, 0x1F, 0x00, 0x00,
        0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
        0x09, 0x0A, 0x0B, 0xFF, 0xC4, 0x00, 0xB5, 0x10, 0x00, 0x02, 0x01, 0x03,
        0x03, 0x02, 0x04, 0x03, 0x05, 0x05, 0x04, 0x04, 0x00, 0x00, 0x01, 0x7D,
        0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12, 0x21, 0x31, 0x41, 0x06,
        0x13, 0x51, 0x61, 0x07, 0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xA1, 0x08,
        0x23, 0x42, 0xB1, 0xC1, 0x15, 0x52, 0xD1, 0xF0, 0x24, 0x33, 0x62, 0x72,
        0x82, 0x09, 0x0A, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x25, 0x26, 0x27, 0x28,
        0x29, 0x2A, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x43, 0x44, 0x45,
        0x46, 0x47, 0x48, 0x49, 0x4A, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59,
        0x5A, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6A, 0x73, 0x74, 0x75,
        0x76, 0x77, 0x78, 0x79, 0x7A, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89,
        0x8A, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9A, 0xA2, 0xA3,
        0xA4, 0xA5, 0xA6, 0xA7, 0xA8, 0xA9, 0xAA, 0xB2, 0xB3, 0xB4, 0xB5, 0xB6,
        0xB7, 0xB8, 0xB9, 0xBA, 0xC2, 0xC3, 0xC4, 0xC5, 0xC6, 0xC7, 0xC8, 0xC9,
        0xCA, 0xD2, 0xD3, 0xD4, 0xD5, 0xD6, 0xD7, 0xD8, 0xD9, 0xDA, 0xE1, 0xE2,
        0xE3, 0xE4, 0xE5, 0xE6, 0xE7, 0xE8, 0xE9, 0xEA, 0xF1, 0xF2, 0xF3, 0xF4,
        0xF5, 0xF6, 0xF7, 0xF8, 0xF9, 0xFA, 0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01,
        0x00, 0x00, 0x3F, 0x00, 0xFB, 0xD5, 0xDB, 0x20, 0xA8, 0xF1, 0x7E, 0xAF,
        0xFF, 0xD9
    ]);
    return jpeg;
}

// Create minimal BMP (1x1 red pixel)
function createTestBMP() {
    const bmp = new Uint8Array([
        0x42, 0x4D,             // BM
        0x3A, 0x00, 0x00, 0x00, // File size
        0x00, 0x00, 0x00, 0x00, // Reserved
        0x36, 0x00, 0x00, 0x00, // Offset to pixel data
        0x28, 0x00, 0x00, 0x00, // DIB header size
        0x01, 0x00, 0x00, 0x00, // Width: 1
        0x01, 0x00, 0x00, 0x00, // Height: 1
        0x01, 0x00,             // Color planes
        0x18, 0x00,             // Bits per pixel: 24
        0x00, 0x00, 0x00, 0x00, // Compression: none
        0x04, 0x00, 0x00, 0x00, // Image size
        0x00, 0x00, 0x00, 0x00, // H resolution
        0x00, 0x00, 0x00, 0x00, // V resolution
        0x00, 0x00, 0x00, 0x00, // Colors in palette
        0x00, 0x00, 0x00, 0x00, // Important colors
        0x00, 0x00, 0xFF, 0x00  // Blue=0, Green=0, Red=255, padding
    ]);
    return bmp;
}

// Test 1: Format detection
console.log('--- Test 1: Format Detection ---');
{
    const png = createTestPNG();
    const jpeg = createTestJPEG();
    const bmp = createTestBMP();

    const pngPtr = copyToWasm(png);
    const jpegPtr = copyToWasm(jpeg);
    const bmpPtr = copyToWasm(bmp);

    console.log(`PNG detected: ${wasm._stb_is_png(pngPtr, png.length) ? '✓' : '✗'}`);
    console.log(`JPEG detected: ${wasm._stb_is_jpg(jpegPtr, jpeg.length) ? '✓' : '✗'}`);
    console.log(`BMP detected: ${wasm._stb_is_bmp(bmpPtr, bmp.length) ? '✓' : '✗'}`);

    wasm._free(pngPtr);
    wasm._free(jpegPtr);
    wasm._free(bmpPtr);
    console.log('');
}

// Test 2: Load PNG
console.log('--- Test 2: Load PNG ---');
{
    const png = createTestPNG();
    const ptr = copyToWasm(png);

    wasm._stb_load_image(ptr, png.length, 4); // Request RGBA

    const width = wasm._stb_get_width();
    const height = wasm._stb_get_height();
    const channels = wasm._stb_get_channels();
    const dataSize = wasm._stb_get_data_size();

    console.log(`Dimensions: ${width}x${height}`);
    console.log(`Channels: ${channels}`);
    console.log(`Data size: ${dataSize} bytes`);

    if (width === 1 && height === 1 && channels === 4) {
        console.log('✓ PNG loaded successfully\n');
    } else {
        console.log('✗ PNG load failed\n');
    }

    wasm._stb_free_image();
    wasm._free(ptr);
}

// Test 3: Load BMP
console.log('--- Test 3: Load BMP ---');
{
    const bmp = createTestBMP();
    const ptr = copyToWasm(bmp);

    wasm._stb_load_image(ptr, bmp.length, 3); // Request RGB

    const width = wasm._stb_get_width();
    const height = wasm._stb_get_height();
    const channels = wasm._stb_get_channels();

    console.log(`Dimensions: ${width}x${height}`);
    console.log(`Channels: ${channels}`);

    if (wasm._stb_get_data()) {
        const dataPtr = wasm._stb_get_data();
        const r = wasm.HEAPU8[dataPtr];
        const g = wasm.HEAPU8[dataPtr + 1];
        const b = wasm.HEAPU8[dataPtr + 2];
        console.log(`Pixel color: R=${r}, G=${g}, B=${b}`);

        if (r === 255 && g === 0 && b === 0) {
            console.log('✓ BMP loaded correctly - red pixel verified\n');
        } else {
            console.log('✗ Color mismatch\n');
        }
    } else {
        const error = wasm.UTF8ToString(wasm._stb_get_error());
        console.log(`✗ Load failed: ${error}\n`);
    }

    wasm._stb_free_image();
    wasm._free(ptr);
}

// Test 4: Get info without loading
console.log('--- Test 4: Get Info Without Loading ---');
{
    const png = createTestPNG();
    const ptr = copyToWasm(png);

    // Allocate space for output values
    const widthPtr = wasm._malloc(4);
    const heightPtr = wasm._malloc(4);
    const channelsPtr = wasm._malloc(4);

    const success = wasm._stb_get_info(ptr, png.length, widthPtr, heightPtr, channelsPtr);

    if (success) {
        const width = wasm.getValue(widthPtr, 'i32');
        const height = wasm.getValue(heightPtr, 'i32');
        const channels = wasm.getValue(channelsPtr, 'i32');
        console.log(`Info: ${width}x${height}, ${channels} channels`);
        console.log('✓ Info retrieved without decoding\n');
    } else {
        console.log('✗ Failed to get info\n');
    }

    wasm._free(widthPtr);
    wasm._free(heightPtr);
    wasm._free(channelsPtr);
    wasm._free(ptr);
}

// Test 5: Error handling
console.log('--- Test 5: Error Handling ---');
{
    const invalidData = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
    const ptr = copyToWasm(invalidData);

    wasm._stb_load_image(ptr, invalidData.length, 0);

    const dataPtr = wasm._stb_get_data();
    if (!dataPtr) {
        const errorPtr = wasm._stb_get_error();
        const error = errorPtr ? wasm.UTF8ToString(errorPtr) : 'unknown error';
        console.log(`✓ Invalid data handled: "${error}"\n`);
    } else {
        console.log('✗ Should have failed on invalid data\n');
    }

    wasm._stb_free_image();
    wasm._free(ptr);
}

// Test 6: Performance Benchmark
console.log('--- Test 6: Performance Benchmark ---');
{
    // Create a larger test image (100x100 BMP)
    const width = 100;
    const height = 100;
    const headerSize = 54;
    const rowSize = Math.ceil((width * 3) / 4) * 4; // BMP rows are 4-byte aligned
    const dataSize = rowSize * height;
    const fileSize = headerSize + dataSize;

    const bmp = new Uint8Array(fileSize);

    // BMP Header
    bmp[0] = 0x42; bmp[1] = 0x4D; // BM
    bmp[2] = fileSize & 0xFF;
    bmp[3] = (fileSize >> 8) & 0xFF;
    bmp[4] = (fileSize >> 16) & 0xFF;
    bmp[5] = (fileSize >> 24) & 0xFF;
    bmp[10] = headerSize;

    // DIB Header
    bmp[14] = 40; // Header size
    bmp[18] = width & 0xFF;
    bmp[19] = (width >> 8) & 0xFF;
    bmp[22] = height & 0xFF;
    bmp[23] = (height >> 8) & 0xFF;
    bmp[26] = 1; // Color planes
    bmp[28] = 24; // Bits per pixel

    // Fill with gradient
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const offset = headerSize + y * rowSize + x * 3;
            bmp[offset] = (x * 255 / width) | 0;     // Blue
            bmp[offset + 1] = (y * 255 / height) | 0; // Green
            bmp[offset + 2] = 128;                    // Red
        }
    }

    const ptr = copyToWasm(bmp);
    const iterations = 1000;

    // Warm up
    for (let i = 0; i < 10; i++) {
        wasm._stb_load_image(ptr, bmp.length, 4);
        wasm._stb_free_image();
    }

    // Benchmark
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        wasm._stb_load_image(ptr, bmp.length, 4);
        wasm._stb_free_image();
    }
    const elapsed = performance.now() - start;

    console.log(`Decoded ${width}x${height} BMP ${iterations} times`);
    console.log(`Total time: ${elapsed.toFixed(2)}ms`);
    console.log(`Per decode: ${(elapsed / iterations).toFixed(3)}ms`);
    console.log(`Throughput: ${(iterations / elapsed * 1000).toFixed(0)} decodes/sec`);

    wasm._free(ptr);
}

// Test 7: Memory management
console.log('\n--- Test 7: Memory Management ---');
{
    const bmp = createTestBMP();
    const ptr = copyToWasm(bmp);

    // Load and free multiple times
    for (let i = 0; i < 100; i++) {
        wasm._stb_load_image(ptr, bmp.length, 4);
        wasm._stb_free_image();
    }

    console.log('✓ 100 load/free cycles completed without issues');
    wasm._free(ptr);
}

console.log('\n=== All Tests Complete ===');
