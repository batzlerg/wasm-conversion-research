/**
 * simdjson WASM Wrapper
 * Fast JSON parsing
 */

// Force fallback implementation for WASM (no native SIMD)
#define SIMDJSON_IMPLEMENTATION_FALLBACK 1
#define SIMDJSON_IMPLEMENTATION_ARM64 0
#define SIMDJSON_IMPLEMENTATION_HASWELL 0
#define SIMDJSON_IMPLEMENTATION_ICELAKE 0
#define SIMDJSON_IMPLEMENTATION_WESTMERE 0
#define SIMDJSON_IMPLEMENTATION_PPC64 0
#define SIMDJSON_IMPLEMENTATION_LSX 0
#define SIMDJSON_IMPLEMENTATION_LASX 0

#include "repo/singleheader/simdjson.h"

#include <emscripten/bind.h>
#include <string>
#include <vector>

using namespace emscripten;
using namespace simdjson;

// Global parser for reuse
static ondemand::parser g_parser;

/**
 * Simple JSON validation
 */
bool validate_json(const std::string& json) {
    simdjson::padded_string padded(json);
    ondemand::document doc;
    auto error = g_parser.iterate(padded).get(doc);
    return error == SUCCESS;
}

/**
 * Parse JSON and return string representation
 * (For benchmarking - actual usage would extract specific values)
 */
std::string parse_json(const std::string& json) {
    simdjson::padded_string padded(json);
    ondemand::document doc;
    auto error = g_parser.iterate(padded).get(doc);
    if (error) {
        return std::string("error: ") + error_message(error);
    }
    // Just validate by consuming the document
    return "ok";
}

/**
 * Get string value at path (simple path like "key" or "key.nested")
 */
std::string get_string(const std::string& json, const std::string& key) {
    simdjson::padded_string padded(json);
    ondemand::document doc;
    auto error = g_parser.iterate(padded).get(doc);
    if (error) {
        return "";
    }

    std::string_view value;
    error = doc[key].get_string().get(value);
    if (error) {
        return "";
    }
    return std::string(value);
}

/**
 * Get int64 value at key
 */
int64_t get_int64(const std::string& json, const std::string& key) {
    simdjson::padded_string padded(json);
    ondemand::document doc;
    auto error = g_parser.iterate(padded).get(doc);
    if (error) {
        return 0;
    }

    int64_t value;
    error = doc[key].get_int64().get(value);
    if (error) {
        return 0;
    }
    return value;
}

/**
 * Get double value at key
 */
double get_double(const std::string& json, const std::string& key) {
    simdjson::padded_string padded(json);
    ondemand::document doc;
    auto error = g_parser.iterate(padded).get(doc);
    if (error) {
        return 0.0;
    }

    double value;
    error = doc[key].get_double().get(value);
    if (error) {
        return 0.0;
    }
    return value;
}

/**
 * Get bool value at key
 */
bool get_bool(const std::string& json, const std::string& key) {
    simdjson::padded_string padded(json);
    ondemand::document doc;
    auto error = g_parser.iterate(padded).get(doc);
    if (error) {
        return false;
    }

    bool value;
    error = doc[key].get_bool().get(value);
    if (error) {
        return false;
    }
    return value;
}

/**
 * Count array elements
 */
size_t count_array(const std::string& json, const std::string& key) {
    simdjson::padded_string padded(json);
    ondemand::document doc;
    auto error = g_parser.iterate(padded).get(doc);
    if (error) {
        return 0;
    }

    ondemand::array arr;
    if (key.empty()) {
        error = doc.get_array().get(arr);
    } else {
        error = doc[key].get_array().get(arr);
    }
    if (error) {
        return 0;
    }

    size_t count = 0;
    for (auto element : arr) {
        (void)element; // suppress unused warning
        count++;
    }
    return count;
}

/**
 * Get version
 */
std::string get_version() {
    return "simdjson-wasm 1.0.0 (simdjson " SIMDJSON_VERSION ")";
}

EMSCRIPTEN_BINDINGS(simdjson) {
    function("getVersion", &get_version);
    function("validateJson", &validate_json);
    function("parseJson", &parse_json);
    function("getString", &get_string);
    function("getInt64", &get_int64);
    function("getDouble", &get_double);
    function("getBool", &get_bool);
    function("countArray", &count_array);
}
