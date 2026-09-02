import { inputField, lastAnswerElement, inputList, history, CE, replaceAnsInputList, setFieldIndex } from './script.js';
import { evaluate } from './customEval.js';
import { valueFormatter } from './helper.js';

export function evaluateExpression() {
    // Getting the expression from the inputList Array because the inputField is just for the showoff inside the input field of calculator.
    // let expression = inputList.join('');

    // console.log("Before:\nEvaluating Expression: ", expression, "Input List: ", inputList);

    // Cleaning the expression so that it can be evaluated properly.
    // expression = expressionReplacement(expression);

    try {
        // Result is Stored.
        let inputExpression = inputField.value;
        replaceAnsInputList();
        let result = evaluate(inputList);

        if (!isFinite(result)) {
            throw new Error("Mathematical result is undefined or infinity");
        }

        // Deleting the inputList array and pushing the lastAnswer or result as first value of the next expression.
        CE();

        result = valueFormatter(result);

        // No usage of history in any form yet.
        // the Show off expression is stored with result as value, it is so that we can actully call back the whole expression from history.
        history.set(inputExpression, result);

        // Updating the inputField as the result.
        inputField.value = result;
        setFieldIndex(1);

        // Directly changing the value of the lastAnswerElement to the result so that it can be called as a simple value rather than being a different kind of call.
        lastAnswerElement.value = result;
    } catch (error) {
        inputField.value = "Error: " + error.message;
        console.error("Calculator Error:", error.message);
    }
}

// function expressionReplacement(expression) {
//     // Replacing the expression with the proper Math functions and operators so that it can be evaluated properly. Also, removing any leading zeros from the expression to avoid errors in evaluation.
//     expression = `Number((${expression
//         // Removing leading zeros so it does not calculate octal.
//         .replace(/\b0+(?=\d)/g, '')

//         // Replacing the functions with the proper Math functions and converting degrees to radians for trigonometric functions.
//         .replace(/sin\((.*?)\)/g, 'Math.sin(($1) * Math.PI / 180)')
//         .replace(/cos\((.*?)\)/g, 'Math.cos(($1) * Math.PI / 180)')
//         .replace(/tan\((.*?)\)/g, 'Math.tan(($1) * Math.PI / 180)')
//         .replace(/sqrt\((.*?)\)/g, 'Math.sqrt($1)')

//         // Replacing the operators with the proper JavaScript operators for evaluation.
//         .replace(/×/g, '*')
//         .replace(/÷/g, '/')

//         // Removing any characters that are not allowed in the expression to avoid errors in evaluation.
//         .replace(/[^0-9+\-*%/\s.()Math\.sincostansqrtPIe]/g, '')

//         // Fixing the decimal places to 2 for better readability and to avoid floating point precision issues.
//     }).toFixed(2))`;

//     return expression
// }