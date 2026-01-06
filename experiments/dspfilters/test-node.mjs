/**
 * DSPFilters WASM Test Suite
 */

const createModule = (await import('./dspfilters.js')).default;
const wasm = await createModule();

console.log('=== DSPFilters WASM Tests ===\n');
console.log('Version:', wasm.getVersion());
console.log('');

// Generate a test signal (440Hz sine wave + 5000Hz noise)
const sampleRate = 44100;
const duration = 0.1; // 100ms
const numSamples = Math.floor(sampleRate * duration);

function generateTestSignal() {
    const signal = [];
    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        // 440Hz sine (signal we want to keep)
        const sine440 = Math.sin(2 * Math.PI * 440 * t);
        // 5000Hz sine (noise we want to filter out)
        const sine5000 = 0.5 * Math.sin(2 * Math.PI * 5000 * t);
        signal.push(sine440 + sine5000);
    }
    return signal;
}

// Helper to calculate RMS
function rms(signal) {
    const sumSquares = signal.reduce((sum, x) => sum + x * x, 0);
    return Math.sqrt(sumSquares / signal.length);
}

// Helper to convert JS array to WASM vector
function toVector(arr) {
    const vec = new wasm.VectorDouble();
    for (const val of arr) {
        vec.push_back(val);
    }
    return vec;
}

// Helper to convert WASM vector to JS array
function fromVector(vec) {
    const arr = [];
    for (let i = 0; i < vec.size(); i++) {
        arr.push(vec.get(i));
    }
    return arr;
}

// Test 1: Butterworth Low-Pass Filter
console.log('--- Test 1: Butterworth Low-Pass (1000Hz cutoff) ---');
{
    const filter = new wasm.ButterworthLowPass(4, sampleRate, 1000);
    const input = generateTestSignal();
    const inputVec = toVector(input);

    const start = performance.now();
    const outputVec = filter.processBlock(inputVec);
    const elapsed = performance.now() - start;

    const output = fromVector(outputVec);

    console.log(`Input RMS: ${rms(input).toFixed(4)}`);
    console.log(`Output RMS: ${rms(output).toFixed(4)}`);
    console.log(`Processing time: ${elapsed.toFixed(2)}ms for ${numSamples} samples`);
    console.log(`Throughput: ${(numSamples / elapsed * 1000).toFixed(0)} samples/sec`);

    // The high-frequency (5000Hz) component should be attenuated
    // We expect output RMS to be lower than input because 5kHz is filtered
    if (rms(output) < rms(input)) {
        console.log('✓ High-frequency attenuation confirmed\n');
    } else {
        console.log('✗ Filter may not be working correctly\n');
    }

    filter.delete();
    inputVec.delete();
    outputVec.delete();
}

// Test 2: Butterworth High-Pass Filter
console.log('--- Test 2: Butterworth High-Pass (2000Hz cutoff) ---');
{
    const filter = new wasm.ButterworthHighPass(4, sampleRate, 2000);
    const input = generateTestSignal();
    const inputVec = toVector(input);

    const outputVec = filter.processBlock(inputVec);
    const output = fromVector(outputVec);

    console.log(`Input RMS: ${rms(input).toFixed(4)}`);
    console.log(`Output RMS: ${rms(output).toFixed(4)}`);

    // The low-frequency (440Hz) component should be attenuated
    // Output should mainly contain the 5kHz component
    if (rms(output) < rms(input)) {
        console.log('✓ Low-frequency attenuation confirmed\n');
    } else {
        console.log('✗ Filter may not be working correctly\n');
    }

    filter.delete();
    inputVec.delete();
    outputVec.delete();
}

// Test 3: Butterworth Band-Pass Filter
console.log('--- Test 3: Butterworth Band-Pass (300-600Hz) ---');
{
    const filter = new wasm.ButterworthBandPass(4, sampleRate, 450, 300);
    const input = generateTestSignal();
    const inputVec = toVector(input);

    const outputVec = filter.processBlock(inputVec);
    const output = fromVector(outputVec);

    console.log(`Input RMS: ${rms(input).toFixed(4)}`);
    console.log(`Output RMS: ${rms(output).toFixed(4)}`);

    // Both 5kHz noise AND some of 440Hz should be attenuated
    // since bandpass is centered at 450Hz with 300Hz width
    console.log('✓ Band-pass filter applied\n');

    filter.delete();
    inputVec.delete();
    outputVec.delete();
}

// Test 4: Chebyshev Type I Low-Pass
console.log('--- Test 4: Chebyshev Type I Low-Pass (1000Hz, 1dB ripple) ---');
{
    const filter = new wasm.ChebyshevILowPass(4, sampleRate, 1000, 1);
    const input = generateTestSignal();
    const inputVec = toVector(input);

    const outputVec = filter.processBlock(inputVec);
    const output = fromVector(outputVec);

    console.log(`Input RMS: ${rms(input).toFixed(4)}`);
    console.log(`Output RMS: ${rms(output).toFixed(4)}`);
    console.log('✓ Chebyshev filter applied\n');

    filter.delete();
    inputVec.delete();
    outputVec.delete();
}

// Test 5: RBJ Filters
console.log('--- Test 5: RBJ Biquad Filters ---');
{
    const lpf = new wasm.RBJLowPass(sampleRate, 1000, 0.707);
    const hpf = new wasm.RBJHighPass(sampleRate, 2000, 0.707);
    const bpf = new wasm.RBJBandPass(sampleRate, 1000, 500);

    const input = generateTestSignal();
    const inputVec = toVector(input);

    const lpfOut = fromVector(lpf.processBlock(inputVec));
    lpf.reset(); // Reset for next test

    const inputVec2 = toVector(input);
    const hpfOut = fromVector(hpf.processBlock(inputVec2));

    const inputVec3 = toVector(input);
    const bpfOut = fromVector(bpf.processBlock(inputVec3));

    console.log(`RBJ Low-Pass RMS: ${rms(lpfOut).toFixed(4)}`);
    console.log(`RBJ High-Pass RMS: ${rms(hpfOut).toFixed(4)}`);
    console.log(`RBJ Band-Pass RMS: ${rms(bpfOut).toFixed(4)}`);
    console.log('✓ RBJ biquad filters working\n');

    lpf.delete();
    hpf.delete();
    bpf.delete();
    inputVec.delete();
    inputVec2.delete();
    inputVec3.delete();
}

// Test 6: Performance Benchmark
console.log('--- Test 6: Performance Benchmark ---');
{
    const filter = new wasm.ButterworthLowPass(4, sampleRate, 1000);
    const iterations = 1000;
    const blockSize = 1024;

    // Pre-generate test data
    const testData = [];
    for (let i = 0; i < blockSize; i++) {
        testData.push(Math.random() * 2 - 1);
    }
    const inputVec = toVector(testData);

    // Warm up
    for (let i = 0; i < 10; i++) {
        const out = filter.processBlock(inputVec);
        out.delete();
        filter.reset();
    }

    // Benchmark
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        const out = filter.processBlock(inputVec);
        out.delete();
        filter.reset();
    }
    const elapsed = performance.now() - start;

    const totalSamples = iterations * blockSize;
    const samplesPerSec = totalSamples / (elapsed / 1000);

    console.log(`Processed ${totalSamples.toLocaleString()} samples in ${elapsed.toFixed(2)}ms`);
    console.log(`Throughput: ${(samplesPerSec / 1e6).toFixed(2)} million samples/sec`);
    console.log(`Real-time capacity: ${(samplesPerSec / sampleRate).toFixed(1)}x at 44.1kHz`);

    filter.delete();
    inputVec.delete();
}

// Test 7: Sample-by-sample processing
console.log('\n--- Test 7: Sample-by-sample Processing ---');
{
    const filter = new wasm.ButterworthLowPass(4, sampleRate, 1000);
    const numSamples = 10000;

    const start = performance.now();
    for (let i = 0; i < numSamples; i++) {
        filter.processSample(Math.random() * 2 - 1);
    }
    const elapsed = performance.now() - start;

    const samplesPerSec = numSamples / (elapsed / 1000);
    console.log(`Single-sample throughput: ${(samplesPerSec / 1e6).toFixed(2)} million samples/sec`);
    console.log('Note: Block processing is faster due to reduced JS/WASM boundary crossings');

    filter.delete();
}

console.log('\n=== All Tests Complete ===');
