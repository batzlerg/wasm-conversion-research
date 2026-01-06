/**
 * nalgebra WASM Test Suite (Rust)
 */

import * as nalgebra from './pkg/nalgebra_wasm.js';

console.log('=== nalgebra WASM Tests (Rust) ===\n');
console.log('Version:', nalgebra.get_version());
console.log('');

// Test 1: Matrix operations
console.log('--- Test 1: Matrix Creation and Access ---');
{
    const m = new nalgebra.Matrix(3, 3);
    m.set(0, 0, 1); m.set(0, 1, 2); m.set(0, 2, 3);
    m.set(1, 0, 4); m.set(1, 1, 5); m.set(1, 2, 6);
    m.set(2, 0, 7); m.set(2, 1, 8); m.set(2, 2, 9);

    console.log(`Matrix ${m.rows()}x${m.cols()}:`);
    console.log(`  [${m.get(0,0)}, ${m.get(0,1)}, ${m.get(0,2)}]`);
    console.log(`  [${m.get(1,0)}, ${m.get(1,1)}, ${m.get(1,2)}]`);
    console.log(`  [${m.get(2,0)}, ${m.get(2,1)}, ${m.get(2,2)}]`);
    console.log(`Determinant: ${m.determinant()}`);
    console.log(`Norm: ${m.norm().toFixed(4)}\n`);
    m.free();
}

// Test 2: Matrix from data
console.log('--- Test 2: Matrix Multiplication ---');
{
    const a = nalgebra.Matrix.from_data(2, 3, new Float64Array([1, 2, 3, 4, 5, 6]));
    const b = nalgebra.Matrix.from_data(3, 2, new Float64Array([7, 8, 9, 10, 11, 12]));
    const c = a.multiply(b);

    console.log(`A (2x3) * B (3x2) = C (${c.rows()}x${c.cols()}):`);
    console.log(`  [${c.get(0,0)}, ${c.get(0,1)}]`);
    console.log(`  [${c.get(1,0)}, ${c.get(1,1)}]`);
    console.log('Expected: [58, 64], [139, 154]\n');
    a.free(); b.free(); c.free();
}

// Test 3: Linear system solving
console.log('--- Test 3: Solve Linear System Ax = b ---');
{
    // 2x + 3y = 8
    // 4x + 5y = 14
    const a = nalgebra.Matrix.from_data(2, 2, new Float64Array([2, 3, 4, 5]));
    const b = new Float64Array([8, 14]);

    const x = a.solve(b);
    console.log('System: 2x + 3y = 8, 4x + 5y = 14');
    console.log(`Solution: x = ${x[0].toFixed(4)}, y = ${x[1].toFixed(4)}`);
    console.log('Expected: x = 1, y = 2\n');
    a.free();
}

// Test 4: Eigenvalues
console.log('--- Test 4: Eigenvalues (Symmetric Matrix) ---');
{
    const m = nalgebra.Matrix.from_data(3, 3, new Float64Array([
        2, 1, 0,
        1, 2, 1,
        0, 1, 2
    ]));

    const ev = m.symmetric_eigenvalues();
    console.log('Eigenvalues:', Array.from(ev).map(v => v.toFixed(4)));
    console.log('Expected: ~[0.586, 2, 3.414]\n');
    m.free();
}

// Test 5: Vector operations
console.log('--- Test 5: Vector Operations ---');
{
    const v1 = nalgebra.Vector.from_data(new Float64Array([1, 2, 3]));
    const v2 = nalgebra.Vector.from_data(new Float64Array([4, 5, 6]));

    console.log(`v1 = [${v1.get(0)}, ${v1.get(1)}, ${v1.get(2)}]`);
    console.log(`v2 = [${v2.get(0)}, ${v2.get(1)}, ${v2.get(2)}]`);
    console.log(`v1 · v2 (dot) = ${v1.dot(v2)}`);
    console.log(`|v1| (norm) = ${v1.norm().toFixed(4)}`);

    // Cross product using fixed-size function
    const cross = nalgebra.vec3_cross(
        new Float64Array([1, 2, 3]),
        new Float64Array([4, 5, 6])
    );
    console.log(`v1 × v2 (cross) = [${cross[0]}, ${cross[1]}, ${cross[2]}]`);
    console.log('Expected cross: [-3, 6, -3]\n');
    v1.free(); v2.free();
}

// Test 6: 4x4 matrix operations (graphics)
console.log('--- Test 6: 4x4 Matrix Operations (Graphics) ---');
{
    // Identity matrix
    const identity = new Float64Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);

    // Translation
    const trans = nalgebra.mat4_translation(10, 20, 30);
    console.log('Translation(10, 20, 30) last column:', trans[12], trans[13], trans[14]);

    // Scaling
    const scale = nalgebra.mat4_scaling(2, 3, 4);
    console.log('Scaling(2, 3, 4) diagonal:', scale[0], scale[5], scale[10]);

    // Rotation
    const rotX = nalgebra.mat4_rotation_x(Math.PI / 2);
    console.log(`Rotation X(90°) [1,1]: ${rotX[5].toFixed(4)} (expect ~0)`);

    // Transform a point
    const point = new Float64Array([1, 0, 0, 1]);
    const transformed = nalgebra.mat4_transform_vec4(trans, point);
    console.log(`Transform point [1,0,0,1]: [${transformed.map(v => v.toFixed(1)).join(', ')}]`);
    console.log('');
}

// Test 7: Performance benchmark
console.log('--- Test 7: Performance Benchmark ---');
{
    const sizes = [10, 50, 100];

    for (const size of sizes) {
        // Create random matrix data
        const data = new Float64Array(size * size);
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random();
        }

        const m = nalgebra.Matrix.from_data(size, size, data);
        const iterations = size <= 50 ? 100 : (size <= 100 ? 50 : 10);

        // Benchmark multiply
        const start = performance.now();
        for (let i = 0; i < iterations; i++) {
            const result = m.multiply(m);
            result.free();
        }
        const elapsed = performance.now() - start;

        const opsPerSec = (iterations / (elapsed / 1000)).toFixed(0);
        const flopsPerMul = 2 * size * size * size;
        const mflops = ((iterations * flopsPerMul) / (elapsed / 1000) / 1e6).toFixed(1);

        console.log(`${size}x${size}: ${opsPerSec} mul/s, ${mflops} MFLOPS`);
        m.free();
    }
}

// Compare with JS
console.log('\n--- Rust WASM vs JS Comparison (100x100) ---');
{
    const size = 100;
    const iterations = 50;

    // JS matrix multiply
    function jsMatrixMultiply(a, b, n) {
        const c = new Float64Array(n * n);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                let sum = 0;
                for (let k = 0; k < n; k++) {
                    sum += a[i * n + k] * b[k * n + j];
                }
                c[i * n + j] = sum;
            }
        }
        return c;
    }

    // Create random data
    const data = new Float64Array(size * size);
    for (let i = 0; i < data.length; i++) {
        data[i] = Math.random();
    }

    // JS benchmark
    const jsStart = performance.now();
    for (let i = 0; i < iterations; i++) {
        jsMatrixMultiply(data, data, size);
    }
    const jsTime = performance.now() - jsStart;

    // Rust WASM benchmark
    const m = nalgebra.Matrix.from_data(size, size, data);
    const wasmStart = performance.now();
    for (let i = 0; i < iterations; i++) {
        const result = m.multiply(m);
        result.free();
    }
    const wasmTime = performance.now() - wasmStart;

    console.log(`JS:   ${(iterations / (jsTime / 1000)).toFixed(1)} mul/s (${jsTime.toFixed(1)}ms)`);
    console.log(`WASM: ${(iterations / (wasmTime / 1000)).toFixed(1)} mul/s (${wasmTime.toFixed(1)}ms)`);
    console.log(`Speedup: ${(jsTime / wasmTime).toFixed(2)}x`);
    m.free();
}

// Compare with Eigen WASM
console.log('\n--- Bonus: Fixed-size mat4 Performance ---');
{
    const iterations = 10000;
    const a = new Float64Array([
        1, 0, 0, 1,
        0, 1, 0, 2,
        0, 0, 1, 3,
        0, 0, 0, 1
    ]);

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        nalgebra.mat4_multiply(a, a);
    }
    const elapsed = performance.now() - start;

    console.log(`mat4_multiply: ${(iterations / (elapsed / 1000)).toFixed(0)} ops/sec`);
}

console.log('\n=== All Tests Complete ===');
