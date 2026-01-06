/**
 * jq WASM Wrapper
 * JSON processing with jq filters
 */

#include <emscripten.h>
#include <stdlib.h>
#include <string.h>

#include "repo/src/jv.h"
#include "repo/src/jq.h"

static jq_state *jq = NULL;
static char *result_buffer = NULL;
static size_t result_buffer_size = 0;

/**
 * Initialize jq
 */
EMSCRIPTEN_KEEPALIVE
int jq_wasm_init(void) {
    if (jq != NULL) {
        jq_teardown(&jq);
    }
    jq = jq_init();
    return jq != NULL ? 0 : -1;
}

/**
 * Compile a jq filter
 * @param filter The jq filter string (e.g., ".foo", ".[].name")
 * @return 0 on success, -1 on error
 */
EMSCRIPTEN_KEEPALIVE
int jq_wasm_compile(const char *filter) {
    if (jq == NULL) {
        jq_wasm_init();
    }
    return jq_compile(jq, filter) ? 0 : -1;
}

/**
 * Run compiled filter on JSON input
 * @param json_input JSON string to process
 * @return JSON result string (caller must not free)
 */
EMSCRIPTEN_KEEPALIVE
const char* jq_wasm_run(const char *json_input) {
    if (jq == NULL) return NULL;

    // Parse input JSON
    jv input = jv_parse(json_input);
    if (!jv_is_valid(input)) {
        jv_free(input);
        return "{\"error\": \"Invalid JSON input\"}";
    }

    // Collect all outputs into an array
    jv outputs = jv_array();

    jq_start(jq, input, 0);
    jv result;
    while (jv_is_valid(result = jq_next(jq))) {
        outputs = jv_array_append(outputs, result);
    }
    jv_free(result);

    // Convert to string
    int output_count = jv_array_length(jv_copy(outputs));
    jv output_str;

    if (output_count == 0) {
        jv_free(outputs);
        return "null";
    } else if (output_count == 1) {
        // Single result - return as-is
        output_str = jv_dump_string(jv_array_get(outputs, 0), 0);
    } else {
        // Multiple results - return as array
        output_str = jv_dump_string(outputs, 0);
    }

    // Copy to persistent buffer
    const char *str = jv_string_value(output_str);
    size_t len = strlen(str) + 1;

    if (result_buffer_size < len) {
        result_buffer = realloc(result_buffer, len);
        result_buffer_size = len;
    }
    strcpy(result_buffer, str);

    jv_free(output_str);

    return result_buffer;
}

/**
 * One-shot: compile and run in one call
 */
EMSCRIPTEN_KEEPALIVE
const char* jq_wasm_filter(const char *filter, const char *json_input) {
    if (jq_wasm_compile(filter) != 0) {
        return "{\"error\": \"Failed to compile filter\"}";
    }
    return jq_wasm_run(json_input);
}

/**
 * Cleanup
 */
EMSCRIPTEN_KEEPALIVE
void jq_wasm_cleanup(void) {
    if (jq != NULL) {
        jq_teardown(&jq);
        jq = NULL;
    }
    if (result_buffer != NULL) {
        free(result_buffer);
        result_buffer = NULL;
        result_buffer_size = 0;
    }
}

/**
 * Get version
 */
EMSCRIPTEN_KEEPALIVE
const char* jq_wasm_version(void) {
    return "jq-wasm 1.0.0";
}
