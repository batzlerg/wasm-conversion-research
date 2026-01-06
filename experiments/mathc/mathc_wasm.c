/**
 * mathc WASM Wrapper
 * Exposes key vector/matrix operations to JavaScript
 */

#include <emscripten.h>
#include "repo/mathc.h"

// Version
EMSCRIPTEN_KEEPALIVE
const char* mathc_version() {
    return "mathc-wasm 1.0.0 (mathc 2019.02.16)";
}

// Memory allocation helpers
EMSCRIPTEN_KEEPALIVE
float* mathc_alloc_floats(int count) {
    return (float*)malloc(count * sizeof(float));
}

EMSCRIPTEN_KEEPALIVE
void mathc_free(void* ptr) {
    free(ptr);
}

// ============ Vec3 Operations ============

EMSCRIPTEN_KEEPALIVE
void mathc_vec3_add(float* result, float* v0, float* v1) {
    vec3_add(result, v0, v1);
}

EMSCRIPTEN_KEEPALIVE
void mathc_vec3_subtract(float* result, float* v0, float* v1) {
    vec3_subtract(result, v0, v1);
}

EMSCRIPTEN_KEEPALIVE
void mathc_vec3_multiply(float* result, float* v0, float* v1) {
    vec3_multiply(result, v0, v1);
}

EMSCRIPTEN_KEEPALIVE
void mathc_vec3_scale(float* result, float* v0, float scale) {
    vec3_multiply_f(result, v0, scale);
}

EMSCRIPTEN_KEEPALIVE
float mathc_vec3_dot(float* v0, float* v1) {
    return vec3_dot(v0, v1);
}

EMSCRIPTEN_KEEPALIVE
void mathc_vec3_cross(float* result, float* v0, float* v1) {
    vec3_cross(result, v0, v1);
}

EMSCRIPTEN_KEEPALIVE
float mathc_vec3_length(float* v0) {
    return vec3_length(v0);
}

EMSCRIPTEN_KEEPALIVE
void mathc_vec3_normalize(float* result, float* v0) {
    vec3_normalize(result, v0);
}

EMSCRIPTEN_KEEPALIVE
void mathc_vec3_lerp(float* result, float* v0, float* v1, float t) {
    vec3_lerp(result, v0, v1, t);
}

// ============ Mat4 Operations ============

EMSCRIPTEN_KEEPALIVE
void mathc_mat4_identity(float* result) {
    mat4_identity(result);
}

EMSCRIPTEN_KEEPALIVE
void mathc_mat4_multiply(float* result, float* m0, float* m1) {
    mat4_multiply(result, m0, m1);
}

EMSCRIPTEN_KEEPALIVE
void mathc_mat4_inverse(float* result, float* m0) {
    mat4_inverse(result, m0);
}

EMSCRIPTEN_KEEPALIVE
void mathc_mat4_transpose(float* result, float* m0) {
    mat4_transpose(result, m0);
}

EMSCRIPTEN_KEEPALIVE
void mathc_mat4_translate(float* result, float* m0, float* v0) {
    mat4_translation(result, m0, v0);
}

EMSCRIPTEN_KEEPALIVE
void mathc_mat4_scale(float* result, float* m0, float* v0) {
    mat4_scaling(result, m0, v0);
}

EMSCRIPTEN_KEEPALIVE
void mathc_mat4_rotate_x(float* result, float* m0, float angle) {
    mat4_rotation_x(result, angle);
    float temp[16];
    mat4_multiply(temp, m0, result);
    for (int i = 0; i < 16; i++) result[i] = temp[i];
}

EMSCRIPTEN_KEEPALIVE
void mathc_mat4_rotate_y(float* result, float* m0, float angle) {
    mat4_rotation_y(result, angle);
    float temp[16];
    mat4_multiply(temp, m0, result);
    for (int i = 0; i < 16; i++) result[i] = temp[i];
}

EMSCRIPTEN_KEEPALIVE
void mathc_mat4_rotate_z(float* result, float* m0, float angle) {
    mat4_rotation_z(result, angle);
    float temp[16];
    mat4_multiply(temp, m0, result);
    for (int i = 0; i < 16; i++) result[i] = temp[i];
}

EMSCRIPTEN_KEEPALIVE
void mathc_mat4_perspective(float* result, float fov, float aspect, float near, float far) {
    mat4_perspective(result, fov, aspect, near, far);
}

EMSCRIPTEN_KEEPALIVE
void mathc_mat4_ortho(float* result, float left, float right, float bottom, float top, float near, float far) {
    mat4_ortho(result, left, right, bottom, top, near, far);
}

EMSCRIPTEN_KEEPALIVE
void mathc_mat4_look_at(float* result, float* eye, float* center, float* up) {
    mat4_look_at(result, eye, center, up);
}

// ============ Quaternion Operations ============

EMSCRIPTEN_KEEPALIVE
void mathc_quat_identity(float* result) {
    // Identity quaternion: (0, 0, 0, 1)
    result[0] = 0.0f;
    result[1] = 0.0f;
    result[2] = 0.0f;
    result[3] = 1.0f;
}

EMSCRIPTEN_KEEPALIVE
void mathc_quat_multiply(float* result, float* q0, float* q1) {
    quat_multiply(result, q0, q1);
}

EMSCRIPTEN_KEEPALIVE
void mathc_quat_normalize(float* result, float* q0) {
    quat_normalize(result, q0);
}

EMSCRIPTEN_KEEPALIVE
void mathc_quat_from_axis_angle(float* result, float* axis, float angle) {
    quat_from_axis_angle(result, axis, angle);
}

EMSCRIPTEN_KEEPALIVE
void mathc_quat_slerp(float* result, float* q0, float* q1, float t) {
    quat_slerp(result, q0, q1, t);
}

EMSCRIPTEN_KEEPALIVE
void mathc_quat_to_mat4(float* result, float* q0) {
    mat4_rotation_quat(result, q0);
}

// ============ Utility ============

EMSCRIPTEN_KEEPALIVE
float mathc_to_radians(float degrees) {
    return to_radians(degrees);
}

EMSCRIPTEN_KEEPALIVE
float mathc_to_degrees(float radians) {
    return to_degrees(radians);
}

EMSCRIPTEN_KEEPALIVE
float mathc_lerp(float a, float b, float t) {
    return a + (b - a) * t;
}

EMSCRIPTEN_KEEPALIVE
float mathc_clamp(float value, float min, float max) {
    return clampf(value, min, max);
}
