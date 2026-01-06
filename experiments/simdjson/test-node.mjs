/**
 * simdjson WASM Test Suite
 * Also benchmarks against native JSON.parse
 */

const createModule = (await import('./simdjson.js')).default;
const wasm = await createModule();

console.log('=== simdjson WASM Tests ===\n');
console.log('Version:', wasm.getVersion());
console.log('');

// Test JSON samples
const simpleJson = '{"name": "test", "value": 42, "active": true}';
const nestedJson = '{"user": {"name": "John", "age": 30}, "scores": [100, 95, 87]}';
const arrayJson = '[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]';

// Test 1: Validation
console.log('--- Test 1: JSON Validation ---');
{
    console.log(`Valid JSON: ${wasm.validateJson(simpleJson) ? '✓' : '✗'}`);
    console.log(`Invalid JSON: ${!wasm.validateJson('{invalid}') ? '✓ (correctly rejected)' : '✗'}`);
    console.log('');
}

// Test 2: Parse simple JSON
console.log('--- Test 2: Parse Simple JSON ---');
{
    const result = wasm.parseJson(simpleJson);
    console.log(`Parse result: ${result}`);
    console.log(result === 'ok' ? '✓ Parsed successfully\n' : '✗ Parse failed\n');
}

// Test 3: Extract values
console.log('--- Test 3: Extract Values ---');
{
    const name = wasm.getString(simpleJson, 'name');
    const value = wasm.getInt64(simpleJson, 'value');
    const active = wasm.getBool(simpleJson, 'active');

    console.log(`getString("name"): "${name}"`);
    console.log(`getInt64("value"): ${value}`);
    console.log(`getBool("active"): ${active}`);

    if (name === 'test' && value === 42 && active === true) {
        console.log('✓ All values extracted correctly\n');
    } else {
        console.log('✗ Value extraction failed\n');
    }
}

// Test 4: Count array
console.log('--- Test 4: Count Array Elements ---');
{
    const count = wasm.countArray(arrayJson, '');
    console.log(`Array count: ${count}`);
    console.log(count === 10 ? '✓ Correct count\n' : '✗ Incorrect count\n');
}

// Test 5: Double values
console.log('--- Test 5: Double Values ---');
{
    const jsonWithDouble = '{"pi": 3.14159, "e": 2.71828}';
    const pi = wasm.getDouble(jsonWithDouble, 'pi');
    const e = wasm.getDouble(jsonWithDouble, 'e');

    console.log(`pi: ${pi}`);
    console.log(`e: ${e}`);
    console.log(Math.abs(pi - 3.14159) < 0.0001 ? '✓ Double values correct\n' : '✗ Double values incorrect\n');
}

// Test 6: Performance Benchmark - simdjson vs JSON.parse
console.log('--- Test 6: Performance Benchmark ---');
{
    // Generate test data
    const testData = {
        users: Array.from({ length: 100 }, (_, i) => ({
            id: i,
            name: `User ${i}`,
            email: `user${i}@example.com`,
            scores: [Math.random() * 100, Math.random() * 100, Math.random() * 100],
            metadata: {
                created: new Date().toISOString(),
                active: i % 2 === 0,
                tags: ['tag1', 'tag2', 'tag3']
            }
        }))
    };

    const largeJson = JSON.stringify(testData);
    console.log(`Test JSON size: ${(largeJson.length / 1024).toFixed(1)} KB`);

    const iterations = 1000;

    // Warm up
    for (let i = 0; i < 100; i++) {
        wasm.validateJson(largeJson);
        JSON.parse(largeJson);
    }

    // Benchmark simdjson validation
    const simdjsonStart = performance.now();
    for (let i = 0; i < iterations; i++) {
        wasm.validateJson(largeJson);
    }
    const simdjsonTime = performance.now() - simdjsonStart;

    // Benchmark native JSON.parse
    const nativeStart = performance.now();
    for (let i = 0; i < iterations; i++) {
        JSON.parse(largeJson);
    }
    const nativeTime = performance.now() - nativeStart;

    console.log(`\nsimdjson.validateJson: ${simdjsonTime.toFixed(2)}ms for ${iterations} iterations`);
    console.log(`Native JSON.parse: ${nativeTime.toFixed(2)}ms for ${iterations} iterations`);

    const ratio = nativeTime / simdjsonTime;
    if (ratio > 1) {
        console.log(`simdjson is ${ratio.toFixed(2)}x faster`);
    } else {
        console.log(`Native JSON.parse is ${(1/ratio).toFixed(2)}x faster`);
    }

    // Throughput
    const simdjsonThroughput = (iterations * largeJson.length) / (simdjsonTime / 1000) / 1024 / 1024;
    const nativeThroughput = (iterations * largeJson.length) / (nativeTime / 1000) / 1024 / 1024;

    console.log(`\nsimdjson throughput: ${simdjsonThroughput.toFixed(1)} MB/s`);
    console.log(`Native throughput: ${nativeThroughput.toFixed(1)} MB/s`);
}

// Test 7: Small JSON performance
console.log('\n--- Test 7: Small JSON Performance ---');
{
    const smallJson = '{"x": 1, "y": 2}';
    const iterations = 10000;

    // Warm up
    for (let i = 0; i < 100; i++) {
        wasm.validateJson(smallJson);
        JSON.parse(smallJson);
    }

    const simdjsonStart = performance.now();
    for (let i = 0; i < iterations; i++) {
        wasm.validateJson(smallJson);
    }
    const simdjsonTime = performance.now() - simdjsonStart;

    const nativeStart = performance.now();
    for (let i = 0; i < iterations; i++) {
        JSON.parse(smallJson);
    }
    const nativeTime = performance.now() - nativeStart;

    console.log(`Small JSON (${smallJson.length} bytes):`);
    console.log(`simdjson: ${simdjsonTime.toFixed(2)}ms`);
    console.log(`Native: ${nativeTime.toFixed(2)}ms`);

    const ratio = nativeTime / simdjsonTime;
    if (ratio > 1) {
        console.log(`simdjson is ${ratio.toFixed(2)}x faster`);
    } else {
        console.log(`Native JSON.parse is ${(1/ratio).toFixed(2)}x faster (expected for small inputs)`);
    }
}

// Test 8: Error handling
console.log('\n--- Test 8: Error Handling ---');
{
    const invalid = '{"unclosed": ';
    const result = wasm.validateJson(invalid);
    console.log(`Invalid JSON rejected: ${!result ? '✓' : '✗'}`);

    const parseResult = wasm.parseJson(invalid);
    console.log(`Parse returns error: ${parseResult.startsWith('error') ? '✓' : '✗'}`);
    console.log(`Error message: ${parseResult}`);
}

console.log('\n=== All Tests Complete ===');
