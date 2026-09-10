import { inputField, lastAnswerElement, inputList, history, CE, replaceAnsInputList, setFieldIndex, addValue } from './script.js';
import { evaluate, cleanValue } from './customEval.js';
import { valueFormatter } from './helper.js';

export function evaluateExpression() {
    try {
        if (inputList.length === 0){
            CE();
            return;
        }

        replaceAnsInputList();
        let result = cleanValue(evaluate(inputList));

        if (!isFinite(result)) {
            throw new Error("Mathematical result is undefined or infinity");
        }

        let inputExpression = inputField.value;        
        CE();

        
        result = "" + valueFormatter(result);

        lastAnswerElement.value = result;
        history.set(inputExpression, result);
        return result;
    } catch (error) {
        CE();
        return "Error: " + error.message;
    }
}