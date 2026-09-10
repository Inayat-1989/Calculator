import { executeHelper, isHistoryActive, setFieldFocus, toggleHistoryActive } from './helper.js';
import { evaluateExpression } from './expressionHelper.js';
import { buttonPressed } from './buttonHelper.js';

export let inputField = document.getElementById('input');
inputField.value = "";
export let lastAnswerElement = document.getElementById('answer');
export let inputList = [];
export let history = new Map();
export let fieldIndex = 0;
export let listIndex = 0;
let onlyAnswerOnDisplay = false;

window.executeHelper = executeHelper;

document.addEventListener('click', function(event) {
    if (event.target.tagName !== "BUTTON") {
        event.preventDefault();
        return;
    }
    const clickedButton = event.target.closest("button");
    
    if (!clickedButton) return;

    if (clickedButton.classList.contains("helper")) {
        event.preventDefault();
        return;
    }

    // if (/[A-Z]/.test(inputField.value)) { 
    //     return;
    // }
    if (onlyAnswerOnDisplay) {
        CE();
        onlyAnswerOnDisplay = false;
    }

    let [buttonValue, secondValueList] = buttonPressed(clickedButton);

    let fieldValue = clickedButton.value || buttonValue;
    if (buttonValue === "ans") fieldValue = "ans";

    if (!isHistoryActive()) {
        addValue(buttonValue, secondValueList, fieldValue);
    } else {
        alert("history is active");
    }
});

inputField.addEventListener("keydown", function(event) {
    event.preventDefault();
});


export function addValue(firstValueList, secondValueList, inputFieldValue) {
    if (isHistoryActive()) {
        toggleHistoryActive();
        CE();
    }
    if (!firstValueList) return;

    if (firstValueList === "=") {
        inputField.value = evaluateExpression();
        onlyAnswerOnDisplay = true;
    } else {
        inputList.splice(listIndex, 0, firstValueList);
        inputField.value = inputField.value.slice(0, fieldIndex) + inputFieldValue + inputField.value.slice(fieldIndex);
        handleIndex(firstValueList);
        if (secondValueList) {
            inputList.splice(listIndex, 0, secondValueList);
            incrementListIndex();
        }
        setFieldFocus(fieldIndex, listIndex);
    }
}

export function incrementFieldIndex() {
    if (fieldIndex >= inputField.value.length) return;
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
    if (listIndex >= inputList.length) return;
    listIndex += 1;
}

export function setListIndex(value) {
    if (value > inputList.length) value = inputList.length;
    else if (value < 0) value = 0;
    listIndex = value;
}

export function decrementListIndex() {
    if (listIndex === 0) return;
    listIndex -= 1;
}

function handleIndex(buttonValue) {
    if (buttonValue === "sin" || buttonValue === "cos" || buttonValue === "tan" || buttonValue === "ans") {
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
    inputField.value = "";
    inputList.length = 0;
    lastAnswerElement.value = 0;
    setFieldFocus(0, 0);
    history.clear();
    console.clear();
}

export function CE() {
    inputField.value = "";
    inputList.length = 0;
    setFieldFocus(0, 0);
}

export function replaceAnsInputList() {
    const ansValue = lastAnswerElement ? lastAnswerElement.value : "0";
    inputList = inputList.map(value => value === "ans" ? ansValue : value);
}

export function insertInputFieldValue(value) {
    inputField.value = value;
}

export function insertLastAnswerValue(value) {
    lastAnswerElement.value = value;
}
