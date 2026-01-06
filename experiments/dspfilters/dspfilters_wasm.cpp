/**
 * DSPFilters WASM Wrapper
 * Exposes common DSP filter operations to JavaScript
 */

#include <emscripten/bind.h>
#include <vector>
#include <string>

#include "DspFilters/Dsp.h"

using namespace emscripten;

// Wrapper class for a Butterworth low-pass filter
class ButterworthLowPass {
private:
    Dsp::SimpleFilter<Dsp::Butterworth::LowPass<8>, 1> filter;
    double sampleRate;
    double cutoffFreq;
    int order;

public:
    ButterworthLowPass(int filterOrder, double sr, double cutoff)
        : sampleRate(sr), cutoffFreq(cutoff), order(filterOrder) {
        filter.setup(filterOrder, sr, cutoff);
    }

    double processSample(double sample) {
        double* channels[1] = { &sample };
        filter.process(1, channels);
        return sample;
    }

    std::vector<double> processBlock(std::vector<double> input) {
        std::vector<double> output = input;
        double* channels[1] = { output.data() };
        filter.process(output.size(), channels);
        return output;
    }

    void reset() {
        filter.reset();
    }

    void setCutoff(double cutoff) {
        cutoffFreq = cutoff;
        filter.setup(order, sampleRate, cutoff);
    }
};

// Wrapper class for a Butterworth high-pass filter
class ButterworthHighPass {
private:
    Dsp::SimpleFilter<Dsp::Butterworth::HighPass<8>, 1> filter;
    double sampleRate;
    double cutoffFreq;
    int order;

public:
    ButterworthHighPass(int filterOrder, double sr, double cutoff)
        : sampleRate(sr), cutoffFreq(cutoff), order(filterOrder) {
        filter.setup(filterOrder, sr, cutoff);
    }

    double processSample(double sample) {
        double* channels[1] = { &sample };
        filter.process(1, channels);
        return sample;
    }

    std::vector<double> processBlock(std::vector<double> input) {
        std::vector<double> output = input;
        double* channels[1] = { output.data() };
        filter.process(output.size(), channels);
        return output;
    }

    void reset() {
        filter.reset();
    }

    void setCutoff(double cutoff) {
        cutoffFreq = cutoff;
        filter.setup(order, sampleRate, cutoff);
    }
};

// Wrapper class for a Butterworth band-pass filter
class ButterworthBandPass {
private:
    Dsp::SimpleFilter<Dsp::Butterworth::BandPass<8>, 1> filter;
    double sampleRate;
    double centerFreq;
    double bandwidth;
    int order;

public:
    ButterworthBandPass(int filterOrder, double sr, double center, double bw)
        : sampleRate(sr), centerFreq(center), bandwidth(bw), order(filterOrder) {
        filter.setup(filterOrder, sr, center, bw);
    }

    double processSample(double sample) {
        double* channels[1] = { &sample };
        filter.process(1, channels);
        return sample;
    }

    std::vector<double> processBlock(std::vector<double> input) {
        std::vector<double> output = input;
        double* channels[1] = { output.data() };
        filter.process(output.size(), channels);
        return output;
    }

    void reset() {
        filter.reset();
    }
};

// Wrapper class for Chebyshev Type I low-pass filter
class ChebyshevILowPass {
private:
    Dsp::SimpleFilter<Dsp::ChebyshevI::LowPass<8>, 1> filter;
    double sampleRate;
    double cutoffFreq;
    double rippleDb;
    int order;

public:
    ChebyshevILowPass(int filterOrder, double sr, double cutoff, double ripple)
        : sampleRate(sr), cutoffFreq(cutoff), rippleDb(ripple), order(filterOrder) {
        filter.setup(filterOrder, sr, cutoff, ripple);
    }

    double processSample(double sample) {
        double* channels[1] = { &sample };
        filter.process(1, channels);
        return sample;
    }

    std::vector<double> processBlock(std::vector<double> input) {
        std::vector<double> output = input;
        double* channels[1] = { output.data() };
        filter.process(output.size(), channels);
        return output;
    }

    void reset() {
        filter.reset();
    }
};

// Wrapper for RBJ biquad filters (more standard audio EQ coefficients)
class RBJLowPass {
private:
    Dsp::SimpleFilter<Dsp::RBJ::LowPass, 1> filter;

public:
    RBJLowPass(double sr, double cutoff, double q) {
        filter.setup(sr, cutoff, q);
    }

    double processSample(double sample) {
        double* channels[1] = { &sample };
        filter.process(1, channels);
        return sample;
    }

    std::vector<double> processBlock(std::vector<double> input) {
        std::vector<double> output = input;
        double* channels[1] = { output.data() };
        filter.process(output.size(), channels);
        return output;
    }

    void reset() {
        filter.reset();
    }
};

class RBJHighPass {
private:
    Dsp::SimpleFilter<Dsp::RBJ::HighPass, 1> filter;

public:
    RBJHighPass(double sr, double cutoff, double q) {
        filter.setup(sr, cutoff, q);
    }

    double processSample(double sample) {
        double* channels[1] = { &sample };
        filter.process(1, channels);
        return sample;
    }

    std::vector<double> processBlock(std::vector<double> input) {
        std::vector<double> output = input;
        double* channels[1] = { output.data() };
        filter.process(output.size(), channels);
        return output;
    }

    void reset() {
        filter.reset();
    }
};

class RBJBandPass {
private:
    Dsp::SimpleFilter<Dsp::RBJ::BandPass1, 1> filter;

public:
    RBJBandPass(double sr, double center, double bandwidth) {
        filter.setup(sr, center, bandwidth);
    }

    double processSample(double sample) {
        double* channels[1] = { &sample };
        filter.process(1, channels);
        return sample;
    }

    std::vector<double> processBlock(std::vector<double> input) {
        std::vector<double> output = input;
        double* channels[1] = { output.data() };
        filter.process(output.size(), channels);
        return output;
    }

    void reset() {
        filter.reset();
    }
};

std::string getVersion() {
    return "dspfilters-wasm 1.0.0";
}

EMSCRIPTEN_BINDINGS(dspfilters) {
    function("getVersion", &getVersion);

    class_<ButterworthLowPass>("ButterworthLowPass")
        .constructor<int, double, double>()
        .function("processSample", &ButterworthLowPass::processSample)
        .function("processBlock", &ButterworthLowPass::processBlock)
        .function("reset", &ButterworthLowPass::reset)
        .function("setCutoff", &ButterworthLowPass::setCutoff);

    class_<ButterworthHighPass>("ButterworthHighPass")
        .constructor<int, double, double>()
        .function("processSample", &ButterworthHighPass::processSample)
        .function("processBlock", &ButterworthHighPass::processBlock)
        .function("reset", &ButterworthHighPass::reset)
        .function("setCutoff", &ButterworthHighPass::setCutoff);

    class_<ButterworthBandPass>("ButterworthBandPass")
        .constructor<int, double, double, double>()
        .function("processSample", &ButterworthBandPass::processSample)
        .function("processBlock", &ButterworthBandPass::processBlock)
        .function("reset", &ButterworthBandPass::reset);

    class_<ChebyshevILowPass>("ChebyshevILowPass")
        .constructor<int, double, double, double>()
        .function("processSample", &ChebyshevILowPass::processSample)
        .function("processBlock", &ChebyshevILowPass::processBlock)
        .function("reset", &ChebyshevILowPass::reset);

    class_<RBJLowPass>("RBJLowPass")
        .constructor<double, double, double>()
        .function("processSample", &RBJLowPass::processSample)
        .function("processBlock", &RBJLowPass::processBlock)
        .function("reset", &RBJLowPass::reset);

    class_<RBJHighPass>("RBJHighPass")
        .constructor<double, double, double>()
        .function("processSample", &RBJHighPass::processSample)
        .function("processBlock", &RBJHighPass::processBlock)
        .function("reset", &RBJHighPass::reset);

    class_<RBJBandPass>("RBJBandPass")
        .constructor<double, double, double>()
        .function("processSample", &RBJBandPass::processSample)
        .function("processBlock", &RBJBandPass::processBlock)
        .function("reset", &RBJBandPass::reset);

    register_vector<double>("VectorDouble");
}
