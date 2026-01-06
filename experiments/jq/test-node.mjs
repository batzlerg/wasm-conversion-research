/**
 * jq WASM Test Suite
 */

const createModule = (await import('./jq.js')).default;
const wasm = await createModule();

console.log('=== jq WASM Tests ===\n');
console.log('Version:', wasm.UTF8ToString(wasm._jq_wasm_version()));
console.log('');

// Helper for calling jq
function jqFilter(filter, json) {
    const filterPtr = wasm._malloc(filter.length + 1);
    wasm.stringToUTF8(filter, filterPtr, filter.length + 1);

    const jsonPtr = wasm._malloc(json.length + 1);
    wasm.stringToUTF8(json, jsonPtr, json.length + 1);

    const resultPtr = wasm._jq_wasm_filter(filterPtr, jsonPtr);
    const result = wasm.UTF8ToString(resultPtr);

    wasm._free(filterPtr);
    wasm._free(jsonPtr);

    return result;
}

// Test 1: Simple field access
console.log('--- Test 1: Field Access ---');
{
    const json = '{"name": "Alice", "age": 30}';
    console.log(`Input: ${json}`);
    console.log(`.name: ${jqFilter('.name', json)}`);
    console.log(`.age: ${jqFilter('.age', json)}`);
    console.log(`. (identity): ${jqFilter('.', json)}`);
    console.log('');
}

// Test 2: Array operations
console.log('--- Test 2: Array Operations ---');
{
    const json = '[1, 2, 3, 4, 5]';
    console.log(`Input: ${json}`);
    console.log(`.[2]: ${jqFilter('.[2]', json)}`);
    console.log(`.[2:4]: ${jqFilter('.[2:4]', json)}`);
    console.log(`.[] | . * 2: ${jqFilter('[.[] | . * 2]', json)}`);
    console.log(`length: ${jqFilter('length', json)}`);
    console.log('');
}

// Test 3: Object array processing
console.log('--- Test 3: Object Array Processing ---');
{
    const json = '[{"name":"Alice","score":85},{"name":"Bob","score":92},{"name":"Charlie","score":78}]';
    console.log(`Input: ${json}`);
    console.log(`.[].name: ${jqFilter('[.[].name]', json)}`);
    console.log(`map(.score): ${jqFilter('map(.score)', json)}`);
    console.log(`max_by(.score): ${jqFilter('max_by(.score)', json)}`);
    console.log(`select(.score > 80): ${jqFilter('[.[] | select(.score > 80)]', json)}`);
    console.log('');
}

// Test 4: Transformations
console.log('--- Test 4: Transformations ---');
{
    const json = '{"a": 1, "b": 2, "c": 3}';
    console.log(`Input: ${json}`);
    console.log(`keys: ${jqFilter('keys', json)}`);
    console.log(`values: ${jqFilter('[.[]]', json)}`);
    console.log(`to_entries: ${jqFilter('to_entries', json)}`);
    console.log(`with_entries(.value += 10): ${jqFilter('with_entries(.value += 10)', json)}`);
    console.log('');
}

// Test 5: Math and string operations
console.log('--- Test 5: Math & String Operations ---');
{
    console.log(`add [1,2,3,4,5]: ${jqFilter('add', '[1,2,3,4,5]')}`);
    console.log(`min [3,1,4,1,5]: ${jqFilter('min', '[3,1,4,1,5]')}`);
    console.log(`max [3,1,4,1,5]: ${jqFilter('max', '[3,1,4,1,5]')}`);
    console.log(`"hello" | ascii_upcase: ${jqFilter('ascii_upcase', '"hello"')}`);
    console.log(`"hello world" | split(" "): ${jqFilter('split(" ")', '"hello world"')}`);
    console.log('');
}

// Test 6: Conditionals and logic
console.log('--- Test 6: Conditionals ---');
{
    const json = '{"status": "active", "count": 5}';
    console.log(`Input: ${json}`);
    console.log(`if .status == "active" then "yes" else "no" end: ${jqFilter('if .status == "active" then "yes" else "no" end', json)}`);
    console.log(`.count > 3: ${jqFilter('.count > 3', json)}`);
    console.log('');
}

// Test 7: Performance benchmark
console.log('--- Test 7: Performance Benchmark ---');
{
    wasm._jq_wasm_init();

    // Pre-compile filter
    const filterStr = '[.[] | {name: .name, doubled: (.value * 2)}]';
    const filterPtr = wasm._malloc(filterStr.length + 1);
    wasm.stringToUTF8(filterStr, filterPtr, filterStr.length + 1);
    const compileResult = wasm._jq_wasm_compile(filterPtr);
    wasm._free(filterPtr);

    if (compileResult !== 0) {
        console.log('Filter compilation failed, skipping benchmark');
        console.log(`Filter: ${filterStr}`);
    } else {

    // Create test data
    const testData = JSON.stringify(
        Array.from({length: 100}, (_, i) => ({name: `item${i}`, value: i}))
    );
    const jsonPtr = wasm._malloc(testData.length + 1);
    wasm.stringToUTF8(testData, jsonPtr, testData.length + 1);

    const iterations = 1000;

    // Benchmark WASM
    const wasmStart = performance.now();
    for (let i = 0; i < iterations; i++) {
        const resultPtr = wasm._jq_wasm_run(jsonPtr);
        // Result is reused, no need to free
    }
    const wasmTime = performance.now() - wasmStart;

    wasm._free(jsonPtr);

    // Benchmark JS equivalent
    const data = JSON.parse(testData);
    const jsStart = performance.now();
    for (let i = 0; i < iterations; i++) {
        const result = data.map(item => ({name: item.name, doubled: item.value * 2}));
    }
    const jsTime = performance.now() - jsStart;

    console.log(`100-element array, ${iterations} iterations:`);
    console.log(`WASM jq: ${(iterations / (wasmTime / 1000)).toFixed(0)} ops/sec (${wasmTime.toFixed(1)}ms)`);
    console.log(`JS map: ${(iterations / (jsTime / 1000)).toFixed(0)} ops/sec (${jsTime.toFixed(1)}ms)`);
    console.log(`Speedup: ${(wasmTime / jsTime).toFixed(2)}x slower (expected - jq has parsing overhead)`);
    }
}

// Test 8: Complex jq expressions
console.log('\n--- Test 8: Complex Expressions ---');
{
    const json = '{"users":[{"id":1,"name":"Alice","roles":["admin","user"]},{"id":2,"name":"Bob","roles":["user"]}]}';
    console.log(`Input: ${JSON.stringify(JSON.parse(json))}`);
    console.log(`Admin users: ${jqFilter('.users | map(select(.roles | contains(["admin"]))) | .[].name', json)}`);
    console.log(`Role count: ${jqFilter('[.users[].roles | length] | add', json)}`);
    console.log('');
}

wasm._jq_wasm_cleanup();
console.log('=== All Tests Complete ===');
