/**
 * Maximilian WASM Test Suite
 */

const createModule = (await import('./maximilian.js')).default;
const wasm = await createModule();

console.log('=== Maximilian WASM Tests ===\n');
console.log('Version:', wasm.getVersion());
console.log('');

// Setup audio settings
wasm.maxiSettings.setup(44100, 2, 512);
console.log('Sample rate:', wasm.maxiSettings.getSampleRate());
console.log('');

// Test 1: Oscillators
console.log('--- Test 1: Oscillators ---');
{
    const osc = new wasm.maxiOsc();

    // Generate one cycle of each waveform
    const samples = 100;
    let sineSum = 0, sawSum = 0, squareSum = 0, triSum = 0;

    for (let i = 0; i < samples; i++) {
        sineSum += Math.abs(osc.sinewave(440));
        sawSum += Math.abs(osc.saw(440));
        squareSum += Math.abs(osc.square(440));
        triSum += Math.abs(osc.triangle(440));
    }

    console.log(`Sine avg amplitude: ${(sineSum / samples).toFixed(4)}`);
    console.log(`Saw avg amplitude: ${(sawSum / samples).toFixed(4)}`);
    console.log(`Square avg amplitude: ${(squareSum / samples).toFixed(4)}`);
    console.log(`Triangle avg amplitude: ${(triSum / samples).toFixed(4)}`);

    // Check that we got valid output
    if (sineSum > 0 && sawSum > 0 && squareSum > 0 && triSum > 0) {
        console.log('✓ All oscillators producing output\n');
    } else {
        console.log('✗ Some oscillators not working\n');
    }

    osc.delete();
}

// Test 2: Filter
console.log('--- Test 2: Filter ---');
{
    const osc = new wasm.maxiOsc();
    const filter = new wasm.maxiFilter();

    // Generate saw wave through lowpass filter
    let unfilteredSum = 0;
    let filteredSum = 0;

    for (let i = 0; i < 1000; i++) {
        const saw = osc.saw(440);
        const filtered = filter.lores(saw, 500, 0.5); // 500Hz cutoff
        unfilteredSum += Math.abs(saw);
        filteredSum += Math.abs(filtered);
    }

    console.log(`Unfiltered avg: ${(unfilteredSum / 1000).toFixed(4)}`);
    console.log(`Filtered avg: ${(filteredSum / 1000).toFixed(4)}`);

    // Filtered should be lower (high frequencies removed)
    if (filteredSum < unfilteredSum) {
        console.log('✓ Filter is attenuating signal\n');
    } else {
        console.log('✗ Filter may not be working correctly\n');
    }

    osc.delete();
    filter.delete();
}

// Test 3: ADSR Envelope
console.log('--- Test 3: ADSR Envelope ---');
{
    const env = new wasm.maxiEnv();

    // Setup ADSR (attack, decay, sustain, release in ms)
    env.setAttack(10);
    env.setDecay(50);
    env.setSustain(0.5);
    env.setRelease(100);

    // Simulate attack phase
    let envOutput = 0;
    for (let i = 0; i < 100; i++) {
        envOutput = env.adsr(1.0, 1); // trigger = 1 (note on)
    }
    console.log(`Envelope output (during attack): ${envOutput.toFixed(4)}`);

    if (envOutput > 0) {
        console.log('✓ Envelope producing output\n');
    } else {
        console.log('✗ Envelope not working\n');
    }

    env.delete();
}

// Test 4: Delay
console.log('--- Test 4: Delay ---');
{
    const osc = new wasm.maxiOsc();
    const delay = new wasm.maxiDelay();

    // Generate some samples
    let delayOutput = 0;
    for (let i = 0; i < 1000; i++) {
        const sine = osc.sinewave(440);
        delayOutput = delay.dl(sine, 4410, 0.5); // 100ms delay at 44100Hz
    }

    console.log(`Delay output: ${delayOutput.toFixed(4)}`);
    console.log('✓ Delay line processed\n');

    osc.delete();
    delay.delete();
}

// Test 5: Stereo Panning
console.log('--- Test 5: Stereo Panning ---');
{
    const mix = new wasm.maxiMix();

    // Pan left
    let leftPan = mix.stereo(1.0, 0.0);
    console.log(`Pan left: L=${leftPan.get(0).toFixed(2)}, R=${leftPan.get(1).toFixed(2)}`);

    // Pan center
    let centerPan = mix.stereo(1.0, 0.5);
    console.log(`Pan center: L=${centerPan.get(0).toFixed(2)}, R=${centerPan.get(1).toFixed(2)}`);

    // Pan right
    let rightPan = mix.stereo(1.0, 1.0);
    console.log(`Pan right: L=${rightPan.get(0).toFixed(2)}, R=${rightPan.get(1).toFixed(2)}`);

    // Verify panning
    if (leftPan.get(0) > leftPan.get(1) && rightPan.get(1) > rightPan.get(0)) {
        console.log('✓ Panning working correctly\n');
    } else {
        console.log('✗ Panning may not be working correctly\n');
    }

    leftPan.delete();
    centerPan.delete();
    rightPan.delete();
    mix.delete();
}

// Test 6: Performance Benchmark
console.log('--- Test 6: Performance Benchmark ---');
{
    const osc = new wasm.maxiOsc();
    const filter = new wasm.maxiFilter();

    const iterations = 100000;

    // Benchmark oscillator
    const oscStart = performance.now();
    for (let i = 0; i < iterations; i++) {
        osc.sinewave(440);
    }
    const oscTime = performance.now() - oscStart;

    // Benchmark oscillator + filter
    const filterStart = performance.now();
    for (let i = 0; i < iterations; i++) {
        const sig = osc.saw(440);
        filter.lores(sig, 1000, 0.5);
    }
    const filterTime = performance.now() - filterStart;

    const oscRate = iterations / (oscTime / 1000);
    const filterRate = iterations / (filterTime / 1000);

    console.log(`Oscillator: ${oscTime.toFixed(2)}ms for ${iterations} samples`);
    console.log(`Osc+Filter: ${filterTime.toFixed(2)}ms for ${iterations} samples`);
    console.log(`Oscillator throughput: ${(oscRate / 1e6).toFixed(2)} million samples/sec`);
    console.log(`Osc+Filter throughput: ${(filterRate / 1e6).toFixed(2)} million samples/sec`);

    // Calculate real-time capacity
    const sampleRate = 44100;
    console.log(`Real-time capacity (osc): ${(oscRate / sampleRate).toFixed(0)}x`);
    console.log(`Real-time capacity (osc+filter): ${(filterRate / sampleRate).toFixed(0)}x`);

    osc.delete();
    filter.delete();
}

// Test 7: Complex synthesis patch
console.log('\n--- Test 7: Complex Synthesis Patch ---');
{
    // Create a simple subtractive synth patch
    const osc1 = new wasm.maxiOsc();
    const osc2 = new wasm.maxiOsc();
    const lfo = new wasm.maxiOsc();
    const filter = new wasm.maxiFilter();
    const env = new wasm.maxiEnv();

    env.setAttack(5);
    env.setDecay(100);
    env.setSustain(0.6);
    env.setRelease(200);

    const iterations = 10000;
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
        // Two detuned oscillators
        const sig1 = osc1.saw(440);
        const sig2 = osc2.saw(442);
        const mix = (sig1 + sig2) * 0.5;

        // LFO modulated filter
        const lfoVal = lfo.sinewave(2) * 500 + 1000;
        const filtered = filter.lores(mix, lfoVal, 0.7);

        // ADSR envelope
        const envVal = env.adsr(1.0, i < 5000 ? 1 : 0);
        const output = filtered * envVal;
    }

    const elapsed = performance.now() - start;
    console.log(`Complex patch: ${iterations} samples in ${elapsed.toFixed(2)}ms`);
    console.log(`Throughput: ${(iterations / elapsed * 1000 / 1e6).toFixed(2)} million samples/sec`);

    osc1.delete();
    osc2.delete();
    lfo.delete();
    filter.delete();
    env.delete();
}

console.log('\n=== All Tests Complete ===');
