/**
 * Test BlurHash WASM module in Node.js
 */

import createModule from './blurhash.js';

async function test() {
    console.log('Loading BlurHash WASM module...');
    const module = await createModule();

    // Helper to convert JS string to WASM memory
    function allocString(str) {
        const len = module.lengthBytesUTF8(str) + 1;
        const ptr = module._malloc(len);
        module.stringToUTF8(str, ptr, len);
        return ptr;
    }

    // Test version
    const versionPtr = module._blurhash_version();
    const version = module.UTF8ToString(versionPtr);
    console.log(`Version: ${version}\n`);

    // Test blurhash validation
    console.log('=== Testing Validation ===\n');

    const testHashes = [
        'LEHV6nWB2yk8pyo0adR*.7kCMdnj',  // Valid
        'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.',  // Valid
        'invalid',                        // Invalid
        '',                               // Invalid
        'L00000fQfQfQfQfQfQfQfQfQfQfQ',   // Valid (solid color)
    ];

    for (const hash of testHashes) {
        const hashPtr = allocString(hash);
        const isValid = module._blurhash_is_valid(hashPtr);
        module._free(hashPtr);
        console.log(`"${hash}" -> ${isValid ? 'Valid' : 'Invalid'}`);
    }

    // Test decode
    console.log('\n=== Testing Decode ===\n');

    const blurhash = 'LEHV6nWB2yk8pyo0adR*.7kCMdnj';
    const width = 32;
    const height = 32;
    const punch = 1;
    const channels = 4;  // RGBA

    // Allocate string in WASM memory
    const hashPtr = allocString(blurhash);

    // Decode
    const start = performance.now();
    const pixelsPtr = module._blurhash_decode(hashPtr, width, height, punch, channels);
    const decodeTime = performance.now() - start;
    module._free(hashPtr);

    if (pixelsPtr === 0) {
        console.log('Decode failed!');
    } else {
        console.log(`Decoded "${blurhash}" to ${width}x${height} in ${decodeTime.toFixed(3)}ms`);

        // Read first few pixels using HEAPU8
        const pixelData = [];
        for (let i = 0; i < 4; i++) {
            const offset = pixelsPtr + i * channels;
            const r = module.HEAPU8[offset];
            const g = module.HEAPU8[offset + 1];
            const b = module.HEAPU8[offset + 2];
            const a = module.HEAPU8[offset + 3];
            pixelData.push(`rgba(${r},${g},${b},${a})`);
        }
        console.log(`First 4 pixels: ${pixelData.join(', ')}`);

        // Free memory
        module._blurhash_free(pixelsPtr);
    }

    // Test encode
    console.log('\n=== Testing Encode ===\n');

    // Create a simple 4x4 red image
    const encodeWidth = 4;
    const encodeHeight = 4;
    const bytesPerRow = encodeWidth * 3;  // RGB
    const imageSize = encodeHeight * bytesPerRow;

    // Allocate memory for image
    const imagePtr = module._blurhash_alloc(imageSize);

    // Fill with red pixels
    for (let i = 0; i < imageSize; i += 3) {
        module.HEAPU8[imagePtr + i] = 255;     // R
        module.HEAPU8[imagePtr + i + 1] = 0;   // G
        module.HEAPU8[imagePtr + i + 2] = 0;   // B
    }

    const encodeStart = performance.now();
    const resultPtr = module._blurhash_encode(4, 3, encodeWidth, encodeHeight, imagePtr, bytesPerRow);
    const encodeTime = performance.now() - encodeStart;

    if (resultPtr === 0) {
        console.log('Encode failed!');
    } else {
        const encodedHash = module.UTF8ToString(resultPtr);
        console.log(`Encoded ${encodeWidth}x${encodeHeight} red image in ${encodeTime.toFixed(3)}ms`);
        console.log(`Result: "${encodedHash}"`);

        // Verify it's valid
        const verifyPtr = allocString(encodedHash);
        const isValidResult = module._blurhash_is_valid(verifyPtr);
        module._free(verifyPtr);
        console.log(`Valid: ${isValidResult ? 'Yes' : 'No'}`);
    }

    // Free image memory
    module._free(imagePtr);

    // Performance benchmark
    console.log('\n=== Performance Benchmark ===\n');

    const iterations = 1000;
    const benchHash = 'LEHV6nWB2yk8pyo0adR*.7kCMdnj';
    const benchHashPtr = allocString(benchHash);

    const benchStart = performance.now();
    for (let i = 0; i < iterations; i++) {
        const ptr = module._blurhash_decode(benchHashPtr, 32, 32, 1, 4);
        module._blurhash_free(ptr);
    }
    const benchTime = performance.now() - benchStart;
    module._free(benchHashPtr);

    console.log(`${iterations} decodes (32x32): ${benchTime.toFixed(2)}ms total`);
    console.log(`Average: ${(benchTime / iterations).toFixed(4)}ms per decode`);
    console.log(`Throughput: ${(iterations / (benchTime / 1000)).toFixed(0)} decodes/sec`);

    console.log('\n=== All Tests Complete ===');
}

test().catch(e => {
    console.error('Fatal error:', e);
    process.exit(1);
});
