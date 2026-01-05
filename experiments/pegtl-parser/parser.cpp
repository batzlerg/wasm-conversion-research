/**
 * Minimal PEGTL Parser for WASM Compilation Test
 *
 * This example parses simple arithmetic expressions like "1 + 2 * 3"
 * and demonstrates PEGTL working in a WebAssembly context.
 */

#include <emscripten/bind.h>
#include <tao/pegtl.hpp>
#include <string>
#include <vector>
#include <sstream>

namespace pegtl = tao::pegtl;

// ============================================
// Grammar Definition
// ============================================

namespace grammar {

// Whitespace
struct ws : pegtl::star<pegtl::space> {};

// Number: one or more digits
struct number : pegtl::plus<pegtl::digit> {};

// Operators
struct plus_op : pegtl::one<'+'> {};
struct minus_op : pegtl::one<'-'> {};
struct mult_op : pegtl::one<'*'> {};
struct div_op : pegtl::one<'/'> {};

// Factor: number or parenthesized expression
struct expression;
struct factor : pegtl::sor<
    number,
    pegtl::seq<pegtl::one<'('>, ws, expression, ws, pegtl::one<')'>>
> {};

// Term: factor followed by (* or /) factor
struct term : pegtl::seq<
    factor,
    pegtl::star<pegtl::seq<ws, pegtl::sor<mult_op, div_op>, ws, factor>>
> {};

// Expression: term followed by (+ or -) term
struct expression : pegtl::seq<
    term,
    pegtl::star<pegtl::seq<ws, pegtl::sor<plus_op, minus_op>, ws, term>>
> {};

// Full input: expression with optional surrounding whitespace
struct input : pegtl::must<ws, expression, ws, pegtl::eof> {};

} // namespace grammar

// ============================================
// Parse Actions (for extracting tokens)
// ============================================

struct parse_result {
    bool success;
    std::string error;
    std::vector<std::string> tokens;
};

template<typename Rule>
struct action : pegtl::nothing<Rule> {};

template<>
struct action<grammar::number> {
    template<typename ActionInput>
    static void apply(const ActionInput& in, parse_result& result) {
        result.tokens.push_back("NUM:" + std::string(in.string()));
    }
};

template<>
struct action<grammar::plus_op> {
    template<typename ActionInput>
    static void apply(const ActionInput&, parse_result& result) {
        result.tokens.push_back("OP:+");
    }
};

template<>
struct action<grammar::minus_op> {
    template<typename ActionInput>
    static void apply(const ActionInput&, parse_result& result) {
        result.tokens.push_back("OP:-");
    }
};

template<>
struct action<grammar::mult_op> {
    template<typename ActionInput>
    static void apply(const ActionInput&, parse_result& result) {
        result.tokens.push_back("OP:*");
    }
};

template<>
struct action<grammar::div_op> {
    template<typename ActionInput>
    static void apply(const ActionInput&, parse_result& result) {
        result.tokens.push_back("OP:/");
    }
};

// ============================================
// Main Parse Function
// ============================================

std::string parse_expression(const std::string& input_str) {
    parse_result result;
    result.success = false;

    try {
        pegtl::memory_input<> in(input_str, "input");
        result.success = pegtl::parse<grammar::input, action>(in, result);
    } catch (const pegtl::parse_error& e) {
        result.error = e.what();
        result.success = false;
    }

    // Build output string
    std::ostringstream oss;
    if (result.success) {
        oss << "SUCCESS\n";
        oss << "Tokens: ";
        for (size_t i = 0; i < result.tokens.size(); ++i) {
            if (i > 0) oss << ", ";
            oss << result.tokens[i];
        }
    } else {
        oss << "ERROR: " << result.error;
    }

    return oss.str();
}

// Simpler version that just validates
bool validate_expression(const std::string& input_str) {
    try {
        pegtl::memory_input<> in(input_str, "input");
        parse_result result;
        return pegtl::parse<grammar::input, action>(in, result);
    } catch (...) {
        return false;
    }
}

// Get library version info
std::string get_version() {
    return "PEGTL Parser v1.0 (WASM)";
}

// ============================================
// Emscripten Bindings
// ============================================

EMSCRIPTEN_BINDINGS(pegtl_parser) {
    emscripten::function("parseExpression", &parse_expression);
    emscripten::function("validateExpression", &validate_expression);
    emscripten::function("getVersion", &get_version);
}
