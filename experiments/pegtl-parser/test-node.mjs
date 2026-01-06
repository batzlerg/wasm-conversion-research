/**
 * Test PEGTL WASM module in Node.js
 * This bypasses browser complexity to test the WASM directly
 */

import createModule from './parser.js';

async function test() {
    console.log('Loading WASM module...');
    const module = await createModule();

    console.log('\n=== Testing Valid Expressions ===\n');

    const validExpressions = [
        '1 + 2',
        '3 * 4 + 5',
        '(1 + 2) * 3',
        '((1 + 2) * (3 + 4))',
    ];

    for (const expr of validExpressions) {
        console.log(`Input: "${expr}"`);
        try {
            const result = module.parseExpression(expr);
            console.log(`Result: ${result}`);
        } catch (e) {
            console.log(`Error: ${e}`);
            console.log(`Error type: ${typeof e}`);
        }
        console.log('');
    }

    console.log('\n=== Testing Invalid Expressions ===\n');

    const invalidExpressions = [
        'invalid!',
        '((1 + 2) * (3 + 4)) * 76^45 % 2',  // From screenshot - uses ^ and %
        '1 +',
        '+ 1',
        '1 ++ 2',
        'abc',
        '',
    ];

    for (const expr of invalidExpressions) {
        console.log(`Input: "${expr}"`);
        try {
            const result = module.parseExpression(expr);
            console.log(`Result: ${result}`);
        } catch (e) {
            console.log(`CAUGHT Exception: ${e}`);
            console.log(`Exception type: ${typeof e}`);
            if (typeof e === 'number') {
                console.log(`  -> This is a raw C++ exception pointer!`);
            }
        }
        console.log('');
    }

    console.log('\n=== Testing validateExpression ===\n');

    for (const expr of [...validExpressions, ...invalidExpressions]) {
        console.log(`Input: "${expr}"`);
        try {
            const valid = module.validateExpression(expr);
            console.log(`Valid: ${valid}`);
        } catch (e) {
            console.log(`CAUGHT Exception: ${e}`);
            console.log(`Exception type: ${typeof e}`);
        }
        console.log('');
    }
}

test().catch(e => {
    console.error('Fatal error:', e);
    process.exit(1);
});
