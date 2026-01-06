/**
 * Snappy WASM Test Suite
 */

const createModule = (await import('./snappy.js')).default;
const wasm = await createModule();

console.log('=== Snappy WASM Tests ===\n');
console.log('Version:', wasm.UTF8ToString(wasm._snappy_wasm_version()));
console.log('');

// Helper to copy data to WASM memory
function copyToWasm(data) {
    const ptr = wasm._malloc(data.length);
    wasm.HEAPU8.set(data, ptr);
    return ptr;
}

// Helper to read data from WASM
function readFromWasm(ptr, length) {
    return new Uint8Array(wasm.HEAPU8.buffer, ptr, length).slice();
}

// Test 1: Compress and decompress
console.log('--- Test 1: Compress/Decompress ---');
{
    const testStr = "Hello, World! This is a test of Snappy compression.";
    const input = new TextEncoder().encode(testStr);
    const inputPtr = copyToWasm(input);

    // Get max compressed length
    const maxLen = wasm._snappy_wasm_max_compressed_length(input.length);
    console.log(`Input size: ${input.length} bytes`);
    console.log(`Max compressed size: ${maxLen} bytes`);

    // Allocate output buffer
    const outputPtr = wasm._malloc(maxLen);
    const outputLenPtr = wasm._malloc(8);
    wasm.setValue(outputLenPtr, maxLen, 'i32');

    // Compress
    const compressResult = wasm._snappy_wasm_compress(inputPtr, input.length, outputPtr, outputLenPtr);
    const compressedLen = wasm.getValue(outputLenPtr, 'i32');

    console.log(`Compress result: ${compressResult === 0 ? 'OK' : 'FAILED'}`);
    console.log(`Compressed size: ${compressedLen} bytes`);
    console.log(`Compression ratio: ${(input.length / compressedLen).toFixed(2)}x`);

    // Copy compressed data
    const compressed = readFromWasm(outputPtr, compressedLen);

    // Get uncompressed length
    const uncompLenPtr = wasm._malloc(8);
    wasm._snappy_wasm_uncompressed_length(outputPtr, compressedLen, uncompLenPtr);
    const uncompLen = wasm.getValue(uncompLenPtr, 'i32');
    console.log(`Reported uncompressed size: ${uncompLen} bytes`);

    // Decompress
    const decompPtr = wasm._malloc(uncompLen);
    const decompLenPtr = wasm._malloc(8);
    wasm.setValue(decompLenPtr, uncompLen, 'i32');

    const decompResult = wasm._snappy_wasm_uncompress(outputPtr, compressedLen, decompPtr, decompLenPtr);
    const decompLen = wasm.getValue(decompLenPtr, 'i32');

    console.log(`Decompress result: ${decompResult === 0 ? 'OK' : 'FAILED'}`);

    const decompressed = readFromWasm(decompPtr, decompLen);
    const decompStr = new TextDecoder().decode(decompressed);

    if (decompStr === testStr) {
        console.log('✓ Round-trip successful\n');
    } else {
        console.log('✗ Data mismatch\n');
    }

    wasm._free(inputPtr);
    wasm._free(outputPtr);
    wasm._free(outputLenPtr);
    wasm._free(uncompLenPtr);
    wasm._free(decompPtr);
    wasm._free(decompLenPtr);
}

// Test 2: Validation
console.log('--- Test 2: Validate Compressed Data ---');
{
    const testStr = "Test validation";
    const input = new TextEncoder().encode(testStr);
    const inputPtr = copyToWasm(input);

    const maxLen = wasm._snappy_wasm_max_compressed_length(input.length);
    const outputPtr = wasm._malloc(maxLen);
    const outputLenPtr = wasm._malloc(8);
    wasm.setValue(outputLenPtr, maxLen, 'i32');

    wasm._snappy_wasm_compress(inputPtr, input.length, outputPtr, outputLenPtr);
    const compressedLen = wasm.getValue(outputLenPtr, 'i32');

    // Validate good data
    const validResult = wasm._snappy_wasm_validate(outputPtr, compressedLen);
    console.log(`Valid data: ${validResult === 0 ? '✓ OK' : '✗ FAILED'}`);

    // Validate corrupted data
    wasm.HEAPU8[outputPtr + 5] ^= 0xFF; // Corrupt a byte
    const invalidResult = wasm._snappy_wasm_validate(outputPtr, compressedLen);
    console.log(`Corrupted data: ${invalidResult !== 0 ? '✓ Rejected' : '✗ Should fail'}\n`);

    wasm._free(inputPtr);
    wasm._free(outputPtr);
    wasm._free(outputLenPtr);
}

// Test 3: Compression ratio for different data types
console.log('--- Test 3: Compression Ratios ---');
{
    const testCases = [
        { name: 'Repeated', data: 'A'.repeat(10000) },
        { name: 'Random-ish', data: Array.from({length: 10000}, () => String.fromCharCode(Math.floor(Math.random() * 256))).join('') },
        { name: 'JSON', data: JSON.stringify(Array.from({length: 100}, (_, i) => ({ id: i, name: `Item ${i}`, value: Math.random() }))) },
        { name: 'Code', data: `function test() { for (let i = 0; i < 100; i++) { console.log(i); } }`.repeat(50) },
    ];

    for (const { name, data } of testCases) {
        const input = new TextEncoder().encode(data);
        const inputPtr = copyToWasm(input);

        const maxLen = wasm._snappy_wasm_max_compressed_length(input.length);
        const outputPtr = wasm._malloc(maxLen);
        const outputLenPtr = wasm._malloc(8);
        wasm.setValue(outputLenPtr, maxLen, 'i32');

        wasm._snappy_wasm_compress(inputPtr, input.length, outputPtr, outputLenPtr);
        const compressedLen = wasm.getValue(outputLenPtr, 'i32');

        const ratio = input.length / compressedLen;
        console.log(`${name.padEnd(12)}: ${input.length} -> ${compressedLen} bytes (${ratio.toFixed(2)}x)`);

        wasm._free(inputPtr);
        wasm._free(outputPtr);
        wasm._free(outputLenPtr);
    }
    console.log('');
}

// Test 4: Performance Benchmark
console.log('--- Test 4: Performance Benchmark ---');
{
    // Generate test data
    const sizes = [1024, 10240, 102400];

    for (const size of sizes) {
        // Create compressible data
        const data = new Uint8Array(size);
        for (let i = 0; i < size; i++) {
            data[i] = (i % 100) + 32;
        }

        const inputPtr = copyToWasm(data);
        const maxLen = wasm._snappy_wasm_max_compressed_length(size);
        const outputPtr = wasm._malloc(maxLen);
        const outputLenPtr = wasm._malloc(8);

        // Compress once to get compressed size
        wasm.setValue(outputLenPtr, maxLen, 'i32');
        wasm._snappy_wasm_compress(inputPtr, size, outputPtr, outputLenPtr);
        const compressedLen = wasm.getValue(outputLenPtr, 'i32');

        // Prepare for decompression
        const decompPtr = wasm._malloc(size);
        const decompLenPtr = wasm._malloc(8);

        const iterations = Math.min(1000, Math.floor(100000 / size));

        // Benchmark compression
        const compStart = performance.now();
        for (let i = 0; i < iterations; i++) {
            wasm.setValue(outputLenPtr, maxLen, 'i32');
            wasm._snappy_wasm_compress(inputPtr, size, outputPtr, outputLenPtr);
        }
        const compTime = performance.now() - compStart;

        // Benchmark decompression
        const decompStart = performance.now();
        for (let i = 0; i < iterations; i++) {
            wasm.setValue(decompLenPtr, size, 'i32');
            wasm._snappy_wasm_uncompress(outputPtr, compressedLen, decompPtr, decompLenPtr);
        }
        const decompTime = performance.now() - decompStart;

        const compThroughput = (iterations * size) / (compTime / 1000) / 1024 / 1024;
        const decompThroughput = (iterations * size) / (decompTime / 1000) / 1024 / 1024;

        console.log(`${(size/1024).toFixed(0).padStart(4)}KB: Compress ${compThroughput.toFixed(0)} MB/s, Decompress ${decompThroughput.toFixed(0)} MB/s`);

        wasm._free(inputPtr);
        wasm._free(outputPtr);
        wasm._free(outputLenPtr);
        wasm._free(decompPtr);
        wasm._free(decompLenPtr);
    }
}

// Test 5: Compare with LZ4 (if we have it)
console.log('\n--- Test 5: Summary ---');
console.log('Snappy characteristics:');
console.log('- Very fast compression and decompression');
console.log('- Moderate compression ratios');
console.log('- Great for real-time compression needs');

console.log('\n=== All Tests Complete ===');
