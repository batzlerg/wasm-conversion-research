/**
 * Test LZ4 WASM module in Node.js
 */

import createModule from './lz4.js';

async function test() {
    console.log('Loading LZ4 WASM module...');
    const module = await createModule();

    // Test version
    const versionPtr = module._lz4_version();
    const version = module.UTF8ToString(versionPtr);
    const versionNum = module._lz4_version_number();
    console.log(`Version: ${version} (${versionNum})\n`);

    // Test compression
    console.log('=== Testing Compression ===\n');

    // Create test data - repetitive data compresses well
    const testString = 'Hello, LZ4 WASM! '.repeat(1000);
    const encoder = new TextEncoder();
    const testData = encoder.encode(testString);

    console.log(`Original size: ${testData.length} bytes`);

    // Allocate input buffer
    const srcPtr = module._lz4_alloc(testData.length);
    module.HEAPU8.set(testData, srcPtr);

    // Get max compressed size
    const maxCompressedSize = module._lz4_compress_bound(testData.length);
    console.log(`Max compressed size: ${maxCompressedSize} bytes`);

    // Allocate output buffer
    const dstPtr = module._lz4_alloc(maxCompressedSize);

    // Compress
    const compressStart = performance.now();
    const compressedSize = module._lz4_compress(srcPtr, dstPtr, testData.length, maxCompressedSize);
    const compressTime = performance.now() - compressStart;

    if (compressedSize > 0) {
        const ratio = ((1 - compressedSize / testData.length) * 100).toFixed(1);
        console.log(`Compressed size: ${compressedSize} bytes (${ratio}% reduction)`);
        console.log(`Compression time: ${compressTime.toFixed(3)}ms`);

        // Copy compressed data
        const compressedData = new Uint8Array(compressedSize);
        compressedData.set(module.HEAPU8.subarray(dstPtr, dstPtr + compressedSize));

        // Test decompression
        console.log('\n=== Testing Decompression ===\n');

        // Allocate decompression buffers
        const decompSrcPtr = module._lz4_alloc(compressedSize);
        module.HEAPU8.set(compressedData, decompSrcPtr);

        const decompDstPtr = module._lz4_alloc(testData.length);

        // Decompress
        const decompressStart = performance.now();
        const decompressedSize = module._lz4_decompress(decompSrcPtr, decompDstPtr, compressedSize, testData.length);
        const decompressTime = performance.now() - decompressStart;

        if (decompressedSize > 0) {
            console.log(`Decompressed size: ${decompressedSize} bytes`);
            console.log(`Decompression time: ${decompressTime.toFixed(3)}ms`);

            // Verify data
            const decompressedData = new Uint8Array(decompressedSize);
            decompressedData.set(module.HEAPU8.subarray(decompDstPtr, decompDstPtr + decompressedSize));

            const decoder = new TextDecoder();
            const decompressedString = decoder.decode(decompressedData);

            const isMatch = decompressedString === testString;
            console.log(`Data integrity: ${isMatch ? 'PASSED ✓' : 'FAILED ✗'}`);
        } else {
            console.log('Decompression failed!');
        }

        module._lz4_free(decompSrcPtr);
        module._lz4_free(decompDstPtr);
    } else {
        console.log('Compression failed!');
    }

    module._lz4_free(srcPtr);
    module._lz4_free(dstPtr);

    // Performance benchmark
    console.log('\n=== Performance Benchmark ===\n');

    // Create larger test data
    const benchData = encoder.encode('x'.repeat(100000));
    const benchSrcPtr = module._lz4_alloc(benchData.length);
    module.HEAPU8.set(benchData, benchSrcPtr);

    const benchMaxSize = module._lz4_compress_bound(benchData.length);
    const benchDstPtr = module._lz4_alloc(benchMaxSize);

    const iterations = 1000;

    // Compression benchmark
    const compBenchStart = performance.now();
    let totalCompressed = 0;
    for (let i = 0; i < iterations; i++) {
        totalCompressed = module._lz4_compress(benchSrcPtr, benchDstPtr, benchData.length, benchMaxSize);
    }
    const compBenchTime = performance.now() - compBenchStart;

    console.log(`${iterations} compressions (100KB each): ${compBenchTime.toFixed(2)}ms`);
    console.log(`Compression throughput: ${((iterations * benchData.length / 1024 / 1024) / (compBenchTime / 1000)).toFixed(2)} MB/s`);

    // Decompression benchmark
    const decompBenchDstPtr = module._lz4_alloc(benchData.length);
    const decompBenchStart = performance.now();
    for (let i = 0; i < iterations; i++) {
        module._lz4_decompress(benchDstPtr, decompBenchDstPtr, totalCompressed, benchData.length);
    }
    const decompBenchTime = performance.now() - decompBenchStart;

    console.log(`${iterations} decompressions: ${decompBenchTime.toFixed(2)}ms`);
    console.log(`Decompression throughput: ${((iterations * benchData.length / 1024 / 1024) / (decompBenchTime / 1000)).toFixed(2)} MB/s`);

    module._lz4_free(benchSrcPtr);
    module._lz4_free(benchDstPtr);
    module._lz4_free(decompBenchDstPtr);

    console.log('\n=== All Tests Complete ===');
}

test().catch(e => {
    console.error('Fatal error:', e);
    process.exit(1);
});
