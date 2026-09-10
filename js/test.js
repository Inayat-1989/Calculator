import assert from 'node:assert';
import { evaluate } from './customEval.js';

function runExtremeTestSuite() {
    console.log("🚀 Starting Ultimate Production-Level Stress Tests...\n");
    let passed = 0;
    let failed = 0;

    function test(description, fn) {
        try {
            fn();
            console.log(`  ✅ PASS: ${description}`);
            passed++;
        } catch (error) {
            console.error(`  ❌ FAIL: ${description}`);
            console.error(`     Error Message: ${error.message}\n`);
            failed++;
        }
    }

    // =========================================================================
    // 1. SIGN COLLAPSING & UNARY OPERATOR EXTREMES
    // =========================================================================
    console.log("--- 1. Extreme Sign Normalization ---");
    test('Alternating chain of + and - (3 + - + - 2 = 5)', () => {
        assert.strictEqual(evaluate(["3", "+", "-", "+", "-", "2"]), 5);
    });

    test('Unary minus at start of array (-45 * 2 = -90)', () => {
        assert.strictEqual(evaluate(["-", "4", "5", "*", "2"]), -90);
    });

    test('Unary minus immediately after open parenthesis sin(-90) = -1', () => {
        assert.strictEqual(evaluate(["sin", "(", "-", "9", "0", ")"]), -1);
    });

    test('Quadruple negative operator (-- - - 5 = 5)', () => {
        assert.strictEqual(evaluate(["-", "-", "-", "-", "5"]), 5);
    });

    test('Five consecutive minus signs (- - - - - 5 = -5)', () => {
        assert.strictEqual(evaluate(["-", "-", "-", "-", "-", "5"]), -5);
    });

    test('Sign preceding scientific function (-sqrt(16) = -4)', () => {
        assert.strictEqual(evaluate(["-", "sqrt", "(", "1", "6", ")"]), -4);
    });

    test('Unary minus after multiplication (5 * - 3 = -15)', () => {
        assert.strictEqual(evaluate(["5", "*", "-", "3"]), -15);
    });


    // =========================================================================
    // 2. IMPLICIT MULTIPLICATION & PARENTHESIS BRIDGING
    // =========================================================================
    console.log("\n--- 2. Implicit Multiplication Edge Cases ---");
    test('Number adjacent to parenthesis (2(3+4) = 14)', () => {
        assert.strictEqual(evaluate(["2", "*", "(", "3", "+", "4", ")"]), 14);
    });

    test('Adjacent parenthesis groups ((2+3) * (4+1) = 25)', () => {
        assert.strictEqual(evaluate(["(", "2", "+", "3", ")", "*", "(", "4", "+", "1", ")"]), 25);
    });

    test('Implicit multiplication with scientific function (2 * sqrt(16) = 8)', () => {
        assert.strictEqual(evaluate(["2", "*", "sqrt", "(", "1", "6", ")"]), 8);
    });

    test('Function result adjacent to parenthesis (sin(90) * (5+5) = 10)', () => {
        assert.strictEqual(evaluate(["sin", "(", "9", "0", ")", "*", "(", "5", "+", "5", ")"]), 10);
    });


    // =========================================================================
    // 3. DECIMALS, ZEROES & FLOATING POINT EDGE CASES
    // =========================================================================
    console.log("\n--- 3. Decimals & Precision Extremes ---");
    test('IEEE 754 precision bug fix (0.1 + 0.2 = 0.3)', () => {
        assert.strictEqual(evaluate(["0", ".", "1", "+", "0", ".", "2"]), 0.3);
    });

    test('IEEE 754 precision subtraction (0.3 - 0.1 = 0.2)', () => {
        assert.strictEqual(evaluate(["0", ".", "3", "-", "0", ".", "1"]), 0.2);
    });

    test('Leading decimal point without leading zero (.005 * 100 = 0.5)', () => {
        assert.strictEqual(evaluate([".", "0", "0", "5", "*", "1", "0", "0"]), 0.5);
    });

    test('Multiple trailing zeroes (1.5000 + 2.500 = 4)', () => {
        assert.strictEqual(evaluate(["1", ".", "5", "0", "0", "0", "+", "2", ".", "5", "0", "0"]), 4);
    });

    test('Very small float multiplication (0.0001 * 0.0001 = 0.00000001)', () => {
        assert.strictEqual(evaluate(["0", ".", "0", "0", "0", "1", "*", "0", ".", "0", "0", "0", "1"]), 0.00000001);
    });


    // =========================================================================
    // 4. OPERATOR PRECEDENCE & ASSOCIATIVITY STRESS
    // =========================================================================
    console.log("\n--- 4. Precedence & Associativity Extremes ---");
    test('Multiplication precedence over implicit addition (3 - 2 * 4 = -5)', () => {
        assert.strictEqual(evaluate(["3", "-", "2", "*", "4"]), -5);
    });

    test('Right-associativity for Power operator (2 ** 3 ** 2 = 512)', () => {
        assert.strictEqual(evaluate(["2", "**", "3", "**", "2"]), 512);
    });

    test('Explicit left-associativity with parentheses ((2 ** 3) ** 2 = 64)', () => {
        assert.strictEqual(evaluate(["(", "2", "**", "3", ")", "**", "2"]), 64);
    });

    test('Mixed Division and Multiplication left-associativity (100 / 5 * 2 = 40)', () => {
        assert.strictEqual(evaluate(["1", "0", "0", "/", "5", "*", "2"]), 40);
    });

    test('Power operator with negative base ((-2) ** 3 = -8)', () => {
        assert.strictEqual(evaluate(["(", "-", "2", ")", "**", "3"]), -8);
    });

    test('Power operator combined with multiplication (2 * 3 ** 2 = 18)', () => {
        assert.strictEqual(evaluate(["2", "*", "3", "**", "2"]), 18);
    });


    // =========================================================================
    // 5. PARENTHESES & NESTING EXTREMES
    // =========================================================================
    console.log("\n--- 5. Deeply Nested Parentheses ---");
    test('Redundant nested parentheses (((10))) = 10', () => {
        assert.strictEqual(evaluate(["(", "(", "(", "1", "0", ")", ")", ")"]), 10);
    });

    test('Complex nested precedence (((2 + 3) * 4) - 5) = 15', () => {
        assert.strictEqual(evaluate(["(", "(", "(", "2", "+", "3", ")", "*", "4", ")", "-", "5", ")"]), 15);
    });

    test('Adjacent parentheses groups (2 + 3) * (4 + 1) = 25', () => {
        assert.strictEqual(evaluate(["(", "2", "+", "3", ")", "*", "(", "4", "+", "1", ")"]), 25);
    });

    test('Negative sign outside parentheses -((2 + 3) * 2) = -10', () => {
        assert.strictEqual(evaluate(["-", "(", "(", "2", "+", "3", ")", "*", "2", ")"]), -10);
    });


    // =========================================================================
    // 6. TRIGONOMETRY & SCIENTIFIC FUNCTIONS
    // =========================================================================
    console.log("\n--- 6. Scientific Functions & Trigonometry ---");
    test('sin(0) = 0', () => {
        assert.strictEqual(evaluate(["sin", "(", "0", ")"]), 0);
    });

    test('cos(0) = 1', () => {
        assert.strictEqual(evaluate(["cos", "(", "0", ")"]), 1);
    });

    test('tan(45) = 1', () => {
        assert.strictEqual(evaluate(["tan", "(", "4", "5", ")"]), 1);
    });

    test('Nested function sqrt(sin(90) * 16) = 4', () => {
        assert.strictEqual(evaluate(["sqrt", "(", "sin", "(", "9", "0", ")", "*", "1", "6", ")"]), 4);
    });

    test('Trigonometry inside mathematical expression (10 + sin(90) * 5 = 15)', () => {
        assert.strictEqual(evaluate(["1", "0", "+", "sin", "(", "9", "0", ")", "*", "5"]), 15);
    });

    test('Pythagorean trigonometric identity (sin(30)**2 + cos(30)**2 = 1)', () => {
        assert.strictEqual(evaluate(["sin", "(", "3", "0", ")", "**", "2", "+", "cos", "(", "3", "0", ")", "**", "2"]), 1);
    });


    // =========================================================================
    // 7. PERCENTAGE OPERATOR SPECIAL CASES
    // =========================================================================
    console.log("\n--- 7. Percentage Operations ---");
    test('Simple percentage conversion (50% = 0.5)', () => {
        assert.strictEqual(evaluate(["5", "0", "%"]), 0.5);
    });

    test('Percentage inside expression (100 * 20% = 20)', () => {
        assert.strictEqual(evaluate(["1", "0", "0", "*", "2", "0", "%"]), 20);
    });

    test('Chained percentage (200% % = 0.02)', () => {
        assert.strictEqual(evaluate(["2", "0", "0", "%", "%"]), 0.02);
    });

    test('Percentage addition (100 + 50% = 100.5)', () => {
        assert.strictEqual(evaluate(["1", "0", "0", "+", "5", "0", "%"]), 100.5);
    });


    // =========================================================================
    // 8. LARGE NUMBERS & BOUNDARY STRESS
    // =========================================================================
    console.log("\n--- 8. Boundary & Large Number Extremes ---");
    test('Large Number Multiplication (999999 * 999999)', () => {
        assert.strictEqual(evaluate(["9", "9", "9", "9", "9", "9", "*", "9", "9", "9", "9", "9", "9"]), 999998000001);
    });

    test('Single zero input (0 = 0)', () => {
        assert.strictEqual(evaluate(["0"]), 0);
    });

    test('Addition with Zero (0 + 0 = 0)', () => {
        assert.strictEqual(evaluate(["0", "+", "0"]), 0);
    });

    test('Empty array input returning default ( [] = 0 )', () => {
        assert.strictEqual(evaluate([]), 0);
    });


    // =========================================================================
    // 9. ERROR HANDLING & DEFENSIVE THROW CHECKS
    // =========================================================================
    console.log("\n--- 9. Error Handling & Exception Guardrails ---");
    test('Error check: Division by Zero', () => {
        assert.throws(() => evaluate(["5", "/", "0"]), /Division by zero/);
    });

    test('Error check: Square Root of Negative Number', () => {
        assert.throws(() => evaluate(["sqrt", "(", "-", "9", ")"]), /Cannot take square root of a negative number/);
    });

    test('Error check: Unclosed opening parenthesis', () => {
        assert.throws(() => evaluate(["(", "2", "+", "3"]), /Mismatched parentheses/);
    });

    test('Error check: Unexpected closing parenthesis', () => {
        assert.throws(() => evaluate(["2", "+", "3", ")"]), /Mismatched parentheses/);
    });

    test('Error check: Consecutive standard binary operators (2 + * 3)', () => {
        assert.throws(() => evaluate(["2", "+", "*", "3"]), /Invalid expression/);
    });

    test('Error check: Trailing operator (5 +)', () => {
        assert.throws(() => evaluate(["5", "+"]), /Invalid expression/);
    });

    test('Error check: Invalid unknown token string', () => {
        assert.throws(() => evaluate(["invalidToken", "5"]), /Invalid token/);
    });


    // =========================================================================
    // SUMMARY REPORT
    // =========================================================================
    console.log("\n=================================================");
    console.log(`📊 FINAL RESULT: ${passed} Passed | ${failed} Failed`);
    console.log("=================================================");
    
    if (failed > 0) {
        process.exit(1);
    }
}

runExtremeTestSuite();