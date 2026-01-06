/**
 * Test mathc WASM module in Node.js
 */

import createModule from './mathc.js';

async function test() {
    console.log('Loading mathc WASM module...');
    const module = await createModule();

    // Helper to create float array in WASM memory
    function allocFloats(values) {
        const ptr = module._mathc_alloc_floats(values.length);
        for (let i = 0; i < values.length; i++) {
            module.HEAPF32[(ptr >> 2) + i] = values[i];
        }
        return ptr;
    }

    // Helper to read float array from WASM memory
    function readFloats(ptr, count) {
        const result = [];
        for (let i = 0; i < count; i++) {
            result.push(module.HEAPF32[(ptr >> 2) + i]);
        }
        return result;
    }

    // Test version
    const versionPtr = module._mathc_version();
    const version = module.UTF8ToString(versionPtr);
    console.log(`Version: ${version}\n`);

    // Test vec3 operations
    console.log('=== Testing Vec3 Operations ===\n');

    const v1 = allocFloats([1, 2, 3]);
    const v2 = allocFloats([4, 5, 6]);
    const vResult = allocFloats([0, 0, 0]);

    // Add
    module._mathc_vec3_add(vResult, v1, v2);
    console.log(`[1,2,3] + [4,5,6] = [${readFloats(vResult, 3).join(', ')}]`);

    // Dot product
    const dot = module._mathc_vec3_dot(v1, v2);
    console.log(`[1,2,3] · [4,5,6] = ${dot}`);

    // Cross product
    module._mathc_vec3_cross(vResult, v1, v2);
    console.log(`[1,2,3] × [4,5,6] = [${readFloats(vResult, 3).join(', ')}]`);

    // Length
    const len = module._mathc_vec3_length(v1);
    console.log(`|[1,2,3]| = ${len.toFixed(4)}`);

    // Normalize
    module._mathc_vec3_normalize(vResult, v1);
    console.log(`normalize([1,2,3]) = [${readFloats(vResult, 3).map(x => x.toFixed(4)).join(', ')}]`);

    // Test mat4 operations
    console.log('\n=== Testing Mat4 Operations ===\n');

    const m1 = allocFloats(new Array(16).fill(0));
    const m2 = allocFloats(new Array(16).fill(0));
    const mResult = allocFloats(new Array(16).fill(0));

    // Identity
    module._mathc_mat4_identity(m1);
    console.log('Identity matrix:');
    const identity = readFloats(m1, 16);
    for (let row = 0; row < 4; row++) {
        console.log(`  [${identity.slice(row * 4, row * 4 + 4).map(x => x.toFixed(1)).join(', ')}]`);
    }

    // Perspective projection
    module._mathc_mat4_perspective(mResult, Math.PI / 4, 16/9, 0.1, 100);
    console.log('\nPerspective (FOV=45°, aspect=16:9):');
    const persp = readFloats(mResult, 16);
    for (let row = 0; row < 4; row++) {
        console.log(`  [${persp.slice(row * 4, row * 4 + 4).map(x => x.toFixed(4)).join(', ')}]`);
    }

    // Test quaternion operations
    console.log('\n=== Testing Quaternion Operations ===\n');

    const q1 = allocFloats([0, 0, 0, 1]);
    const q2 = allocFloats([0, 0, 0, 1]);
    const qResult = allocFloats([0, 0, 0, 0]);
    const axis = allocFloats([0, 1, 0]);  // Y-axis

    // Identity
    module._mathc_quat_identity(q1);
    console.log(`Identity quaternion: [${readFloats(q1, 4).join(', ')}]`);

    // From axis-angle (90 degrees around Y)
    module._mathc_quat_from_axis_angle(q2, axis, Math.PI / 2);
    console.log(`Rotate 90° around Y: [${readFloats(q2, 4).map(x => x.toFixed(4)).join(', ')}]`);

    // Multiply
    module._mathc_quat_multiply(qResult, q1, q2);
    console.log(`Identity * rotation: [${readFloats(qResult, 4).map(x => x.toFixed(4)).join(', ')}]`);

    // Utility functions
    console.log('\n=== Testing Utility Functions ===\n');

    console.log(`to_radians(180) = ${module._mathc_to_radians(180).toFixed(4)}`);
    console.log(`to_degrees(π) = ${module._mathc_to_degrees(Math.PI).toFixed(4)}`);
    console.log(`lerp(0, 100, 0.5) = ${module._mathc_lerp(0, 100, 0.5)}`);
    console.log(`clamp(150, 0, 100) = ${module._mathc_clamp(150, 0, 100)}`);

    // Performance benchmark
    console.log('\n=== Performance Benchmark ===\n');

    const iterations = 100000;

    // Mat4 multiply benchmark
    module._mathc_mat4_identity(m1);
    module._mathc_mat4_identity(m2);
    const matStart = performance.now();
    for (let i = 0; i < iterations; i++) {
        module._mathc_mat4_multiply(mResult, m1, m2);
    }
    const matTime = performance.now() - matStart;
    console.log(`${iterations} mat4 multiplies: ${matTime.toFixed(2)}ms`);
    console.log(`Average: ${(matTime / iterations * 1000).toFixed(4)}µs per multiply`);
    console.log(`Throughput: ${(iterations / (matTime / 1000)).toFixed(0)} ops/sec`);

    // Vec3 operations benchmark
    const vecStart = performance.now();
    for (let i = 0; i < iterations; i++) {
        module._mathc_vec3_cross(vResult, v1, v2);
        module._mathc_vec3_normalize(vResult, vResult);
    }
    const vecTime = performance.now() - vecStart;
    console.log(`\n${iterations} vec3 cross+normalize: ${vecTime.toFixed(2)}ms`);
    console.log(`Average: ${(vecTime / iterations * 1000).toFixed(4)}µs per operation`);

    // Cleanup
    module._mathc_free(v1);
    module._mathc_free(v2);
    module._mathc_free(vResult);
    module._mathc_free(m1);
    module._mathc_free(m2);
    module._mathc_free(mResult);
    module._mathc_free(q1);
    module._mathc_free(q2);
    module._mathc_free(qResult);
    module._mathc_free(axis);

    console.log('\n=== All Tests Complete ===');
}

test().catch(e => {
    console.error('Fatal error:', e);
    process.exit(1);
});
