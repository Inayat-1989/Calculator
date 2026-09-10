function mergeDigits(inputList) {
    let merged = [];
    let currentNumber = "";

    for (let i = 0; i < inputList.length; i++) {
        let token = inputList[i];

        if (/^\d+$/.test(token) || token === '.' || (currentNumber.toLowerCase().includes('e') && (token === '-' || token === '+'))) {
            currentNumber += token;
        } else {
            if (currentNumber !== "") {
                if (currentNumber.startsWith('.')) currentNumber = '0' + currentNumber;
                merged.push(currentNumber);
                currentNumber = "";
            }
            merged.push(token);
        }
    }

    if (currentNumber !== "") {
        if (currentNumber.startsWith('.')) currentNumber = '0' + currentNumber;
        merged.push(currentNumber);
    }

    return merged;
}

function cleanOperators(mergedList) {
    let cleaned = [];
    let i = 0;

    while (i < mergedList.length) {
        let token = mergedList[i];

        if (token === '+' || token === '-') {
            let signMultiplier = 1;

            while (i < mergedList.length && (mergedList[i] === '+' || mergedList[i] === '-')) {
                if (mergedList[i] === '-') signMultiplier *= -1;
                i++;
            }

            const netSign = signMultiplier === 1 ? '+' : '-';
            const prev = cleaned[cleaned.length - 1];
            const isBinaryContext = cleaned.length > 0 && (!isNaN(prev) || prev === ')' || prev === '%');

            if (isBinaryContext) {
                if (netSign === '+') {
                    cleaned.push('+');
                } else {
                    cleaned.push('+');
                    cleaned.push('-1');
                    cleaned.push('*');
                }
            } else {
                if (netSign === '-') {
                    cleaned.push('-1');
                    cleaned.push('*');
                }
            }
        } else {
            cleaned.push(token);
            i++;
        }
    }

    return cleaned;
}

function infixToPostfix(inputList) {
    let mergedInputList = mergeDigits(inputList);
    mergedInputList = cleanOperators(mergedInputList);

    const precedence = { 
        '+': 1,
        '*': 2, '/': 2,
        '**': 3, 
        'sin': 4, 'cos': 4, 'tan': 4, 'sqrt': 4 
    };

    const associativity = { 
        '+': 'Left',
        '*': 'Left', '/': 'Left',
        '**': 'Right', 
        'sin': 'Right', 'cos': 'Right', 'tan': 'Right', 'sqrt': 'Right' 
    };

    let postFixStack = [];
    let operatorStack = [];

    for (let token of mergedInputList) {
        if (!isNaN(token) || token === "%") {
            postFixStack.push(token);
        } 
        else if (precedence[token] !== undefined) {
            while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                let top = operatorStack[operatorStack.length - 1];
                let comingOperator = precedence[token];
                let inStackOperator = precedence[top];
                
                if ((associativity[token] === 'Left' && comingOperator <= inStackOperator) || 
                    (associativity[token] === 'Right' && comingOperator < inStackOperator)) {
                    postFixStack.push(operatorStack.pop());
                } else {
                    break;
                }
            }
            operatorStack.push(token);
        } 
        else if (token === '(') {
            operatorStack.push(token);
        } 
        else if (token === ')') {
            while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                postFixStack.push(operatorStack.pop());
            }

            if (operatorStack.length === 0) {
                throw new Error("Mismatched parentheses: Unexpected ')'");
            }

            operatorStack.pop();
        } else {
            throw new Error(`Invalid token: '${token}'`);
        }
    }
    
    while (operatorStack.length > 0) {
        let operator = operatorStack.pop();
        if (operator === '(') {
            throw new Error("Mismatched parentheses: Unclosed '('");
        }
        postFixStack.push(operator);
    }

    return postFixStack;
}

export function evaluate(inputList) {
    if (inputList.length === 0) {
        return 0;
    }
    const postFixStack = infixToPostfix(inputList);
    let evaluationStack = [];
    
    for (let token of postFixStack) {
        if (!isNaN(token)) {
            evaluationStack.push(cleanValue(Number(token)));
        } 
        else if (['sin', 'cos', 'tan', 'sqrt', "%"].includes(token)) {
            let arg = evaluationStack.pop();
            let valueToPush = 0;
            if (token === 'sin') valueToPush = Math.sin(arg * (Math.PI / 180));
            if (token === 'cos') valueToPush = Math.cos(arg * (Math.PI / 180));
            if (token === 'tan') valueToPush = Math.tan(arg * (Math.PI / 180));
            if (token === 'sqrt') {
                if (arg < 0) throw new Error("Cannot take square root of a negative number");
                valueToPush = Math.sqrt(arg);
            }
            if (token === '%') valueToPush = arg / 100;

            evaluationStack.push(cleanValue(valueToPush));
        } 
        else {
            let secondValue = evaluationStack.pop();
            let firstValue = evaluationStack.pop();
            let valueToPush = 0;

            if (token === '+') valueToPush = firstValue + secondValue;
            else if (token === '*') valueToPush = firstValue * secondValue;
            else if (token === '/') {
                if (secondValue === 0) throw new Error("Division by zero");
                valueToPush = firstValue / secondValue;
            }
            else if (token === '**') valueToPush = firstValue ** secondValue;
            
            evaluationStack.push(cleanValue(valueToPush));
        }
    }

    if (evaluationStack.length !== 1) {
        throw new Error("Invalid expression structure");
    }

    if (isNaN(evaluationStack[0])) {
        throw new Error("Invalid expression");
    }

    return cleanValue(evaluationStack.pop());
}

export function cleanValue(value) {
    if (typeof value !== 'number' || isNaN(value)) return value;

    if (Math.abs(value) < 1e-6 || Math.abs(value) > 1e12) {
        return value;
    }
    
    return Math.round(value * 1e12) / 1e12;
}