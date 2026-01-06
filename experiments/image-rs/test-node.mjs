/**
 * image-rs WASM Test Suite
 */

import * as wasm from './pkg/image_rs_wasm.js';
import fs from 'fs';

console.log('=== image-rs WASM Tests ===\n');
console.log('Version:', wasm.get_version());
console.log('');

// Helper to create test image
function createTestImage(width, height) {
    const data = new Uint8Array(width * height * 4);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            data[i] = Math.floor((x / width) * 255);     // R
            data[i + 1] = Math.floor((y / height) * 255); // G
            data[i + 2] = 128;                             // B
            data[i + 3] = 255;                             // A
        }
    }
    return data;
}

// Test 1: Image creation and basic properties
console.log('--- Test 1: Image Creation ---');
{
    const data = createTestImage(100, 100);
    const img = new wasm.Image(100, 100, data);
    console.log(`Created image: ${img.width()}x${img.height()}`);

    const pixel = img.get_pixel(50, 50);
    console.log(`Center pixel [50,50]: RGBA(${pixel.join(', ')})`);
    console.log('');
    img.free();
}

// Test 2: Resize operations
console.log('--- Test 2: Image Resizing ---');
{
    const data = createTestImage(200, 200);
    const img = new wasm.Image(200, 200, data);

    const start = performance.now();
    const resized = img.resize(100, 100);
    const elapsed = performance.now() - start;

    console.log(`Resize 200x200 -> 100x100: ${elapsed.toFixed(2)}ms`);
    console.log(`Result: ${resized.width()}x${resized.height()}`);

    const fast_start = performance.now();
    const resized_fast = img.resize_fast(100, 100);
    const fast_elapsed = performance.now() - fast_start;

    console.log(`Resize (fast) 200x200 -> 100x100: ${fast_elapsed.toFixed(2)}ms`);
    console.log(`Speedup: ${(elapsed / fast_elapsed).toFixed(2)}x faster`);
    console.log('');

    img.free();
    resized.free();
    resized_fast.free();
}

// Test 3: Transformations
console.log('--- Test 3: Image Transformations ---');
{
    const data = createTestImage(50, 50);
    const img = new wasm.Image(50, 50, data);

    console.log('Testing transformations:');

    const rotated = img.rotate90();
    console.log(`  rotate90: ${rotated.width()}x${rotated.height()}`);
    rotated.free();

    const flipped = img.fliph();
    console.log(`  fliph: ${flipped.width()}x${flipped.height()}`);
    flipped.free();

    const gray = img.grayscale();
    console.log(`  grayscale: ${gray.width()}x${gray.height()}`);
    gray.free();

    const bright = img.brighten(50);
    console.log(`  brighten(50): ${bright.width()}x${bright.height()}`);
    bright.free();

    console.log('');
    img.free();
}

// Test 4: Blur operation
console.log('--- Test 4: Gaussian Blur ---');
{
    const sizes = [50, 100, 200];

    for (const size of sizes) {
        const data = createTestImage(size, size);
        const img = new wasm.Image(size, size, data);

        const start = performance.now();
        const blurred = img.blur(2.0);
        const elapsed = performance.now() - start;

        console.log(`${size}x${size} blur(2.0): ${elapsed.toFixed(2)}ms`);

        img.free();
        blurred.free();
    }
    console.log('');
}

// Test 5: Crop operation
console.log('--- Test 5: Image Cropping ---');
{
    const data = createTestImage(200, 200);
    const img = new wasm.Image(200, 200, data);

    const cropped = img.crop(50, 50, 100, 100);
    console.log(`Crop [50,50,100,100] from 200x200: ${cropped.width()}x${cropped.height()}`);

    img.free();
    cropped.free();
    console.log('');
}

// Test 6: Encoding operations
console.log('--- Test 6: Image Encoding ---');
{
    const data = createTestImage(100, 100);
    const img = new wasm.Image(100, 100, data);

    const png_start = performance.now();
    const png_data = img.encode_png();
    const png_time = performance.now() - png_start;
    console.log(`PNG encode (100x100): ${png_time.toFixed(2)}ms, ${png_data.length} bytes`);

    const jpeg_start = performance.now();
    const jpeg_data = img.encode_jpeg(90);
    const jpeg_time = performance.now() - jpeg_start;
    console.log(`JPEG encode (100x100, q=90): ${jpeg_time.toFixed(2)}ms, ${jpeg_data.length} bytes`);
    console.log(`JPEG compression: ${(100 - (jpeg_data.length / png_data.length * 100)).toFixed(1)}% smaller`);

    img.free();
    console.log('');
}

// Test 7: Performance benchmark - resize
console.log('--- Test 7: Resize Performance Benchmark ---');
{
    const sizes = [
        { from: [200, 200], to: [100, 100], iterations: 100 },
        { from: [400, 400], to: [200, 200], iterations: 50 },
        { from: [800, 800], to: [400, 400], iterations: 20 },
    ];

    for (const { from, to, iterations } of sizes) {
        const data = createTestImage(from[0], from[1]);
        const img = new wasm.Image(from[0], from[1], data);

        const start = performance.now();
        for (let i = 0; i < iterations; i++) {
            const resized = img.resize(to[0], to[1]);
            resized.free();
        }
        const elapsed = performance.now() - start;

        const opsPerSec = (iterations / (elapsed / 1000)).toFixed(1);
        const msPerOp = (elapsed / iterations).toFixed(2);

        console.log(`${from.join('x')} -> ${to.join('x')}: ${opsPerSec} ops/sec (${msPerOp}ms/op)`);

        img.free();
    }
    console.log('');
}

// Test 8: Performance benchmark - blur
console.log('--- Test 8: Blur Performance Benchmark ---');
{
    const sizes = [100, 200, 400];
    const iterations = 20;

    for (const size of sizes) {
        const data = createTestImage(size, size);
        const img = new wasm.Image(size, size, data);

        const start = performance.now();
        for (let i = 0; i < iterations; i++) {
            const blurred = img.blur(2.0);
            blurred.free();
        }
        const elapsed = performance.now() - start;

        const opsPerSec = (iterations / (elapsed / 1000)).toFixed(1);
        const msPerOp = (elapsed / iterations).toFixed(2);

        console.log(`${size}x${size} blur: ${opsPerSec} ops/sec (${msPerOp}ms/op)`);

        img.free();
    }
    console.log('');
}

// Test 9: Memory safety - multiple operations
console.log('--- Test 9: Chained Operations ---');
{
    const data = createTestImage(100, 100);
    const img = new wasm.Image(100, 100, data);

    const start = performance.now();
    const result = img
        .resize(200, 200)
        .blur(1.0)
        .grayscale()
        .brighten(20)
        .resize(100, 100);
    const elapsed = performance.now() - start;

    console.log(`Chained: resize->blur->grayscale->brighten->resize`);
    console.log(`Time: ${elapsed.toFixed(2)}ms`);
    console.log(`Final size: ${result.width()}x${result.height()}`);

    img.free();
    result.free();
    console.log('');
}

console.log('=== All Tests Complete ===');
