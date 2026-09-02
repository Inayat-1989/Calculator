import { executeHelper, setFieldFocus } from './helper.js';
import { evaluateExpression } from './expressionHelper.js';
import { buttonPressed } from './buttonHelper.js';

export let inputField = document.getElementById('input'); // For keeping it all the time and working on this object.
inputField.value = "";
export let lastAnswerElement = document.getElementById('answer'); // for getting the answer element so that it value can be changed directly.
export let inputList = []; // for Storing the actual expression keeping the output and the evaluation separate.
export let history = new Map(); // Stores the history of all the expressions as all expression are unique so expression as the key. (reqetition of expression must be handled in the future.)
export const allowedCharacters = /^[0-9+\-*/^%.()\s]+$/; // Regular expression to allow only valid characters in the input field.
export let fieldIndex = 0;
export let listIndex = 0;

window.executeHelper = executeHelper; // Exposing the executeHelper function to the global scope so that it can be called from the HTML file.

document.addEventListener('click', function(event) {
    event.preventDefault();
    // Getting the button that is clicked on the Screen
    const clickedButton = event.target.closest("button");
    
    if (!clickedButton) return;

    // getting the primary and secondary values of the button pressed. For example, for sin() the primary value is sin and the secondary value is (.
    let [buttonValue, secondValue] = buttonPressed(clickedButton);

    if (!buttonValue) {
        return;
    }

    clearingAns();

    // If the button pressed is the equal sign, we evaluate the expression. Otherwise, we append the button value to the input field and splice(fieldIndex,0, it to the inputList array. If there is a secondary value (like for functions), we also splice(fieldIndex,0, that to the inputList.
    if (buttonValue === "=") {
        evaluateExpression();
    } else {
        let fieldValue = clickedButton.value;
        if (buttonValue === "Ans") fieldValue = buttonValue;
        inputList.splice(listIndex,0,buttonValue);
        inputField.value = inputField.value.slice(0,fieldIndex) + fieldValue + inputField.value.slice(fieldIndex);
        handleIndex(buttonValue);
        if (secondValue) {
            inputList.splice(listIndex,0,secondValue);
            incrementListIndex();
        }
        setFieldFocus(fieldIndex, listIndex);
        console.log("Value: ", inputField.value,"\nList: ", inputList,"\nField Index: ", fieldIndex, "\nList Index: ", listIndex);
    }
});

inputField.addEventListener("keydown", function(event) {
    event.preventDefault();
    // When Any = or Enter key is pressed, evaluate the expression
    if (event.key === "Enter" || event.key === "=") {
        evaluateExpression();
        return;
    }

    // Prevent default behavior for Shift, Control, Alt, and Meta keys These are pushed to our Stack which can't be calculated and will throw an error. So we prevent them from being pushed to the stack.
    if (event.key === 'Shift' || event.key === 'Control' || event.key === 'Alt' || event.key === 'Meta') {
        return;
    }

    // Prevent default behavior for Backspace, Delete, and Arrow keys. These are handled separately to allow for custom behavior in the calculator and also Duplicates are happened.
    if (event.key === 'Backspace' || event.key === 'Delete' || event.key.startsWith('Arrow')) {
        executeHelper(event.key === "Backspace" ? "backspace" : event.key === 'Delete' ? 'CE' : event.key === 'ArrowLeft' ? 'larr' : 'rarr');
        return;
    }

    // Prevent default behavior for any other keys that are not allowed in the calculator input. This ensures that only valid characters are entered into the input field.
    if (!allowedCharacters.test(event.key)) {
        event.preventDefault();
    }

    // Push the key to the inputList array for evaluation later. This allows us to keep track of the user's input and evaluate it when needed.
    // inputField is by default updated with the key pressed, so we don't need to update it here.
    inputField.value = inputField.value.slice(0,fieldIndex) + event.key + inputField.value.slice(fieldIndex);
    inputList.splice(listIndex,0,event.key);
    handleIndex(event.key);
    setFieldFocus(fieldIndex, listIndex);
    console.log("Value: ", inputField.value,"\nList: ", inputList,"\nField Index: ", fieldIndex, "\nList Index: ", listIndex);
});

export function incrementFieldIndex() {
    if (fieldIndex === inputField.value.length) return;
    fieldIndex += 1;
}

export function setFieldIndex(value) {
    if (value > inputField.value.length) value = inputField.value.length;
    else if (value < 0) value = 0;
    fieldIndex = value;
}

export function decrementFieldIndex() {
    if (fieldIndex === 0) return;
    fieldIndex -= 1;
}

export function incrementListIndex() {
    if (listIndex === inputList.length) return;
    listIndex += 1;
}

export function setListIndex(value) {
    if (value > inputList.length) value = inputList.length;
    else if (value < 0) value = 0
    listIndex = value;
}

export function decrementListIndex() {
    if (listIndex === 0) return;
    listIndex -= 1;
}

function handleIndex(buttonValue) {
    if (buttonValue === "sin" || buttonValue === "cos" || buttonValue === "tan" || buttonValue === "Ans") {
        setFieldIndex(fieldIndex + 4);
        incrementListIndex();
    } else if (buttonValue === "**" || buttonValue === "sqrt") {
        setFieldIndex(fieldIndex + 2);
        incrementListIndex();
    } else if (buttonValue !== "=") {
        incrementFieldIndex();
        incrementListIndex();
    }
}

export function clearAll() {
    // Clears the input field, inputList array, lastAnswerElement value, and history object.
    inputField.value = "";
    inputList.length = 0;
    lastAnswerElement.value = 0;
    setFieldIndex(0);
    setListIndex(0);
    history.clear();
    console.clear();
}

export function CE() {
    inputField.value = "";
    inputList.length = 0;
    setFieldIndex(0);
    setListIndex(0);
    // console.clear();
}

export function replaceAnsInputList() {
    inputList = inputList.map(value => value === "Ans" ? lastAnswerElement.value : value);
}

export function clearingAns() {
    if (inputField.value === lastAnswerElement.value) {
        CE();
    }
}

export function insertInputFieldValue(value) {
    inputField.value = value;
}