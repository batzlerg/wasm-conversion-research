/**
 * Eigen WASM Test Suite
 */

const createModule = (await import('./eigen.js')).default;
const wasm = await createModule();

console.log('=== Eigen WASM Tests ===\n');
console.log('Version:', wasm.getVersion());
console.log('');

// Test 1: Basic Matrix Operations
console.log('--- Test 1: Matrix Creation and Access ---');
{
    const m = new wasm.Matrix(3, 3);
    m.set(0, 0, 1); m.set(0, 1, 2); m.set(0, 2, 3);
    m.set(1, 0, 4); m.set(1, 1, 5); m.set(1, 2, 6);
    m.set(2, 0, 7); m.set(2, 1, 8); m.set(2, 2, 9);

    console.log(`Matrix ${m.rows()}x${m.cols()}:`);
    console.log(`  [${m.get(0,0)}, ${m.get(0,1)}, ${m.get(0,2)}]`);
    console.log(`  [${m.get(1,0)}, ${m.get(1,1)}, ${m.get(1,2)}]`);
    console.log(`  [${m.get(2,0)}, ${m.get(2,1)}, ${m.get(2,2)}]`);
    console.log(`Determinant: ${m.determinant()}`);
    console.log(`Norm: ${m.norm().toFixed(4)}\n`);
    m.delete();
}

// Test 2: Matrix Multiplication
console.log('--- Test 2: Matrix Multiplication ---');
{
    const a = new wasm.Matrix(2, 3);
    a.set(0, 0, 1); a.set(0, 1, 2); a.set(0, 2, 3);
    a.set(1, 0, 4); a.set(1, 1, 5); a.set(1, 2, 6);

    const b = new wasm.Matrix(3, 2);
    b.set(0, 0, 7); b.set(0, 1, 8);
    b.set(1, 0, 9); b.set(1, 1, 10);
    b.set(2, 0, 11); b.set(2, 1, 12);

    const c = a.multiply(b);
    console.log(`A (2x3) * B (3x2) = C (${c.rows()}x${c.cols()}):`);
    console.log(`  [${c.get(0,0)}, ${c.get(0,1)}]`);
    console.log(`  [${c.get(1,0)}, ${c.get(1,1)}]`);
    console.log('Expected: [58, 64], [139, 154]\n');
    a.delete(); b.delete(); c.delete();
}

// Test 3: Transpose and Inverse
console.log('--- Test 3: Transpose and Inverse ---');
{
    const m = new wasm.Matrix(2, 2);
    m.set(0, 0, 4); m.set(0, 1, 7);
    m.set(1, 0, 2); m.set(1, 1, 6);

    const mt = m.transpose();
    console.log(`Original: [${m.get(0,0)}, ${m.get(0,1)}], [${m.get(1,0)}, ${m.get(1,1)}]`);
    console.log(`Transpose: [${mt.get(0,0)}, ${mt.get(0,1)}], [${mt.get(1,0)}, ${mt.get(1,1)}]`);

    const mi = m.inverse();
    console.log(`Inverse: [${mi.get(0,0).toFixed(3)}, ${mi.get(0,1).toFixed(3)}], [${mi.get(1,0).toFixed(3)}, ${mi.get(1,1).toFixed(3)}]`);

    // Verify: M * M^-1 = I
    const identity = m.multiply(mi);
    console.log(`M * M^-1: [${identity.get(0,0).toFixed(3)}, ${identity.get(0,1).toFixed(3)}], [${identity.get(1,0).toFixed(3)}, ${identity.get(1,1).toFixed(3)}]\n`);
    m.delete(); mt.delete(); mi.delete(); identity.delete();
}

// Test 4: Linear System Solving (Ax = b)
console.log('--- Test 4: Solve Linear System Ax = b ---');
{
    // 2x + 3y = 8
    // 4x + 5y = 14
    // Solution: x=1, y=2
    const a = new wasm.Matrix(2, 2);
    a.set(0, 0, 2); a.set(0, 1, 3);
    a.set(1, 0, 4); a.set(1, 1, 5);

    const bVec = new wasm.VectorDouble();
    bVec.push_back(8);
    bVec.push_back(14);

    const x = a.solve(bVec);
    console.log(`System: 2x + 3y = 8, 4x + 5y = 14`);
    console.log(`Solution: x = ${x.get(0).toFixed(4)}, y = ${x.get(1).toFixed(4)}`);
    console.log('Expected: x = 1, y = 2\n');
    a.delete(); bVec.delete(); x.delete();
}

// Test 5: Eigenvalues
console.log('--- Test 5: Eigenvalues (Symmetric Matrix) ---');
{
    // Symmetric matrix for real eigenvalues
    const m = new wasm.Matrix(3, 3);
    m.set(0, 0, 2); m.set(0, 1, 1); m.set(0, 2, 0);
    m.set(1, 0, 1); m.set(1, 1, 2); m.set(1, 2, 1);
    m.set(2, 0, 0); m.set(2, 1, 1); m.set(2, 2, 2);

    const ev = m.eigenvalues();
    console.log('Eigenvalues:', Array.from({length: ev.size()}, (_, i) => ev.get(i).toFixed(4)));
    console.log('Expected: ~[0.586, 2, 3.414]\n');
    m.delete(); ev.delete();
}

// Test 6: Vector Operations
console.log('--- Test 6: Vector Operations ---');
{
    const v1 = new wasm.Vector(3);
    v1.set(0, 1); v1.set(1, 2); v1.set(2, 3);

    const v2 = new wasm.Vector(3);
    v2.set(0, 4); v2.set(1, 5); v2.set(2, 6);

    console.log(`v1 = [${v1.get(0)}, ${v1.get(1)}, ${v1.get(2)}]`);
    console.log(`v2 = [${v2.get(0)}, ${v2.get(1)}, ${v2.get(2)}]`);
    console.log(`v1 · v2 (dot) = ${v1.dot(v2)}`);
    console.log(`|v1| (norm) = ${v1.norm().toFixed(4)}`);

    const cross = v1.cross3(v2);
    console.log(`v1 × v2 (cross) = [${cross.get(0)}, ${cross.get(1)}, ${cross.get(2)}]`);
    console.log('Expected cross: [-3, 6, -3]\n');
    v1.delete(); v2.delete(); cross.delete();
}

// Test 7: Performance Benchmark
console.log('--- Test 7: Performance Benchmark ---');
{
    const sizes = [10, 50, 100, 200];

    for (const size of sizes) {
        // Create random matrix
        const m = new wasm.Matrix(size, size);
        m.setRandom();

        const iterations = size <= 50 ? 100 : (size <= 100 ? 50 : 10);

        // Benchmark multiply
        const start = performance.now();
        for (let i = 0; i < iterations; i++) {
            const result = m.multiply(m);
            result.delete();
        }
        const elapsed = performance.now() - start;

        const opsPerSec = (iterations / (elapsed / 1000)).toFixed(0);
        const flopsPerMul = 2 * size * size * size; // 2n³ FLOPs for matrix multiply
        const mflops = ((iterations * flopsPerMul) / (elapsed / 1000) / 1e6).toFixed(1);

        console.log(`${size}x${size}: ${opsPerSec} mul/s, ${mflops} MFLOPS`);
        m.delete();
    }
}

// Compare with JS implementation
console.log('\n--- JS Baseline Comparison (100x100) ---');
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
    const jsA = new Float64Array(size * size);
    const jsB = new Float64Array(size * size);
    for (let i = 0; i < size * size; i++) {
        jsA[i] = Math.random();
        jsB[i] = Math.random();
    }

    // JS benchmark
    const jsStart = performance.now();
    for (let i = 0; i < iterations; i++) {
        jsMatrixMultiply(jsA, jsB, size);
    }
    const jsTime = performance.now() - jsStart;

    // WASM benchmark with same data
    const wasmM = new wasm.Matrix(size, size);
    const wasmVec = new wasm.VectorDouble();
    for (let i = 0; i < size * size; i++) wasmVec.push_back(jsA[i]);
    wasmM.setFromVector(wasmVec);
    wasmVec.delete();

    const wasmStart = performance.now();
    for (let i = 0; i < iterations; i++) {
        const result = wasmM.multiply(wasmM);
        result.delete();
    }
    const wasmTime = performance.now() - wasmStart;

    console.log(`JS:   ${(iterations / (jsTime / 1000)).toFixed(1)} mul/s (${jsTime.toFixed(1)}ms)`);
    console.log(`WASM: ${(iterations / (wasmTime / 1000)).toFixed(1)} mul/s (${wasmTime.toFixed(1)}ms)`);
    console.log(`Speedup: ${(jsTime / wasmTime).toFixed(2)}x`);
    wasmM.delete();
}

console.log('\n=== All Tests Complete ===');
