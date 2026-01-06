/**
 * QOI (Quite OK Image) WASM Test Suite
 */

const createModule = (await import('./qoi.js')).default;
const wasm = await createModule();

console.log('=== QOI WASM Tests ===\n');
console.log('Version:', wasm.UTF8ToString(wasm._qoi_wasm_version()));
console.log('');

// Helper to create test image
function createTestImage(width, height) {
    const pixels = new Uint8Array(width * height * 4);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            pixels[i] = Math.floor((x / width) * 255);      // R
            pixels[i + 1] = Math.floor((y / height) * 255);  // G
            pixels[i + 2] = 128;                             // B
            pixels[i + 3] = 255;                             // A
        }
    }
    return pixels;
}

// Test 1: Basic encode/decode
console.log('--- Test 1: Basic Encode/Decode ---');
{
    const width = 64;
    const height = 64;
    const pixels = createTestImage(width, height);

    // Allocate and copy pixels to WASM memory
    const pixelsPtr = wasm._malloc(pixels.length);
    wasm.HEAPU8.set(pixels, pixelsPtr);

    // Encode
    const outLenPtr = wasm._malloc(4);
    const encodedPtr = wasm._qoi_encode_rgba(pixelsPtr, width, height, outLenPtr);
    const encodedLen = wasm.getValue(outLenPtr, 'i32');

    console.log(`Encoded ${width}x${height} RGBA image: ${encodedLen} bytes`);
    console.log(`Compression: ${(pixels.length / encodedLen).toFixed(2)}x`);

    // Decode
    const outWidthPtr = wasm._malloc(4);
    const outHeightPtr = wasm._malloc(4);
    const decodedPtr = wasm._qoi_decode_to_rgba(encodedPtr, encodedLen, outWidthPtr, outHeightPtr);
    const decodedWidth = wasm.getValue(outWidthPtr, 'i32');
    const decodedHeight = wasm.getValue(outHeightPtr, 'i32');

    console.log(`Decoded image: ${decodedWidth}x${decodedHeight}`);

    // Verify pixels match
    const decodedPixels = wasm.HEAPU8.subarray(decodedPtr, decodedPtr + pixels.length);
    let mismatch = 0;
    for (let i = 0; i < pixels.length; i++) {
        if (pixels[i] !== decodedPixels[i]) mismatch++;
    }
    console.log(`Pixel verification: ${mismatch === 0 ? 'PASS' : `FAIL (${mismatch} mismatches)`}`);

    // Cleanup
    wasm._free(pixelsPtr);
    wasm._free(outLenPtr);
    wasm._free(outWidthPtr);
    wasm._free(outHeightPtr);
    wasm._qoi_free_encoded(encodedPtr);
    wasm._qoi_free_decoded(decodedPtr);
    console.log('');
}

// Test 2: Different image sizes
console.log('--- Test 2: Compression Ratios ---');
{
    const sizes = [
        { w: 32, h: 32 },
        { w: 64, h: 64 },
        { w: 128, h: 128 },
        { w: 256, h: 256 },
    ];

    for (const { w, h } of sizes) {
        const pixels = createTestImage(w, h);
        const pixelsPtr = wasm._malloc(pixels.length);
        wasm.HEAPU8.set(pixels, pixelsPtr);

        const outLenPtr = wasm._malloc(4);
        const encodedPtr = wasm._qoi_encode_rgba(pixelsPtr, w, h, outLenPtr);
        const encodedLen = wasm.getValue(outLenPtr, 'i32');

        const ratio = (pixels.length / encodedLen).toFixed(2);
        const savings = (100 * (1 - encodedLen / pixels.length)).toFixed(1);

        console.log(`${w}x${h}: ${pixels.length} bytes -> ${encodedLen} bytes (${ratio}x, ${savings}% savings)`);

        wasm._free(pixelsPtr);
        wasm._free(outLenPtr);
        wasm._qoi_free_encoded(encodedPtr);
    }
    console.log('');
}

// Test 3: Solid color (best compression)
console.log('--- Test 3: Solid Color Image ---');
{
    const width = 100;
    const height = 100;
    const pixels = new Uint8Array(width * height * 4);
    pixels.fill(128); // Solid gray

    const pixelsPtr = wasm._malloc(pixels.length);
    wasm.HEAPU8.set(pixels, pixelsPtr);

    const outLenPtr = wasm._malloc(4);
    const encodedPtr = wasm._qoi_encode_rgba(pixelsPtr, width, height, outLenPtr);
    const encodedLen = wasm.getValue(outLenPtr, 'i32');

    const ratio = (pixels.length / encodedLen).toFixed(2);
    console.log(`Solid color 100x100: ${pixels.length} bytes -> ${encodedLen} bytes (${ratio}x compression)`);

    wasm._free(pixelsPtr);
    wasm._free(outLenPtr);
    wasm._qoi_free_encoded(encodedPtr);
    console.log('');
}

// Test 4: Random noise (worst compression)
console.log('--- Test 4: Random Noise Image ---');
{
    const width = 100;
    const height = 100;
    const pixels = new Uint8Array(width * height * 4);
    for (let i = 0; i < pixels.length; i++) {
        pixels[i] = Math.floor(Math.random() * 256);
    }

    const pixelsPtr = wasm._malloc(pixels.length);
    wasm.HEAPU8.set(pixels, pixelsPtr);

    const outLenPtr = wasm._malloc(4);
    const encodedPtr = wasm._qoi_encode_rgba(pixelsPtr, width, height, outLenPtr);
    const encodedLen = wasm.getValue(outLenPtr, 'i32');

    const ratio = (pixels.length / encodedLen).toFixed(2);
    console.log(`Random noise 100x100: ${pixels.length} bytes -> ${encodedLen} bytes (${ratio}x)`);

    wasm._free(pixelsPtr);
    wasm._free(outLenPtr);
    wasm._qoi_free_encoded(encodedPtr);
    console.log('');
}

// Test 5: Performance benchmark - encoding
console.log('--- Test 5: Encoding Performance ---');
{
    const sizes = [
        { w: 128, h: 128, iterations: 1000 },
        { w: 256, h: 256, iterations: 500 },
        { w: 512, h: 512, iterations: 100 },
    ];

    for (const { w, h, iterations } of sizes) {
        const pixels = createTestImage(w, h);
        const pixelsPtr = wasm._malloc(pixels.length);
        wasm.HEAPU8.set(pixels, pixelsPtr);
        const outLenPtr = wasm._malloc(4);

        const start = performance.now();
        for (let i = 0; i < iterations; i++) {
            const encodedPtr = wasm._qoi_encode_rgba(pixelsPtr, w, h, outLenPtr);
            wasm._qoi_free_encoded(encodedPtr);
        }
        const elapsed = performance.now() - start;

        const opsPerSec = (iterations / (elapsed / 1000)).toFixed(0);
        const mpixPerSec = (iterations * w * h / (elapsed / 1000) / 1e6).toFixed(1);

        console.log(`${w}x${h}: ${opsPerSec} encodes/sec, ${mpixPerSec} MP/s`);

        wasm._free(pixelsPtr);
        wasm._free(outLenPtr);
    }
    console.log('');
}

// Test 6: Performance benchmark - decoding
console.log('--- Test 6: Decoding Performance ---');
{
    const sizes = [
        { w: 128, h: 128, iterations: 1000 },
        { w: 256, h: 256, iterations: 500 },
        { w: 512, h: 512, iterations: 100 },
    ];

    for (const { w, h, iterations } of sizes) {
        // Pre-encode an image
        const pixels = createTestImage(w, h);
        const pixelsPtr = wasm._malloc(pixels.length);
        wasm.HEAPU8.set(pixels, pixelsPtr);
        const outLenPtr = wasm._malloc(4);
        const encodedPtr = wasm._qoi_encode_rgba(pixelsPtr, w, h, outLenPtr);
        const encodedLen = wasm.getValue(outLenPtr, 'i32');

        // Benchmark decoding
        const outWidthPtr = wasm._malloc(4);
        const outHeightPtr = wasm._malloc(4);

        const start = performance.now();
        for (let i = 0; i < iterations; i++) {
            const decodedPtr = wasm._qoi_decode_to_rgba(encodedPtr, encodedLen, outWidthPtr, outHeightPtr);
            wasm._qoi_free_decoded(decodedPtr);
        }
        const elapsed = performance.now() - start;

        const opsPerSec = (iterations / (elapsed / 1000)).toFixed(0);
        const mpixPerSec = (iterations * w * h / (elapsed / 1000) / 1e6).toFixed(1);

        console.log(`${w}x${h}: ${opsPerSec} decodes/sec, ${mpixPerSec} MP/s`);

        wasm._free(pixelsPtr);
        wasm._free(outLenPtr);
        wasm._free(outWidthPtr);
        wasm._free(outHeightPtr);
        wasm._qoi_free_encoded(encodedPtr);
    }
    console.log('');
}

// Test 7: RGB vs RGBA
console.log('--- Test 7: RGB vs RGBA ---');
{
    const width = 128;
    const height = 128;
    const pixelsRGBA = createTestImage(width, height);

    // RGBA encoding
    const pixelsRGBAPtr = wasm._malloc(pixelsRGBA.length);
    wasm.HEAPU8.set(pixelsRGBA, pixelsRGBAPtr);
    const outLenRGBAPtr = wasm._malloc(4);
    const encodedRGBAPtr = wasm._qoi_encode_rgba(pixelsRGBAPtr, width, height, outLenRGBAPtr);
    const encodedRGBALen = wasm.getValue(outLenRGBAPtr, 'i32');

    // RGB encoding (remove alpha channel)
    const pixelsRGB = new Uint8Array(width * height * 3);
    for (let i = 0; i < width * height; i++) {
        pixelsRGB[i * 3] = pixelsRGBA[i * 4];
        pixelsRGB[i * 3 + 1] = pixelsRGBA[i * 4 + 1];
        pixelsRGB[i * 3 + 2] = pixelsRGBA[i * 4 + 2];
    }

    const pixelsRGBPtr = wasm._malloc(pixelsRGB.length);
    wasm.HEAPU8.set(pixelsRGB, pixelsRGBPtr);
    const outLenRGBPtr = wasm._malloc(4);
    const encodedRGBPtr = wasm._qoi_encode_rgb(pixelsRGBPtr, width, height, outLenRGBPtr);
    const encodedRGBLen = wasm.getValue(outLenRGBPtr, 'i32');

    console.log(`RGBA: ${encodedRGBALen} bytes`);
    console.log(`RGB:  ${encodedRGBLen} bytes`);
    console.log(`Savings: ${encodedRGBALen - encodedRGBLen} bytes (${((1 - encodedRGBLen/encodedRGBALen) * 100).toFixed(1)}%)`);

    wasm._free(pixelsRGBAPtr);
    wasm._free(pixelsRGBPtr);
    wasm._free(outLenRGBAPtr);
    wasm._free(outLenRGBPtr);
    wasm._qoi_free_encoded(encodedRGBAPtr);
    wasm._qoi_free_encoded(encodedRGBPtr);
    console.log('');
}

console.log('=== All Tests Complete ===');
