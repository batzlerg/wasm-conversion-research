/**
 * xxHash WASM Test Suite
 */

const createModule = (await import('./xxhash.js')).default;
const wasm = await createModule();

console.log('=== xxHash WASM Tests ===\n');
console.log('Version:', wasm.UTF8ToString(wasm._xxhash_version()));
console.log('');

// Helper to copy data to WASM memory
function copyToWasm(data) {
    const ptr = wasm._malloc(data.length);
    wasm.HEAPU8.set(data, ptr);
    return ptr;
}

// Helper to convert string to Uint8Array
function stringToBytes(str) {
    return new TextEncoder().encode(str);
}

// Helper to read 64-bit result as hex string
function read64BitHex(ptr) {
    const low = wasm.HEAPU32[ptr >> 2];
    const high = wasm.HEAPU32[(ptr >> 2) + 1];
    return (BigInt(high) << 32n | BigInt(low)).toString(16).padStart(16, '0');
}

// Helper to read 128-bit result as hex string
function read128BitHex(ptr) {
    const low0 = wasm.HEAPU32[ptr >> 2];
    const high0 = wasm.HEAPU32[(ptr >> 2) + 1];
    const low1 = wasm.HEAPU32[(ptr >> 2) + 2];
    const high1 = wasm.HEAPU32[(ptr >> 2) + 3];
    const lowPart = (BigInt(high0) << 32n | BigInt(low0)).toString(16).padStart(16, '0');
    const highPart = (BigInt(high1) << 32n | BigInt(low1)).toString(16).padStart(16, '0');
    return highPart + lowPart;
}

// Test 1: XXH32
console.log('--- Test 1: XXH32 ---');
{
    const testStr = "Hello, World!";
    const data = stringToBytes(testStr);
    const ptr = copyToWasm(data);

    const hash = wasm._xxhash32(ptr, data.length, 0);
    console.log(`XXH32("${testStr}") = ${hash.toString(16)}`);

    // Known value for "Hello, World!" with seed 0
    console.log(`Hash value: ${hash}`);
    console.log('✓ XXH32 computed\n');

    wasm._free(ptr);
}

// Test 2: XXH64
console.log('--- Test 2: XXH64 ---');
{
    const testStr = "Hello, World!";
    const data = stringToBytes(testStr);
    const ptr = copyToWasm(data);

    const resultPtr = wasm._xxhash64_split(ptr, data.length, 0, 0);
    const hashHex = read64BitHex(resultPtr);
    console.log(`XXH64("${testStr}") = ${hashHex}`);
    console.log('✓ XXH64 computed\n');

    wasm._free(ptr);
}

// Test 3: XXH3_64bits (fastest for medium data)
console.log('--- Test 3: XXH3_64bits ---');
{
    const testStr = "Hello, World!";
    const data = stringToBytes(testStr);
    const ptr = copyToWasm(data);

    const resultPtr = wasm._xxh3_64(ptr, data.length);
    const hashHex = read64BitHex(resultPtr);
    console.log(`XXH3_64("${testStr}") = ${hashHex}`);
    console.log('✓ XXH3_64 computed\n');

    wasm._free(ptr);
}

// Test 4: XXH3_128bits
console.log('--- Test 4: XXH3_128bits ---');
{
    const testStr = "Hello, World!";
    const data = stringToBytes(testStr);
    const ptr = copyToWasm(data);

    const resultPtr = wasm._xxh3_128(ptr, data.length);
    const hashHex = read128BitHex(resultPtr);
    console.log(`XXH3_128("${testStr}") = ${hashHex}`);
    console.log('✓ XXH3_128 computed\n');

    wasm._free(ptr);
}

// Test 5: Different seeds produce different hashes
console.log('--- Test 5: Seed Variation ---');
{
    const data = stringToBytes("test");
    const ptr = copyToWasm(data);

    const hash0 = wasm._xxhash32(ptr, data.length, 0);
    const hash1 = wasm._xxhash32(ptr, data.length, 1);
    const hash42 = wasm._xxhash32(ptr, data.length, 42);

    console.log(`Seed 0: ${hash0.toString(16)}`);
    console.log(`Seed 1: ${hash1.toString(16)}`);
    console.log(`Seed 42: ${hash42.toString(16)}`);

    if (hash0 !== hash1 && hash1 !== hash42) {
        console.log('✓ Different seeds produce different hashes\n');
    } else {
        console.log('✗ Seeds should produce different hashes\n');
    }

    wasm._free(ptr);
}

// Test 6: Streaming API
console.log('--- Test 6: Streaming API ---');
{
    // Hash in chunks
    const chunk1 = stringToBytes("Hello, ");
    const chunk2 = stringToBytes("World!");

    wasm._xxh3_streaming_init();

    const ptr1 = copyToWasm(chunk1);
    wasm._xxh3_streaming_update(ptr1, chunk1.length);
    wasm._free(ptr1);

    const ptr2 = copyToWasm(chunk2);
    wasm._xxh3_streaming_update(ptr2, chunk2.length);
    wasm._free(ptr2);

    const streamResultPtr = wasm._xxh3_streaming_digest();
    const streamHash = read64BitHex(streamResultPtr);

    // Compare with one-shot hash
    const fullData = stringToBytes("Hello, World!");
    const fullPtr = copyToWasm(fullData);
    const oneShotPtr = wasm._xxh3_64(fullPtr, fullData.length);
    const oneShotHash = read64BitHex(oneShotPtr);

    console.log(`Streaming hash: ${streamHash}`);
    console.log(`One-shot hash: ${oneShotHash}`);

    if (streamHash === oneShotHash) {
        console.log('✓ Streaming matches one-shot\n');
    } else {
        console.log('✗ Streaming should match one-shot\n');
    }

    wasm._xxh3_streaming_free();
    wasm._free(fullPtr);
}

// Test 7: Performance Benchmark
console.log('--- Test 7: Performance Benchmark ---');
{
    // Generate test data of various sizes
    const sizes = [64, 256, 1024, 4096, 16384, 65536];

    for (const size of sizes) {
        const data = new Uint8Array(size);
        for (let i = 0; i < size; i++) {
            data[i] = i % 256;
        }

        const ptr = copyToWasm(data);
        const iterations = Math.min(10000, Math.floor(1000000 / size));

        // Warm up
        for (let i = 0; i < 100; i++) {
            wasm._xxh3_64(ptr, size);
        }

        // Benchmark
        const start = performance.now();
        for (let i = 0; i < iterations; i++) {
            wasm._xxh3_64(ptr, size);
        }
        const elapsed = performance.now() - start;

        const totalBytes = iterations * size;
        const throughput = totalBytes / (elapsed / 1000) / 1024 / 1024;

        console.log(`${size.toString().padStart(5)} bytes: ${throughput.toFixed(0)} MB/s (${iterations} iterations)`);

        wasm._free(ptr);
    }
}

// Test 8: Compare with simpler JS hash
console.log('\n--- Test 8: Compare with JS Hash ---');
{
    // Simple JS hash for comparison
    function simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash >>> 0;
    }

    const testStr = "The quick brown fox jumps over the lazy dog";
    const data = stringToBytes(testStr);

    // JS hash
    const jsStart = performance.now();
    for (let i = 0; i < 100000; i++) {
        simpleHash(testStr);
    }
    const jsTime = performance.now() - jsStart;

    // WASM xxh3
    const ptr = copyToWasm(data);
    const wasmStart = performance.now();
    for (let i = 0; i < 100000; i++) {
        wasm._xxh3_64(ptr, data.length);
    }
    const wasmTime = performance.now() - wasmStart;

    console.log(`Simple JS hash: ${jsTime.toFixed(2)}ms`);
    console.log(`xxHash WASM: ${wasmTime.toFixed(2)}ms`);

    const ratio = jsTime / wasmTime;
    if (ratio > 1) {
        console.log(`xxHash is ${ratio.toFixed(2)}x faster than simple JS hash`);
    } else {
        console.log(`Simple JS hash is ${(1/ratio).toFixed(2)}x faster (unexpected)`);
    }

    wasm._free(ptr);
}

console.log('\n=== All Tests Complete ===');
