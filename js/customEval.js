function mergeDigits(inputList) {
    let merged = [];
    let currentNumber = "";

    for (let token of inputList) {
        // Check if token is a single digit or a decimal point
        if (/^\d$/.test(token) || token === '.') {
            currentNumber += token; // Build the multi-digit number
        } else {
            if (currentNumber !== "") {
                merged.push(currentNumber);
                currentNumber = "";
            }
            merged.push(token);
        }
    }
    // Push any remaining number at the end of the list
    if (currentNumber !== "") {
        merged.push(currentNumber);
    }

    return merged;
}

function infixToPostfix(inputList) {
    const mergedInputList = mergeDigits(inputList);

    const precedence = { 
        '+': 1, '-': 1, 
        '*': 2, '/': 2,
        '**': 3, 
        'sin': 4, 'cos': 4, 'tan': 4, 'sqrt': 4 
    };

    const associativity = { 
        '+': 'Left', '-': 'Left', 
        '*': 'Left', '/': 'Left',
        '**': 'Right', 
        'sin': 'Right', 'cos': 'Right', 'tan': 'Right', 'sqrt': 'Right' 
    };

    let postFixStack = [];
    let operatorStack = [];

    for (let token of mergedInputList) {
        // If it's a number (can include decimals)
        if (!isNaN(token) || token === "%") {
            postFixStack.push(token);
        } 
        // If it's an operator or math function
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
        // If opening parenthesis
        else if (token === '(') {
            operatorStack.push(token);
        } 
        // If closing parenthesis
        else if (token === ')') {
            while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                postFixStack.push(operatorStack.pop());
            }

            if (operatorStack.length === 0) {
                throw new Error("Mismatched parentheses: Unexpected ')'");
            }

            operatorStack.pop(); // Discard the '('
        } else {
            throw new Error(`Invalid token: '${token}'`);
        }
    }
    
    // Pop remaining operators from evaluationStack to postFixStack
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
    const postFixStack = infixToPostfix(inputList);
    let evaluationStack = [];
    
    for (let token of postFixStack) {
        if (!isNaN(token)) {
         evaluationStack.push(parseFloat(token));
        } 
        // If it's a single-argument trig/math function
        else if (['sin', 'cos', 'tan', 'sqrt', "%"].includes(token)) {
            let arg = evaluationStack.pop();
            if (token !== 'sqrt' || token !== '%') {
                arg = arg * (Math.PI / 180);
            }
            
            if (token === 'sin') evaluationStack.push(Math.sin(arg));
            if (token === 'cos') evaluationStack.push(Math.cos(arg));
            if (token === 'tan') evaluationStack.push(Math.tan(arg));
            if (token === 'sqrt') {
                if (arg < 0) throw new Error("Cannot take square root of a negative number");
                evaluationStack.push(Math.sqrt(arg));
            }
            if (token === '%') evaluationStack.push(parseFloat(20/100));
        } 
        // If it's a two-argument math operator
        else {
            // if (evaluationStack.length < 2) {
            //     throw new Error(`Malformed expression near operator '${token}'`);
            // }
            let secondValue = evaluationStack.pop(); // Right operand
            let firstValue = evaluationStack.pop(); // Left operand
            if (!firstValue) {
                if (token === '+') evaluationStack.push(0 + secondValue);
                else if (token === '-') evaluationStack.push(0 - secondValue);
                continue;
            }
            
            if (token === '+') evaluationStack.push(firstValue + secondValue);
            else if (token === '-') evaluationStack.push(firstValue - secondValue);
            else if (token === '*') evaluationStack.push(firstValue * secondValue);
            else if (token === '/'){
                if (secondValue === 0) throw new Error("Division by zero");
                evaluationStack.push(firstValue / secondValue);
            }
            else if (token === '**') evaluationStack.push(Math.pow(firstValue, secondValue));
        }
    }

    if (evaluationStack.length !== 1) {
        throw new Error("Invalid expression structure");
    }
    
    return evaluationStack[0]
}
// ['2', '+', '(', '5', '-', '2', ')', '*', '4', '/', '6', '+', 'sin', '(', '3', '0', ')', '+', 'cos', '(', '6', '0', ')', '+', 'sqrt', '(', '4', ')', '+', '2', '**', '2']
// Number((2+(5-2)*4/6+Math.sin((30) * Math.PI / 180)+Math.cos((60) * Math.PI / 180)+Math.sqrt(4)+2**2c).toFixed(2))
// 2+(5-2)×4÷6+sin(30)+cos(60)+√(4)+2^2

// const result = evaluate(['2', '+', '(', '5', '-', '2', ')', '*', '4', '/', '6', '+', 'sin', '(', '3', '0', ')', '+', 'cos', '(', '6', '0', ')', '+', 'sqrt', '(', '4', ')', '+', '2', '**', '2']);
const result = evaluate(['-','6','+','3','+','2','0','%']);
