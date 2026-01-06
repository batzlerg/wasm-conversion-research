/**
 * Maximilian WASM Wrapper - Simplified
 * Core audio synthesis functionality
 */

#include <emscripten/bind.h>
#include "maximilian.h"

using namespace emscripten;

// Wrapper for maxiOsc
class MaxiOscWrapper {
private:
    maxiOsc osc;

public:
    double sinewave(double freq) { return osc.sinewave(freq); }
    double coswave(double freq) { return osc.coswave(freq); }
    double saw(double freq) { return osc.saw(freq); }
    double triangle(double freq) { return osc.triangle(freq); }
    double square(double freq) { return osc.square(freq); }
    double pulse(double freq, double duty) { return osc.pulse(freq, duty); }
    double phasor(double freq) { return osc.phasor(freq); }
    double noise() { return osc.noise(); }
    void phaseReset(double phase) { osc.phaseReset(phase); }
};

// Wrapper for maxiFilter
class MaxiFilterWrapper {
private:
    maxiFilter filter;

public:
    double lores(double input, double cutoff, double resonance) {
        return filter.lores(input, cutoff, resonance);
    }
    double hires(double input, double cutoff, double resonance) {
        return filter.hires(input, cutoff, resonance);
    }
    double bandpass(double input, double cutoff, double resonance) {
        return filter.bandpass(input, cutoff, resonance);
    }
    double lopass(double input, double cutoff) {
        return filter.lopass(input, cutoff);
    }
    double hipass(double input, double cutoff) {
        return filter.hipass(input, cutoff);
    }
};

// Wrapper for maxiEnvelope (ADSR)
class MaxiEnvelopeWrapper {
private:
    maxiEnv env;

public:
    double adsr(double input, int trigger) {
        return env.adsr(input, trigger);
    }
    void setAttack(double ms) { env.setAttack(ms); }
    void setDecay(double ms) { env.setDecay(ms); }
    void setSustain(double level) { env.setSustain(level); }
    void setRelease(double ms) { env.setRelease(ms); }
    int getEnvState() { return env.trigger; }
};

// Wrapper for maxiDelayline
class MaxiDelayWrapper {
private:
    maxiDelayline delay;

public:
    double dl(double input, int size, double feedback) {
        return delay.dl(input, size, feedback);
    }
};

// Wrapper for maxiMix (panning)
class MaxiMixWrapper {
private:
    maxiMix mix;
    std::vector<double> outputs;

public:
    MaxiMixWrapper() : outputs(2) {}

    std::vector<double> stereo(double input, double pan) {
        mix.stereo(input, outputs, pan);
        return outputs;
    }
};

// Settings wrapper
class MaxiSettingsWrapper {
public:
    static void setup(int sampleRate, int channels, int bufferSize) {
        maxiSettings::setup(sampleRate, channels, bufferSize);
    }
    static int getSampleRate() {
        return maxiSettings::getSampleRate();
    }
};

std::string getVersion() {
    return "maximilian-wasm 1.0.0";
}

EMSCRIPTEN_BINDINGS(maximilian) {
    emscripten::function("getVersion", &getVersion);

    class_<MaxiSettingsWrapper>("maxiSettings")
        .class_function("setup", &MaxiSettingsWrapper::setup)
        .class_function("getSampleRate", &MaxiSettingsWrapper::getSampleRate);

    class_<MaxiOscWrapper>("maxiOsc")
        .constructor<>()
        .function("sinewave", &MaxiOscWrapper::sinewave)
        .function("coswave", &MaxiOscWrapper::coswave)
        .function("saw", &MaxiOscWrapper::saw)
        .function("triangle", &MaxiOscWrapper::triangle)
        .function("square", &MaxiOscWrapper::square)
        .function("pulse", &MaxiOscWrapper::pulse)
        .function("phasor", &MaxiOscWrapper::phasor)
        .function("noise", &MaxiOscWrapper::noise)
        .function("phaseReset", &MaxiOscWrapper::phaseReset);

    class_<MaxiFilterWrapper>("maxiFilter")
        .constructor<>()
        .function("lores", &MaxiFilterWrapper::lores)
        .function("hires", &MaxiFilterWrapper::hires)
        .function("bandpass", &MaxiFilterWrapper::bandpass)
        .function("lopass", &MaxiFilterWrapper::lopass)
        .function("hipass", &MaxiFilterWrapper::hipass);

    class_<MaxiEnvelopeWrapper>("maxiEnv")
        .constructor<>()
        .function("adsr", &MaxiEnvelopeWrapper::adsr)
        .function("setAttack", &MaxiEnvelopeWrapper::setAttack)
        .function("setDecay", &MaxiEnvelopeWrapper::setDecay)
        .function("setSustain", &MaxiEnvelopeWrapper::setSustain)
        .function("setRelease", &MaxiEnvelopeWrapper::setRelease)
        .function("getEnvState", &MaxiEnvelopeWrapper::getEnvState);

    class_<MaxiDelayWrapper>("maxiDelay")
        .constructor<>()
        .function("dl", &MaxiDelayWrapper::dl);

    class_<MaxiMixWrapper>("maxiMix")
        .constructor<>()
        .function("stereo", &MaxiMixWrapper::stereo);

    register_vector<double>("VectorDouble");
}
